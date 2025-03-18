
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Ship, 
  Truck, 
  PlaneTakeoff, 
  Search, 
  Filter, 
  Calendar, 
  Plus,
  ArrowRight,
  Layers,
  MapPin,
  Clock,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
  CalendarRange,
  UserCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShipmentDetail from '@/components/shipments/ShipmentDetail';
import { useToast } from '@/hooks/use-toast';

const Shipments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getShipmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'maritime':
        return <Ship className="h-5 w-5 text-blue-600" />;
      case 'routier':
        return <Truck className="h-5 w-5 text-amber-600" />;
      case 'aérien':
        return <PlaneTakeoff className="h-5 w-5 text-green-600" />;
      default:
        return <Ship className="h-5 w-5 text-primary" />;
    }
  };

  const handleOpenShipment = (id: string) => {
    setSelectedShipment(id);
  };

  const shipments = [
    { 
      id: "SHP-2023-0089", 
      client: "Tech Supplies Inc", 
      departureDate: "22/05/2023", 
      arrivalDate: "15/06/2023",
      origin: "Shanghai, CN", 
      destination: "Paris, FR",
      status: "en cours",
      progress: 65,
      type: "Maritime",
      containers: "2 x 40HC"
    },
    { 
      id: "SHP-2023-0088", 
      client: "Pharma Solutions", 
      departureDate: "18/05/2023", 
      arrivalDate: "20/05/2023",
      origin: "New York, US", 
      destination: "Madrid, ES",
      status: "terminée",
      progress: 100,
      type: "Aérien",
      containers: "250 kg"
    },
    { 
      id: "SHP-2023-0087", 
      client: "Global Imports Ltd", 
      departureDate: "26/05/2023", 
      arrivalDate: "14/06/2023",
      origin: "Rotterdam, NL", 
      destination: "Marseille, FR",
      status: "planifiée",
      progress: 20,
      type: "Maritime",
      containers: "1 x 20GP"
    },
    { 
      id: "SHP-2023-0086", 
      client: "Eurotech GmbH", 
      departureDate: "15/05/2023", 
      arrivalDate: "17/05/2023",
      origin: "Munich, DE", 
      destination: "Lyon, FR",
      status: "retardée",
      progress: 80,
      type: "Routier",
      containers: "Camion complet"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion des Expéditions</h1>
              <p className="text-muted-foreground">Suivi et gestion des expéditions en cours</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Planifier
              </Button>
              <Button className="gap-2" onClick={() => toast({
                title: "Fonction en développement",
                description: "La création d'une nouvelle expédition sera bientôt disponible.",
              })}>
                <Plus className="h-4 w-4" />
                Nouvelle Expédition
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher par n° expédition, client, destination..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showAdvancedFilters ? "default" : "outline"} 
                className="gap-2"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
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
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Tous</Badge>
                      <Badge variant="default" className="cursor-pointer">En cours</Badge>
                      <Badge variant="success" className="cursor-pointer">Terminée</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Planifiée</Badge>
                      <Badge variant="destructive" className="cursor-pointer">Retardée</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type de transport</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Tous</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-blue-500/10 text-blue-500">Maritime</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-green-500/10 text-green-500">Aérien</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-amber-500/10 text-amber-500">Routier</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Période</label>
                    <div className="flex gap-2">
                      <Input type="date" className="w-full" placeholder="Date début" />
                      <Input type="date" className="w-full" placeholder="Date fin" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Transporteur</label>
                    <Input placeholder="Nom du transporteur" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Origine</label>
                    <Input placeholder="Port/Ville d'origine" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Destination</label>
                    <Input placeholder="Port/Ville de destination" />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="mr-2">Réinitialiser</Button>
                  <Button>Appliquer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
              <TabsTrigger value="delayed">Retardées</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {shipments.map((shipment) => (
                <Card 
                  key={shipment.id} 
                  className="hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => handleOpenShipment(shipment.id)}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          {getShipmentIcon(shipment.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{shipment.id}</h3>
                            <Badge variant={
                              shipment.status === "terminée" ? "success" : 
                              shipment.status === "en cours" ? "default" :
                              shipment.status === "planifiée" ? "outline" :
                              "destructive"
                            }>
                              {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{shipment.client}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm flex-1">
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <p>Trajet</p>
                          </div>
                          <p className="font-medium">{shipment.origin} → {shipment.destination}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <p>Dates</p>
                          </div>
                          <p className="font-medium">{shipment.departureDate} - {shipment.arrivalDate}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Layers className="h-3 w-3" />
                            <p>Fret</p>
                          </div>
                          <p className="font-medium">{shipment.containers}</p>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progression</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <Progress value={shipment.progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            {/* Autres onglets */}
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
        </div>
      </main>
      
      {selectedShipment && (
        <ShipmentDetail
          shipmentId={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}
    </div>
  );
};

export default Shipments;
