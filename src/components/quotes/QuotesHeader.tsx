
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface QuotesHeaderProps {
  onNewQuote: () => void;
}

const QuotesHeader: React.FC<QuotesHeaderProps> = ({ onNewQuote }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des Devis</h1>
        <p className="text-muted-foreground">Créez et gérez vos demandes de devis</p>
      </div>
      <div>
        <Button 
          className="gap-2" 
          onClick={onNewQuote}
          variant="default"
        >
          <PlusCircle className="h-4 w-4" />
          Nouveau Devis
        </Button>
      </div>
    </div>
  );
};

export default QuotesHeader;
