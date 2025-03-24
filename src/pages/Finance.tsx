
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileSpreadsheet, 
  Euro, 
  CalendarRange,
  BarChart4,
  PieChart,
  TrendingUp,
  AlertTriangle,
  FileText,
  Plus,
  ArrowUp,
  ArrowDown,
  Receipt,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import FinanceFilters from '@/components/finance/FinanceFilters';
import FinanceStats from '@/components/finance/FinanceStats';
import FinanceCharts from '@/components/finance/FinanceCharts';
import InvoiceTable from '@/components/finance/InvoiceTable';
import NewInvoiceDialog from '@/components/finance/NewInvoiceDialog';
import { Invoice, InvoiceStatus } from '@/components/finance/types/financeTypes';
import { mockInvoices } from '@/components/finance/data/mockData';

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

const Finance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FinanceFilterValues | null>(null);
  const [activeTab, setActiveTab] = useState<InvoiceStatus | 'all'>('all');
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleApplyFilters = (filters: FinanceFilterValues) => {
    setActiveFilters(filters);
    
    // Si des filtres de statut sont appliqués, on peut basculer sur l'onglet correspondant
    if (filters.status && filters.status.length === 1) {
      setActiveTab(filters.status[0] as InvoiceStatus | 'all');
    } else if (filters.status && filters.status.length === 0) {
      setActiveTab('all');
    }
    
    toast({
      title: "Filtres appliqués",
      description: "Les factures ont été filtrées selon vos critères.",
    });

    // Filter invoices based on applied filters
    filterInvoices(filters);
  };
  
  const clearAllFilters = () => {
    setActiveFilters(null);
    setSearchTerm('');
    setFilteredInvoices(invoices);
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés.",
    });
  };
  
  const handleSortToggle = (field: string) => {
    let newDirection: 'asc' | 'desc' | null = null;
    let newField = field;
    
    if (activeFilters?.sortField === field) {
      // Basculer la direction: asc -> desc -> null
      if (activeFilters.sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (activeFilters.sortDirection === 'desc') {
        newField = '';
        newDirection = null;
      }
    } else {
      // Nouveau champ, commencer par ascendant
      newDirection = 'asc';
    }
    
    const newFilters = {
      ...activeFilters || { status: [], clientTypes: [] },
      sortField: newField || undefined,
      sortDirection: newDirection || undefined
    };
    
    handleApplyFilters(newFilters);
  };

  // Filter invoices based on applied filters and search term
  const filterInvoices = (filters: FinanceFilterValues | null) => {
    if (!filters && !searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }

    let filtered = [...invoices];

    // Apply search term filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.id.toLowerCase().includes(search) ||
        invoice.client.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter(invoice => filters.status.includes(invoice.status));
    }

    // Apply client type filter
    if (filters?.clientTypes && filters.clientTypes.length > 0) {
      filtered = filtered.filter(invoice => filters.clientTypes.includes(invoice.clientType || ''));
    }

    // Apply date filters
    if (filters?.startDate) {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.issueDate);
        return invoiceDate >= filters.startDate!;
      });
    }

    if (filters?.endDate) {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.issueDate);
        return invoiceDate <= filters.endDate!;
      });
    }

    // Apply amount filters
    if (filters?.minAmount !== undefined) {
      filtered = filtered.filter(invoice => invoice.amount >= filters.minAmount!);
    }

    if (filters?.maxAmount !== undefined) {
      filtered = filtered.filter(invoice => invoice.amount <= filters.maxAmount!);
    }

    // Apply commercial filter
    if (filters?.commercial) {
      filtered = filtered.filter(invoice => 
        invoice.commercial?.toLowerCase().includes(filters.commercial!.toLowerCase())
      );
    }

    // Apply sorting
    if (filters?.sortField && filters?.sortDirection) {
      filtered.sort((a, b) => {
        const field = filters.sortField as keyof Invoice;
        
        let valueA = a[field];
        let valueB = b[field];
        
        // Handle special cases for date fields
        if (field === 'issueDate' || field === 'dueDate') {
          valueA = new Date(valueA as string).getTime();
          valueB = new Date(valueB as string).getTime();
        }
        
        if (valueA < valueB) {
          return filters.sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return filters.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredInvoices(filtered);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as InvoiceStatus | 'all');
    
    // Update filters to reflect tab change
    const newFilters = { 
      ...activeFilters || { clientTypes: [] },
      status: value === 'all' ? [] : [value]
    };
    
    handleApplyFilters(newFilters);
  };

  // Add new invoice
  const handleAddInvoice = (invoice: Invoice) => {
    const newInvoice = {
      ...invoice,
      id: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(4, '0')}`
    };
    
    setInvoices([newInvoice, ...invoices]);
    setFilteredInvoices([newInvoice, ...filteredInvoices]);
    
    toast({
      title: "Facture créée",
      description: `La facture ${newInvoice.id} a été créée avec succès.`,
    });
    
    setIsNewInvoiceOpen(false);
  };

  // Update invoices when filters change
  useEffect(() => {
    filterInvoices(activeFilters);
  }, [searchTerm, activeFilters]);

  // Rendu des icônes de tri
  const renderSortIcon = (field: string) => {
    if (activeFilters?.sortField === field) {
      if (activeFilters.sortDirection === 'asc') {
        return <ArrowUp className="h-3.5 w-3.5 text-primary ml-1" />;
      } else if (activeFilters.sortDirection === 'desc') {
        return <ArrowDown className="h-3.5 w-3.5 text-primary ml-1" />;
      }
    }
    return <span className="h-3.5 w-3.5 opacity-0 group-hover:opacity-30 ml-1">↕</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion Financière</h1>
              <p className="text-muted-foreground">Suivi des factures, paiements et performance financière</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Rapports
              </Button>
              <Button className="gap-2" onClick={() => setIsNewInvoiceOpen(true)}>
                <Plus className="h-4 w-4" />
                Nouvelle Facture
              </Button>
            </div>
          </div>

          <FinanceStats />

          <FinanceCharts />

          <FinanceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            activeFilters={activeFilters}
            onApplyFilters={handleApplyFilters}
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
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <NewInvoiceDialog
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        onSubmit={handleAddInvoice}
      />
    </div>
  );
};

export default Finance;
