
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShipmentTable from './ShipmentTable';
import { Shipment } from './ShipmentTable';
import { Card, CardContent } from '@/components/ui/card';

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
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Affichage des expéditions en cours</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="completed">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Affichage des expéditions terminées</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="delayed">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Affichage des expéditions retardées</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="calendar">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Vue calendrier des expéditions</h3>
            <div className="grid grid-cols-7 gap-1 mt-2">
              <div className="p-2 text-center font-medium text-sm">Lun</div>
              <div className="p-2 text-center font-medium text-sm">Mar</div>
              <div className="p-2 text-center font-medium text-sm">Mer</div>
              <div className="p-2 text-center font-medium text-sm">Jeu</div>
              <div className="p-2 text-center font-medium text-sm">Ven</div>
              <div className="p-2 text-center font-medium text-sm">Sam</div>
              <div className="p-2 text-center font-medium text-sm">Dim</div>
              
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className="aspect-square border rounded-md p-2 text-center">
                  <div className="text-sm font-medium">{i + 1}</div>
                  {i === 4 && (
                    <div className="mt-1 text-xs bg-blue-100 text-blue-800 rounded-sm p-1">
                      SHP-0089
                    </div>
                  )}
                  {i === 8 && (
                    <div className="mt-1 text-xs bg-green-100 text-green-800 rounded-sm p-1">
                      SHP-0087
                    </div>
                  )}
                  {i === 14 && (
                    <div className="mt-1 text-xs bg-amber-100 text-amber-800 rounded-sm p-1">
                      SHP-0092
                    </div>
                  )}
                  {i === 18 && (
                    <div className="mt-1 text-xs bg-blue-100 text-blue-800 rounded-sm p-1">
                      SHP-0095
                    </div>
                  )}
                  {i === 22 && (
                    <div className="mt-1 text-xs bg-red-100 text-red-800 rounded-sm p-1">
                      SHP-0097
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ShipmentTabs;
