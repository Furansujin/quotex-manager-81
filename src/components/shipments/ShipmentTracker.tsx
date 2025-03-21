
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
  CheckCircle
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
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

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
    type: 'info' | 'warning' | 'success';
  }[];
}

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
  const [newEvent, setNewEvent] = useState({ date: '', description: '', type: 'info' });
  
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

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case 'success':
        return <CircleCheck className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600" />;
    }
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
      setNewEvent({ date: '', description: '', type: 'info' });
    }
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
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Parcours de l'expédition</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: "Parcours optimisé",
                description: "Le parcours a été recalculé et optimisé."
              });
            }}
            className="text-xs"
          >
            <MapPin className="h-3 w-3 mr-1" />
            Optimiser le parcours
          </Button>
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                    >
                      <option value="info">Information</option>
                      <option value="warning">Avertissement</option>
                      <option value="success">Succès</option>
                    </select>
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
                {getEventIcon(event.type)}
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
    </div>
  );
};

export default ShipmentTracker;
