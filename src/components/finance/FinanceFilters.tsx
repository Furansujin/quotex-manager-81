
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon,
  X,
  UserCircle,
  Building,
} from 'lucide-react';
import SearchAndFilterBar from '@/components/common/SearchAndFilterBar';

interface FinanceFilterValues {
  status: string[];
  clientTypes: string[];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  commercial?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

interface FinanceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  activeFilters: FinanceFilterValues | null;
  onApplyFilters: (filters: FinanceFilterValues) => void;
  clearAllFilters: () => void;
}

const FinanceFilters: React.FC<FinanceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFilters,
  onApplyFilters,
  clearAllFilters
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedClientTypes, setSelectedClientTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [commercial, setCommercial] = useState<string>('');
  
  // Liste des commerciaux (à remplacer par des données réelles)
  const commercials = [
    { id: 'jean', name: 'Jean Dupont' },
    { id: 'marie', name: 'Marie Martin' },
    { id: 'pierre', name: 'Pierre Durand' }
  ];
  
  // Formatter le status pour affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      default: return status;
    }
  };
  
  // Gérer les changements de statut
  const handleStatusToggle = (status: string) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status];
    
    setSelectedStatus(newStatus);
  };
  
  // Gérer les changements de type de client
  const handleClientTypeToggle = (type: string) => {
    const newTypes = selectedClientTypes.includes(type)
      ? selectedClientTypes.filter(t => t !== type)
      : [...selectedClientTypes, type];
    
    setSelectedClientTypes(newTypes);
  };

  // Gérer les changements de date
  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (type === 'start') {
      setStartDate(date);
      if (date) {
        setStartDateInput(format(date, 'dd/MM/yyyy', { locale: fr }));
      } else {
        setStartDateInput('');
      }
    } else {
      setEndDate(date);
      if (date) {
        setEndDateInput(format(date, 'dd/MM/yyyy', { locale: fr }));
      } else {
        setEndDateInput('');
      }
    }
  };

  // Gérer les inputs manuels de date
  const handleDateInputChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDateInput(value);
      
      try {
        if (value) {
          const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
          if (!isNaN(parsedDate.getTime())) {
            setStartDate(parsedDate);
          }
        } else {
          setStartDate(undefined);
        }
      } catch (error) {
        // Format de date invalide
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
        // Format de date invalide
      }
    }
  };

  // Gérer les changements de montant
  const handleAmountChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setMinAmount(value);
    } else {
      setMaxAmount(value);
    }
  };

  // Construire et appliquer les filtres
  const applyCurrentFilters = () => {
    const filters: FinanceFilterValues = {
      status: selectedStatus,
      clientTypes: selectedClientTypes,
      startDate,
      endDate,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      commercial: commercial || undefined,
      sortField: activeFilters?.sortField,
      sortDirection: activeFilters?.sortDirection
    };
    
    onApplyFilters(filters);
  };

  // Mettre à jour l'état local lorsque les filtres actifs changent
  useEffect(() => {
    if (activeFilters) {
      setSelectedStatus(activeFilters.status || []);
      setSelectedClientTypes(activeFilters.clientTypes || []);
      
      if (activeFilters.startDate) {
        setStartDate(activeFilters.startDate);
        setStartDateInput(format(activeFilters.startDate, 'dd/MM/yyyy', { locale: fr }));
      } else {
        setStartDate(undefined);
        setStartDateInput('');
      }
      
      if (activeFilters.endDate) {
        setEndDate(activeFilters.endDate);
        setEndDateInput(format(activeFilters.endDate, 'dd/MM/yyyy', { locale: fr }));
      } else {
        setEndDate(undefined);
        setEndDateInput('');
      }
      
      setMinAmount(activeFilters.minAmount?.toString() || '');
      setMaxAmount(activeFilters.maxAmount?.toString() || '');
      setCommercial(activeFilters.commercial || '');
    } else {
      setSelectedStatus([]);
      setSelectedClientTypes([]);
      setStartDate(undefined);
      setEndDate(undefined);
      setStartDateInput('');
      setEndDateInput('');
      setMinAmount('');
      setMaxAmount('');
      setCommercial('');
    }
  }, [activeFilters]);
  
  // Rendu des badges de filtre
  const renderFilterBadges = () => (
    <>
      {selectedStatus.map((status) => (
        <Badge key={status} variant="outline" className="px-3 py-1.5 bg-primary/5 gap-1">
          {formatStatus(status)}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              const newStatus = selectedStatus.filter(s => s !== status);
              setSelectedStatus(newStatus);
              onApplyFilters({
                ...activeFilters || { status: [], clientTypes: [] },
                status: newStatus
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      {selectedClientTypes.map((type) => (
        <Badge key={type} variant="outline" className="px-3 py-1.5 gap-1">
          <Building className="h-3.5 w-3.5 mr-1" />
          {type}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              const newTypes = selectedClientTypes.filter(t => t !== type);
              setSelectedClientTypes(newTypes);
              onApplyFilters({
                ...activeFilters || { status: [], clientTypes: [] },
                clientTypes: newTypes
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      {(startDate || endDate) && (
        <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
          Période: {startDate && format(startDate, 'dd/MM/yyyy', { locale: fr })}
          {startDate && endDate && ' - '}
          {endDate && format(endDate, 'dd/MM/yyyy', { locale: fr })}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
              setStartDateInput('');
              setEndDateInput('');
              onApplyFilters({
                ...activeFilters || { status: [], clientTypes: [] },
                startDate: undefined,
                endDate: undefined
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {(minAmount || maxAmount) && (
        <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
          Montant: {minAmount && `${minAmount}€`}
          {minAmount && maxAmount && ' - '}
          {maxAmount && `${maxAmount}€`}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              setMinAmount('');
              setMaxAmount('');
              onApplyFilters({
                ...activeFilters || { status: [], clientTypes: [] },
                minAmount: undefined,
                maxAmount: undefined
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {commercial && (
        <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
          Commercial: {commercial}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              setCommercial('');
              onApplyFilters({
                ...activeFilters || { status: [], clientTypes: [] },
                commercial: undefined
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </>
  );

  // Rendu du contenu du filtre
  const renderFilterContent = ({ onApplyFilters }: { onApplyFilters: () => void }) => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status filters */}
        <div>
          <label className="text-sm font-medium mb-3 block text-gray-700">Statut de paiement</label>
          <div className="flex flex-wrap gap-2">
            <Toggle 
              pressed={selectedStatus.length === 0} 
              onPressedChange={() => setSelectedStatus([])}
              className="data-[state=on]:bg-primary/10"
            >
              Tous
            </Toggle>
            <Toggle 
              pressed={selectedStatus.includes('paid')} 
              onPressedChange={() => handleStatusToggle('paid')}
              className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              Payée
            </Toggle>
            <Toggle 
              pressed={selectedStatus.includes('pending')} 
              onPressedChange={() => handleStatusToggle('pending')}
              className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700"
            >
              En attente
            </Toggle>
            <Toggle 
              pressed={selectedStatus.includes('overdue')} 
              onPressedChange={() => handleStatusToggle('overdue')}
              className="data-[state=on]:bg-red-100 data-[state=on]:text-red-700"
            >
              En retard
            </Toggle>
          </div>
        </div>
        
        {/* Client type filters */}
        <div>
          <label className="text-sm font-medium mb-3 block text-gray-700">Type de client</label>
          <div className="flex flex-wrap gap-2">
            <Toggle 
              pressed={selectedClientTypes.length === 0} 
              onPressedChange={() => setSelectedClientTypes([])}
              className="data-[state=on]:bg-primary/10"
            >
              Tous
            </Toggle>
            <Toggle 
              pressed={selectedClientTypes.includes('Entreprise')} 
              onPressedChange={() => handleClientTypeToggle('Entreprise')}
              className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
            >
              Entreprise
            </Toggle>
            <Toggle 
              pressed={selectedClientTypes.includes('PME')} 
              onPressedChange={() => handleClientTypeToggle('PME')}
              className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              PME
            </Toggle>
            <Toggle 
              pressed={selectedClientTypes.includes('Particulier')} 
              onPressedChange={() => handleClientTypeToggle('Particulier')}
              className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700"
            >
              Particulier
            </Toggle>
          </div>
        </div>
        
        {/* Date filters */}
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
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleDateChange('start', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    locale={fr}
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
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleDateChange('end', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Montant */}
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
        
        {/* Commercial */}
        <div>
          <label className="text-sm font-medium mb-3 block text-gray-700">Commercial</label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un commercial..." 
              className="pl-10 h-10 bg-white" 
              value={commercial}
              onChange={(e) => setCommercial(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-end justify-end">
          <Button onClick={() => {
            applyCurrentFilters();
            onApplyFilters();
          }}>
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <SearchAndFilterBar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      showAdvancedFilters={showAdvancedFilters}
      setShowAdvancedFilters={setShowAdvancedFilters}
      activeFilters={activeFilters}
      onApplyFilters={onApplyFilters}
      clearAllFilters={clearAllFilters}
      renderFilterContent={renderFilterContent}
      renderFilterBadges={renderFilterBadges}
      title="Factures"
    />
  );
};

export default FinanceFilters;
