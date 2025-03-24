
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { SupplierPrice } from '../types/supplierPricing';

export const formatDate = (dateString: string | Date) => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    return 'Date invalide';
  }
};

export const isPriceExpired = (dateString: string | Date) => {
  try {
    const validUntil = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return validUntil < new Date();
  } catch {
    return false;
  }
};

export const getServiceLevelBadge = (level: string) => {
  switch (level) {
    case 'express':
      return <Badge variant="destructive">Express</Badge>;
    case 'standard':
      return <Badge variant="default">Standard</Badge>;
    case 'economy':
      return <Badge variant="outline">Économique</Badge>;
    default:
      return <Badge variant="secondary">{level}</Badge>;
  }
};

export const getTransportTypeLabel = (type: string, transportTypeLabels: Record<string, string>) => {
  return transportTypeLabels[type] || type;
};

export const filterPrices = (
  prices: SupplierPrice[],
  searchTerm: string,
  selectedOrigin: string,
  selectedDestination: string,
  selectedType: string
) => {
  return prices.filter(price => {
    const matchesSearch = 
      price.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (price.contractRef && price.contractRef.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesOrigin = !selectedOrigin || price.origin.includes(selectedOrigin);
    const matchesDestination = !selectedDestination || price.destination.includes(selectedDestination);
    const matchesType = !selectedType || price.transportType === selectedType;
    
    return matchesSearch && matchesOrigin && matchesDestination && matchesType;
  });
};
