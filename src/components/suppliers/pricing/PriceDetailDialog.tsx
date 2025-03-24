
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SupplierPrice, transportTypeLabels } from '../types/supplierPricing';
import { formatDate, isPriceExpired, getServiceLevelBadge, getTransportTypeLabel } from '../utils/supplierPricingUtils';
import { ArrowUpDown, Edit } from 'lucide-react';

interface PriceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  price: SupplierPrice | null;
  onEdit: (price: SupplierPrice) => void;
}

const PriceDetailDialog: React.FC<PriceDetailDialogProps> = ({ 
  isOpen, 
  onClose, 
  price, 
  onEdit 
}) => {
  if (!price) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Tarif {price.supplier}
            {getServiceLevelBadge(price.serviceLevel)}
          </DialogTitle>
          <DialogDescription>
            Détails du tarif de transport
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex justify-between">
              <div>
                <h4 className="text-sm font-medium">Origine</h4>
                <p className="text-lg">{price.origin}</p>
              </div>
              <div className="flex items-center">
                <ArrowUpDown className="mx-2 text-muted-foreground" />
              </div>
              <div className="text-right">
                <h4 className="text-sm font-medium">Destination</h4>
                <p className="text-lg">{price.destination}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Type de transport</h4>
              <p>{getTransportTypeLabel(price.transportType, transportTypeLabels)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Prix</h4>
              <p className="text-lg font-semibold">{price.price.toFixed(2)} {price.currency}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Temps de transit</h4>
              <p>{price.transitTime}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Validité</h4>
              <p className={isPriceExpired(price.validUntil) ? 'text-red-500' : ''}>
                {formatDate(price.validUntil)}
                {isPriceExpired(price.validUntil) && ' (Expiré)'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Référence contrat</h4>
              <p>{price.contractRef || 'Non spécifié'}</p>
            </div>
          </div>
          
          {price.notes && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
              <p className="text-sm">{price.notes}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onEdit(price)}>
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceDetailDialog;
