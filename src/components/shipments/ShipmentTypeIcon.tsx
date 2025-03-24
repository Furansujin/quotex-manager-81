
import React from 'react';
import { Ship, Truck, PlaneTakeoff } from 'lucide-react';

interface ShipmentTypeIconProps {
  type: string;
}

const ShipmentTypeIcon: React.FC<ShipmentTypeIconProps> = ({ type }) => {
  switch (type.toLowerCase()) {
    case 'maritime':
      return <Ship className="h-4 w-4 text-blue-600" />;
    case 'routier':
      return <Truck className="h-4 w-4 text-amber-600" />;
    case 'aérien':
      return <PlaneTakeoff className="h-4 w-4 text-green-600" />;
    default:
      return <Ship className="h-4 w-4 text-primary" />;
  }
};

export default ShipmentTypeIcon;
