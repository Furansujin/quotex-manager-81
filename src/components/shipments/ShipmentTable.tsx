
import React, { useState } from 'react';
import { 
  Ship, 
  Truck, 
  PlaneTakeoff,
  Calendar,
  MoreHorizontal,
  Edit,
  Copy,
  Download,
  FileText
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
}

interface ShipmentTableProps {
  shipments: Shipment[];
  onOpenShipment: (id: string) => void;
}

const ShipmentTable: React.FC<ShipmentTableProps> = ({ shipments, onOpenShipment }) => {
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

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Expédition</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Trajet</TableHead>
              <TableHead>Fret</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
              shipments.map((shipment) => (
                <TableRow 
                  key={shipment.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onOpenShipment(shipment.id)}
                  onMouseEnter={() => setHoveredRow(shipment.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getShipmentIcon(shipment.type)}
                      {shipment.id}
                    </div>
                  </TableCell>
                  <TableCell>{shipment.client}</TableCell>
                  <TableCell>
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
                  <TableCell>
                    <Badge variant="outline" className={shipment.type === 'Maritime' ? 'bg-blue-100 text-blue-700' : 
                                                       shipment.type === 'Aérien' ? 'bg-sky-100 text-sky-700' : 
                                                       'bg-amber-100 text-amber-700'}>
                      {shipment.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="max-w-[100px] truncate">{shipment.origin}</span>
                      <span>→</span>
                      <span className="max-w-[100px] truncate">{shipment.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>{shipment.containers}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {getStatusBadge(shipment.status)}
                      <div className="w-full h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(shipment.status)}`}
                          style={{ width: `${shipment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-8 px-2 transition-opacity ${hoveredRow === shipment.id ? 'opacity-100' : 'opacity-70'}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleEditShipment(shipment.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Modifier</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateShipment(shipment.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Dupliquer</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadShipment(shipment.id)}>
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
      </div>
    </Card>
  );
};

export default ShipmentTable;
