
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ShipmentDetail from '@/components/shipments/ShipmentDetail';
import NewShipmentForm from '@/components/shipments/NewShipmentForm';
import ShipmentFilters from '@/components/shipments/ShipmentFilters';
import ShipmentTabs from '@/components/shipments/ShipmentTabs';
import ShipmentPageHeader from '@/components/shipments/ShipmentPageHeader';
import { useShipmentData } from '@/components/shipments/useShipmentData';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

interface ShipmentFilterValues {
  status: string[];
  types: string[];
  startDate?: Date;
  endDate?: Date;
  origin?: string;
  destination?: string;
  handler?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const Shipments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ShipmentFilterValues | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [showNewShipmentForm, setShowNewShipmentForm] = useState(false);
  const { toast } = useToast();
  const { shipments } = useShipmentData();
  const location = useLocation();

  // Check for shipment ID in URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const shipmentId = queryParams.get('id');
    
    if (shipmentId) {
      setSelectedShipment(shipmentId);
    }
  }, [location.search]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOpenShipment = (id: string) => {
    setSelectedShipment(id);
  };

  const handleNewShipmentSuccess = (shipmentId: string) => {
    setShowNewShipmentForm(false);
    toast({
      title: "Expédition créée",
      description: `L'expédition ${shipmentId} a été créée avec succès.`,
    });
    // Dans une vrai app, vous rechargeriez la liste des expéditions ou ajouteriez la nouvelle expédition à l'état
  };

  const handleApplyFilters = (filters: ShipmentFilterValues) => {
    setActiveFilters(filters);
    
    // Si des filtres de statut sont appliqués, on peut basculer sur l'onglet correspondant
    if (filters.status && filters.status.length === 1) {
      setActiveTab(filters.status[0]);
    } else if (filters.status && filters.status.length === 0) {
      setActiveTab('all');
    }
    
    toast({
      title: "Filtres appliqués",
      description: "Les expéditions ont été filtrées selon vos critères.",
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
      ...activeFilters || { status: [], types: [] },
      sortField: newField || undefined,
      sortDirection: newDirection || undefined
    };
    
    handleApplyFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <ShipmentPageHeader 
            onNewShipment={() => setShowNewShipmentForm(true)} 
          />

          <ShipmentFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            activeFilters={activeFilters}
            onApplyFilters={handleApplyFilters}
            clearAllFilters={clearAllFilters}
          />

          <ShipmentTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            shipments={shipments}
            onOpenShipment={handleOpenShipment}
            onSort={handleSortToggle}
            sortField={activeFilters?.sortField}
            sortDirection={activeFilters?.sortDirection}
          />
        </div>
      </main>
      
      {selectedShipment && (
        <ShipmentDetail
          shipmentId={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}

      {showNewShipmentForm && (
        <NewShipmentForm 
          onClose={() => setShowNewShipmentForm(false)}
          onSuccess={handleNewShipmentSuccess}
        />
      )}
    </div>
  );
};

export default Shipments;
