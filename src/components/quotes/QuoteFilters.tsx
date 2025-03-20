
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface QuoteFiltersProps {
  show: boolean;
  onClose: () => void;
}

const QuoteFilters: React.FC<QuoteFiltersProps> = ({ show, onClose }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
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
  };
  
  const handleApply = () => {
    // Appliquer les filtres
    // Ici vous pourriez passer ces valeurs à une fonction de filtrage
    console.log({
      startDate,
      endDate,
      selectedStatus,
      selectedTypes
    });
    onClose();
  };
  
  if (!show) return null;
  
  return (
    <Card className="absolute z-10 top-full mt-2 right-0 w-full md:w-[600px] shadow-lg">
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
          <Select>
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
              <Input type="number" placeholder="Min (€)" />
            </div>
            <div>
              <Input type="number" placeholder="Max (€)" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2" onClick={handleReset}>Réinitialiser</Button>
          <Button onClick={handleApply}>Appliquer</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteFilters;
