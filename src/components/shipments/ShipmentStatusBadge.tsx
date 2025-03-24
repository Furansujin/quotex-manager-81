
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ShipmentStatusBadgeProps {
  status: string;
}

const ShipmentStatusBadge: React.FC<ShipmentStatusBadgeProps> = ({ status }) => {
  return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
};

export default ShipmentStatusBadge;
