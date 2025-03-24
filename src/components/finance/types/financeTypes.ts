
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  client: string;
  clientType?: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paymentTerm?: string;
  commercial?: string;
  shipmentRef?: string;
  notes?: string;
  taxAmount?: number;
  totalAmount?: number;
}

export interface FinanceStatistic {
  label: string;
  value: string | number;
  previousValue?: string | number;
  percentChange?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

export interface InvoiceSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  count: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
}
