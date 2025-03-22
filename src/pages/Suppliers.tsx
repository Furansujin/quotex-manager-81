import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SuppliersList from '@/components/suppliers/SuppliersList';
import SupplierPricing from '@/components/suppliers/SupplierPricing';
import SupplierImport from '@/components/suppliers/SupplierImport';
import SupplierFilters from '@/components/suppliers/SupplierFilters';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

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
  const [activeTab, setActiveTab] = useState('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SupplierFilterValues | null>(null);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestion des Fournisseurs</h1>
            <p className="text-muted-foreground">Gérez vos fournisseurs et leurs tarifs</p>
          </div>

          {activeTab === 'suppliers' && (
            <SupplierFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showAdvancedFilters={showAdvancedFilters}
              setShowAdvancedFilters={setShowAdvancedFilters}
              activeFilters={activeFilters}
              onApplyFilters={handleApplyFilters}
              clearAllFilters={clearAllFilters}
            />
          )}

          <Tabs defaultValue="suppliers" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="suppliers" className="relative">
                  Fournisseurs
                </TabsTrigger>
                <TabsTrigger value="pricing">
                  Tarification
                </TabsTrigger>
                <TabsTrigger value="import">
                  Import Données
                </TabsTrigger>
              </TabsList>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-help">
                      <HelpCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Aide</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" align="end" className="max-w-[250px]">
                    <p className="text-sm">
                      {activeTab === 'suppliers' && "Gérez vos fournisseurs, ajoutez, modifiez ou supprimez des informations."}
                      {activeTab === 'pricing' && "Configurez et gérez les tarifs proposés par vos fournisseurs pour différentes routes."}
                      {activeTab === 'import' && "Importez des données de fournisseurs ou de tarifs à partir de fichiers CSV."}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <TabsContent value="suppliers" className="min-h-[500px]">
              <SuppliersList sortField={activeFilters?.sortField} sortDirection={activeFilters?.sortDirection} onSort={handleSortToggle} />
            </TabsContent>

            <TabsContent value="pricing" className="min-h-[500px]">
              <SupplierPricing />
            </TabsContent>

            <TabsContent value="import" className="min-h-[500px]">
              <SupplierImport />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Suppliers;
