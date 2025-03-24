
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface ShipmentActionsProps {
  shipmentId: string;
  onOpenShipment: (id: string) => void;
}

const ShipmentActions: React.FC<ShipmentActionsProps> = ({ shipmentId, onOpenShipment }) => {
  const { toast } = useToast();

  const handleEditShipment = (id: string) => {
    onOpenShipment(id);
  };

  const handleDuplicateShipment = (id: string) => {
    toast({
      title: "Expédition dupliquée",
      description: `L'expédition ${id} a été dupliquée avec succès.`,
    });
  };

  const handleDownloadShipment = (id: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Les documents de l'expédition ${id} sont en cours de téléchargement.`,
    });
  };
  
  const handleViewTrackingDetails = (id: string) => {
    onOpenShipment(id);
    toast({
      title: "Détails de suivi",
      description: `Consultation des détails de suivi pour l'expédition ${id}.`,
    });
  };

  return (
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleEditShipment(shipmentId)}>
            Modifier l'expédition
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleViewTrackingDetails(shipmentId)}>
            Consulter le suivi
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleDuplicateShipment(shipmentId)}>
            Dupliquer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownloadShipment(shipmentId)}>
            Télécharger les documents
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ShipmentActions;
