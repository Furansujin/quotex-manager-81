
import { Invoice } from '../types/financeTypes';

export const mockInvoices: Invoice[] = [
  { 
    id: "INV-2023-0045", 
    client: "Tech Supplies Inc", 
    clientType: "Entreprise",
    issueDate: "2023-06-05", 
    dueDate: "2023-07-05",
    amount: 4250,
    currency: "EUR",
    status: "pending",
    commercial: "Jean Dupont",
    shipmentRef: "SHIP-2023-0123",
    notes: "Livraison en 2 parties",
  },
  { 
    id: "INV-2023-0044", 
    client: "Pharma Solutions", 
    clientType: "Entreprise",
    issueDate: "2023-06-02", 
    dueDate: "2023-07-02",
    amount: 2840.50,
    currency: "EUR",
    status: "pending",
    commercial: "Marie Martin",
    shipmentRef: "SHIP-2023-0119",
  },
  { 
    id: "INV-2023-0043", 
    client: "Global Imports Ltd", 
    clientType: "Entreprise",
    issueDate: "2023-05-28", 
    dueDate: "2023-06-27",
    amount: 3620.75,
    currency: "EUR",
    status: "paid",
    commercial: "Pierre Durand",
    shipmentRef: "SHIP-2023-0115",
    notes: "Transport maritime spécial",
  },
  { 
    id: "INV-2023-0042", 
    client: "Eurotech GmbH", 
    clientType: "PME",
    issueDate: "2023-05-25", 
    dueDate: "2023-06-24",
    amount: 1480,
    currency: "EUR",
    status: "paid",
    commercial: "Jean Dupont",
    shipmentRef: "SHIP-2023-0111",
  },
  { 
    id: "INV-2023-0041", 
    client: "Tech Supplies Inc", 
    clientType: "Entreprise",
    issueDate: "2023-05-20", 
    dueDate: "2023-06-19",
    amount: 2980.25,
    currency: "EUR",
    status: "overdue",
    commercial: "Marie Martin",
    shipmentRef: "SHIP-2023-0107",
  },
];

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'Payée';
    case 'pending':
      return 'En attente';
    case 'overdue':
      return 'En retard';
    default:
      return status;
  }
};

export const getStatusVariant = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'outline';
    case 'overdue':
      return 'destructive';
    default:
      return 'default';
  }
};
