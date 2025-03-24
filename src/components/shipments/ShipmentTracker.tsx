
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Ship, 
  Truck, 
  PlaneTakeoff, 
  CircleCheck,
  CircleDashed,
  Clock,
  AlertCircle,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <CircleDashed className="h-6 w-6 text-gray-400" />;
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'en cours': return 'bg-amber-500';
      case 'terminée': return 'bg-green-500';
      case 'planifiée': return 'bg-blue-500';
      case 'retardée': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  const handleSyncNow = () => {
    toast({
      title: "Synchronisation effectuée",
      description: "Les informations de suivi ont été mises à jour."
    });
  };

  return (
    <div className="bg-white rounded-lg">
      {/* Header avec progression simplifiée */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-md bg-primary/10">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold">{origin} → {destination}</h2>
              {getStatusBadge()}
            </div>
            <Progress value={progress} className={`w-full h-2 mt-1 ${getProgressColor()}`} />
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={handleSyncNow}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Actualiser
        </Button>
      </div>
      
      {/* Dates clés simplifiées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Départ</p>
              <p className="font-medium">{departureDate}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Arrivée estimée</p>
              <p className="font-medium">{estimatedArrival}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Timeline simplifiée */}
      <div className="mb-6">
        <h3 className="font-medium mb-4">Parcours de l'expédition</h3>
        
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
                      {stop.status === 'delayed' && (
                        <Badge variant="outline" className="bg-red-100 text-red-700 mt-1">Retard</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Événements récents simplifiés */}
      {events.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Dernières mises à jour</h3>
          
          <div className="space-y-3">
            {events.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-gray-50">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p>{event.description}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
            {events.length > 3 && (
              <Button variant="ghost" className="w-full text-sm">
                Voir toutes les mises à jour ({events.length})
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentTracker;
