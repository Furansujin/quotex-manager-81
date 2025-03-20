
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import QuoteFilters, { QuoteFilterValues } from '@/components/quotes/QuoteFilters';

interface QuotesSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (value: boolean) => void;
  activeFilters: QuoteFilterValues | null;
  onApplyFilters: (filters: QuoteFilterValues) => void;
  clearAllFilters: () => void;
}

const QuotesSearchAndFilter: React.FC<QuotesSearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFilters,
  onApplyFilters,
  clearAllFilters
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par client, n° devis, destination..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showAdvancedFilters || activeFilters ? "default" : "outline"} 
            className="gap-2"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4" />
            {activeFilters ? "Filtres actifs" : "Filtres"}
            {activeFilters && <Badge variant="outline" className="ml-1 text-xs">{Object.keys(activeFilters).filter(k => {
              const value = activeFilters[k as keyof QuoteFilterValues];
              return value && (
                Array.isArray(value) 
                  ? (value as any[]).length > 0 
                  : true
              );
            }).length}</Badge>}
          </Button>
          
          {activeFilters && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={clearAllFilters}
            >
              <X className="h-4 w-4" />
              Effacer
            </Button>
          )}
          
          <QuoteFilters 
            show={showAdvancedFilters} 
            onClose={() => setShowAdvancedFilters(false)}
            onApplyFilters={onApplyFilters}
          />
        </div>
      </div>

      {/* Affichage des filtres actifs */}
      {activeFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeFilters.status.length > 0 && (
            <Badge variant="outline" className="gap-1">
              Statut: {activeFilters.status.map(s => 
                s === 'approved' ? 'Approuvé' : 
                s === 'pending' ? 'En attente' : 
                s === 'rejected' ? 'Rejeté' : 'Expiré'
              ).join(', ')}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1" 
                onClick={() => onApplyFilters({...activeFilters, status: []})}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {activeFilters.types.length > 0 && (
            <Badge variant="outline" className="gap-1">
              Type: {activeFilters.types.join(', ')}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1" 
                onClick={() => onApplyFilters({...activeFilters, types: []})}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {activeFilters.commercial && activeFilters.commercial !== 'all' && (
            <Badge variant="outline" className="gap-1">
              Commercial: {
                activeFilters.commercial === 'jean' ? 'Jean' : 
                activeFilters.commercial === 'marie' ? 'Marie' : 
                'Pierre'
              }
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1" 
                onClick={() => onApplyFilters({...activeFilters, commercial: undefined})}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(activeFilters.minAmount || activeFilters.maxAmount) && (
            <Badge variant="outline" className="gap-1">
              Montant: {activeFilters.minAmount ? `Min ${activeFilters.minAmount}€` : ''} 
              {activeFilters.minAmount && activeFilters.maxAmount ? ' - ' : ''}
              {activeFilters.maxAmount ? `Max ${activeFilters.maxAmount}€` : ''}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1" 
                onClick={() => onApplyFilters({...activeFilters, minAmount: undefined, maxAmount: undefined})}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(activeFilters.startDate || activeFilters.endDate) && (
            <Badge variant="outline" className="gap-1">
              Période: {activeFilters.startDate ? activeFilters.startDate.toLocaleDateString() : ''} 
              {activeFilters.startDate && activeFilters.endDate ? ' - ' : ''}
              {activeFilters.endDate ? activeFilters.endDate.toLocaleDateString() : ''}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1" 
                onClick={() => onApplyFilters({...activeFilters, startDate: undefined, endDate: undefined})}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </>
  );
};

export default QuotesSearchAndFilter;
