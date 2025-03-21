
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  Calendar, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  UserCircle, 
  Clock, 
  CalendarRange 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShipmentFiltersProps {
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShipmentFilters: React.FC<ShipmentFiltersProps> = ({
  showAdvancedFilters,
  setShowAdvancedFilters,
}) => {
  const clearAllFilters = () => {
    // Implementation for clearing filters would go here
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 px-4 h-11">
                <SlidersHorizontal className="h-4 w-4" />
                Trier
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Trier par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <CalendarRange className="mr-2 h-4 w-4" />
                  <span>Date de départ (plus récent)</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarRange className="mr-2 h-4 w-4" />
                  <span>Date d'arrivée (plus proche)</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Client (A-Z)</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Progression (croissant)</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showAdvancedFilters && (
        <Card className="mb-8 bg-white border border-[#eee] shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Statut</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 px-3 py-1">Tous</Badge>
                  <Badge variant="default" className="cursor-pointer px-3 py-1">En cours</Badge>
                  <Badge variant="outline" className="cursor-pointer bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1">Terminée</Badge>
                  <Badge variant="outline" className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1">Planifiée</Badge>
                  <Badge variant="outline" className="cursor-pointer bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1">Retardée</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Type de transport</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 px-3 py-1">Tous</Badge>
                  <Badge variant="outline" className="cursor-pointer bg-blue-50 text-blue-500 hover:bg-blue-100 px-3 py-1">Maritime</Badge>
                  <Badge variant="outline" className="cursor-pointer bg-green-50 text-green-500 hover:bg-green-100 px-3 py-1">Aérien</Badge>
                  <Badge variant="outline" className="cursor-pointer bg-amber-50 text-amber-500 hover:bg-amber-100 px-3 py-1">Routier</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Période</label>
                <div className="flex gap-3">
                  <Input type="date" className="w-full h-10 bg-white" placeholder="Date début" />
                  <Input type="date" className="w-full h-10 bg-white" placeholder="Date fin" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Transporteur</label>
                <Input placeholder="Nom du transporteur" className="h-10 bg-white" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Origine</label>
                <Input placeholder="Port/Ville d'origine" className="h-10 bg-white" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-700">Destination</label>
                <Input placeholder="Port/Ville de destination" className="h-10 bg-white" />
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <Button variant="outline" className="mr-3" onClick={clearAllFilters}>Réinitialiser</Button>
              <Button>Appliquer</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ShipmentFilters;
