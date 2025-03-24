
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface ShipmentTableHeaderProps {
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const ShipmentTableHeader: React.FC<ShipmentTableHeaderProps> = ({ 
  onSort,
  sortField,
  sortDirection
}) => {
  // Function to render sort icons
  const renderSortIcon = (field: string) => {
    if (!onSort) return null;
    
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onSort) onSort(field);
        }}
        className="ml-1 p-0 h-6 w-6 hover:bg-transparent"
      >
        {sortField === field && sortDirection === 'asc' && <ArrowUp className="h-3.5 w-3.5 text-primary" />}
        {sortField === field && sortDirection === 'desc' && <ArrowDown className="h-3.5 w-3.5 text-primary" />}
        {sortField !== field && <div className="h-3.5 w-3.5 opacity-0 group-hover:opacity-30">↕</div>}
      </Button>
    );
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="cursor-pointer group">
          Référence {renderSortIcon('id')}
        </TableHead>
        <TableHead className="cursor-pointer group">
          Client {renderSortIcon('client')}
        </TableHead>
        <TableHead className="cursor-pointer group">
          Transport {renderSortIcon('type')}
        </TableHead>
        <TableHead className="cursor-pointer group">
          Trajet & Dates {renderSortIcon('departureDate')}
        </TableHead>
        <TableHead className="cursor-pointer group">
          Statut {renderSortIcon('status')}
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ShipmentTableHeader;
