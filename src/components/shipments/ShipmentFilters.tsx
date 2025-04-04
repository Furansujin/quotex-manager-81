
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
  Ship, 
  Plane, 
  Truck, 
  Train, 
  Package, 
  UserCircle, 
  Calendar as CalendarIcon,
  X,
  Clock
} from 'lucide-react';
import SearchAndFilterBar from '@/components/common/SearchAndFilterBar';

interface ShipmentFilterValues {
  status: string[];
  types: string[];
  startDate?: Date;
  endDate?: Date;
  origin?: string;
  destination?: string;
  handler?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

interface ShipmentFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  activeFilters: ShipmentFilterValues | null;
  onApplyFilters: (filters: ShipmentFilterValues) => void;
  clearAllFilters: () => void;
}

const ShipmentFilters: React.FC<ShipmentFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFilters,
  onApplyFilters,
  clearAllFilters
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [handler, setHandler] = useState('');
  
  // Liste des gestionnaires (à remplacer par des données réelles)
  const handlers = [
    { id: 'marc', name: 'Marc Dubois' },
    { id: 'sophie', name: 'Sophie Mercier' },
    { id: 'thomas', name: 'Thomas Leroy' }
  ];
  
  // Formatter le status pour affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'in_transit': return 'En transit';
      case 'delivered': return 'Livrée';
      case 'pending': return 'En attente';
      case 'delayed': return 'Retardée';
      case 'cancelled': return 'Annulée';
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
  
  // Gérer les changements de type
  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
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

  // Construire et appliquer les filtres
  const applyCurrentFilters = () => {
    const filters: ShipmentFilterValues = {
      status: selectedStatus,
      types: selectedTypes,
      startDate,
      endDate,
      origin: origin || undefined,
      destination: destination || undefined,
      handler: handler || undefined,
      sortField: activeFilters?.sortField,
      sortDirection: activeFilters?.sortDirection
    };
    
    onApplyFilters(filters);
  };

  // Mettre à jour l'état local lorsque les filtres actifs changent
  useEffect(() => {
    if (activeFilters) {
      setSelectedStatus(activeFilters.status || []);
      setSelectedTypes(activeFilters.types || []);
      
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
      
      setOrigin(activeFilters.origin || '');
      setDestination(activeFilters.destination || '');
      setHandler(activeFilters.handler || '');
    } else {
      setSelectedStatus([]);
      setSelectedTypes([]);
      setStartDate(undefined);
      setEndDate(undefined);
      setStartDateInput('');
      setEndDateInput('');
      setOrigin('');
      setDestination('');
      setHandler('');
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
                ...activeFilters || { status: [], types: [] },
                status: newStatus
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      {selectedTypes.map((type) => (
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
              const newTypes = selectedTypes.filter(t => t !== type);
              setSelectedTypes(newTypes);
              onApplyFilters({
                ...activeFilters || { status: [], types: [] },
                types: newTypes
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
                ...activeFilters || { status: [], types: [] },
                startDate: undefined,
                endDate: undefined
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {origin && (
        <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
          Origine: {origin}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              setOrigin('');
              onApplyFilters({
                ...activeFilters || { status: [], types: [] },
                origin: undefined
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {destination && (
        <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
          Destination: {destination}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              setDestination('');
              onApplyFilters({
                ...activeFilters || { status: [], types: [] },
                destination: undefined
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {handler && (
        <Badge variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
          Gestionnaire: {handler}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              setHandler('');
              onApplyFilters({
                ...activeFilters || { status: [], types: [] },
                handler: undefined
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
          <label className="text-sm font-medium mb-3 block text-gray-700">Statut</label>
          <div className="flex flex-wrap gap-2">
            <Toggle 
              pressed={selectedStatus.length === 0} 
              onPressedChange={() => setSelectedStatus([])}
              className="data-[state=on]:bg-primary/10"
            >
              Tous
            </Toggle>
            <Toggle 
              pressed={selectedStatus.includes('in_transit')} 
              onPressedChange={() => handleStatusToggle('in_transit')}
              className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 gap-1"
            >
              <Clock className="h-3.5 w-3.5" />
              En transit
            </Toggle>
            <Toggle 
              pressed={selectedStatus.includes('delivered')} 
              onPressedChange={() => handleStatusToggle('delivered')}
              className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              Livrée
            </Toggle>
            <Toggle 
              pressed={selectedStatus.includes('pending')} 
              onPressedChange={() => handleStatusToggle('pending')}
              className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700"
            >
              En attente
            </Toggle>
            <Toggle 
              pressed={selectedStatus.includes('delayed')} 
              onPressedChange={() => handleStatusToggle('delayed')}
              className="data-[state=on]:bg-red-100 data-[state=on]:text-red-700"
            >
              Retardée
            </Toggle>
            <Toggle 
              pressed={selectedStatus.includes('cancelled')} 
              onPressedChange={() => handleStatusToggle('cancelled')}
              className="data-[state=on]:bg-gray-100 data-[state=on]:text-gray-700"
            >
              Annulée
            </Toggle>
          </div>
        </div>
        
        {/* Transport type filters */}
        <div>
          <label className="text-sm font-medium mb-3 block text-gray-700">Type de transport</label>
          <div className="flex flex-wrap gap-2">
            <Toggle 
              pressed={selectedTypes.length === 0} 
              onPressedChange={() => setSelectedTypes([])}
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
        {/* Origin and destination */}
        <div>
          <Label className="text-sm font-medium mb-3 block text-gray-700">Origine</Label>
          <Input 
            placeholder="Ville, pays..." 
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="h-10 bg-white"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-3 block text-gray-700">Destination</Label>
          <Input 
            placeholder="Ville, pays..." 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="h-10 bg-white"
          />
        </div>
        
        {/* Handler */}
        <div>
          <Label className="text-sm font-medium mb-3 block text-gray-700">Gestionnaire</Label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Nom du gestionnaire" 
              className="pl-10 h-10 bg-white" 
              value={handler}
              onChange={(e) => setHandler(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={() => {
          applyCurrentFilters();
          onApplyFilters();
        }}>
          Appliquer
        </Button>
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
      title="Expéditions"
    />
  );
};

export default ShipmentFilters;
