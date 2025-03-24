
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { Shipment } from './ShipmentTable';
import ShipmentStatusBadge from './ShipmentStatusBadge';
import ShipmentPriorityLabel from './ShipmentPriorityLabel';
import ShipmentActions from './ShipmentActions';
import ShipmentRouteInfo from './ShipmentRouteInfo';
import ShipmentTypeIcon from './ShipmentTypeIcon';

interface ShipmentRowProps {
  shipment: Shipment;
  onOpenShipment: (id: string) => void;
}

const ShipmentRow: React.FC<ShipmentRowProps> = ({ shipment, onOpenShipment }) => {
  const handleRowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenShipment(shipment.id);
  };

  return (
    <TableRow 
      key={shipment.id}
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={handleRowClick}
    >
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium truncate">{shipment.id}</span>
          <span className="text-xs text-muted-foreground">{shipment.containers}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col">
          <div className="font-medium">{shipment.client}</div>
          {shipment.priority && <ShipmentPriorityLabel priority={shipment.priority} />}
        </div>
      </TableCell>

      <TableCell>
        <Badge variant="outline" className="flex items-center gap-1.5">
          <ShipmentTypeIcon type={shipment.type} />
          {shipment.type}
        </Badge>
      </TableCell>
      
      <TableCell>
        <ShipmentRouteInfo
          origin={shipment.origin}
          destination={shipment.destination}
          departureDate={shipment.departureDate}
          arrivalDate={shipment.arrivalDate}
        />
      </TableCell>
      
      <TableCell>
        <ShipmentStatusBadge status={shipment.status} />
      </TableCell>
      
      <TableCell className="text-right">
        <ShipmentActions shipmentId={shipment.id} onOpenShipment={onOpenShipment} />
      </TableCell>
    </TableRow>
  );
};

export default ShipmentRow;
