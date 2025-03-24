
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// Format a date for display
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy');
  } catch (error) {
    return String(date);
  }
};

// Check if a price has expired
export const isPriceExpired = (date: string | Date): boolean => {
  if (!date) return false;
  
  try {
    const expiryDate = typeof date === 'string' ? new Date(date) : date;
    return expiryDate < new Date();
  } catch (error) {
    return false;
  }
};

// Get a badge component for a service level
export const getServiceLevelBadge = (serviceLevel: string) => {
  switch (serviceLevel) {
    case 'express':
      return <Badge variant="destructive">Express</Badge>;
    case 'standard':
      return <Badge variant="default">Standard</Badge>;
    case 'economy':
      return <Badge variant="outline">Economy</Badge>;
    default:
      return <Badge variant="secondary">{serviceLevel}</Badge>;
  }
};

// Get a transport type label
export const getTransportTypeLabel = (
  transportType: string,
  transportTypeLabels: Record<string, string>
): string => {
  return transportTypeLabels[transportType] || transportType;
};
