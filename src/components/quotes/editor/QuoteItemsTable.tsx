
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

interface QuoteItemsTableProps {
  items: QuoteItem[];
  updateItem: (id: string, field: keyof QuoteItem, value: any) => void;
  removeItem: (id: string) => void;
  addItem: () => void;
  calculateSubtotal: () => number;
  calculateTaxAmount: () => number;
  calculateTotal: () => number;
  currency: string;
}

const QuoteItemsTable: React.FC<QuoteItemsTableProps> = ({
  items,
  updateItem,
  removeItem,
  addItem,
  calculateSubtotal,
  calculateTaxAmount,
  calculateTotal,
  currency
}) => {
  return (
    <>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Description</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Prix unitaire</TableHead>
              <TableHead>Remise (%)</TableHead>
              <TableHead>TVA (%)</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input 
                    value={item.description} 
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="max-w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={item.unitPrice} 
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={item.discount} 
                    onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                    className="w-20"
                    min="0"
                    max="100"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={item.tax} 
                    onChange={(e) => updateItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                    className="w-20"
                    min="0"
                    max="100"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {item.total.toFixed(2)} {currency}
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Aucun service ajouté. Cliquez sur un service suggéré ou ajoutez-en un manuellement.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={addItem}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter une ligne
        </Button>
      </div>
      
      <div className="mt-6 flex justify-end">
        <div className="w-72 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Sous-total:</span>
            <span className="font-medium">{calculateSubtotal().toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">TVA:</span>
            <span className="font-medium">{calculateTaxAmount().toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-medium">Total:</span>
            <span className="font-bold">{calculateTotal().toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuoteItemsTable;
