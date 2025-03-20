
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuoteOptionsProps {
  type: string;
  setType: (value: string) => void;
  validUntil: string;
  setValidUntil: (value: string) => void;
  incoterm: string;
  setIncoterm: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  items: any[];
  addItem: (item?: any) => void;
  suggestedItems: Record<string, any[]>;
}

const QuoteOptions: React.FC<QuoteOptionsProps> = ({
  type,
  setType,
  validUntil,
  setValidUntil,
  incoterm,
  setIncoterm,
  currency,
  setCurrency,
  notes,
  setNotes,
  items,
  addItem,
  suggestedItems
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type de transport *</label>
          <Select 
            value={type}
            onValueChange={(value) => {
              setType(value);
              // Auto-suggest services when type changes
              if (items.length === 0) {
                const serviceType = value as keyof typeof suggestedItems;
                if (suggestedItems[serviceType]?.[0]) {
                  addItem(suggestedItems[serviceType][0]);
                }
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Maritime">Maritime</SelectItem>
              <SelectItem value="Aérien">Aérien</SelectItem>
              <SelectItem value="Routier">Routier</SelectItem>
              <SelectItem value="Ferroviaire">Ferroviaire</SelectItem>
              <SelectItem value="Multimodal">Multimodal</SelectItem>
            </SelectContent>
          </Select>
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
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Incoterm</label>
          <Select 
            value={incoterm}
            onValueChange={setIncoterm}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un incoterm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXW">EXW - Ex Works</SelectItem>
              <SelectItem value="FCA">FCA - Free Carrier</SelectItem>
              <SelectItem value="FOB">FOB - Free On Board</SelectItem>
              <SelectItem value="CIF">CIF - Cost, Insurance & Freight</SelectItem>
              <SelectItem value="DAP">DAP - Delivered At Place</SelectItem>
              <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Devise</label>
          <Select 
            value={currency}
            onValueChange={setCurrency}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="USD">USD - Dollar américain</SelectItem>
              <SelectItem value="GBP">GBP - Livre sterling</SelectItem>
              <SelectItem value="JPY">JPY - Yen japonais</SelectItem>
              <SelectItem value="CNY">CNY - Yuan chinois</SelectItem>
            </SelectContent>
          </Select>
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
    </>
  );
};

export default QuoteOptions;
