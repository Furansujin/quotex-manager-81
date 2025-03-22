import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  ArrowDownUp,
  SortAsc,
  SortDesc,
  X, 
  RefreshCw,
  Ship,
  Plane,
  Truck,
  Train,
  Package,
  UserCircle,
  Calendar
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { QuoteFilterValues } from '@/hooks/useQuotesData';

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
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [commercialSearch, setCommercialSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  
  // Liste des commerciaux (à remplacer par des données réelles)
  const commercials = [
    { id: 'jean', name: 'Jean Dupont' },
    { id: 'marie', name: 'Marie Martin' },
    { id: 'pierre', name: 'Pierre Durand' }
  ];
  
  // Filtrer les commerciaux en fonction de la recherche
  const filteredCommercials = commercials.filter(commercial => 
    commercial.name.toLowerCase().includes(commercialSearch.toLowerCase())
  );
  
  // Handle sort toggle
  const handleSortToggle = (field: string) => {
    let newSortField = field;
    let newSortDirection: 'asc' | 'desc' | null = null;
    
    if (sortField === field) {
      if (sortDirection === 'asc') {
        newSortDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newSortField = '';
      }
    } else {
      newSortDirection = 'asc';
    }
    
    setSortField(newSortField || null);
    setSortDirection(newSortDirection);
    
    // Apply sort to filters
    const newFilters = { 
      ...activeFilters || { status: [], types: [] }, 
      sortField: newSortField || undefined,
      sortDirection: newSortDirection || undefined
    };
    onApplyFilters(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status];
    
    setSelectedStatus(newStatus);
  };
  
  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
  };

  const handleCommercialSelect = (commercial: string) => {
    setCommercialSearch(commercial);
  };

  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (type === 'start') {
      setStartDate(date);
      if (date) {
        setStartDateInput(format(date, 'dd/MM/yyyy'));
      } else {
        setStartDateInput('');
      }
    } else {
      setEndDate(date);
      if (date) {
        setEndDateInput(format(date, 'dd/MM/yyyy'));
      } else {
        setEndDateInput('');
      }
    }
  };

  const handleDateInputChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDateInput(value);
      
      try {
        if (value) {
          // Try to parse the date in format dd/MM/yyyy
          const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
          if (!isNaN(parsedDate.getTime())) {
            setStartDate(parsedDate);
          }
        } else {
          setStartDate(undefined);
        }
      } catch (error) {
        // Invalid date format, keep the input but don't update the date
      }
    } else {
      setEndDateInput(value);
      
      try {
        if (value) {
          const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
          if (!isNaN(parsedDate.getTime())) {
            setEndDate(parsedDate);
          }
        } else {
          setEndDate(undefined);
        }
      } catch (error) {
        // Invalid date format
      }
    }
  };

  const handleAmountChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setMinAmount(value);
    } else {
      setMaxAmount(value);
    }
  };

  const getFilterValues = () => {
    // Déterminer le commercial sélectionné
    let selectedCommercial: string | undefined = undefined;
    const matchedCommercial = commercials.find(c => 
      c.name.toLowerCase() === commercialSearch.toLowerCase()
    );
    if (matchedCommercial) {
      selectedCommercial = matchedCommercial.id;
    } else if (commercialSearch.trim()) {
      selectedCommercial = commercialSearch;
    }
    
    // Construire l'objet de filtres
    return {
      startDate,
      endDate,
      status: selectedStatus,
      types: selectedTypes,
      commercial: selectedCommercial,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      sortField: sortField || undefined,
      sortDirection: sortDirection || undefined
    };
  };
  
  const handleApplyFilters = () => {
    const filters = getFilterValues();
    onApplyFilters(filters);
    setShowAdvancedFilters(false);
  };
  
  const handleResetFilters = () => {
    setSelectedStatus([]);
    setSelectedTypes([]);
    setCommercialSearch('');
    setStartDate(undefined);
    setEndDate(undefined);
    setStartDateInput('');
    setEndDateInput('');
    setMinAmount('');
    setMaxAmount('');
    setSortField(null);
    setSortDirection(null);
    
    clearAllFilters();
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
      !!activeFilters.endDate ||
      !!activeFilters.sortField
    );
  };
  
  // Update local state when activeFilters change
  useEffect(() => {
    if (activeFilters) {
      setSelectedStatus(activeFilters.status || []);
      setSelectedTypes(activeFilters.types || []);
      
      if (activeFilters.startDate) {
        setStartDate(activeFilters.startDate);
        setStartDateInput(format(activeFilters.startDate, 'dd/MM/yyyy'));
      } else {
        setStartDate(undefined);
        setStartDateInput('');
      }
      
      if (activeFilters.endDate) {
        setEndDate(activeFilters.endDate);
        setEndDateInput(format(activeFilters.endDate, 'dd/MM/yyyy'));
      } else {
        setEndDate(undefined);
        setEndDateInput('');
      }
      
      setCommercialSearch(activeFilters.commercial || '');
      setMinAmount(activeFilters.minAmount?.toString() || '');
      setMaxAmount(activeFilters.maxAmount?.toString() || '');
      
      if (activeFilters.sortField) {
        setSortField(activeFilters.sortField);
        setSortDirection(activeFilters.sortDirection || 'asc');
      } else {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSelectedStatus([]);
      setSelectedTypes([]);
      setCommercialSearch('');
      setStartDate(undefined);
      setEndDate(undefined);
      setStartDateInput('');
      setEndDateInput('');
      setMinAmount('');
      setMaxAmount('');
      setSortField(null);
      setSortDirection(null);
    }
  }, [activeFilters]);
  
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
                  (activeFilters?.minAmount || activeFilters?.maxAmount ? 1 : 0) +
                  (activeFilters?.sortField ? 1 : 0)
                }
              </Badge>
            )}
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className={`gap-2 px-3 h-11 ${sortField === 'date' ? 'border-primary' : ''}`}
              onClick={() => handleSortToggle('date')}
            >
              {sortField === 'date' && sortDirection === 'asc' && <SortAsc className="h-4 w-4 text-primary" />}
              {sortField === 'date' && sortDirection === 'desc' && <SortDesc className="h-4 w-4 text-primary" />}
              {(!sortField || sortField !== 'date') && <ArrowDownUp className="h-4 w-4" />}
              Date
            </Button>
            
            <Button 
              variant="outline" 
              className={`gap-2 px-3 h-11 ${sortField === 'amount' ? 'border-primary' : ''}`}
              onClick={() => handleSortToggle('amount')}
            >
              {sortField === 'amount' && sortDirection === 'asc' && <SortAsc className="h-4 w-4 text-primary" />}
              {sortField === 'amount' && sortDirection === 'desc' && <SortDesc className="h-4 w-4 text-primary" />}
              {(!sortField || sortField !== 'amount') && <ArrowDownUp className="h-4 w-4" />}
              Montant
            </Button>
          </div>
          
          {hasActiveFilters() && (
            <Button 
              variant="outline" 
              className="gap-2 px-4 h-11"
              onClick={handleResetFilters}
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
              Période: {activeFilters.startDate && format(activeFilters.startDate, 'dd/MM/yyyy', { locale: fr })}
              {activeFilters.startDate && activeFilters.endDate && ' - '}
              {activeFilters.endDate && format(activeFilters.endDate, 'dd/MM/yyyy', { locale: fr })}
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
          
          {activeFilters?.sortField && (
            <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
              Tri: {activeFilters.sortField === 'date' ? 'Date' : 
                activeFilters.sortField === 'amount' ? 'Montant' : 
                activeFilters.sortField === 'client' ? 'Client' : activeFilters.sortField}
              {activeFilters.sortDirection === 'asc' ? ' (↑)' : ' (↓)'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => {
                  const newFilters = {...activeFilters, sortField: undefined, sortDirection: undefined};
                  onApplyFilters(newFilters);
                  setSortField(null);
                  setSortDirection(null);
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
        <Card className="mb-8 bg-white border border-[#eee] shadow-sm animate-fade-in">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Statut</label>
                <div className="flex flex-wrap gap-2">
                  <Toggle 
                    pressed={selectedStatus.length === 0} 
                    onPressedChange={() => {
                      setSelectedStatus([]);
                    }}
                    className="data-[state=on]:bg-primary/10"
                  >
                    Tous
                  </Toggle>
                  <Toggle 
                    pressed={selectedStatus.includes('pending')} 
                    onPressedChange={() => handleStatusToggle('pending')}
                    className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700"
                  >
                    En attente
                  </Toggle>
                  <Toggle 
                    pressed={selectedStatus.includes('approved')} 
                    onPressedChange={() => handleStatusToggle('approved')}
                    className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
                  >
                    Approuvés
                  </Toggle>
                  <Toggle 
                    pressed={selectedStatus.includes('rejected')} 
                    onPressedChange={() => handleStatusToggle('rejected')}
                    className="data-[state=on]:bg-red-100 data-[state=on]:text-red-700"
                  >
                    Rejetés
                  </Toggle>
                  <Toggle 
                    pressed={selectedStatus.includes('expired')} 
                    onPressedChange={() => handleStatusToggle('expired')}
                    className="data-[state=on]:bg-gray-100 data-[state=on]:text-gray-700"
                  >
                    Expirés
                  </Toggle>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Type de transport</label>
                <div className="flex flex-wrap gap-2">
                  <Toggle 
                    pressed={selectedTypes.length === 0} 
                    onPressedChange={() => {
                      setSelectedTypes([]);
                    }}
                    className="data-[state=on]:bg-primary/10"
                  >
                    Tous
                  </Toggle>
                  <Toggle 
                    pressed={selectedTypes.includes('Maritime')} 
                    onPressedChange={() => handleTypeToggle('Maritime')}
                    className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 gap-1"
                  >
                    <Ship className="h-3.5 w-3.5" />
                    Maritime
                  </Toggle>
                  <Toggle 
                    pressed={selectedTypes.includes('Aérien')} 
                    onPressedChange={() => handleTypeToggle('Aérien')}
                    className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700 gap-1"
                  >
                    <Plane className="h-3.5 w-3.5" />
                    Aérien
                  </Toggle>
                  <Toggle 
                    pressed={selectedTypes.includes('Routier')} 
                    onPressedChange={() => handleTypeToggle('Routier')}
                    className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700 gap-1"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    Routier
                  </Toggle>
                  <Toggle 
                    pressed={selectedTypes.includes('Ferroviaire')} 
                    onPressedChange={() => handleTypeToggle('Ferroviaire')}
                    className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700 gap-1"
                  >
                    <Train className="h-3.5 w-3.5" />
                    Ferroviaire
                  </Toggle>
                  <Toggle 
                    pressed={selectedTypes.includes('Multimodal')} 
                    onPressedChange={() => handleTypeToggle('Multimodal')}
                    className="data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700 gap-1"
                  >
                    <Package className="h-3.5 w-3.5" />
                    Multimodal
                  </Toggle>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Période</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      placeholder="JJ/MM/AAAA"
                      value={startDateInput}
                      onChange={(e) => handleDateInputChange('start', e.target.value)}
                      className="h-10 bg-white"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-10 w-10"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => handleDateChange('start', date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="relative">
                    <Input
                      placeholder="JJ/MM/AAAA"
                      value={endDateInput}
                      onChange={(e) => handleDateInputChange('end', e.target.value)}
                      className="h-10 bg-white"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-10 w-10"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => handleDateChange('end', date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Commercial</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher un commercial..." 
                    className="pl-10 h-10 bg-white" 
                    value={commercialSearch}
                    onChange={(e) => setCommercialSearch(e.target.value)}
                  />
                  {commercialSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                      {filteredCommercials.map((commercial, i) => (
                        <div 
                          key={i} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCommercialSelect(commercial.name)}
                        >
                          {commercial.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Montant (€)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    className="h-10 bg-white"
                    value={minAmount}
                    onChange={(e) => handleAmountChange('min', e.target.value)}
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    className="h-10 bg-white"
                    value={maxAmount}
                    onChange={(e) => handleAmountChange('max', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-end justify-end">
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleResetFilters}>Réinitialiser</Button>
                  <Button onClick={handleApplyFilters}>Appliquer</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuotesSearchAndFilter;
