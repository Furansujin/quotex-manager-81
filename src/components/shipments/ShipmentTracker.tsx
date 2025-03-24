
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Ship, 
  Truck, 
  PlaneTakeoff, 
  MapPin, 
  CircleCheck,
  CircleDashed,
  Clock,
  AlertCircle,
  CalendarClock,
  Container,
  Building,
  CircleAlert,
  MoreHorizontal,
  Pencil,
  Trash,
  CheckCircle,
  Link,
  ExternalLink,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShipmentTrackerProps {
  shipmentType: 'maritime' | 'aérien' | 'routier';
  status: 'planifiée' | 'en cours' | 'terminée' | 'retardée';
  progress: number;
  origin: string;
  destination: string;
  departureDate: string;
  estimatedArrival: string;
  stops?: {
    location: string;
    date: string;
    status: 'completed' | 'current' | 'upcoming' | 'delayed';
  }[];
  events?: {
    date: string;
    description: string;
  }[];
}

interface TrackingProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'maritime' | 'aérien' | 'routier' | 'multi';
}

const trackingProviders: TrackingProvider[] = [
  { id: 'marinetraffic', name: 'MarineTraffic', icon: <Ship className="h-4 w-4" />, type: 'maritime' },
  { id: 'flightaware', name: 'FlightAware', icon: <PlaneTakeoff className="h-4 w-4" />, type: 'aérien' },
  { id: 'fleetmanager', name: 'FleetManager', icon: <Truck className="h-4 w-4" />, type: 'routier' },
  { id: 'shipgo', name: 'ShipGo', icon: <Container className="h-4 w-4" />, type: 'multi' },
  { id: 'tracktrace', name: 'Track & Trace', icon: <MapPin className="h-4 w-4" />, type: 'multi' },
  { id: 'custom', name: 'Service personnalisé', icon: <Link className="h-4 w-4" />, type: 'multi' },
];

const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({
  shipmentType,
  status,
  progress,
  origin,
  destination,
  departureDate,
  estimatedArrival,
  stops = [],
  events = []
}) => {
  const { toast } = useToast();
  const [showEditStopDialog, setShowEditStopDialog] = useState(false);
  const [editingStop, setEditingStop] = useState<{index: number, data: any} | null>(null);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', description: '' });
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const [integrationTab, setIntegrationTab] = useState('providers');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [trackingProviderConnected, setTrackingProviderConnected] = useState(false);
  
  const getIcon = () => {
    switch (shipmentType) {
      case 'maritime':
        return <Ship className="h-6 w-6 text-blue-600" />;
      case 'aérien':
        return <PlaneTakeoff className="h-6 w-6 text-green-600" />;
      case 'routier':
        return <Truck className="h-6 w-6 text-amber-600" />;
      default:
        return <Ship className="h-6 w-6 text-blue-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'planifiée':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Planifiée</Badge>;
      case 'en cours':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700">En cours</Badge>;
      case 'terminée':
        return <Badge variant="outline" className="bg-green-100 text-green-700">Terminée</Badge>;
      case 'retardée':
        return <Badge variant="outline" className="bg-red-100 text-red-700">Retardée</Badge>;
    }
  };

  const getStepIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <CircleCheck className="h-6 w-6 text-green-600" />;
      case 'current':
        return <CircleDashed className="h-6 w-6 text-blue-600 animate-pulse" />;
      case 'upcoming':
        return <CircleDashed className="h-6 w-6 text-gray-400" />;
      case 'delayed':
        return <CircleAlert className="h-6 w-6 text-red-600" />;
      default:
        return <CircleDashed className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStepStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'current': return 'En cours';
      case 'upcoming': return 'À venir';
      case 'delayed': return 'Retardé';
      default: return status;
    }
  };

  const getEventIcon = () => {
    return <Clock className="h-5 w-5 text-blue-600" />;
  };

  const getProgressBarColor = () => {
    switch (status) {
      case 'en cours': return 'bg-amber-500';
      case 'terminée': return 'bg-green-500';
      case 'planifiée': return 'bg-blue-500';
      case 'retardée': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  const handleEditStop = (index: number) => {
    setEditingStop({
      index,
      data: { ...stops[index] }
    });
    setShowEditStopDialog(true);
  };

  const saveEditedStop = () => {
    if (!editingStop) return;
    
    toast({
      title: "Étape modifiée",
      description: "Les informations de l'étape ont été mises à jour."
    });
    
    setShowEditStopDialog(false);
    setEditingStop(null);
  };

  const addNewEvent = () => {
    if (newEvent.date && newEvent.description) {
      toast({
        title: "Événement ajouté",
        description: "Le nouvel événement a été ajouté au suivi."
      });
      
      setShowAddEventDialog(false);
      setNewEvent({ date: '', description: '' });
    }
  };
  
  const handleConnectProvider = () => {
    if (!selectedProvider) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fournisseur de suivi.",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date();
    setLastSyncTime(now.toLocaleTimeString());
    setTrackingProviderConnected(true);
    
    toast({
      title: "Service connecté",
      description: `Le suivi a été connecté à ${trackingProviders.find(p => p.id === selectedProvider)?.name}.`
    });
    
    setShowIntegrationDialog(false);
  };
  
  const handleAddTrackingNumber = () => {
    if (!trackingNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un numéro de suivi valide.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Numéro de suivi ajouté",
      description: `Le numéro de suivi ${trackingNumber} a été ajouté à l'expédition.`
    });
    
    const now = new Date();
    setLastSyncTime(now.toLocaleTimeString());
    setTrackingProviderConnected(true);
    setShowIntegrationDialog(false);
  };
  
  const handleSyncNow = () => {
    toast({
      title: "Synchronisation en cours",
      description: "Mise à jour des informations de suivi..."
    });
    
    // Simuler une synchronisation
    setTimeout(() => {
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString());
      
      toast({
        title: "Synchronisation terminée",
        description: "Les informations de suivi ont été mises à jour."
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-md bg-primary/10">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold">Expédition {shipmentType}</h2>
              {getStatusBadge()}
            </div>
            <p className="text-muted-foreground">
              {origin} → {destination}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Progression</p>
          <div className="flex items-center gap-2">
            <Progress value={progress} className={`w-24 h-2 ${getProgressBarColor()}`} />
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <CalendarClock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Départ</p>
              <p className="font-medium">{departureDate}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <p className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <CalendarClock className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Arrivée estimée</p>
              <p className="font-medium">{estimatedArrival}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Intégration avec services de tracking */}
      <div className="mb-6">
        <Card className={`border ${trackingProviderConnected ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {trackingProviderConnected ? (
                  <>
                    <Zap className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Suivi automatique activé</p>
                      <p className="text-sm text-muted-foreground">
                        Dernière synchronisation: {lastSyncTime}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Link className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Activer le suivi automatique</p>
                      <p className="text-sm text-muted-foreground">
                        Connectez-vous à un service de tracking pour des mises à jour en temps réel
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex gap-2">
                {trackingProviderConnected && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1" 
                    onClick={handleSyncNow}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Synchroniser
                  </Button>
                )}
                <Dialog open={showIntegrationDialog} onOpenChange={setShowIntegrationDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant={trackingProviderConnected ? "outline" : "default"} 
                      size="sm"
                    >
                      {trackingProviderConnected ? "Configurer" : "Connecter"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Configuration du tracking</DialogTitle>
                      <DialogDescription>
                        Connectez cette expédition à un service de suivi ou ajoutez manuellement un numéro de tracking.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs value={integrationTab} onValueChange={setIntegrationTab} className="mt-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="providers">Services de suivi</TabsTrigger>
                        <TabsTrigger value="manual">Numéro de tracking</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="providers" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Sélectionnez un service</label>
                          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir un service de suivi" />
                            </SelectTrigger>
                            <SelectContent>
                              {trackingProviders
                                .filter(provider => provider.type === 'multi' || provider.type === shipmentType)
                                .map(provider => (
                                  <SelectItem key={provider.id} value={provider.id} className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      {provider.icon}
                                      <span>{provider.name}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Référence d'expédition</label>
                          <Input placeholder="Référence sur la plateforme du transporteur" />
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch 
                            id="auto-sync"
                            checked={autoSync}
                            onCheckedChange={setAutoSync}
                          />
                          <label htmlFor="auto-sync" className="text-sm font-medium">
                            Synchroniser automatiquement (toutes les 2 heures)
                          </label>
                        </div>
                        
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="mr-2" onClick={() => window.open("https://example.com", "_blank")}>
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Voir la documentation
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="manual" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Numéro de tracking</label>
                          <Input 
                            placeholder="Saisissez le numéro de suivi" 
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Transporteur</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez le transporteur" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cma-cgm">CMA CGM</SelectItem>
                              <SelectItem value="maersk">Maersk</SelectItem>
                              <SelectItem value="msc">MSC</SelectItem>
                              <SelectItem value="dhl">DHL</SelectItem>
                              <SelectItem value="fedex">FedEx</SelectItem>
                              <SelectItem value="ups">UPS</SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch 
                            id="show-tracking"
                            defaultChecked={true}
                          />
                          <label htmlFor="show-tracking" className="text-sm font-medium">
                            Afficher le lien de suivi au client
                          </label>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setShowIntegrationDialog(false)}>Annuler</Button>
                      <Button onClick={integrationTab === 'providers' ? handleConnectProvider : handleAddTrackingNumber}>
                        {trackingProviderConnected ? "Mettre à jour" : "Connecter"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Parcours de l'expédition</h3>
        </div>
        
        <div className="relative">
          {/* Ligne de connexion entre les étapes */}
          <div className="absolute left-6 top-6 h-[calc(100%-48px)] w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {stops.map((stop, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                <div className="mt-1 z-10">{getStepIcon(stop.status)}</div>
                <div className="bg-white flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{stop.location}</p>
                      <p className="text-sm text-muted-foreground">{stop.date}</p>
                      {stop.status === 'current' && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 mt-1">En cours de traitement</Badge>
                      )}
                      {stop.status === 'delayed' && (
                        <Badge variant="outline" className="bg-red-100 text-red-700 mt-1">Retard signalé</Badge>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditStop(index)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          toast({
                            title: "Alerte envoyée",
                            description: "Une alerte a été envoyée concernant cette étape."
                          });
                        }}>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          <span>Signaler un problème</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {events.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Activité récente</h3>
            <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">Ajouter un événement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un événement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      type="date" 
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input 
                      placeholder="Description de l'événement..." 
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>Annuler</Button>
                  <Button onClick={addNewEvent}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-gray-50">
                {getEventIcon()}
                <div className="flex-1">
                  <p className="font-medium">{event.description}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal d'édition d'étape */}
      <Dialog open={showEditStopDialog} onOpenChange={setShowEditStopDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier une étape</DialogTitle>
          </DialogHeader>
          {editingStop && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Localisation</label>
                <Input 
                  value={editingStop.data.location}
                  onChange={(e) => setEditingStop({
                    ...editingStop,
                    data: { ...editingStop.data, location: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  value={editingStop.data.date}
                  onChange={(e) => setEditingStop({
                    ...editingStop,
                    data: { ...editingStop.data, date: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={editingStop.data.status}
                  onChange={(e) => setEditingStop({
                    ...editingStop,
                    data: { ...editingStop.data, status: e.target.value }
                  })}
                >
                  <option value="upcoming">À venir</option>
                  <option value="current">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="delayed">Retardé</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditStopDialog(false)}>Annuler</Button>
            <Button onClick={saveEditedStop}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'ajout d'événement */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un événement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input 
                type="date" 
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                placeholder="Description de l'événement..." 
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>Annuler</Button>
            <Button onClick={addNewEvent}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipmentTracker;
