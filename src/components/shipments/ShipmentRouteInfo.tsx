
import React from 'react';
import { Calendar } from 'lucide-react';

interface ShipmentRouteInfoProps {
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
}

const ShipmentRouteInfo: React.FC<ShipmentRouteInfoProps> = ({ 
  origin, 
  destination, 
  departureDate, 
  arrivalDate 
}) => {
  return (
    <div className="flex flex-col">
      <div className="font-medium mb-1">{origin} → {destination}</div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Départ: {departureDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Arrivée: {arrivalDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentRouteInfo;
