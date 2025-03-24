
import React from 'react';
import { Ship, Truck, PlaneTakeoff, Train, Bus } from 'lucide-react';

interface ShipmentTypeIconProps {
  type: string;
  className?: string;
}

const ShipmentTypeIcon: React.FC<ShipmentTypeIconProps> = ({ type, className = "h-5 w-5" }) => {
  switch (type.toLowerCase()) {
    case 'maritime':
      return <Ship className={className} />;
    case 'routier':
      return <Truck className={className} />;
    case 'aérien':
      return <PlaneTakeoff className={className} />;
    case 'ferroviaire':
      return <Train className={className} />;
    case 'multimodal':
      return <Bus className={className} />;
    default:
      return <Ship className={className} />;
  }
};

export default ShipmentTypeIcon;
