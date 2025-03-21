
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Search, 
  SlidersHorizontal,
  ChevronDown,
  UserCircle,
  Clock,
  CalendarRange
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShipmentDetail from '@/components/shipments/ShipmentDetail';
import NewShipmentForm from '@/components/shipments/NewShipmentForm';
import ShipmentFilters from '@/components/shipments/ShipmentFilters';
import ShipmentTable from '@/components/shipments/ShipmentTable';
import ShipmentTabs from '@/components/shipments/ShipmentTabs';
import ShipmentPageHeader from '@/components/shipments/ShipmentPageHeader';
import { useShipmentData } from '@/components/shipments/useShipmentData';
import { useToast } from '@/hooks/use-toast';

const Shipments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [showNewShipmentForm, setShowNewShipmentForm] = useState(false);
  const { toast } = useToast();
  const { shipments } = useShipmentData();

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
    // In a real app, you would refresh the shipments list or add the new shipment to the state
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
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
          />

          <ShipmentTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            shipments={shipments}
            onOpenShipment={handleOpenShipment}
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
