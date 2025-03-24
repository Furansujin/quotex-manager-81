
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Invoice } from './types/financeTypes';
import { getStatusLabel, getStatusVariant } from './data/mockData';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Download, Printer, Mail, ExternalLink } from 'lucide-react';

interface InvoiceDetailProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ 
  invoice, 
  isOpen, 
  onClose 
}) => {
  if (!invoice) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: currency 
    }).format(amount);
  };

  // Calculate total with tax if available
  const totalAmount = invoice.totalAmount || (invoice.taxAmount 
    ? invoice.amount + invoice.taxAmount 
    : invoice.amount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Facture {invoice.id}</DialogTitle>
            <Badge variant={getStatusVariant(invoice.status) as any}>
              {getStatusLabel(invoice.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
              <p className="text-base font-semibold">{invoice.client}</p>
              {invoice.clientType && (
                <p className="text-sm text-muted-foreground">{invoice.clientType}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Commercial</h3>
              <p className="text-base">{invoice.commercial || 'Non spécifié'}</p>
            </div>
            
            {invoice.shipmentRef && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Référence d'expédition</h3>
                <p className="text-base">{invoice.shipmentRef}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date d'émission</h3>
              <p className="text-base">{formatDate(invoice.issueDate)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date d'échéance</h3>
              <p className="text-base">{formatDate(invoice.dueDate)}</p>
            </div>
            
            {invoice.paymentTerm && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Conditions de paiement</h3>
                <p className="text-base">{invoice.paymentTerm}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />
        
        <div className="space-y-4 py-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Montant HT</span>
            <span className="font-medium">{formatCurrency(invoice.amount, invoice.currency)}</span>
          </div>
          
          {invoice.taxAmount && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">TVA</span>
              <span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(totalAmount, invoice.currency)}</span>
          </div>
        </div>
        
        {invoice.notes && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
            <p className="text-sm p-3 bg-muted/30 rounded-md">{invoice.notes}</p>
          </div>
        )}
        
        <DialogFooter className="flex flex-wrap gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Envoyer
            </Button>
            <Button size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              Éditer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetail;
