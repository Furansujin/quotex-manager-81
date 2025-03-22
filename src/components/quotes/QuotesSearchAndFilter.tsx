
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuotesSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (value: boolean) => void;
  activeFilters: QuoteFilterValues | null;
  onApplyFilters: (filters: QuoteFilterValues) => void;
  clearAllFilters: () => void;
}

export interface QuoteFilterValues {
  startDate?: Date;
  endDate?: Date;
  status: string[];
  types: string[];
  commercial?: string;
  minAmount?: number;
  maxAmount?: number;
  [key: string]: any;
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
  // Local state for filter values
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>(activeFilters?.status || []);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(activeFilters?.types || []);
  const [commercial, setCommercial] = React.useState<string>(activeFilters?.commercial || 'all');
  const [minAmount, setMinAmount] = React.useState<string>(activeFilters?.minAmount?.toString() || '');
  const [maxAmount, setMaxAmount] = React.useState<string>(activeFilters?.maxAmount?.toString() || '');
  const [startDate, setStartDate] = React.useState<Date | undefined>(activeFilters?.startDate);
  const [endDate, setEndDate] = React.useState<Date | undefined>(activeFilters?.endDate);

  // Sync local state with active filters
  React.useEffect(() => {
    if (activeFilters) {
      setSelectedStatus(activeFilters.status || []);
      setSelectedTypes(activeFilters.types || []);
      setCommercial(activeFilters.commercial || 'all');
      setMinAmount(activeFilters.minAmount?.toString() || '');
      setMaxAmount(activeFilters.maxAmount?.toString() || '');
      setStartDate(activeFilters.startDate);
      setEndDate(activeFilters.endDate);
    } else {
      setSelectedStatus([]);
      setSelectedTypes([]);
      setCommercial('all');
      setMinAmount('');
      setMaxAmount('');
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [activeFilters]);

  const handleStatusToggle = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleApplyFilters = () => {
    const filters: QuoteFilterValues = {
      status: selectedStatus,
      types: selectedTypes,
      commercial: commercial !== 'all' ? commercial : undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      startDate,
      endDate
    };
    
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setSelectedStatus([]);
    setSelectedTypes([]);
    setCommercial('all');
    setMinAmount('');
    setMaxAmount('');
    setStartDate(undefined);
    setEndDate(undefined);
    clearAllFilters();
  };

  // Auto-apply filters when they change
  React.useEffect(() => {
    if (activeFilters) {
      handleApplyFilters();
    }
  }, [selectedStatus, selectedTypes, commercial, startDate, endDate]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
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
          <Collapsible 
            open={showAdvancedFilters} 
            onOpenChange={setShowAdvancedFilters}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant={activeFilters ? "default" : "outline"} 
                className="gap-2"
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
                {showAdvancedFilters ? 
                  <ChevronUp className="h-4 w-4 ml-1" /> : 
                  <ChevronDown className="h-4 w-4 ml-1" />
                }
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          
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
        </div>
      </div>

      {/* Collapsible Filter Section - Always accessible below search bar */}
      <Collapsible open={showAdvancedFilters} className="mb-6">
        <CollapsibleContent>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Statut</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer hover:bg-primary/10 ${selectedStatus.length === 0 ? 'bg-primary/10' : ''}`}
                      onClick={() => setSelectedStatus([])}
                    >
                      Tous
                    </Badge>
                    <Badge 
                      variant="warning" 
                      className={`cursor-pointer ${selectedStatus.includes('pending') ? 'opacity-100' : 'opacity-60'}`}
                      onClick={() => handleStatusToggle('pending')}
                    >
                      En attente
                    </Badge>
                    <Badge 
                      variant="success" 
                      className={`cursor-pointer ${selectedStatus.includes('approved') ? 'opacity-100' : 'opacity-60'}`}
                      onClick={() => handleStatusToggle('approved')}
                    >
                      Approuvés
                    </Badge>
                    <Badge 
                      variant="destructive" 
                      className={`cursor-pointer ${selectedStatus.includes('rejected') ? 'opacity-100' : 'opacity-60'}`}
                      onClick={() => handleStatusToggle('rejected')}
                    >
                      Rejetés
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer hover:bg-primary/10 ${selectedStatus.includes('expired') ? 'opacity-100' : 'opacity-60'}`}
                      onClick={() => handleStatusToggle('expired')}
                    >
                      Expirés
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Type de transport</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer hover:bg-primary/10 ${selectedTypes.length === 0 ? 'bg-primary/10' : ''}`}
                      onClick={() => setSelectedTypes([])}
                    >
                      Tous
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer hover:bg-blue-500/10 text-blue-500 ${selectedTypes.includes('Maritime') ? 'bg-blue-500/10' : ''}`}
                      onClick={() => handleTypeToggle('Maritime')}
                    >
                      Maritime
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer hover:bg-green-500/10 text-green-500 ${selectedTypes.includes('Aérien') ? 'bg-green-500/10' : ''}`}
                      onClick={() => handleTypeToggle('Aérien')}
                    >
                      Aérien
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer hover:bg-amber-500/10 text-amber-500 ${selectedTypes.includes('Routier') ? 'bg-amber-500/10' : ''}`}
                      onClick={() => handleTypeToggle('Routier')}
                    >
                      Routier
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer hover:bg-purple-500/10 text-purple-500 ${selectedTypes.includes('Ferroviaire') ? 'bg-purple-500/10' : ''}`}
                      onClick={() => handleTypeToggle('Ferroviaire')}
                    >
                      Ferroviaire
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer hover:bg-indigo-500/10 text-indigo-500 ${selectedTypes.includes('Multimodal') ? 'bg-indigo-500/10' : ''}`}
                      onClick={() => handleTypeToggle('Multimodal')}
                    >
                      Multimodal
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Commercial</label>
                  <Select value={commercial} onValueChange={setCommercial}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tous les commerciaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les commerciaux</SelectItem>
                      <SelectItem value="jean">Jean Dupont</SelectItem>
                      <SelectItem value="marie">Marie Martin</SelectItem>
                      <SelectItem value="pierre">Pierre Durand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Montant</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="number" 
                      placeholder="Min (€)" 
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                    <Input 
                      type="number" 
                      placeholder="Max (€)" 
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Période</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {startDate ? format(startDate, 'P', { locale: fr }) : <span>Date début</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {endDate ? format(endDate, 'P', { locale: fr }) : <span>Date fin</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="mr-2" onClick={handleResetFilters}>Réinitialiser</Button>
                <Button onClick={handleApplyFilters}>Appliquer</Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

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
