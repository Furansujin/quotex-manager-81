
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Import } from 'lucide-react';
import SuppliersList from '@/components/suppliers/SuppliersList';
import SupplierFilters from '@/components/suppliers/SupplierFilters';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SupplierImportPanel from '@/components/suppliers/SupplierImportPanel';

interface SupplierFilterValues {
  types: string[];
  categories: string[];
  locations: string[];
  startDate?: Date;
  endDate?: Date;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const Suppliers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SupplierFilterValues | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleApplyFilters = (filters: SupplierFilterValues) => {
    setActiveFilters(filters);
    
    toast({
      title: "Filtres appliqués",
      description: "Les fournisseurs ont été filtrés selon vos critères.",
    });
  };
  
  const clearAllFilters = () => {
    setActiveFilters(null);
    setSearchTerm('');
    
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
      ...activeFilters || { types: [], categories: [], locations: [] },
      sortField: newField || undefined,
      sortDirection: newDirection || undefined
    };
    
    handleApplyFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Gestion des Fournisseurs</h1>
              <p className="text-muted-foreground">Gérez vos fournisseurs et leurs tarifs</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setImportModalOpen(true)} className="flex items-center gap-2">
                <Import className="h-4 w-4" />
                <span className="hidden sm:inline">Importer</span>
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nouveau Fournisseur</span>
              </Button>
            </div>
          </div>

          <SupplierFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            activeFilters={activeFilters}
            onApplyFilters={handleApplyFilters}
            clearAllFilters={clearAllFilters}
          />

          <SuppliersList 
            sortField={activeFilters?.sortField} 
            sortDirection={activeFilters?.sortDirection} 
            onSort={handleSortToggle} 
          />
        </div>
      </main>

      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importation de Données</DialogTitle>
          </DialogHeader>
          <SupplierImportPanel onClose={() => setImportModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Suppliers;
