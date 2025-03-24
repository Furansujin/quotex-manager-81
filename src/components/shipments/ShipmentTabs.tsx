
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShipmentTable from './ShipmentTable';
import { Shipment } from './ShipmentTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, setDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShipmentTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  shipments: Shipment[];
  onOpenShipment: (id: string) => void;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const ShipmentTabs: React.FC<ShipmentTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  shipments, 
  onOpenShipment,
  onSort,
  sortField,
  sortDirection
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const currentMonthStr = format(currentDate, 'MMMM yyyy', { locale: fr });
  
  // Get days in the current month
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate);
  // Day of the week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  // We convert to 0 = Monday, ..., 6 = Sunday for our calendar
  const firstDayOfWeek = getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;
  
  // Calculate empty cells before the first day of the month
  const emptyStartCells = Array.from({ length: firstDayOfWeek }, (_, index) => (
    <div key={`empty-start-${index}`} className="aspect-square border rounded-md p-2 text-center bg-gray-50"></div>
  ));
  
  // Generate the days cells for the current month
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayDate = setDate(currentDate, day);
    
    // Simple mock data mapping for shipments based on the day
    let shipmentInfo = null;
    
    if (day === 4) {
      shipmentInfo = {
        id: "SHP-0089",
        color: "blue"
      };
    } else if (day === 8) {
      shipmentInfo = {
        id: "SHP-0087",
        color: "green"
      };
    } else if (day === 14) {
      shipmentInfo = {
        id: "SHP-0092",
        color: "amber"
      };
    } else if (day === 18) {
      shipmentInfo = {
        id: "SHP-0095",
        color: "blue"
      };
    } else if (day === 22) {
      shipmentInfo = {
        id: "SHP-0097",
        color: "red"
      };
    }
    
    return (
      <div key={`day-${day}`} className="aspect-square border rounded-md p-2 text-center">
        <div className="text-sm font-medium">{day}</div>
        {shipmentInfo && (
          <div 
            className={`mt-1 text-xs bg-${shipmentInfo.color}-100 text-${shipmentInfo.color}-800 rounded-sm p-1 cursor-pointer hover:bg-${shipmentInfo.color}-200 transition-colors`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenShipment(shipmentInfo.id);
            }}
          >
            {shipmentInfo.id}
          </div>
        )}
      </div>
    );
  });
  
  // Combine empty cells and day cells
  const calendarCells = [...emptyStartCells, ...dayCells];

  // Filtrer les expéditions en fonction de l'onglet actif
  const filteredShipments = shipments.filter(shipment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return shipment.status === 'en cours';
    if (activeTab === 'completed') return shipment.status === 'terminée';
    if (activeTab === 'delayed') return shipment.status === 'retardée';
    return true;
  });

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="active">En cours</TabsTrigger>
        <TabsTrigger value="completed">Terminées</TabsTrigger>
        <TabsTrigger value="delayed">Retardées</TabsTrigger>
        <TabsTrigger value="calendar">Calendrier</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <ShipmentTable 
          shipments={shipments} 
          onOpenShipment={onOpenShipment}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </TabsContent>
      
      <TabsContent value="active">
        <ShipmentTable 
          shipments={filteredShipments} 
          onOpenShipment={onOpenShipment}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </TabsContent>
      
      <TabsContent value="completed">
        <ShipmentTable 
          shipments={filteredShipments} 
          onOpenShipment={onOpenShipment}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </TabsContent>
      
      <TabsContent value="delayed">
        <ShipmentTable 
          shipments={filteredShipments} 
          onOpenShipment={onOpenShipment}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </TabsContent>
      
      <TabsContent value="calendar">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-medium text-center capitalize">{currentMonthStr}</h3>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mt-2">
              <div className="p-2 text-center font-medium text-sm">Lun</div>
              <div className="p-2 text-center font-medium text-sm">Mar</div>
              <div className="p-2 text-center font-medium text-sm">Mer</div>
              <div className="p-2 text-center font-medium text-sm">Jeu</div>
              <div className="p-2 text-center font-medium text-sm">Ven</div>
              <div className="p-2 text-center font-medium text-sm">Sam</div>
              <div className="p-2 text-center font-medium text-sm">Dim</div>
              
              {calendarCells}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ShipmentTabs;
