
import React from 'react';
import { Ship, Truck, PlaneTakeoff, Train, Bus } from 'lucide-react';

interface ShipmentTypeIconProps {
  type: string;
  className?: string;
}

const ShipmentTypeIcon: React.FC<ShipmentTypeIconProps> = ({ type, className = "h-4 w-4" }) => {
  switch (type.toLowerCase()) {
    case 'maritime':
      return <Ship className={`${className} text-primary`} />;
    case 'routier':
      return <Truck className={`${className} text-primary`} />;
    case 'aérien':
      return <PlaneTakeoff className={`${className} text-primary`} />;
    case 'ferroviaire':
      return <Train className={`${className} text-primary`} />;
    case 'multimodal':
      return <Bus className={`${className} text-primary`} />;
    default:
      return <Ship className={`${className} text-primary`} />;
  }
};

export default ShipmentTypeIcon;
