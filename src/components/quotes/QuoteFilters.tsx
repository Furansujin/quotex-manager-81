
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, X, Save } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
}

const QuoteFilters: React.FC<QuoteFiltersProps> = ({ show, onClose, onApplyFilters }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [commercial, setCommercial] = useState<string>('all');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [saveFilter, setSaveFilter] = useState(false);
  const [filterName, setFilterName] = useState('');
  const { toast } = useToast();
  
  // Sauvegarde des filtres récents (simulation)
  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: 'Devis maritimes en attente' },
    { id: 2, name: 'Devis approuvés récents' }
  ]);
  
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
  
  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedStatus([]);
    setSelectedTypes([]);
    setCommercial('all');
    setMinAmount('');
    setMaxAmount('');
    setSaveFilter(false);
    setFilterName('');
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
    
    // Construire l'objet de filtres
    const filters: QuoteFilterValues = {
      startDate,
      endDate,
      status: selectedStatus,
      types: selectedTypes,
      commercial: commercial !== 'all' ? commercial : undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      savedFilter: saveFilter,
      filterName: saveFilter ? filterName : undefined
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
    } else {
      console.log('Filtres appliqués:', filters);
    }
    
    onClose();
  };
  
  const loadSavedFilter = (filterId: number) => {
    // Simuler le chargement d'un filtre sauvegardé
    // Dans une application réelle, vous récupéreriez les paramètres du filtre depuis une API
    
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
    <Card className="absolute z-10 top-full mt-2 right-0 w-full md:w-[600px] shadow-lg">
      <CardContent className="p-4">
        {/* Filtres sauvegardés */}
        {savedFilters.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Filtres sauvegardés</h4>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map(filter => (
                <Badge 
                  key={filter.id}
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => loadSavedFilter(filter.id)}
                >
                  {filter.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
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
            <label className="text-sm font-medium mb-2 block">Période</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'P', { locale: fr }) : <span>Date début</span>}
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
                    {endDate ? format(endDate, 'P', { locale: fr }) : <span>Date fin</span>}
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
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">Commercial</label>
          <Select value={commercial} onValueChange={setCommercial}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les commerciaux" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Commerciaux</SelectLabel>
                <SelectItem value="all">Tous les commerciaux</SelectItem>
                <SelectItem value="jean">Jean Dupont</SelectItem>
                <SelectItem value="marie">Marie Martin</SelectItem>
                <SelectItem value="pierre">Pierre Durand</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">Montant</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input 
                type="number" 
                placeholder="Min (€)" 
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            <div>
              <Input 
                type="number" 
                placeholder="Max (€)" 
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
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
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="gap-1"
          >
            <X className="h-4 w-4" /> Réinitialiser
          </Button>
          
          <div className="flex gap-2">
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
  );
};

export default QuoteFilters;
