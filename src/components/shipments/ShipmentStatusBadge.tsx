
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ShipmentStatusBadgeProps {
  status: string;
}

const ShipmentStatusBadge: React.FC<ShipmentStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'en cours':
      return <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-200">En cours</Badge>;
    case 'terminée':
      return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-200">Terminée</Badge>;
    case 'planifiée':
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200">Planifiée</Badge>;
    case 'retardée':
      return <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-200">Retardée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default ShipmentStatusBadge;
