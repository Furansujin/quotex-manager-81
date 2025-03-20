
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Tag, ArrowUpDown, Percent, LightbulbIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  supplier?: string;
  margin?: number;
  basePrice?: number;
  additionalFees?: number;
}

interface QuoteItemsTableProps {
  items: QuoteItem[];
  updateItem: (id: string, field: keyof QuoteItem, value: any) => void;
  removeItem: (id: string) => void;
  addItem: (item?: {description: string; unitPrice: number}) => void;
  calculateSubtotal: () => number;
  calculateTaxAmount: () => number;
  calculateTotal: () => number;
  currency: string;
  suggestedItems: Array<{description: string; unitPrice: number}>;
  type: string;
}

const QuoteItemsTable: React.FC<QuoteItemsTableProps> = ({
  items,
  updateItem,
  removeItem,
  addItem,
  calculateSubtotal,
  calculateTaxAmount,
  calculateTotal,
  currency,
  suggestedItems,
  type
}) => {
  const [activeTab, setActiveTab] = useState<string>("items");
  
  // Function to determine if an item has margin info
  const hasMarginInfo = (item: QuoteItem) => {
    return item.basePrice !== undefined && item.margin !== undefined;
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="items">Lignes du devis</TabsTrigger>
          <TabsTrigger value="suggestions" className="gap-1">
            <LightbulbIcon className="h-4 w-4" />
            Services suggérés
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="pt-4">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Description</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Remise (%)</TableHead>
                  <TableHead>TVA (%)</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Marge</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <Input 
                          value={item.description} 
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="max-w-full"
                        />
                        {item.supplier && (
                          <Badge variant="outline" className="text-xs">
                            {item.supplier}
                          </Badge>
                        )}
                      </div>
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
                      {hasMarginInfo(item) ? (
                        <Badge 
                          variant="success" 
                          className="whitespace-nowrap gap-1 flex items-center"
                        >
                          <Percent className="h-3 w-3" /> {item.margin}%
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="whitespace-nowrap">Non défini</Badge>
                      )}
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
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      Aucun service ajouté. Utilisez les services suggérés ou ajoutez-en un manuellement.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => addItem()}
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
        </TabsContent>
        
        <TabsContent value="suggestions" className="pt-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-md font-medium mb-3">Services suggérés pour transport {type}</h3>
            
            {suggestedItems && suggestedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedItems.map((item, index) => (
                  <Card key={index} className="border border-muted hover:border-primary/30 transition-all">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.unitPrice.toFixed(2)} {currency}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          addItem(item);
                          setActiveTab("items");
                        }}
                        className="gap-1"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Ajouter
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {type ? 
                  "Aucun service suggéré disponible pour ce type de transport." : 
                  "Sélectionnez un type de transport pour voir les suggestions."}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuoteItemsTable;
