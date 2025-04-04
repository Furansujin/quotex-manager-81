
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ShipmentPageHeaderProps {
  onNewShipment: () => void;
}

const ShipmentPageHeader: React.FC<ShipmentPageHeaderProps> = ({ onNewShipment }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des Expéditions</h1>
        <p className="text-muted-foreground">Suivi et gestion des expéditions en cours</p>
      </div>
      <div className="flex gap-2">
        <Button 
          className="gap-2" 
          onClick={onNewShipment}
        >
          <Plus className="h-4 w-4" />
          Nouvelle Expédition
        </Button>
      </div>
    </div>
  );
};

export default ShipmentPageHeader;
