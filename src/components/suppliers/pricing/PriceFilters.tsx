
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface PriceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedOrigin: string;
  setSelectedOrigin: (value: string) => void;
  selectedDestination: string;
  setSelectedDestination: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  uniqueOrigins: string[];
  uniqueDestinations: string[];
}

const PriceFilters: React.FC<PriceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedOrigin,
  setSelectedOrigin,
  selectedDestination,
  setSelectedDestination,
  selectedType,
  setSelectedType,
  uniqueOrigins,
  uniqueDestinations
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Origine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les origines</SelectItem>
            {uniqueOrigins.map((origin) => (
              <SelectItem key={origin} value={origin}>{origin}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedDestination} onValueChange={setSelectedDestination}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les destinations</SelectItem>
            {uniqueDestinations.map((destination) => (
              <SelectItem key={destination} value={destination}>{destination}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de transport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les types</SelectItem>
            <SelectItem value="maritime">Maritime</SelectItem>
            <SelectItem value="aérien">Aérien</SelectItem>
            <SelectItem value="routier">Routier</SelectItem>
            <SelectItem value="ferroviaire">Ferroviaire</SelectItem>
            <SelectItem value="multimodal">Multimodal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PriceFilters;
