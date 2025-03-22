
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  X, 
  Save, 
  Ship, 
  Plane, 
  Truck, 
  Train, 
  Package, 
  UserCircle, 
  ArrowDownUp, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface QuoteFiltersProps {
  show: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: QuoteFilterValues) => void;
}

export interface QuoteFilterValues {
  startDate?: Date;
  endDate?: Date;
  status: string[];
  types: string[];
  commercial?: string;
  minAmount?: number;
  maxAmount?: number;
  savedFilter?: boolean;
  filterName?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const QuoteFilters: React.FC<QuoteFiltersProps> = ({ show, onClose, onApplyFilters }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [commercialSearch, setCommercialSearch] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [saveFilter, setSaveFilter] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const { toast } = useToast();
  
  // Sauvegarde des filtres récents (simulation)
  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: 'Devis maritimes en attente' },
    { id: 2, name: 'Devis approuvés récents' }
  ]);
  
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
  
  const handleStatusToggle = (status: string) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter(s => s !== status));
    } else {
      setSelectedStatus([...selectedStatus, status]);
    }
  };
  
  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

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
  
  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedStatus([]);
    setSelectedTypes([]);
    setCommercialSearch('');
    setMinAmount('');
    setMaxAmount('');
    setSaveFilter(false);
    setFilterName('');
    setSortField(null);
    setSortDirection(null);
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés avec succès.",
    });
  };
  
  const handleApply = () => {
    // Vérifier si le filtre doit être sauvegardé
    if (saveFilter && filterName.trim() === '') {
      toast({
        title: "Nom du filtre requis",
        description: "Veuillez donner un nom à votre filtre pour le sauvegarder.",
        variant: "destructive"
      });
      return;
    }
    
    // Déterminer le commercial sélectionné
    let selectedCommercial: string | undefined = undefined;
    const matchedCommercial = commercials.find(c => 
      c.name.toLowerCase() === commercialSearch.toLowerCase()
    );
    if (matchedCommercial) {
      selectedCommercial = matchedCommercial.id;
    } else if (commercialSearch.trim()) {
      // Si une valeur est entrée mais ne correspond pas exactement, on la garde quand même
      selectedCommercial = commercialSearch;
    }
    
    // Construire l'objet de filtres
    const filters: QuoteFilterValues = {
      startDate,
      endDate,
      status: selectedStatus,
      types: selectedTypes,
      commercial: selectedCommercial,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      savedFilter: saveFilter,
      filterName: saveFilter ? filterName : undefined,
      sortField: sortField || undefined,
      sortDirection: sortDirection || undefined
    };
    
    // Sauvegarder le filtre si nécessaire
    if (saveFilter && filterName) {
      setSavedFilters([...savedFilters, { id: Date.now(), name: filterName }]);
      
      toast({
        title: "Filtre sauvegardé",
        description: `Le filtre "${filterName}" a été sauvegardé avec succès.`,
      });
    }
    
    // Appliquer les filtres
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    
    // Fermer automatiquement la fenêtre de filtres après application
    onClose();
  };
  
  const loadSavedFilter = (filterId: number) => {
    const filter = savedFilters.find(f => f.id === filterId);
    
    if (filter) {
      // Exemple de chargement de filtre prédéfini
      if (filter.name === 'Devis maritimes en attente') {
        setSelectedTypes(['Maritime']);
        setSelectedStatus(['pending']);
      } else if (filter.name === 'Devis approuvés récents') {
        setSelectedStatus(['approved']);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        setStartDate(lastMonth);
      }
      
      toast({
        title: "Filtre chargé",
        description: `Le filtre "${filter.name}" a été chargé.`,
      });
    }
  };
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto animate-fade-in">
      <Card className="w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto shadow-lg animate-scale-in">
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Filtres avancés</h3>
            <p className="text-sm text-muted-foreground">Affinez votre recherche de devis</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <CardContent className="p-6">
          {/* Filtres sauvegardés */}
          {savedFilters.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Filtres sauvegardés</h4>
              <div className="flex flex-wrap gap-2">
                {savedFilters.map(filter => (
                  <Badge 
                    key={filter.id}
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5 px-3"
                    onClick={() => loadSavedFilter(filter.id)}
                  >
                    {filter.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne 1: Statut et Type */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Statut</label>
                <div className="flex flex-wrap gap-2">
                  <Toggle 
                    pressed={selectedStatus.length === 0} 
                    onPressedChange={() => setSelectedStatus([])}
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
                <label className="text-sm font-medium mb-3 block">Type de transport</label>
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
            </div>
            
            {/* Colonne 2: Période et Tri */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Période</label>
                <div className="space-y-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yyyy', { locale: fr }) : <span>Date début</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
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
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yyyy', { locale: fr }) : <span>Date fin</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block">Trier par</label>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className={`w-full justify-between ${sortField === 'date' ? 'border-primary' : ''}`}
                    onClick={() => handleSortToggle('date')}
                  >
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? 
                        <SortAsc className="h-4 w-4 text-primary animate-fade-in" /> : 
                        <SortDesc className="h-4 w-4 text-primary animate-fade-in" />
                    )}
                    {!sortField || sortField !== 'date' && <ArrowDownUp className="h-4 w-4 text-gray-400" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={`w-full justify-between ${sortField === 'amount' ? 'border-primary' : ''}`}
                    onClick={() => handleSortToggle('amount')}
                  >
                    Montant
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? 
                        <SortAsc className="h-4 w-4 text-primary animate-fade-in" /> : 
                        <SortDesc className="h-4 w-4 text-primary animate-fade-in" />
                    )}
                    {!sortField || sortField !== 'amount' && <ArrowDownUp className="h-4 w-4 text-gray-400" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={`w-full justify-between ${sortField === 'client' ? 'border-primary' : ''}`}
                    onClick={() => handleSortToggle('client')}
                  >
                    Client
                    {sortField === 'client' && (
                      sortDirection === 'asc' ? 
                        <SortAsc className="h-4 w-4 text-primary animate-fade-in" /> : 
                        <SortDesc className="h-4 w-4 text-primary animate-fade-in" />
                    )}
                    {!sortField || sortField !== 'client' && <ArrowDownUp className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Colonne 3: Commercial et Montant */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Commercial</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher un commercial..." 
                    className="pl-10" 
                    value={commercialSearch}
                    onChange={(e) => setCommercialSearch(e.target.value)}
                  />
                  {commercialSearch && filteredCommercials.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                      {filteredCommercials.map(commercial => (
                        <div 
                          key={commercial.id} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => setCommercialSearch(commercial.name)}
                        >
                          {commercial.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Montant (€)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="save-filter" 
                    checked={saveFilter}
                    onCheckedChange={setSaveFilter}
                  />
                  <Label htmlFor="save-filter">Sauvegarder ce filtre</Label>
                </div>
                
                {saveFilter && (
                  <div className="mt-2">
                    <Input 
                      placeholder="Nom du filtre" 
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" /> Réinitialiser
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button 
                size="sm" 
                onClick={handleApply}
                className="gap-1"
              >
                <Save className="h-4 w-4" /> Appliquer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteFilters;
