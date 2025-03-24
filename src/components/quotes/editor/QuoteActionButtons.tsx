
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, SendHorizontal, Printer, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuoteActionButtonsProps {
  onClose: () => void;
  handleGeneratePdf: () => Promise<void>;
  handlePrint: () => Promise<void>;
  handleSend: () => Promise<void>;
  handleSave: () => Promise<void>;
  handleFollowUp?: () => void;
  isGeneratingPdf: boolean;
  isPrinting: boolean;
  isSaving: boolean;
  itemsExist: boolean;
  showFollowUp?: boolean;
  hasCargoDetails?: boolean;
  status: string;
  onStatusChange: (status: string) => void;
}

const QuoteActionButtons: React.FC<QuoteActionButtonsProps> = ({
  onClose,
  handleGeneratePdf,
  handlePrint,
  handleSend,
  handleSave,
  handleFollowUp,
  isGeneratingPdf,
  isPrinting,
  isSaving,
  itemsExist,
  showFollowUp = false,
  hasCargoDetails = false,
  status,
  onStatusChange
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        {showFollowUp && handleFollowUp && (
          <Button 
            variant="outline" 
            onClick={handleFollowUp}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            Relancer
          </Button>
        )}
      </div>
      
      <div className="flex gap-2 items-center">
        {!hasCargoDetails && (
          <div className="flex items-center text-yellow-600 text-sm mr-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Détails marchandise non complétés</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mr-2">
          <span className="text-sm text-muted-foreground">Statut:</span>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvé</SelectItem>
              <SelectItem value="rejected">Rejeté</SelectItem>
              <SelectItem value="expired">Expiré</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
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
          {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  );
};

export default QuoteActionButtons;
