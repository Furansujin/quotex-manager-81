
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
    taxAmount: 850,
    paymentTerm: "30 jours"
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
    taxAmount: 568.10,
    paymentTerm: "30 jours"
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
    taxAmount: 724.15,
    paymentTerm: "30 jours"
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
    taxAmount: 296,
    paymentTerm: "30 jours"
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
    taxAmount: 596.05,
    paymentTerm: "30 jours"
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

export const calculateInvoiceSummary = (invoices: Invoice[]) => {
  return invoices.reduce((summary, invoice) => {
    const totalWithTax = invoice.totalAmount || 
      (invoice.taxAmount ? invoice.amount + invoice.taxAmount : invoice.amount);
    
    summary.totalAmount += totalWithTax;
    
    // Update amounts by status
    if (invoice.status === 'paid') {
      summary.paidAmount += totalWithTax;
      summary.count.paid += 1;
    } else if (invoice.status === 'pending') {
      summary.pendingAmount += totalWithTax;
      summary.count.pending += 1;
    } else if (invoice.status === 'overdue') {
      summary.overdueAmount += totalWithTax;
      summary.count.overdue += 1;
    }
    
    summary.count.total += 1;
    
    return summary;
  }, {
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    count: {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0
    }
  });
};
