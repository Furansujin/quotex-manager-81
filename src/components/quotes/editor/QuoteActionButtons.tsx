
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, SendHorizontal, Printer, FileText } from 'lucide-react';

interface QuoteActionButtonsProps {
  onClose: () => void;
  handleGeneratePdf: () => Promise<void>;
  handlePrint: () => Promise<void>;
  handleSend: () => Promise<void>;
  handleSave: () => Promise<void>;
  isGeneratingPdf: boolean;
  isPrinting: boolean;
  isSaving: boolean;
  itemsExist: boolean;
}

const QuoteActionButtons: React.FC<QuoteActionButtonsProps> = ({
  onClose,
  handleGeneratePdf,
  handlePrint,
  handleSend,
  handleSave,
  isGeneratingPdf,
  isPrinting,
  isSaving,
  itemsExist
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf || !itemsExist}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          {isGeneratingPdf ? 'Génération...' : 'Générer PDF'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handlePrint}
          disabled={isPrinting || !itemsExist}
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          {isPrinting ? 'Impression...' : 'Imprimer'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleSend}
          disabled={isSaving || !itemsExist}
          className="gap-2"
        >
          <SendHorizontal className="h-4 w-4" />
          {isSaving ? 'Envoi...' : 'Envoyer'}
        </Button>
        
        <Button 
          onClick={handleSave}
          disabled={isSaving || !itemsExist}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  );
};

export default QuoteActionButtons;
