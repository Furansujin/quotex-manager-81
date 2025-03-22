
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
  Calendar as CalendarIcon,
  X,
  MapPin,
  Hash,
  Tag
} from 'lucide-react';
import SearchAndFilterBar from '@/components/common/SearchAndFilterBar';

interface SupplierFilterValues {
  types: string[];
  categories: string[];
  locations: string[];
  startDate?: Date;
  endDate?: Date;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

interface SupplierFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  activeFilters: SupplierFilterValues | null;
  onApplyFilters: (filters: SupplierFilterValues) => void;
  clearAllFilters: () => void;
}

const SupplierFilters: React.FC<SupplierFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFilters,
  onApplyFilters,
  clearAllFilters
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  
  // Gérer les changements de type
  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
  };
  
  // Gérer les changements de catégorie
  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
  };
  
  // Gérer les changements de localisation
  const handleLocationToggle = (location: string) => {
    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter(l => l !== location)
      : [...selectedLocations, location];
    
    setSelectedLocations(newLocations);
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
    const filters: SupplierFilterValues = {
      types: selectedTypes,
      categories: selectedCategories,
      locations: selectedLocations,
      startDate,
      endDate,
      sortField: activeFilters?.sortField,
      sortDirection: activeFilters?.sortDirection
    };
    
    onApplyFilters(filters);
  };

  // Mettre à jour l'état local lorsque les filtres actifs changent
  useEffect(() => {
    if (activeFilters) {
      setSelectedTypes(activeFilters.types || []);
      setSelectedCategories(activeFilters.categories || []);
      setSelectedLocations(activeFilters.locations || []);
      
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
    } else {
      setSelectedTypes([]);
      setSelectedCategories([]);
      setSelectedLocations([]);
      setStartDate(undefined);
      setEndDate(undefined);
      setStartDateInput('');
      setEndDateInput('');
    }
  }, [activeFilters]);
  
  // Rendu des badges de filtre
  const renderFilterBadges = () => (
    <>
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
          ) : (
            type
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              const newTypes = selectedTypes.filter(t => t !== type);
              setSelectedTypes(newTypes);
              onApplyFilters({
                ...activeFilters || { types: [], categories: [], locations: [] },
                types: newTypes
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      {selectedCategories.map((category) => (
        <Badge key={category} variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
          <Tag className="h-3.5 w-3.5 mr-1" />
          {category}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              const newCategories = selectedCategories.filter(c => c !== category);
              setSelectedCategories(newCategories);
              onApplyFilters({
                ...activeFilters || { types: [], categories: [], locations: [] },
                categories: newCategories
              });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      {selectedLocations.map((location) => (
        <Badge key={location} variant="outline" className="px-3 py-1.5 gap-1 bg-primary/5">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          {location}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1"
            onClick={() => {
              const newLocations = selectedLocations.filter(l => l !== location);
              setSelectedLocations(newLocations);
              onApplyFilters({
                ...activeFilters || { types: [], categories: [], locations: [] },
                locations: newLocations
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
                ...activeFilters || { types: [], categories: [], locations: [] },
                startDate: undefined,
                endDate: undefined
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
        {/* Types de fournisseurs */}
        <div>
          <label className="text-sm font-medium mb-3 block text-gray-700">Type de service</label>
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
              pressed={selectedTypes.includes('Assurance')} 
              onPressedChange={() => handleTypeToggle('Assurance')}
              className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700"
            >
              Assurance
            </Toggle>
            <Toggle 
              pressed={selectedTypes.includes('Entrepôt')} 
              onPressedChange={() => handleTypeToggle('Entrepôt')}
              className="data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700"
            >
              Entrepôt
            </Toggle>
          </div>
        </div>
        
        {/* Catégories */}
        <div>
          <label className="text-sm font-medium mb-3 block text-gray-700">Catégorie</label>
          <div className="flex flex-wrap gap-2">
            <Toggle 
              pressed={selectedCategories.length === 0} 
              onPressedChange={() => setSelectedCategories([])}
              className="data-[state=on]:bg-primary/10"
            >
              Toutes
            </Toggle>
            <Toggle 
              pressed={selectedCategories.includes('Préféré')} 
              onPressedChange={() => handleCategoryToggle('Préféré')}
              className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700"
            >
              Préféré
            </Toggle>
            <Toggle 
              pressed={selectedCategories.includes('Premium')} 
              onPressedChange={() => handleCategoryToggle('Premium')}
              className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
            >
              Premium
            </Toggle>
            <Toggle 
              pressed={selectedCategories.includes('Standard')} 
              onPressedChange={() => handleCategoryToggle('Standard')}
              className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              Standard
            </Toggle>
            <Toggle 
              pressed={selectedCategories.includes('Nouveau')} 
              onPressedChange={() => handleCategoryToggle('Nouveau')}
              className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700"
            >
              Nouveau
            </Toggle>
          </div>
        </div>
        
        {/* Localisations */}
        <div>
          <label className="text-sm font-medium mb-3 block text-gray-700">Localisation</label>
          <div className="flex flex-wrap gap-2">
            <Toggle 
              pressed={selectedLocations.length === 0} 
              onPressedChange={() => setSelectedLocations([])}
              className="data-[state=on]:bg-primary/10"
            >
              Toutes
            </Toggle>
            <Toggle 
              pressed={selectedLocations.includes('Europe')} 
              onPressedChange={() => handleLocationToggle('Europe')}
              className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
            >
              Europe
            </Toggle>
            <Toggle 
              pressed={selectedLocations.includes('Asie')} 
              onPressedChange={() => handleLocationToggle('Asie')}
              className="data-[state=on]:bg-red-100 data-[state=on]:text-red-700"
            >
              Asie
            </Toggle>
            <Toggle 
              pressed={selectedLocations.includes('Amérique')} 
              onPressedChange={() => handleLocationToggle('Amérique')}
              className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700"
            >
              Amérique
            </Toggle>
            <Toggle 
              pressed={selectedLocations.includes('Afrique')} 
              onPressedChange={() => handleLocationToggle('Afrique')}
              className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              Afrique
            </Toggle>
            <Toggle 
              pressed={selectedLocations.includes('Océanie')} 
              onPressedChange={() => handleLocationToggle('Océanie')}
              className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700"
            >
              Océanie
            </Toggle>
          </div>
        </div>
      </div>
      
      {/* Dates */}
      <div className="mt-6">
        <label className="text-sm font-medium mb-3 block text-gray-700">Période d'activité</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
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
      title="Fournisseurs"
    />
  );
};

export default SupplierFilters;
