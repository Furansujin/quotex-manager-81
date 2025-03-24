
export interface SupplierPrice {
  id: string;
  supplier: string;
  origin: string;
  destination: string;
  transportType: 'maritime' | 'aérien' | 'routier' | 'ferroviaire' | 'multimodal';
  price: number;
  currency: string;
  transitTime: string;
  validUntil: string | Date;
  serviceLevel: 'express' | 'standard' | 'economy';
  notes?: string;
  contractRef?: string;
}

export const transportTypeLabels: Record<string, string> = {
  'maritime': 'Maritime',
  'aérien': 'Aérien',
  'routier': 'Routier',
  'ferroviaire': 'Ferroviaire',
  'multimodal': 'Multimodal'
};

// Mock data for demonstration
export const mockPrices: SupplierPrice[] = [
  {
    id: '1',
    supplier: 'Maersk',
    origin: 'Paris, France',
    destination: 'New York, États-Unis',
    transportType: 'maritime',
    price: 1250,
    currency: 'EUR',
    transitTime: '25-30 jours',
    validUntil: '2023-12-31',
    serviceLevel: 'standard',
    contractRef: 'CTR-MAE-2023-001'
  },
  {
    id: '2',
    supplier: 'CMA CGM',
    origin: 'Paris, France',
    destination: 'New York, États-Unis',
    transportType: 'maritime',
    price: 1150,
    currency: 'EUR',
    transitTime: '28-32 jours',
    validUntil: '2023-12-31',
    serviceLevel: 'standard',
    contractRef: 'CTR-CMA-2023-001'
  },
  {
    id: '3',
    supplier: 'Air France Cargo',
    origin: 'Paris, France',
    destination: 'New York, États-Unis',
    transportType: 'aérien',
    price: 2250,
    currency: 'EUR',
    transitTime: '3-5 jours',
    validUntil: '2023-12-15',
    serviceLevel: 'express',
    contractRef: 'CTR-AFC-2023-001'
  },
  {
    id: '4',
    supplier: 'DB Schenker',
    origin: 'Paris, France',
    destination: 'Madrid, Espagne',
    transportType: 'routier',
    price: 850,
    currency: 'EUR',
    transitTime: '5-7 jours',
    validUntil: '2023-12-15',
    serviceLevel: 'standard',
    contractRef: 'CTR-DBS-2023-001'
  }
];

export const suppliers = ['Maersk', 'CMA CGM', 'Air France Cargo', 'DB Schenker', 'Kuehne + Nagel', 'DSV'];
export const currencies = ['EUR', 'USD', 'GBP', 'JPY', 'CNY'];
