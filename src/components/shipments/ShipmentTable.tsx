
import React, { useState } from 'react';
import { 
  Ship, 
  Truck, 
  PlaneTakeoff,
  Calendar,
  MoreHorizontal,
  FileText,
  ArrowUpDown,
  AlertTriangle,
  BellRing 
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define shipment type for better type safety
export interface Shipment {
  id: string;
  client: string;
  departureDate: string;
  arrivalDate: string;
  origin: string;
  destination: string;
  status: string;
  progress: number;
  type: string;
  containers: string;
  priority?: 'haute' | 'moyenne' | 'basse';
  hasDocumentIssues?: boolean;
  isWatched?: boolean;
}

interface ShipmentTableProps {
  shipments: Shipment[];
  onOpenShipment: (id: string) => void;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const ShipmentTable: React.FC<ShipmentTableProps> = ({ 
  shipments, 
  onOpenShipment, 
  onSort, 
  sortField, 
  sortDirection 
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { toast } = useToast();

  const getShipmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'maritime':
        return <Ship className="h-4 w-4 text-blue-600" />;
      case 'routier':
        return <Truck className="h-4 w-4 text-amber-600" />;
      case 'aérien':
        return <PlaneTakeoff className="h-4 w-4 text-green-600" />;
      default:
        return <Ship className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en cours':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-200">En cours</Badge>;
      case 'terminée':
        return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-200">Terminée</Badge>;
      case 'planifiée':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200">Planifiée</Badge>;
      case 'retardée':
        return <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-200">Retardée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityLabel = (priority?: 'haute' | 'moyenne' | 'basse') => {
    if (!priority) return null;
    
    switch (priority) {
      case 'haute':
        return <span className="text-red-600 text-sm font-medium ml-2">• Prioritaire</span>;
      case 'moyenne':
        return <span className="text-amber-600 text-sm font-medium ml-2">• Moyenne</span>;
      case 'basse':
        return null;
      default:
        return null;
    }
  };

  const handleEditShipment = (id: string) => {
    onOpenShipment(id);
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
  
  const handleWatchShipment = (id: string) => {
    toast({
      title: "Suivi activé",
      description: `Vous recevrez des notifications pour l'expédition ${id}.`,
    });
  };
  
  const handleUnwatchShipment = (id: string) => {
    toast({
      title: "Suivi désactivé",
      description: `Vous ne recevrez plus de notifications pour l'expédition ${id}.`,
    });
  };
  
  const handleViewTrackingDetails = (id: string) => {
    onOpenShipment(id);
    toast({
      title: "Détails de suivi",
      description: `Consultation des détails de suivi pour l'expédition ${id}.`,
    });
  };
  
  const handleMarkAsPriority = (id: string) => {
    toast({
      title: "Priorité modifiée",
      description: `L'expédition ${id} a été marquée comme prioritaire.`,
    });
  };
  
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-4 w-4" />;
    return sortDirection === 'asc' 
      ? <ArrowUpDown className="ml-1 h-4 w-4 text-primary" /> 
      : <ArrowUpDown className="ml-1 h-4 w-4 text-primary rotate-180" />;
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer w-[150px]" onClick={() => onSort && onSort('id')}>
                Référence {onSort && getSortIcon('id')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort && onSort('client')}>
                Client {onSort && getSortIcon('client')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort && onSort('departureDate')}>
                Trajet & Dates {onSort && getSortIcon('departureDate')}
              </TableHead>
              <TableHead className="cursor-pointer w-[120px]" onClick={() => onSort && onSort('type')}>
                Transport {onSort && getSortIcon('type')}
              </TableHead>
              <TableHead className="cursor-pointer w-[120px]" onClick={() => onSort && onSort('status')}>
                Statut {onSort && getSortIcon('status')}
              </TableHead>
              <TableHead className="cursor-pointer w-[100px]">Alerte</TableHead>
              <TableHead className="text-right w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-base">Aucune expédition trouvée</p>
                    <p className="text-sm text-muted-foreground mt-1">Créez une nouvelle expédition ou modifiez vos filtres de recherche</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow 
                  key={shipment.id}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${shipment.priority === 'haute' ? 'bg-red-50/30' : ''}`}
                  onClick={() => onOpenShipment(shipment.id)}
                  onMouseEnter={() => setHoveredRow(shipment.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      {getShipmentIcon(shipment.type)}
                      <div className="flex flex-col">
                        <span className="font-medium">{shipment.id}</span>
                        <span className="text-sm text-muted-foreground">{shipment.containers}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <div className="font-medium">{shipment.client}</div>
                      {shipment.priority && getPriorityLabel(shipment.priority)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <div className="font-medium mb-1">{shipment.origin} → {shipment.destination}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Départ: {shipment.departureDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Arrivée: {shipment.arrivalDate}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <Badge variant="outline" className={shipment.type === 'Maritime' ? 'bg-blue-100 text-blue-700' : 
                                                       shipment.type === 'Aérien' ? 'bg-sky-100 text-sky-700' : 
                                                       'bg-amber-100 text-amber-700'}>
                      {shipment.type}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="space-y-1.5">
                      {getStatusBadge(shipment.status)}
                      <div className="w-full h-1.5 rounded-full bg-gray-100 mt-2">
                        <div 
                          className={`h-full rounded-full ${
                            shipment.status === 'en cours' ? 'bg-amber-500' :
                            shipment.status === 'terminée' ? 'bg-green-500' :
                            shipment.status === 'planifiée' ? 'bg-blue-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${shipment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      {shipment.hasDocumentIssues && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="p-1 bg-amber-100 rounded-full">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Documents manquants</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {shipment.isWatched && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="p-1 bg-blue-100 rounded-full">
                                <BellRing className="h-4 w-4 text-blue-600" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Notifications activées</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => handleEditShipment(shipment.id)}>
                            Modifier l'expédition
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewTrackingDetails(shipment.id)}>
                            Consulter le suivi
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDuplicateShipment(shipment.id)}>
                            Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadShipment(shipment.id)}>
                            Télécharger les documents
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {shipment.isWatched ? (
                            <DropdownMenuItem onClick={() => handleUnwatchShipment(shipment.id)}>
                              Désactiver les notifications
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleWatchShipment(shipment.id)}>
                              Activer les notifications
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleMarkAsPriority(shipment.id)}>
                            Marquer comme prioritaire
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
      </div>
    </Card>
  );
};

export default ShipmentTable;
