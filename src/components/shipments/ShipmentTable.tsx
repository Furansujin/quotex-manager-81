
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import ShipmentTableHeader from './ShipmentTableHeader';
import ShipmentRow from './ShipmentRow';
import ShipmentEmptyState from './ShipmentEmptyState';

// Define shipment type for better type safety
export interface Shipment {
  id: string;
  client: string;
  departureDate: string;
  arrivalDate: string;
  origin: string;
  destination: string;
  status: string;
  progress: number;
  type: string;
  containers: string;
  priority?: 'haute' | 'moyenne' | 'basse';
  hasDocumentIssues?: boolean;
  isWatched?: boolean;
}

interface ShipmentTableProps {
  shipments: Shipment[];
  onOpenShipment: (id: string) => void;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const ShipmentTable: React.FC<ShipmentTableProps> = ({ 
  shipments, 
  onOpenShipment, 
  onSort, 
  sortField, 
  sortDirection 
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <ShipmentTableHeader 
            onSort={onSort} 
            sortField={sortField} 
            sortDirection={sortDirection} 
          />
          
          <TableBody>
            {shipments.length === 0 ? (
              <ShipmentEmptyState />
            ) : (
              shipments.map((shipment) => (
                <ShipmentRow 
                  key={shipment.id}
                  shipment={shipment} 
                  onOpenShipment={onOpenShipment} 
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ShipmentTable;
