
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  Download, 
  SendHorizontal, 
  X, 
  Printer, 
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

interface QuoteEditorProps {
  quoteId?: string;
  onClose: () => void;
}

const QuoteEditor: React.FC<QuoteEditorProps> = ({ quoteId, onClose }) => {
  const { toast } = useToast();
  const isEditing = !!quoteId;
  
  const [client, setClient] = useState(isEditing ? 'Tech Supplies Inc' : '');
  const [origin, setOrigin] = useState(isEditing ? 'Shanghai, CN' : '');
  const [destination, setDestination] = useState(isEditing ? 'Paris, FR' : '');
  const [validUntil, setValidUntil] = useState(isEditing ? '2023-07-31' : '');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState(isEditing ? 'Maritime' : 'Maritime');
  
  const [items, setItems] = useState<QuoteItem[]>(
    isEditing 
      ? [
          { 
            id: '1', 
            description: 'Transport maritime container 40HC', 
            quantity: 2, 
            unitPrice: 1200, 
            discount: 0, 
            tax: 20, 
            total: 2400 
          },
          { 
            id: '2', 
            description: 'Frais de manutention portuaire', 
            quantity: 1, 
            unitPrice: 350, 
            discount: 0, 
            tax: 20, 
            total: 350 
          },
          { 
            id: '3', 
            description: 'Assurance fret (Ad Valorem)', 
            quantity: 1, 
            unitPrice: 680, 
            discount: 5, 
            tax: 20, 
            total: 646 
          }
        ]
      : []
  );

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 20,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount' || field === 'tax') {
          const quantity = field === 'quantity' ? value : item.quantity;
          const unitPrice = field === 'unitPrice' ? value : item.unitPrice;
          const discount = field === 'discount' ? value : item.discount;
          
          const subtotal = quantity * unitPrice;
          const discountAmount = subtotal * (discount / 100);
          updatedItem.total = subtotal - discountAmount;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.total, 0);
  };

  const calculateTaxAmount = () => {
    return items.reduce((acc, item) => {
      const taxRate = item.tax / 100;
      return acc + (item.total * taxRate);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };

  const handleSave = () => {
    toast({
      title: "Devis enregistré",
      description: "Le devis a été sauvegardé avec succès.",
    });
  };

  const handleSend = () => {
    toast({
      title: "Devis envoyé",
      description: "Le devis a été envoyé au client par email.",
    });
  };

  const handleGeneratePdf = () => {
    toast({
      title: "PDF généré",
      description: "Le devis a été converti en PDF avec succès.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{isEditing ? 'Modifier le devis' : 'Nouveau devis'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client *</label>
                  <Input 
                    placeholder="Nom du client" 
                    value={client} 
                    onChange={(e) => setClient(e.target.value)} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Origine *</label>
                    <Input 
                      placeholder="Port/Ville d'origine" 
                      value={origin} 
                      onChange={(e) => setOrigin(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination *</label>
                    <Input 
                      placeholder="Port/Ville de destination" 
                      value={destination} 
                      onChange={(e) => setDestination(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de transport *</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="Maritime">Maritime</option>
                      <option value="Aérien">Aérien</option>
                      <option value="Routier">Routier</option>
                      <option value="Ferroviaire">Ferroviaire</option>
                      <option value="Multimodal">Multimodal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Valide jusqu'au *</label>
                    <Input 
                      type="date" 
                      value={validUntil} 
                      onChange={(e) => setValidUntil(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea 
                    placeholder="Informations complémentaires, conditions spéciales, etc." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations du devis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Numéro de devis</label>
                    <Input value="QT-2023-0142" disabled />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de création</label>
                  <Input type="date" value={new Date().toISOString().split('T')[0]} disabled />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Créé par</label>
                  <Input value="Jean Dupont" disabled />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <div className="p-3 bg-muted rounded-md">
                    {isEditing ? (
                      <Badge variant="success">Approuvé</Badge>
                    ) : (
                      <Badge variant="warning">Brouillon</Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Options du devis</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Taxes incluses</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Prix en EUR</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Incoterm FOB</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Détails des services</span>
                <Button onClick={addItem} size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead className="text-right">Prix unitaire</TableHead>
                      <TableHead className="text-right">Remise (%)</TableHead>
                      <TableHead className="text-right">TVA (%)</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input 
                            value={item.description} 
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Description du service"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="1"
                            value={item.quantity} 
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            className="text-right w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="0"
                            step="0.01"
                            value={item.unitPrice} 
                            onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                            className="text-right w-24"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="0"
                            max="100"
                            value={item.discount} 
                            onChange={(e) => updateItem(item.id, 'discount', Number(e.target.value))}
                            className="text-right w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="0"
                            max="100"
                            value={item.tax} 
                            onChange={(e) => updateItem(item.id, 'tax', Number(e.target.value))}
                            className="text-right w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.total.toFixed(2)} €
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Aucun service ajouté. Cliquez sur "Ajouter" pour commencer.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {items.length > 0 && (
                <div className="mt-6 space-y-2 w-72 ml-auto">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total:</span>
                    <span>{calculateSubtotal().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVA:</span>
                    <span>{calculateTaxAmount().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <Button variant="outline" className="gap-2 mr-2" onClick={handleGeneratePdf}>
                <FileText className="h-4 w-4" />
                Générer PDF
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => {}}>
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
            </div>
            
            <div>
              <Button variant="outline" className="gap-2 mr-2" onClick={onClose}>
                Annuler
              </Button>
              <Button variant="default" className="gap-2 mr-2" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
              <Button variant="default" className="gap-2" onClick={handleSend}>
                <SendHorizontal className="h-4 w-4" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteEditor;
