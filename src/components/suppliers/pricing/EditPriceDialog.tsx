
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import PriceForm, { PriceFormValues } from './PriceForm';
import { SupplierPrice } from '../types/supplierPricing';

interface EditPriceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  price: SupplierPrice | null;
  onSubmit: (values: PriceFormValues) => void;
}

const EditPriceDialog: React.FC<EditPriceDialogProps> = ({ 
  isOpen, 
  onClose, 
  price, 
  onSubmit 
}) => {
  if (!price) return null;

  const defaultValues = {
    supplier: price.supplier,
    origin: price.origin,
    destination: price.destination,
    transportType: price.transportType,
    price: price.price,
    currency: price.currency,
    transitTime: price.transitTime,
    validUntil: typeof price.validUntil === 'string' ? new Date(price.validUntil) : price.validUntil,
    serviceLevel: price.serviceLevel,
    notes: price.notes || '',
    contractRef: price.contractRef || ''
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier un tarif</DialogTitle>
          <DialogDescription>
            Modifiez les informations du tarif
          </DialogDescription>
        </DialogHeader>
        <PriceForm 
          defaultValues={defaultValues} 
          onSubmit={onSubmit} 
          submitLabel="Enregistrer" 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPriceDialog;
