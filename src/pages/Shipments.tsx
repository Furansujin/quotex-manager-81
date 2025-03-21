
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
  ChevronDown,
  SlidersHorizontal,
  CalendarRange,
  UserCircle,
  Clock,
  MoreHorizontal,
  FileText,
  Download,
  Copy,
  Edit
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import NewShipmentForm from '@/components/shipments/NewShipmentForm';
import { useToast } from '@/hooks/use-toast';

const Shipments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showNewShipmentForm, setShowNewShipmentForm] = useState(false);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en cours':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 font-medium">En cours</Badge>;
      case 'terminée':
        return <Badge variant="outline" className="bg-green-100 text-green-700 font-medium">Terminée</Badge>;
      case 'planifiée':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 font-medium">Planifiée</Badge>;
      case 'retardée':
        return <Badge variant="outline" className="bg-red-100 text-red-700 font-medium">Retardée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'en cours':
        return 'bg-amber-500';
      case 'terminée':
        return 'bg-green-500';
      case 'planifiée':
        return 'bg-blue-500';
      case 'retardée':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  const handleOpenShipment = (id: string) => {
    setSelectedShipment(id);
  };

  const handleEditShipment = (id: string) => {
    setSelectedShipment(id);
  };

  const handleDuplicateShipment = (id: string) => {
    toast({
      title: "Expédition dupliquée",
      description: `L'expédition ${id} a été dupliquée avec succès.`,
    });
  };

  const handleDownloadShipment = (id: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Les documents de l'expédition ${id} sont en cours de téléchargement.`,
    });
  };

  const handleNewShipmentSuccess = (shipmentId: string) => {
    setShowNewShipmentForm(false);
    toast({
      title: "Expédition créée",
      description: `L'expédition ${shipmentId} a été créée avec succès.`,
    });
    // In a real app, you would refresh the shipments list or add the new shipment to the state
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Gestion des Expéditions</h1>
              <p className="text-muted-foreground">Suivi et gestion des expéditions en cours</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 px-4 h-10">
                <Calendar className="h-4 w-4" />
                Planifier
              </Button>
              <Button 
                className="gap-2 px-4 h-10" 
                onClick={() => setShowNewShipmentForm(true)}
              >
                <Plus className="h-4 w-4" />
                Nouvelle Expédition
              </Button>
            </div>
          </div>

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
                  <Button variant="outline" className="mr-3">Réinitialiser</Button>
                  <Button>Appliquer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6 h-11 p-1 bg-[#f3f3f3] border border-[#eee]">
              <TabsTrigger value="all" className="h-9 px-5 rounded-md data-[state=active]:bg-white">Toutes</TabsTrigger>
              <TabsTrigger value="active" className="h-9 px-5 rounded-md data-[state=active]:bg-white">En cours</TabsTrigger>
              <TabsTrigger value="completed" className="h-9 px-5 rounded-md data-[state=active]:bg-white">Terminées</TabsTrigger>
              <TabsTrigger value="delayed" className="h-9 px-5 rounded-md data-[state=active]:bg-white">Retardées</TabsTrigger>
              <TabsTrigger value="calendar" className="h-9 px-5 rounded-md data-[state=active]:bg-white">Calendrier</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card className="border border-[#eee] shadow-sm">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-[#f6f6f7]">
                      <TableRow className="border-0 hover:bg-transparent">
                        <TableHead className="h-12 px-6 text-sm font-semibold text-gray-700">N° Expédition</TableHead>
                        <TableHead className="h-12 px-6 text-sm font-semibold text-gray-700">Client</TableHead>
                        <TableHead className="h-12 px-6 text-sm font-semibold text-gray-700">Dates</TableHead>
                        <TableHead className="h-12 px-6 text-sm font-semibold text-gray-700">Type</TableHead>
                        <TableHead className="h-12 px-6 text-sm font-semibold text-gray-700">Trajet</TableHead>
                        <TableHead className="h-12 px-6 text-sm font-semibold text-gray-700">Fret</TableHead>
                        <TableHead className="h-12 px-6 text-sm font-semibold text-gray-700">Statut</TableHead>
                        <TableHead className="h-12 px-6 text-sm font-semibold text-gray-700 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-center">
                              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                              <p className="text-muted-foreground text-base">Aucune expédition trouvée</p>
                              <p className="text-sm text-muted-foreground mt-1">Créez une nouvelle expédition ou modifiez vos filtres de recherche</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        shipments.map((shipment, index) => (
                          <TableRow 
                            key={shipment.id}
                            className={`cursor-pointer hover:bg-[#f1f1f1] transition-colors ${index < shipments.length - 1 ? 'border-b' : 'border-b-0'}`}
                            onClick={() => handleOpenShipment(shipment.id)}
                            onMouseEnter={() => setHoveredRow(shipment.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <TableCell className="px-6 py-5 font-medium">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-[#f1f0fb]">
                                  {getShipmentIcon(shipment.type)}
                                </div>
                                {shipment.id}
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                              <span className="font-medium text-gray-800">{shipment.client}</span>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                  <span className="font-medium">Départ:</span> {shipment.departureDate}
                                </span>
                                <span className="text-sm flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-green-600" />
                                  <span className="font-medium">Arrivée:</span> {shipment.arrivalDate}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                              <span className="text-gray-800">{shipment.type}</span>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                              <div className="flex items-center gap-2 text-gray-800">
                                <span className="max-w-[100px] truncate">{shipment.origin}</span>
                                <span>→</span>
                                <span className="max-w-[100px] truncate">{shipment.destination}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-5 text-gray-800">{shipment.containers}</TableCell>
                            <TableCell className="px-6 py-5">
                              <div className="space-y-2.5">
                                <div className="flex justify-between items-center">
                                  {getStatusBadge(shipment.status)}
                                  <span className="text-xs font-medium text-gray-600">{shipment.progress}%</span>
                                </div>
                                <Progress 
                                  value={shipment.progress} 
                                  className={`h-2 ${getProgressColor(shipment.status)}`} 
                                />
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-5 text-right">
                              <div className="flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className={`h-9 px-2.5 rounded-full transition-opacity ${hoveredRow === shipment.id ? 'opacity-100' : 'opacity-0'}`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-4.5 w-4.5" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditShipment(shipment.id);
                                    }}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Modifier</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuplicateShipment(shipment.id);
                                    }}>
                                      <Copy className="mr-2 h-4 w-4" />
                                      <span>Dupliquer</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadShipment(shipment.id);
                                    }}>
                                      <Download className="mr-2 h-4 w-4" />
                                      <span>Télécharger</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
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

      {showNewShipmentForm && (
        <NewShipmentForm 
          onClose={() => setShowNewShipmentForm(false)}
          onSuccess={handleNewShipmentSuccess}
        />
      )}
    </div>
  );
};

export default Shipments;
