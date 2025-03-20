
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
  addItem: (item?: {description: string; unitPrice: number}) => void;
  suggestedItems: any;
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
  setNotes
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type de transport</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
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
          <Label htmlFor="validUntil">Validité</Label>
          <Input
            id="validUntil"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="incoterm">Incoterm</Label>
          <Select value={incoterm} onValueChange={setIncoterm}>
            <SelectTrigger id="incoterm">
              <SelectValue placeholder="Sélectionner un incoterm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
              <SelectItem value="FCA">FCA (Free Carrier)</SelectItem>
              <SelectItem value="FOB">FOB (Free On Board)</SelectItem>
              <SelectItem value="CIF">CIF (Cost, Insurance & Freight)</SelectItem>
              <SelectItem value="DAP">DAP (Delivered At Place)</SelectItem>
              <SelectItem value="DDP">DDP (Delivered Duty Paid)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
              <SelectItem value="CNY">CNY (¥)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Notes ou instructions particulières pour ce devis"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default QuoteOptions;
