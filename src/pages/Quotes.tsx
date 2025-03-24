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
import { Card } from '@/components/ui/card';
import QuoteFollowUpButton from '@/components/quotes/QuoteFollowUpButton';
import { useToast } from '@/hooks/use-toast';
import QuotesSearchAndFilter from '@/components/quotes/QuotesSearchAndFilter';
import { useLocation } from 'react-router-dom';

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
    addQuote,
    handleApplyFilters, 
    clearAllFilters,
    updateQuoteStatus 
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

  // State for sorting
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const location = useLocation();

  // Check for quote ID in URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const quoteId = queryParams.get('id');
    
    if (quoteId) {
      handleEditQuote(quoteId);
    }
  }, [location.search, handleEditQuote]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle sort toggle
  const handleSortToggle = (field: string) => {
    let newDirection: 'asc' | 'desc' | null = null;
    let newField = field;
    
    if (sortField === field) {
      // Toggle direction: asc -> desc -> null
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newField = '';
        newDirection = null;
      }
    } else {
      // New field, start with ascending
      newDirection = 'asc';
    }
    
    setSortField(newField || null);
    setSortDirection(newDirection);
    
    // Apply sorting to filters
    const newFilters = {
      ...activeFilters || { status: [], types: [] },
      sortField: newField || undefined,
      sortDirection: newDirection || undefined
    };
    
    handleApplyFilters(newFilters);
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

  // Update sort state when activeFilters change
  useEffect(() => {
    if (activeFilters?.sortField) {
      setSortField(activeFilters.sortField);
      setSortDirection(activeFilters.sortDirection || 'asc');
    } else {
      setSortField(null);
      setSortDirection(null);
    }
  }, [activeFilters]);

  // Handle quote status change in the list
  const handleQuoteStatusChange = (id: string, newStatus: string) => {
    updateQuoteStatus(id, newStatus);
    
    // Optionally refresh the view or show a toast
    toast({
      title: "Statut mis à jour",
      description: `Le statut du devis a été changé.`,
    });
    
    // Update active tab if needed
    setActiveTab(newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          {/* Header with title and new quote button */}
          <QuotesHeader onNewQuote={handleNewQuote} />

          {/* Search and filter components using QuotesSearchAndFilter */}
          <QuotesSearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            activeFilters={activeFilters}
            onApplyFilters={handleApplyFilters}
            clearAllFilters={clearAllFilters}
          />

          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous les devis</TabsTrigger>
              <TabsTrigger value="draft">Brouillons</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
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
                renderFollowUpButton={(quote) => (
                  quote.status === 'pending' && <QuoteFollowUpButton quote={quote} />
                )}
                onSort={handleSortToggle}
                sortField={sortField}
                sortDirection={sortDirection}
                onStatusChange={handleQuoteStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="draft" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
                onSort={handleSortToggle}
                sortField={sortField}
                sortDirection={sortDirection}
                onStatusChange={handleQuoteStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
                renderFollowUpButton={(quote) => <QuoteFollowUpButton quote={quote} />}
                onSort={handleSortToggle}
                sortField={sortField}
                sortDirection={sortDirection}
                onStatusChange={handleQuoteStatusChange}
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
                onSort={handleSortToggle}
                sortField={sortField}
                sortDirection={sortDirection}
                onStatusChange={handleQuoteStatusChange}
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
                onSort={handleSortToggle}
                sortField={sortField}
                sortDirection={sortDirection}
                onStatusChange={handleQuoteStatusChange}
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
                onSort={handleSortToggle}
                sortField={sortField}
                sortDirection={sortDirection}
                onStatusChange={handleQuoteStatusChange}
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
    </div>
  );
};

export default Quotes;
