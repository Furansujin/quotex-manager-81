
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowDown } from 'lucide-react';
import FinanceFilters from '@/components/finance/FinanceFilters';
import InvoiceTable from '@/components/finance/InvoiceTable';
import { Invoice, InvoiceStatus } from '@/components/finance/types/financeTypes';

interface FinanceFilterValues {
  status: string[];
  clientTypes: string[];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  commercial?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

interface FinanceInvoiceViewProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  activeFilters: FinanceFilterValues | null;
  onApplyFilters: (filters: FinanceFilterValues) => void;
  clearAllFilters: () => void;
  activeTab: InvoiceStatus | 'all';
  handleTabChange: (value: string) => void;
  filteredInvoices: Invoice[];
  renderSortIcon: (field: string) => React.ReactNode;
  handleSortToggle: (field: string) => void;
  onSelectInvoice: (invoice: Invoice) => void;
}

const FinanceInvoiceView: React.FC<FinanceInvoiceViewProps> = ({
  searchTerm,
  setSearchTerm,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFilters,
  onApplyFilters,
  clearAllFilters,
  activeTab,
  handleTabChange,
  filteredInvoices,
  renderSortIcon,
  handleSortToggle,
  onSelectInvoice
}) => {
  return (
    <>
      <FinanceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        activeFilters={activeFilters}
        onApplyFilters={onApplyFilters}
        clearAllFilters={clearAllFilters}
      />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Factures</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="paid">Payées</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="overdue">En retard</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <InvoiceTable 
                invoices={filteredInvoices} 
                renderSortIcon={renderSortIcon} 
                handleSortToggle={handleSortToggle} 
                onSelectInvoice={onSelectInvoice}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default FinanceInvoiceView;
