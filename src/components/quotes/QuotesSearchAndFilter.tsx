
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  ArrowDownUp,
  X, 
  RefreshCw,
  Ship,
  Plane,
  Truck,
  Train,
  Package
} from 'lucide-react';
import QuoteFilters, { QuoteFilterValues } from './QuoteFilters';

interface QuotesSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
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
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  
  // Handle sort toggle
  const handleSortToggle = () => {
    if (!sortField) {
      setSortField('date');
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortField(null);
      setSortDirection(null);
    }
  };
  
  // Format active status filters for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'expired': return 'Expiré';
      default: return status;
    }
  };
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    if (!activeFilters) return false;
    
    return (
      activeFilters.status.length > 0 ||
      activeFilters.types.length > 0 ||
      !!activeFilters.commercial ||
      !!activeFilters.minAmount ||
      !!activeFilters.maxAmount ||
      !!activeFilters.startDate ||
      !!activeFilters.endDate
    );
  };
  
  return (
    <div className="mb-6 space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par n° devis, client, destination..." 
            className="pl-10 h-11 bg-white border-[#eee]" 
          />
        </div>
        <div className="flex gap-3">
          <Button 
            variant={showAdvancedFilters ? "default" : "outline"} 
            className={`gap-2 px-4 h-11 ${hasActiveFilters() ? 'bg-primary/10' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtres
            {hasActiveFilters() && (
              <Badge variant="outline" className="ml-1 bg-white">
                {
                  (activeFilters?.status?.length || 0) + 
                  (activeFilters?.types?.length || 0) + 
                  (activeFilters?.commercial ? 1 : 0) +
                  (activeFilters?.startDate || activeFilters?.endDate ? 1 : 0) +
                  (activeFilters?.minAmount || activeFilters?.maxAmount ? 1 : 0)
                }
              </Badge>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className={`gap-2 px-4 h-11 ${sortField ? 'bg-primary/10' : ''}`}
            onClick={handleSortToggle}
          >
            <ArrowDownUp className={`h-4 w-4 ${sortField ? 'text-primary' : ''}`} />
            {!sortField && "Trier"}
            {sortField === 'date' && sortDirection === 'asc' && "Date (↑)"}
            {sortField === 'date' && sortDirection === 'desc' && "Date (↓)"}
          </Button>
          
          {hasActiveFilters() && (
            <Button 
              variant="outline" 
              className="gap-2 px-4 h-11"
              onClick={clearAllFilters}
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
      
      {/* Display active filters */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {activeFilters?.status.map((status) => (
            <Badge key={status} variant="outline" className="px-3 py-1.5 bg-primary/5 gap-1">
              {formatStatus(status)}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => {
                  const newFilters = {...activeFilters, status: activeFilters.status.filter(s => s !== status)};
                  onApplyFilters(newFilters);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {activeFilters?.types.map((type) => (
            <Badge key={type} variant="outline" className="px-3 py-1.5 gap-1">
              {type === 'Maritime' ? (
                <>
                  <Ship className="h-3.5 w-3.5 text-blue-500" />
                  Maritime
                </>
              ) : type === 'Aérien' ? (
                <>
                  <Plane className="h-3.5 w-3.5 text-green-500" />
                  Aérien
                </>
              ) : type === 'Routier' ? (
                <>
                  <Truck className="h-3.5 w-3.5 text-amber-500" />
                  Routier
                </>
              ) : type === 'Ferroviaire' ? (
                <>
                  <Train className="h-3.5 w-3.5 text-purple-500" />
                  Ferroviaire
                </>
              ) : (
                <>
                  <Package className="h-3.5 w-3.5 text-indigo-500" />
                  Multimodal
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => {
                  const newFilters = {...activeFilters, types: activeFilters.types.filter(t => t !== type)};
                  onApplyFilters(newFilters);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {activeFilters?.commercial && (
            <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
              Commercial: {activeFilters.commercial}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => {
                  const newFilters = {...activeFilters, commercial: undefined};
                  onApplyFilters(newFilters);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(activeFilters?.startDate || activeFilters?.endDate) && (
            <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
              Période: {activeFilters.startDate && new Date(activeFilters.startDate).toLocaleDateString('fr')}
              {activeFilters.startDate && activeFilters.endDate && ' - '}
              {activeFilters.endDate && new Date(activeFilters.endDate).toLocaleDateString('fr')}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => {
                  const newFilters = {...activeFilters, startDate: undefined, endDate: undefined};
                  onApplyFilters(newFilters);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(activeFilters?.minAmount || activeFilters?.maxAmount) && (
            <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
              Montant: {activeFilters.minAmount && `${activeFilters.minAmount}€`}
              {activeFilters.minAmount && activeFilters.maxAmount && ' - '}
              {activeFilters.maxAmount && `${activeFilters.maxAmount}€`}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => {
                  const newFilters = {...activeFilters, minAmount: undefined, maxAmount: undefined};
                  onApplyFilters(newFilters);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 gap-1"
            onClick={clearAllFilters}
          >
            <X className="h-3 w-3" />
            Effacer tout
          </Button>
        </div>
      )}
      
      {/* Filters panel */}
      {showAdvancedFilters && (
        <div className="mt-2 animate-fade-in">
          <QuoteFilters 
            show={showAdvancedFilters} 
            onClose={() => setShowAdvancedFilters(false)}
            onApplyFilters={onApplyFilters}
          />
        </div>
      )}
    </div>
  );
};

export default QuotesSearchAndFilter;
