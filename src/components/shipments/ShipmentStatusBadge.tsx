
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ShipmentStatusBadgeProps {
  status: string;
}

const ShipmentStatusBadge: React.FC<ShipmentStatusBadgeProps> = ({ status }) => {
  // Define color classes based on status
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'complété':
      case 'livré':
      case 'terminée':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'retardé':
      case 'retardée':
        return 'bg-red-100 text-red-700 hover:bg-red-200';
      case 'problème':
        return 'bg-red-100 text-red-700 hover:bg-red-200';
      case 'annulé':
      case 'annulée':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
      case 'planifié':
      case 'planifiée':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  return (
    <Badge
      variant="outline"
      className={getStatusClass()}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default ShipmentStatusBadge;
