
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { Shipment } from './ShipmentTable';
import ShipmentStatusBadge from './ShipmentStatusBadge';
import ShipmentPriorityLabel from './ShipmentPriorityLabel';
import ShipmentProgressBar from './ShipmentProgressBar';
import ShipmentActions from './ShipmentActions';
import ShipmentRouteInfo from './ShipmentRouteInfo';

interface ShipmentRowProps {
  shipment: Shipment;
  onOpenShipment: (id: string) => void;
}

const ShipmentRow: React.FC<ShipmentRowProps> = ({ shipment, onOpenShipment }) => {
  return (
    <TableRow 
      key={shipment.id}
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onOpenShipment(shipment.id)}
    >
      <TableCell className="py-4">
        <div className="flex flex-col">
          <span className="font-medium truncate">{shipment.id}</span>
          <span className="text-xs text-muted-foreground">{shipment.containers}</span>
        </div>
      </TableCell>
      
      <TableCell className="py-4">
        <div className="flex flex-col">
          <div className="font-medium">{shipment.client}</div>
          {/* La balise ShipmentPriorityLabel est conservée mais retourne null désormais */}
          {shipment.priority && <ShipmentPriorityLabel priority={shipment.priority} />}
        </div>
      </TableCell>

      <TableCell className="py-4 text-center">
        <Badge variant="outline" className={shipment.type === 'Maritime' ? 'bg-blue-100 text-blue-700' : 
                                           shipment.type === 'Aérien' ? 'bg-sky-100 text-sky-700' : 
                                           'bg-amber-100 text-amber-700'}>
          {shipment.type}
        </Badge>
      </TableCell>
      
      <TableCell className="py-4">
        <ShipmentRouteInfo
          origin={shipment.origin}
          destination={shipment.destination}
          departureDate={shipment.departureDate}
          arrivalDate={shipment.arrivalDate}
        />
      </TableCell>
      
      <TableCell className="py-4">
        <div className="space-y-1.5">
          <ShipmentStatusBadge status={shipment.status} />
          <ShipmentProgressBar status={shipment.status} progress={shipment.progress} />
        </div>
      </TableCell>
      
      <TableCell className="text-right py-4">
        <ShipmentActions shipmentId={shipment.id} onOpenShipment={onOpenShipment} />
      </TableCell>
    </TableRow>
  );
};

export default ShipmentRow;
