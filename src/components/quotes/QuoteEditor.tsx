import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuoteActions } from '@/hooks/useQuoteActions';
import { useQuotesData } from '@/hooks/useQuotesData';
import { useQuoteEditorData } from './editor/useQuoteEditorData';
import { useQuoteFollowUps } from '@/hooks/useQuoteFollowUps';
import QuoteEditorLayout from './editor/QuoteEditorLayout';
import ClientInfoCard from './editor/ClientInfoCard';
import LocationFields from './editor/LocationFields';
import QuoteOptions from './editor/QuoteOptions';
import QuoteItemsTable from './editor/QuoteItemsTable';
import QuoteActionButtons from './editor/QuoteActionButtons';
import SupplierPricing from './editor/SupplierPricing';
import FollowUpReminder from './followup/FollowUpReminder';
import FollowUpHistory from './followup/FollowUpHistory';
import CargoDetails from './editor/CargoDetails';

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
  const [isDraft, setIsDraft] = useState(false);

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
    // Propriétés pour les détails de marchandise
    cargoDescription,
    setCargoDescription,
    cargoType,
    setCargoType,
    cargoNature,
    setCargoNature,
    cargoLength,
    setCargoLength,
    cargoWidth,
    setCargoWidth,
    cargoHeight,
    setCargoHeight,
    cargoWeight,
    setCargoWeight,
    cargoVolume,
    setCargoVolume,
    cargoPackaging,
    setCargoPackaging,
    cargoPackageCount,
    setCargoPackageCount,
  } = useQuoteEditorData(quoteId, clientId, quotes);

  // Add follow-up functionality
  const {
    followUps,
    showFollowUpReminder,
    showFollowUpHistory,
    setShowFollowUpReminder,
    toggleFollowUpHistory,
    addFollowUp
  } = useQuoteFollowUps(quoteId);

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

  // Check if the quote is a draft
  useEffect(() => {
    if (quoteId) {
      const existingQuote = quotes.find(q => q.id === quoteId);
      if (existingQuote && existingQuote.status === 'draft') {
        setIsDraft(true);
      }
    }
  }, [quoteId, quotes]);

  // Fonction pour vérifier si les détails de marchandise sont remplis
  const hasCargoDetails = () => {
    return !!(cargoDescription && cargoType && cargoNature && 
             (cargoWeight || (cargoLength && cargoWidth && cargoHeight)) && 
             cargoPackaging && cargoPackageCount);
  };

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
        status: isDraft ? "pending" : (isEditing ? "approved" : "pending"),
        amount: `€ ${calculateTotal().toFixed(2)}`,
        type,
        commercial: "Jean Dupont", // Hardcoded for now
        validUntil: new Date(validUntil).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        notes,
        // Ajout des détails de marchandise
        cargoDetails: {
          description: cargoDescription,
          type: cargoType,
          nature: cargoNature,
          dimensions: {
            length: cargoLength,
            width: cargoWidth,
            height: cargoHeight,
            weight: cargoWeight,
            volume: cargoVolume
          },
          packaging: cargoPackaging,
          packageCount: cargoPackageCount
        }
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

  const handleSaveAsDraft = async () => {
    // Basic validation - only client is required for draft
    if (!client) {
      toast({
        title: "Champ requis",
        description: "Veuillez sélectionner un client pour ce devis.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare quote data for draft
      const quoteData = {
        id: quoteId,
        client,
        clientId: clientDetails?.id || clientId || "UNKNOWN",
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        origin: origin || "",
        destination: destination || "",
        status: "draft",
        amount: `€ ${items.length > 0 ? calculateTotal().toFixed(2) : "0.00"}`,
        type: type || "Maritime",
        commercial: "Jean Dupont", // Hardcoded for now
        validUntil: new Date(validUntil).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        notes,
        // Include cargo details if they exist
        cargoDetails: cargoDescription ? {
          description: cargoDescription,
          type: cargoType,
          nature: cargoNature,
          dimensions: {
            length: cargoLength,
            width: cargoWidth,
            height: cargoHeight,
            weight: cargoWeight,
            volume: cargoVolume
          },
          packaging: cargoPackaging,
          packageCount: cargoPackageCount
        } : undefined
      };
      
      // Save the quote as draft
      await saveQuote(quoteData);
      
      toast({
        title: "Brouillon enregistré",
        description: "Le devis a été sauvegardé comme brouillon.",
      });
      
      // Close the editor
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du brouillon.",
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
        notes,
        cargoDetails: {
          description: cargoDescription,
          type: cargoType,
          nature: cargoNature,
          dimensions: {
            length: cargoLength,
            width: cargoWidth,
            height: cargoHeight,
            weight: cargoWeight,
            volume: cargoVolume
          },
          packaging: cargoPackaging,
          packageCount: cargoPackageCount
        }
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
          notes,
          cargoDetails: {
            description: cargoDescription,
            type: cargoType,
            nature: cargoNature,
            dimensions: {
              length: cargoLength,
              width: cargoWidth,
              height: cargoHeight,
              weight: cargoWeight,
              volume: cargoVolume
            },
            packaging: cargoPackaging,
            packageCount: cargoPackageCount
          }
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
          notes,
          cargoDetails: {
            description: cargoDescription,
            type: cargoType,
            nature: cargoNature,
            dimensions: {
              length: cargoLength,
              width: cargoWidth,
              height: cargoHeight,
              weight: cargoWeight,
              volume: cargoVolume
            },
            packaging: cargoPackaging,
            packageCount: cargoPackageCount
          }
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

  const handleFollowUp = () => {
    setShowFollowUpReminder(true);
  };

  const handleFollowUpSent = (method: string, message: string) => {
    addFollowUp(method, message);
  };

  return (
    <QuoteEditorLayout 
      title={isDraft ? 'Modifier le brouillon' : (isEditing ? 'Modifier le devis' : 'Nouveau devis')} 
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        {/* Section supérieure - Informations générales - Disposition en grille adaptative */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colonne de gauche - Client info */}
              <div>
                <ClientInfoCard 
                  client={client}
                  setClient={setClient}
                  clientDetails={clientDetails}
                  showClientInfo={showClientInfo}
                  setShowClientInfo={setShowClientInfo}
                  clientId={clientId}
                  initialClientName={selectedClientName}
                />
              </div>
              
              {/* Colonne de droite - Options du devis */}
              <div>
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
              </div>
            </div>
            
            {/* Champs d'origine et destination */}
            <div className="mt-6">
              <LocationFields 
                origin={origin}
                setOrigin={setOrigin}
                destination={destination}
                setDestination={setDestination}
                originSuggestions={originSuggestions}
                destinationSuggestions={destinationSuggestions}
              />
            </div>

            {/* Historique des suivis */}
            {quoteId && followUps.length > 0 && (
              <div className="mt-4">
                <FollowUpHistory 
                  followUps={followUps}
                  isExpanded={showFollowUpHistory}
                  onToggle={toggleFollowUpHistory}
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Section du milieu - Détails de marchandise et Tarification fournisseur */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Détails de la marchandise */}
          <CargoDetails
            description={cargoDescription}
            setDescription={setCargoDescription}
            cargoType={cargoType}
            setCargoType={setCargoType}
            cargoNature={cargoNature}
            setCargoNature={setCargoNature}
            length={cargoLength}
            setLength={setCargoLength}
            width={cargoWidth}
            setWidth={setCargoWidth}
            height={cargoHeight}
            setHeight={setCargoHeight}
            weight={cargoWeight}
            setWeight={setCargoWeight}
            volume={cargoVolume}
            setVolume={setCargoVolume}
            packaging={cargoPackaging}
            setPackaging={setCargoPackaging}
            packageCount={cargoPackageCount}
            setPackageCount={setCargoPackageCount}
          />
          
          {/* Tarification fournisseur */}
          {showSupplierPricing && (
            <SupplierPricing
              origin={origin}
              destination={destination}
              type={type}
              currency={currency}
              onPriceSelect={addItem}
            />
          )}
        </div>
        
        {/* Section inférieure - Services et produits */}
        <Card>
          <CardHeader>
            <CardTitle>Services et produits</CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteItemsTable 
              items={items}
              updateItem={updateItem}
              removeItem={removeItem}
              addItem={addItem}
              calculateSubtotal={calculateSubtotal}
              calculateTaxAmount={calculateTaxAmount}
              calculateTotal={calculateTotal}
              currency={currency}
              suggestedItems={type ? suggestedItems[type] : []}
              type={type}
            />
          </CardContent>
        </Card>
        
        {/* Boutons d'action */}
        <QuoteActionButtons 
          onClose={onClose}
          handleGeneratePdf={handleGeneratePdf}
          handlePrint={handlePrint}
          handleSend={handleSend}
          handleSave={handleSave}
          handleSaveAsDraft={handleSaveAsDraft}
          handleFollowUp={handleFollowUp}
          isGeneratingPdf={isGeneratingPdf}
          isPrinting={isPrinting}
          isSaving={isSaving}
          itemsExist={items.length > 0}
          showFollowUp={isEditing && quoteId !== undefined && !isDraft}
          hasCargoDetails={hasCargoDetails()}
          isDraft={isDraft}
        />
      </div>

      {/* Dialogue de rappel de suivi */}
      {showFollowUpReminder && (
        <FollowUpReminder 
          quoteId={quoteId || ''}
          clientName={client}
          isOpen={showFollowUpReminder}
          onClose={() => setShowFollowUpReminder(false)}
          lastContact={isEditing ? quotes.find(q => q.id === quoteId)?.date : undefined}
          onFollowUpSent={handleFollowUpSent}
        />
      )}
    </QuoteEditorLayout>
  );
};

export default QuoteEditor;
