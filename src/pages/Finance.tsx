
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Invoice } from '@/components/finance/types/financeTypes';
import { mockInvoices, calculateInvoiceSummary } from '@/components/finance/data/mockData';
import FinanceDashboard from '@/components/finance/FinanceDashboard';
import FinancePageHeader from '@/components/finance/FinancePageHeader';
import FinanceViewToggle from '@/components/finance/FinanceViewToggle';
import FinanceInvoiceView from '@/components/finance/FinanceInvoiceView';
import NewInvoiceDialog from '@/components/finance/NewInvoiceDialog';
import InvoiceDetail from '@/components/finance/InvoiceDetail';
import { useInvoiceFilters } from '@/hooks/useInvoiceFilters';
import { useToast } from '@/hooks/use-toast';

const Finance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'invoices'>('dashboard');
  const { toast } = useToast();

  const invoiceSummary = calculateInvoiceSummary(invoices);

  const {
    searchTerm,
    setSearchTerm,
    showAdvancedFilters,
    setShowAdvancedFilters,
    activeFilters,
    activeTab,
    filteredInvoices,
    handleApplyFilters,
    clearAllFilters,
    handleSortToggle,
    handleTabChange,
    renderSortIcon
  } = useInvoiceFilters(invoices);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddInvoice = (invoice: Invoice) => {
    const newInvoice = {
      ...invoice,
      id: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(4, '0')}`
    };
    
    setInvoices([newInvoice, ...invoices]);
    
    toast({
      title: "Facture créée",
      description: `La facture ${newInvoice.id} a été créée avec succès.`,
    });
    
    setIsNewInvoiceOpen(false);
  };

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceDetailOpen(true);
  };

  const handleDashboardNavigation = (tab: string) => {
    setViewMode('invoices');
    handleTabChange(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <FinancePageHeader onNewInvoiceClick={() => setIsNewInvoiceOpen(true)} />
          
          <FinanceViewToggle 
            viewMode={viewMode} 
            onViewModeChange={(mode) => setViewMode(mode)} 
          />

          {viewMode === 'dashboard' && (
            <FinanceDashboard 
              invoices={invoices}
              invoiceSummary={invoiceSummary}
              onNavigate={handleDashboardNavigation}
              onSelectInvoice={handleSelectInvoice}
            />
          )}

          {viewMode === 'invoices' && (
            <FinanceInvoiceView
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showAdvancedFilters={showAdvancedFilters}
              setShowAdvancedFilters={setShowAdvancedFilters}
              activeFilters={activeFilters}
              onApplyFilters={handleApplyFilters}
              clearAllFilters={clearAllFilters}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              filteredInvoices={filteredInvoices}
              renderSortIcon={renderSortIcon}
              handleSortToggle={handleSortToggle}
              onSelectInvoice={handleSelectInvoice}
            />
          )}
        </div>
      </main>

      <NewInvoiceDialog
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        onSubmit={handleAddInvoice}
      />

      <InvoiceDetail 
        invoice={selectedInvoice}
        isOpen={isInvoiceDetailOpen}
        onClose={() => setIsInvoiceDetailOpen(false)}
      />
    </div>
  );
};

export default Finance;
