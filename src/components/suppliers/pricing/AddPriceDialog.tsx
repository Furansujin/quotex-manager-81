
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import PriceForm, { PriceFormValues } from './PriceForm';

interface AddPriceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PriceFormValues) => void;
}

const AddPriceDialog: React.FC<AddPriceDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un tarif</DialogTitle>
          <DialogDescription>
            Complétez les informations du nouveau tarif
          </DialogDescription>
        </DialogHeader>
        <PriceForm onSubmit={onSubmit} submitLabel="Ajouter" />
      </DialogContent>
    </Dialog>
  );
};

export default AddPriceDialog;
