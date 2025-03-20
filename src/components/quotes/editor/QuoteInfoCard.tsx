
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface QuoteInfoCardProps {
  isEditing: boolean;
  type: string;
  suggestedItems: Record<string, Array<{description: string; unitPrice: number}>>;
  currency: string;
  addItem: (item?: {description: string; unitPrice: number}) => void;
}

const QuoteInfoCard: React.FC<QuoteInfoCardProps> = ({
  isEditing,
  type,
  suggestedItems,
  currency,
  addItem
}) => {
  return (
    <>
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
        <label className="text-sm font-medium">Services suggérés</label>
        <div className="bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
          {type && suggestedItems[type as keyof typeof suggestedItems] ? (
            <div className="space-y-2">
              {suggestedItems[type as keyof typeof suggestedItems].map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 hover:bg-background rounded-md cursor-pointer"
                  onClick={() => addItem(item)}
                >
                  <div>
                    <div className="font-medium text-sm">{item.description}</div>
                    <div className="text-xs text-muted-foreground">{item.unitPrice.toFixed(2)} {currency}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3 w-3" />
                    <span className="text-xs">Ajouter</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Sélectionnez un type de transport pour voir les suggestions
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuoteInfoCard;
