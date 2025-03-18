
import React from 'react';
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
  Truck as TruckIcon,
  Building,
  CircleAlert
} from 'lucide-react';

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
        return <Badge variant="outline">Planifiée</Badge>;
      case 'en cours':
        return <Badge variant="default">En cours</Badge>;
      case 'terminée':
        return <Badge variant="success">Terminée</Badge>;
      case 'retardée':
        return <Badge variant="destructive">Retardée</Badge>;
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

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border shadow-sm">
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
            <Progress value={progress} className="w-24 h-2" />
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Date de départ</p>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">{departureDate}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Arrivée estimée</p>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">{estimatedArrival}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Statut actuel</p>
          <div className="flex items-center gap-2">
            {status === 'en cours' && <Clock className="h-4 w-4 text-blue-600" />}
            {status === 'terminée' && <CircleCheck className="h-4 w-4 text-green-600" />}
            {status === 'retardée' && <AlertCircle className="h-4 w-4 text-red-600" />}
            {status === 'planifiée' && <CalendarClock className="h-4 w-4 text-gray-600" />}
            <p className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6 mb-6">
        <h3 className="font-medium mb-4">Parcours de l'expédition</h3>
        
        <div className="relative">
          {/* Ligne de connexion entre les étapes */}
          <div className="absolute left-6 top-6 h-[calc(100%-48px)] w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {stops.map((stop, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                <div className="mt-1 z-10">{getStepIcon(stop.status)}</div>
                <div className="bg-white">
                  <p className="font-medium">{stop.location}</p>
                  <p className="text-sm text-muted-foreground">{stop.date}</p>
                  {stop.status === 'current' && (
                    <p className="text-sm text-blue-600 mt-1">En cours de traitement</p>
                  )}
                  {stop.status === 'delayed' && (
                    <p className="text-sm text-red-600 mt-1">Retard signalé</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {events.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Activité récente</h3>
          
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-gray-50">
                {getEventIcon(event.type)}
                <div>
                  <p className="font-medium">{event.description}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentTracker;
