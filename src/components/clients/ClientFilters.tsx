
import React, { useState } from 'react';
import { X, Check, CalendarRange } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientFiltersProps {
  show: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const ClientFilters = ({ show, onClose, onApplyFilters }: ClientFiltersProps) => {
  const [status, setStatus] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [quotesMin, setQuotesMin] = useState<string>('');
  const [quotesMax, setQuotesMax] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);

  const handleStatusChange = (checked: boolean, value: string) => {
    setStatus(prev => 
      checked 
        ? [...prev, value] 
        : prev.filter(item => item !== value)
    );
  };

  const handleTypeChange = (checked: boolean, value: string) => {
    setTypes(prev => 
      checked 
        ? [...prev, value] 
        : prev.filter(item => item !== value)
    );
  };

  const handleTagChange = (checked: boolean, value: string) => {
    setTags(prev => 
      checked 
        ? [...prev, value] 
        : prev.filter(item => item !== value)
    );
  };

  const resetFilters = () => {
    setStatus([]);
    setTypes([]);
    setQuotesMin('');
    setQuotesMax('');
    setStartDate(undefined);
    setEndDate(undefined);
    setTags([]);
  };

  const applyFilters = () => {
    const filters = {
      status,
      types,
      quotesMin: quotesMin ? parseInt(quotesMin) : undefined,
      quotesMax: quotesMax ? parseInt(quotesMax) : undefined,
      startDate,
      endDate,
      tags
    };
    
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Sheet open={show} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtres avancés</SheetTitle>
          <SheetDescription>
            Affinez votre recherche de clients avec des filtres détaillés
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-5">
          <div className="space-y-3">
            <h3 className="font-medium">Statut</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-active" 
                  checked={status.includes('active')}
                  onCheckedChange={(checked) => handleStatusChange(checked as boolean, 'active')}
                />
                <Label htmlFor="status-active" className="cursor-pointer">Actif</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-inactive" 
                  checked={status.includes('inactive')}
                  onCheckedChange={(checked) => handleStatusChange(checked as boolean, 'inactive')}
                />
                <Label htmlFor="status-inactive" className="cursor-pointer">Inactif</Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-medium">Type de client</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="type-enterprise" 
                  checked={types.includes('enterprise')}
                  onCheckedChange={(checked) => handleTypeChange(checked as boolean, 'enterprise')}
                />
                <Label htmlFor="type-enterprise" className="cursor-pointer">Entreprise</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="type-sme" 
                  checked={types.includes('sme')}
                  onCheckedChange={(checked) => handleTypeChange(checked as boolean, 'sme')}
                />
                <Label htmlFor="type-sme" className="cursor-pointer">PME</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="type-individual" 
                  checked={types.includes('individual')}
                  onCheckedChange={(checked) => handleTypeChange(checked as boolean, 'individual')}
                />
                <Label htmlFor="type-individual" className="cursor-pointer">Particulier</Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-medium">Nombre de devis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quotes-min">Minimum</Label>
                <Input 
                  id="quotes-min" 
                  type="number"
                  min="0"
                  value={quotesMin}
                  onChange={(e) => setQuotesMin(e.target.value)}
                  placeholder="Min"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quotes-max">Maximum</Label>
                <Input 
                  id="quotes-max" 
                  type="number"
                  min="0"
                  value={quotesMax}
                  onChange={(e) => setQuotesMax(e.target.value)}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-medium">Dernière activité</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PP', { locale: fr }) : "Sélectionner..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PP', { locale: fr }) : "Sélectionner..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-medium">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['VIP', 'International', 'Healthcare', 'Import', 'Tech', 'EU', 'Food'].map((tag) => (
                <Badge 
                  key={tag} 
                  variant={tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagChange(!tags.includes(tag), tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <SheetFooter className="pt-2">
          <Button onClick={applyFilters}>
            Appliquer les filtres
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ClientFilters;
