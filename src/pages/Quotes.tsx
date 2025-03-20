
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
import QuotesSearchAndFilter from '@/components/quotes/QuotesSearchAndFilter';

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
    setShowQuoteEditor
  } = useQuoteActions();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mettre à jour le titre de la page
  useEffect(() => {
    document.title = "Gestion des Devis";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          {/* Header with title and new quote button */}
          <QuotesHeader onNewQuote={handleNewQuote} />

          {/* Search and filter components */}
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
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="approved">Approuvés</TabsTrigger>
              <TabsTrigger value="rejected">Rejetés</TabsTrigger>
              <TabsTrigger value="expired">Expirés</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
              />
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
              />
            </TabsContent>
            
            <TabsContent value="rejected" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
              />
            </TabsContent>
            
            <TabsContent value="expired" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
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
