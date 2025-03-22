
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { 
  Filter, 
  Search, 
  ArrowDownUp,
  X, 
  UserCircle, 
  Clock, 
  CalendarRange,
  Ship,
  Plane,
  Truck,
  RefreshCw
} from 'lucide-react';

interface ShipmentFiltersProps {
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShipmentFilters: React.FC<ShipmentFiltersProps> = ({
  showAdvancedFilters,
  setShowAdvancedFilters,
}) => {
  // Local state for filters
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [commercialSearch, setCommercialSearch] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Toggle status filter
  const handleStatusToggle = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  // Toggle transport type filter
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Handle sort toggle
  const handleSortToggle = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Apply filters and close the filter panel
  const applyFilters = () => {
    // Here you would apply the filters to your data
    setShowAdvancedFilters(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedStatus([]);
    setSelectedTypes([]);
    setSortField(null);
    setSortDirection(null);
    setCommercialSearch('');
    setOriginFilter('');
    setDestinationFilter('');
    setStartDate('');
    setEndDate('');
  };

  // List of suggested commercial names based on search input
  const commercialSuggestions = [
    'Jean Dupont',
    'Marie Martin',
    'Sophie Bernard',
    'Lucas Petit'
  ].filter(name => 
    name.toLowerCase().includes(commercialSearch.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher par n° expédition, client, destination..." className="pl-10 h-11 bg-white border-[#eee]" />
        </div>
        <div className="flex gap-3">
          <Button 
            variant={showAdvancedFilters ? "default" : "outline"} 
            className="gap-2 px-4 h-11"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtres
            {selectedStatus.length > 0 || selectedTypes.length > 0 ? (
              <Badge variant="outline" className="ml-1 bg-white">{selectedStatus.length + selectedTypes.length}</Badge>
            ) : null}
          </Button>
          
          <Button 
            variant="outline" 
            className={`gap-2 px-4 h-11 ${sortField ? 'bg-primary/10' : ''}`}
            onClick={() => handleSortToggle('date')}
          >
            <ArrowDownUp className={`h-4 w-4 ${sortField ? 'text-primary' : ''}`} />
            {!sortField && "Trier"}
            {sortField === 'date' && sortDirection === 'asc' && "Date (↑)"}
            {sortField === 'date' && sortDirection === 'desc' && "Date (↓)"}
          </Button>
          
          {(selectedStatus.length > 0 || selectedTypes.length > 0 || sortField) && (
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

      {showAdvancedFilters && (
        <Card className="mb-8 bg-white border border-[#eee] shadow-sm animate-fade-in">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    pressed={selectedStatus.includes('in-progress')} 
                    onPressedChange={() => handleStatusToggle('in-progress')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    En cours
                  </Toggle>
                  <Toggle 
                    pressed={selectedStatus.includes('completed')} 
                    onPressedChange={() => handleStatusToggle('completed')}
                    className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
                  >
                    Terminée
                  </Toggle>
                  <Toggle 
                    pressed={selectedStatus.includes('planned')} 
                    onPressedChange={() => handleStatusToggle('planned')}
                    className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
                  >
                    Planifiée
                  </Toggle>
                  <Toggle 
                    pressed={selectedStatus.includes('delayed')} 
                    onPressedChange={() => handleStatusToggle('delayed')}
                    className="data-[state=on]:bg-red-100 data-[state=on]:text-red-700"
                  >
                    Retardée
                  </Toggle>
                </div>
              </div>
              
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
                    pressed={selectedTypes.includes('maritime')} 
                    onPressedChange={() => handleTypeToggle('maritime')}
                    className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 gap-1"
                  >
                    <Ship className="h-3.5 w-3.5" />
                    Maritime
                  </Toggle>
                  <Toggle 
                    pressed={selectedTypes.includes('air')} 
                    onPressedChange={() => handleTypeToggle('air')}
                    className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700 gap-1"
                  >
                    <Plane className="h-3.5 w-3.5" />
                    Aérien
                  </Toggle>
                  <Toggle 
                    pressed={selectedTypes.includes('road')} 
                    onPressedChange={() => handleTypeToggle('road')}
                    className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700 gap-1"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    Routier
                  </Toggle>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Période</label>
                <div className="flex gap-3">
                  <Input 
                    type="date" 
                    className="w-full h-10 bg-white" 
                    placeholder="Date début"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input 
                    type="date" 
                    className="w-full h-10 bg-white" 
                    placeholder="Date fin"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
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
                      {commercialSuggestions.map((name, i) => (
                        <div 
                          key={i} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setCommercialSearch(name)}
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Origine</label>
                <Input 
                  placeholder="Port/Ville d'origine" 
                  className="h-10 bg-white"
                  value={originFilter}
                  onChange={(e) => setOriginFilter(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Destination</label>
                <Input 
                  placeholder="Port/Ville de destination" 
                  className="h-10 bg-white"
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <div className="flex items-center gap-2">
                <Switch id="auto-apply" />
                <label htmlFor="auto-apply" className="text-sm text-gray-700 cursor-pointer">Appliquer automatiquement</label>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={clearAllFilters}>Réinitialiser</Button>
                <Button onClick={applyFilters}>Appliquer</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display active filters */}
      {(selectedStatus.length > 0 || selectedTypes.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedStatus.map((status) => (
            <Badge key={status} variant="outline" className="px-3 py-1.5 bg-primary/5 gap-1">
              {status === 'in-progress' ? 'En cours' : 
              status === 'completed' ? 'Terminée' : 
              status === 'planned' ? 'Planifiée' : 'Retardée'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => handleStatusToggle(status)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {selectedTypes.map((type) => (
            <Badge key={type} variant="outline" className="px-3 py-1.5 gap-1">
              {type === 'maritime' ? (
                <>
                  <Ship className="h-3.5 w-3.5 text-blue-500" />
                  Maritime
                </>
              ) : type === 'air' ? (
                <>
                  <Plane className="h-3.5 w-3.5 text-green-500" />
                  Aérien
                </>
              ) : (
                <>
                  <Truck className="h-3.5 w-3.5 text-amber-500" />
                  Routier
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => handleTypeToggle(type)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {(selectedStatus.length > 0 || selectedTypes.length > 0) && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 gap-1"
              onClick={clearAllFilters}
            >
              <X className="h-3 w-3" />
              Effacer tout
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default ShipmentFilters;
