import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuoteActions } from '@/hooks/useQuoteActions';
import { useQuotesData } from '@/hooks/useQuotesData';
import { useQuoteEditorData } from './editor/useQuoteEditorData';
import QuoteEditorLayout from './editor/QuoteEditorLayout';
import ClientInfoCard from './editor/ClientInfoCard';
import LocationFields from './editor/LocationFields';
import QuoteOptions from './editor/QuoteOptions';
import QuoteInfoCard from './editor/QuoteInfoCard';
import QuoteItemsTable from './editor/QuoteItemsTable';
import QuoteActionButtons from './editor/QuoteActionButtons';
import SupplierPricing from './editor/SupplierPricing';

interface QuoteEditorProps {
  quoteId?: string;
  clientId?: string;
  onClose: () => void;
}

const QuoteEditor: React.FC<QuoteEditorProps> = ({ quoteId, clientId, onClose }) => {
  const { toast } = useToast();
  const { saveQuote, generatePdf, printQuote, selectedClientName } = useQuoteActions();
  const { quotes } = useQuotesData();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showSupplierPricing, setShowSupplierPricing] = useState(false);

  const {
    isEditing,
    client,
    setClient,
    clientDetails,
    origin,
    setOrigin,
    destination,
    setDestination,
    validUntil,
    setValidUntil,
    notes,
    setNotes,
    type,
    setType,
    incoterm,
    setIncoterm,
    currency, 
    setCurrency,
    showClientInfo,
    setShowClientInfo,
    items,
    addItem,
    removeItem,
    updateItem,
    calculateSubtotal,
    calculateTaxAmount,
    calculateTotal,
    suggestedItems,
    originSuggestions,
    destinationSuggestions,
  } = useQuoteEditorData(quoteId, clientId, quotes);

  // Set the client name when the component mounts or when selectedClientName changes
  useEffect(() => {
    if (selectedClientName && !client) {
      setClient(selectedClientName);
    }
  }, [selectedClientName, client, setClient]);

  // Show supplier pricing when origin and destination are set
  useEffect(() => {
    if (origin && destination) {
      setShowSupplierPricing(true);
    }
  }, [origin, destination]);

  const handleSave = async () => {
    // Validation simple
    if (!client) {
      toast({
        title: "Champ requis",
        description: "Veuillez sélectionner un client pour ce devis.",
        variant: "destructive"
      });
      return;
    }
    
    if (!origin || !destination) {
      toast({
        title: "Champs requis",
        description: "L'origine et la destination sont requises.",
        variant: "destructive"
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Aucun service",
        description: "Veuillez ajouter au moins un service au devis.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare quote data
      const quoteData = {
        id: quoteId,
        client,
        clientId: clientDetails?.id || clientId || "UNKNOWN",
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        origin,
        destination,
        status: isEditing ? "approved" : "pending",
        amount: `€ ${calculateTotal().toFixed(2)}`,
        type,
        commercial: "Jean Dupont", // Hardcoded for now
        validUntil: new Date(validUntil).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        notes,
        // In a real app, you would include the items as well
      };
      
      // Save the quote
      await saveQuote(quoteData);
      
      // Close the editor
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du devis.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    // Vérification similaire à handleSave
    if (!client || !origin || !destination || items.length === 0) {
      toast({
        title: "Devis incomplet",
        description: "Veuillez remplir tous les champs obligatoires avant d'envoyer.",
        variant: "destructive"
      });
      return;
    }
    
    // First save the quote
    setIsSaving(true);
    
    try {
      // Prepare quote data (same as in handleSave)
      const quoteData = {
        id: quoteId,
        client,
        clientId: clientDetails?.id || clientId || "UNKNOWN",
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        origin,
        destination,
        status: "pending",
        amount: `€ ${calculateTotal().toFixed(2)}`,
        type,
        commercial: "Jean Dupont",
        validUntil: new Date(validUntil).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        notes
      };
      
      // Save the quote
      await saveQuote(quoteData);
      
      // In a real app, you would send an email with the quote
      toast({
        title: "Devis envoyé",
        description: "Le devis a été envoyé au client par email.",
      });
      
      // Close the editor
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du devis.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!quoteId && !client) {
      toast({
        title: "Action impossible",
        description: "Veuillez d'abord enregistrer le devis avant de générer un PDF.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingPdf(true);
    
    try {
      let id = quoteId;
      
      // If it's a new quote, save it first
      if (!id) {
        // Prepare quote data (same as in handleSave)
        const quoteData = {
          client,
          clientId: clientDetails?.id || clientId || "UNKNOWN",
          date: new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          origin,
          destination,
          status: "pending",
          amount: `€ ${calculateTotal().toFixed(2)}`,
          type,
          commercial: "Jean Dupont",
          validUntil: new Date(validUntil).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          notes
        };
        
        // Save the quote
        const savedQuote = await saveQuote(quoteData);
        id = savedQuote.id;
      }
      
      // Generate PDF
      await generatePdf(id);
      
      // In a real app, you would open or download the PDF
      // For now, we'll just show a toast
      toast({
        title: "PDF généré",
        description: "Le PDF du devis est prêt à être téléchargé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = async () => {
    if (!quoteId && !client) {
      toast({
        title: "Action impossible",
        description: "Veuillez d'abord enregistrer le devis avant de l'imprimer.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPrinting(true);
    
    try {
      let id = quoteId;
      
      // If it's a new quote, save it first
      if (!id) {
        // Prepare quote data (same as in handleSave)
        const quoteData = {
          client,
          clientId: clientDetails?.id || clientId || "UNKNOWN",
          date: new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          origin,
          destination,
          status: "pending",
          amount: `€ ${calculateTotal().toFixed(2)}`,
          type,
          commercial: "Jean Dupont",
          validUntil: new Date(validUntil).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          notes
        };
        
        // Save the quote
        const savedQuote = await saveQuote(quoteData);
        id = savedQuote.id;
      }
      
      // Print the quote
      printQuote(id);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'impression.",
        variant: "destructive"
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <QuoteEditorLayout 
      title={isEditing ? 'Modifier le devis' : 'Nouveau devis'} 
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ClientInfoCard 
                client={client}
                setClient={setClient}
                clientDetails={clientDetails}
                showClientInfo={showClientInfo}
                setShowClientInfo={setShowClientInfo}
                clientId={clientId}
                initialClientName={selectedClientName}
              />
              
              <LocationFields 
                origin={origin}
                setOrigin={setOrigin}
                destination={destination}
                setDestination={setDestination}
                originSuggestions={originSuggestions}
                destinationSuggestions={destinationSuggestions}
              />
              
              <QuoteOptions 
                type={type}
                setType={setType}
                validUntil={validUntil}
                setValidUntil={setValidUntil}
                incoterm={incoterm}
                setIncoterm={setIncoterm}
                currency={currency}
                setCurrency={setCurrency}
                notes={notes}
                setNotes={setNotes}
                items={items}
                addItem={addItem}
                suggestedItems={suggestedItems}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Informations du devis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuoteInfoCard 
                isEditing={isEditing}
                type={type}
                suggestedItems={suggestedItems}
                currency={currency}
                addItem={addItem}
              />
            </CardContent>
          </Card>
        </div>
        
        {showSupplierPricing && (
          <SupplierPricing
            origin={origin}
            destination={destination}
            type={type}
            currency={currency}
            onPriceSelect={addItem}
          />
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Services et produits</CardTitle>
            <CardContent>Ajoutez les services et produits pour ce devis</CardContent>
          </CardHeader>
          <CardContent>
            <QuoteItemsTable 
              items={items}
              updateItem={updateItem}
              removeItem={removeItem}
              addItem={() => addItem()}
              calculateSubtotal={calculateSubtotal}
              calculateTaxAmount={calculateTaxAmount}
              calculateTotal={calculateTotal}
              currency={currency}
            />
          </CardContent>
        </Card>
        
        <QuoteActionButtons 
          onClose={onClose}
          handleGeneratePdf={handleGeneratePdf}
          handlePrint={handlePrint}
          handleSend={handleSend}
          handleSave={handleSave}
          isGeneratingPdf={isGeneratingPdf}
          isPrinting={isPrinting}
          isSaving={isSaving}
          itemsExist={items.length > 0}
        />
      </div>
    </QuoteEditorLayout>
  );
};

export default QuoteEditor;
