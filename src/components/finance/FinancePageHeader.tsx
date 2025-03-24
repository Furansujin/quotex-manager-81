
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Plus } from 'lucide-react';

interface FinancePageHeaderProps {
  onNewInvoiceClick: () => void;
}

const FinancePageHeader: React.FC<FinancePageHeaderProps> = ({ 
  onNewInvoiceClick 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion Financière</h1>
        <p className="text-muted-foreground">Suivi des factures, paiements et performance financière</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Rapports
        </Button>
        <Button className="gap-2" onClick={onNewInvoiceClick}>
          <Plus className="h-4 w-4" />
          Nouvelle Facture
        </Button>
      </div>
    </div>
  );
};

export default FinancePageHeader;
