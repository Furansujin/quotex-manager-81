
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Invoice } from './types/financeTypes';
import { getStatusLabel, getStatusVariant } from './data/mockData';
import { 
  format, 
  parseISO 
} from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoiceTableProps {
  invoices: Invoice[];
  renderSortIcon: (field: string) => React.ReactNode;
  handleSortToggle: (field: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices, 
  renderSortIcon, 
  handleSortToggle 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-6 gap-4 p-3 bg-muted/30 text-sm font-medium border-b">
        <div className="flex items-center group cursor-pointer" onClick={() => handleSortToggle('id')}>
          N° Facture {renderSortIcon('id')}
        </div>
        <div className="flex items-center group cursor-pointer" onClick={() => handleSortToggle('client')}>
          Client {renderSortIcon('client')}
        </div>
        <div className="flex items-center group cursor-pointer" onClick={() => handleSortToggle('issueDate')}>
          Émission {renderSortIcon('issueDate')}
        </div>
        <div className="flex items-center group cursor-pointer" onClick={() => handleSortToggle('dueDate')}>
          Échéance {renderSortIcon('dueDate')}
        </div>
        <div className="flex items-center justify-end group cursor-pointer" onClick={() => handleSortToggle('amount')}>
          Montant {renderSortIcon('amount')}
        </div>
        <div className="flex items-center justify-end group cursor-pointer" onClick={() => handleSortToggle('status')}>
          Statut {renderSortIcon('status')}
        </div>
      </div>
      
      {invoices.length > 0 ? (
        invoices.map((invoice, index) => (
          <div 
            key={invoice.id} 
            className={`grid grid-cols-6 gap-4 p-3 text-sm hover:bg-muted/30 ${index !== invoices.length - 1 ? 'border-b' : ''}`}
          >
            <div className="font-medium">{invoice.id}</div>
            <div>{invoice.client}</div>
            <div>{formatDate(invoice.issueDate)}</div>
            <div>{formatDate(invoice.dueDate)}</div>
            <div className="text-right font-medium">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
            </div>
            <div className="text-right">
              <Badge variant={getStatusVariant(invoice.status) as any}>
                {getStatusLabel(invoice.status)}
              </Badge>
            </div>
          </div>
        ))
      ) : (
        <div className="p-6 text-center text-muted-foreground">
          Aucune facture ne correspond à vos critères
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
