
import React from 'react';
import { Button } from '@/components/ui/button';

interface FinanceViewToggleProps {
  viewMode: 'dashboard' | 'invoices';
  onViewModeChange: (mode: 'dashboard' | 'invoices') => void;
}

const FinanceViewToggle: React.FC<FinanceViewToggleProps> = ({ 
  viewMode, 
  onViewModeChange 
}) => {
  return (
    <div className="flex space-x-2 mb-6">
      <Button 
        variant={viewMode === 'dashboard' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('dashboard')}
      >
        Tableau de bord
      </Button>
      <Button 
        variant={viewMode === 'invoices' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('invoices')}
      >
        Factures
      </Button>
    </div>
  );
};

export default FinanceViewToggle;
