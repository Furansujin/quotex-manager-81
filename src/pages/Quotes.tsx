
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuotesList from '@/components/quotes/QuotesList';
import QuoteEditor from '@/components/quotes/QuoteEditor';
import ClientSelector from '@/components/quotes/ClientSelector';
import { useQuotesData } from '@/hooks/useQuotesData';
import { useQuoteActions } from '@/hooks/useQuoteActions';
import QuotesHeader from '@/components/quotes/QuotesHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Calendar } from 'lucide-react';
import QuoteFollowUpButton from '@/components/quotes/QuoteFollowUpButton';
import { useToast } from '@/hooks/use-toast';
import { useInvoiceService } from '@/hooks/useInvoiceService';
import InvoiceViewer from '@/components/invoices/InvoiceViewer';

const Quotes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Get quotes data and filtering logic
  const { 
    activeTab, 
    setActiveTab, 
    searchTerm, 
    setSearchTerm, 
    activeFilters, 
    filteredQuotes, 
    quotes,
    addQuote,
    updateQuoteStatus,
    handleApplyFilters, 
    clearAllFilters 
  } = useQuotesData();
  
  // Get quote action handlers
  const {
    showQuoteEditor,
    showClientSelector,
    editingQuoteId,
    selectedClient,
    handleNewQuote,
    handleEditQuote,
    handleDuplicateQuote,
    handleDownloadQuote,
    handleClientSelect,
    setShowQuoteEditor,
    setShowClientSelector,
    saveQuote
  } = useQuoteActions();

  // Get invoice service
  const {
    invoices,
    isGenerating,
    currentInvoice,
    showInvoiceModal,
    generateInvoice,
    openInvoice,
    closeInvoice,
    sendInvoice,
    markAsPaid,
    findInvoiceById,
    findInvoiceByQuoteId,
    updateInvoice
  } = useInvoiceService();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mise à jour du titre de la page
  useEffect(() => {
    document.title = "Gestion des Devis";
  }, []);

  // Connect the saveQuote method to the addQuote method
  useEffect(() => {
    // Create a wrapped version of the saveQuote function that also updates the quotes list
    const originalSaveQuote = saveQuote;
    
    const enhancedSaveQuote = async (quoteData: any) => {
      const result = await originalSaveQuote(quoteData);
      if (result) {
        addQuote(result);
        
        // Optional: trigger a refresh or notification
        localStorage.setItem('newQuote', JSON.stringify(result));
        // This will trigger the storage event listener in useQuotesData
      }
      return result;
    };
    
    // Properly handle enhancedSaveQuote when saving quotes
    const handleSave = enhancedSaveQuote;
    
    return () => {
      // No need to cleanup as we're not modifying prototypes
    };
  }, [saveQuote, addQuote]);
  
  const { toast } = useToast();

  // Check for quotes that need reminders
  useEffect(() => {
    // Check if we've already shown reminders today
    const lastReminderCheck = localStorage.getItem('lastReminderCheck');
    const today = new Date().toDateString();
    
    if (lastReminderCheck !== today) {
      // Find quotes that are pending and older than 7 days
      const pendingQuotes = filteredQuotes.filter(quote => {
        if (quote.status !== 'pending') return false;
        
        // Convert date from DD/MM/YYYY to a Date object
        const parts = quote.date.split('/');
        const quoteDate = new Date(
          parseInt(parts[2]), // year
          parseInt(parts[1]) - 1, // month (0-indexed)
          parseInt(parts[0]) // day
        );
        
        // Check if quote is older than 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        return quoteDate < sevenDaysAgo;
      });
      
      // Show notification if there are pending quotes to follow up
      if (pendingQuotes.length > 0) {
        toast({
          title: "Relances recommandées",
          description: `${pendingQuotes.length} devis en attente depuis plus de 7 jours.`,
        });
      }
      
      // Update the last check date
      localStorage.setItem('lastReminderCheck', today);
    }
  }, [filteredQuotes, toast]);

  // Gestion de l'approbation d'un devis
  const handleApproveQuote = async (quoteId: string) => {
    // Trouver le devis
    const quoteToApprove = quotes.find(q => q.id === quoteId);
    
    if (!quoteToApprove) {
      toast({
        title: "Erreur",
        description: "Devis introuvable.",
        variant: "destructive"
      });
      return;
    }
    
    // Mettre à jour le statut du devis
    updateQuoteStatus(quoteId, "validated");
    
    toast({
      title: "Devis validé",
      description: `Le devis ${quoteId} a été validé avec succès.`,
    });
    
    // Option: générer automatiquement la facture
    // (Désactivé par défaut, à activer selon les besoins de l'utilisateur)
    /*
    try {
      const invoice = await handleGenerateInvoice(quoteId);
      // Afficher un message de succès supplémentaire
    } catch (error) {
      // Gestion des erreurs
    }
    */
  };

  // Gestion de la génération d'une facture
  const handleGenerateInvoice = async (quoteId: string) => {
    // Vérifier si une facture existe déjà
    const existingInvoice = findInvoiceByQuoteId(quoteId);
    
    if (existingInvoice) {
      // Ouvrir la facture existante
      openInvoice(existingInvoice);
      return existingInvoice;
    }
    
    // Trouver le devis
    const quote = quotes.find(q => q.id === quoteId);
    
    if (!quote) {
      toast({
        title: "Erreur",
        description: "Devis introuvable.",
        variant: "destructive"
      });
      throw new Error("Quote not found");
    }
    
    try {
      // Générer la facture
      const invoice = await generateInvoice(quote);
      
      // Mettre à jour le statut du devis
      updateQuoteStatus(quoteId, "invoiced");
      
      // Ouvrir la facture générée
      openInvoice(invoice);
      
      return invoice;
    } catch (error) {
      console.error("Erreur lors de la génération de la facture", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la facture. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          {/* Header with title and new quote button */}
          <QuotesHeader onNewQuote={handleNewQuote} />

          {/* Search and filter components - modified to match Shipments style */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Input 
                placeholder="Rechercher par client, n° devis, destination..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showAdvancedFilters ? "default" : "outline"} 
                className="gap-2"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Advanced filters panel - similar to Shipments */}
          {showAdvancedFilters && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Tous</Badge>
                      <Badge variant="warning" className="cursor-pointer">En attente</Badge>
                      <Badge variant="success" className="cursor-pointer">Approuvés</Badge>
                      <Badge variant="outline" className="cursor-pointer bg-blue-100 text-blue-700">Validés</Badge>
                      <Badge variant="outline" className="cursor-pointer bg-violet-100 text-violet-700">Facturés</Badge>
                      <Badge variant="destructive" className="cursor-pointer">Rejetés</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Expirés</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type de transport</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Tous</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-blue-500/10 text-blue-500">Maritime</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-green-500/10 text-green-500">Aérien</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-amber-500/10 text-amber-500">Routier</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Période</label>
                    <div className="flex gap-2">
                      <Input type="date" className="w-full" placeholder="Date début" />
                      <Input type="date" className="w-full" placeholder="Date fin" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Commercial</label>
                    <Input placeholder="Nom du commercial" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Montant min</label>
                    <Input placeholder="Montant minimum (€)" type="number" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Montant max</label>
                    <Input placeholder="Montant maximum (€)" type="number" />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="mr-2" onClick={clearAllFilters}>Réinitialiser</Button>
                  <Button onClick={() => {
                    // Logique simplifiée pour appliquer les filtres
                    handleApplyFilters({
                      status: [],
                      types: [],
                      startDate: undefined,
                      endDate: undefined
                    });
                    setShowAdvancedFilters(false);
                  }}>Appliquer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous les devis</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="validated">Validés</TabsTrigger>
              <TabsTrigger value="invoiced">Facturés</TabsTrigger>
              <TabsTrigger value="approved">Approuvés</TabsTrigger>
              <TabsTrigger value="rejected">Rejetés</TabsTrigger>
              <TabsTrigger value="expired">Expirés</TabsTrigger>
            </TabsList>

            {/* Tab content for all quote statuses */}
            <TabsContent value="all" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
                onApprove={handleApproveQuote}
                onGenerateInvoice={handleGenerateInvoice}
                renderFollowUpButton={(quote) => (
                  quote.status === 'pending' && <QuoteFollowUpButton quote={quote} />
                )}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes}
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
                onApprove={handleApproveQuote}
                renderFollowUpButton={(quote) => <QuoteFollowUpButton quote={quote} />}
              />
            </TabsContent>
            
            <TabsContent value="validated" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes}
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
                onGenerateInvoice={handleGenerateInvoice}
                renderFollowUpButton={(quote) => (
                  quote.status === 'pending' && <QuoteFollowUpButton quote={quote} />
                )}
              />
            </TabsContent>
            
            <TabsContent value="invoiced" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes}
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
                renderFollowUpButton={(quote) => (
                  quote.status === 'pending' && <QuoteFollowUpButton quote={quote} />
                )}
              />
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
                renderFollowUpButton={(quote) => (
                  quote.status === 'pending' && <QuoteFollowUpButton quote={quote} />
                )}
              />
            </TabsContent>
            
            <TabsContent value="rejected" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
                renderFollowUpButton={(quote) => (
                  quote.status === 'pending' && <QuoteFollowUpButton quote={quote} />
                )}
              />
            </TabsContent>
            
            <TabsContent value="expired" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
                renderFollowUpButton={(quote) => (
                  quote.status === 'pending' && <QuoteFollowUpButton quote={quote} />
                )}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showQuoteEditor && (
        <QuoteEditor 
          quoteId={editingQuoteId} 
          clientId={selectedClient || undefined}
          onClose={() => setShowQuoteEditor(false)} 
        />
      )}

      {showClientSelector && (
        <ClientSelector 
          onClose={() => setShowClientSelector(false)}
          onSelectClient={handleClientSelect}
          initialSearchTerm={searchTerm}
        />
      )}

      {/* Invoice Viewer Modal */}
      {showInvoiceModal && (
        <InvoiceViewer
          invoice={currentInvoice}
          isOpen={showInvoiceModal}
          onClose={closeInvoice}
          onSendEmail={sendInvoice}
          onMarkAsPaid={markAsPaid}
          onUpdateInvoice={updateInvoice}
        />
      )}
    </div>
  );
};

export default Quotes;
