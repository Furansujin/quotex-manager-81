
import { useState, useEffect } from 'react';
import { Invoice, InvoiceStatus } from '@/components/finance/types/financeTypes';
import { useToast } from '@/hooks/use-toast';

export interface FinanceFilterValues {
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

export const useInvoiceFilters = (invoices: Invoice[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FinanceFilterValues | null>(null);
  const [activeTab, setActiveTab] = useState<InvoiceStatus | 'all'>('all');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices);
  const { toast } = useToast();

  const handleApplyFilters = (filters: FinanceFilterValues) => {
    setActiveFilters(filters);
    
    if (filters.status && filters.status.length === 1) {
      setActiveTab(filters.status[0] as InvoiceStatus | 'all');
    } else if (filters.status && filters.status.length === 0) {
      setActiveTab('all');
    }
    
    toast({
      title: "Filtres appliqués",
      description: "Les factures ont été filtrées selon vos critères.",
    });

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
      if (activeFilters.sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (activeFilters.sortDirection === 'desc') {
        newField = '';
        newDirection = null;
      }
    } else {
      newDirection = 'asc';
    }
    
    const newFilters = {
      ...activeFilters || { status: [], clientTypes: [] },
      sortField: newField || undefined,
      sortDirection: newDirection || undefined
    };
    
    handleApplyFilters(newFilters);
  };

  const filterInvoices = (filters: FinanceFilterValues | null) => {
    if (!filters && !searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }

    let filtered = [...invoices];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.id.toLowerCase().includes(search) ||
        invoice.client.toLowerCase().includes(search)
      );
    }

    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter(invoice => filters.status.includes(invoice.status));
    }

    if (filters?.clientTypes && filters.clientTypes.length > 0) {
      filtered = filtered.filter(invoice => filters.clientTypes.includes(invoice.clientType || ''));
    }

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

    if (filters?.minAmount !== undefined) {
      filtered = filtered.filter(invoice => invoice.amount >= filters.minAmount!);
    }

    if (filters?.maxAmount !== undefined) {
      filtered = filtered.filter(invoice => invoice.amount <= filters.maxAmount!);
    }

    if (filters?.commercial) {
      filtered = filtered.filter(invoice => 
        invoice.commercial?.toLowerCase().includes(filters.commercial!.toLowerCase())
      );
    }

    if (filters?.sortField && filters?.sortDirection) {
      filtered.sort((a, b) => {
        const field = filters.sortField as keyof Invoice;
        
        let valueA = a[field];
        let valueB = b[field];
        
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

  const handleTabChange = (value: string) => {
    setActiveTab(value as InvoiceStatus | 'all');
    
    const newFilters = { 
      ...activeFilters || { clientTypes: [] },
      status: value === 'all' ? [] : [value]
    };
    
    handleApplyFilters(newFilters);
  };

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

  useEffect(() => {
    filterInvoices(activeFilters);
  }, [searchTerm, activeFilters, invoices]);

  return {
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
  };
};
