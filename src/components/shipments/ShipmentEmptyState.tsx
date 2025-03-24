
import React from 'react';
import { FileText } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';

const ShipmentEmptyState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center text-center">
          <FileText className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-base">Aucune expédition trouvée</p>
          <p className="text-sm text-muted-foreground mt-1">Créez une nouvelle expédition ou modifiez vos filtres de recherche</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ShipmentEmptyState;
