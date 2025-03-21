
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
                  onClick={() => onOpenShipment(shipment.id)}
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
  );
};

export default ShipmentTable;
