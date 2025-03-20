
// La partie ci-dessous fixe le problème de type
// Remplacez la définition du type ShipmentType
type ShipmentType = "maritime" | "aérien" | "routier" | "ferroviaire";

import React from 'react';
import { X, MapPin, Calendar, Clock, Truck, Ship, PlaneTakeoff, Train, Package, FileText, User, Phone, Mail, Building, Download, MessageSquare, Plus, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ShipmentTracker from './ShipmentTracker';

interface ShipmentDetailProps {
  shipmentId: string;
  onClose: () => void;
}

const getShipmentIcon = (type: ShipmentType) => {
  switch (type.toLowerCase() as ShipmentType) {
    case 'maritime':
      return <Ship className="h-5 w-5 text-blue-600" />;
    case 'routier':
      return <Truck className="h-5 w-5 text-amber-600" />;
    case 'aérien':
      return <PlaneTakeoff className="h-5 w-5 text-green-600" />;
    case 'ferroviaire':
      return <Train className="h-5 w-5 text-purple-600" />;
    default:
      return <Ship className="h-5 w-5 text-primary" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'en cours':
      return <Badge variant="default">En cours</Badge>;
    case 'terminée':
      return <Badge variant="success">Terminée</Badge>;
    case 'planifiée':
      return <Badge variant="outline">Planifiée</Badge>;
    case 'retardée':
      return <Badge variant="destructive">Retardée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipmentId, onClose }) => {
  const { toast } = useToast();

  // Données factices pour la démonstration
  const shipment = {
    id: shipmentId,
    client: "Tech Supplies Inc",
    type: "maritime" as ShipmentType,
    departureDate: "22/05/2023",
    arrivalDate: "15/06/2023",
    origin: "Shanghai, CN",
    destination: "Paris, FR",
    status: "en cours",
    progress: 65,
    containers: "2 x 40HC",
    carrier: "Ocean Line Express",
    reference: "REF-2023-0089",
    description: "Équipements électroniques et pièces détachées",
    contactName: "John Smith",
    contactPhone: "+33 1 23 45 67 89",
    contactEmail: "j.smith@techsupplies.com",
    notes: "Le client souhaite être informé de tout retard éventuel. Livraison prioritaire."
  };

  const handleDownloadDocument = (docType: string) => {
    toast({
      title: `Téléchargement du document`,
      description: `Le ${docType} est en cours de téléchargement.`,
    });
  };

  const handleAddNote = () => {
    toast({
      title: "Note ajoutée",
      description: "Votre note a été ajoutée à l'expédition."
    });
  };

  const handleReportIssue = () => {
    toast({
      title: "Problème signalé",
      description: "Le problème a été signalé à l'équipe responsable."
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getShipmentIcon(shipment.type)}
            <h2 className="text-xl font-bold">{shipment.id}</h2>
            {getStatusBadge(shipment.status)}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'expédition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    <p>Trajet</p>
                  </div>
                  <p className="font-medium">{shipment.origin} → {shipment.destination}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <p>Date de départ</p>
                  </div>
                  <p className="font-medium">{shipment.departureDate}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <p>Date d'arrivée prévue</p>
                  </div>
                  <p className="font-medium">{shipment.arrivalDate}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Package className="h-4 w-4" />
                    <p>Fret</p>
                  </div>
                  <p className="font-medium">{shipment.containers}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Truck className="h-4 w-4" />
                    <p>Transporteur</p>
                  </div>
                  <p className="font-medium">{shipment.carrier}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <FileText className="h-4 w-4" />
                    <p>Référence externe</p>
                  </div>
                  <p className="font-medium">{shipment.reference}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <FileText className="h-4 w-4" />
                    <p>Description</p>
                  </div>
                  <p>{shipment.description}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Building className="h-4 w-4" />
                    <p>Entreprise</p>
                  </div>
                  <p className="font-medium">{shipment.client}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    <p>Contact</p>
                  </div>
                  <p className="font-medium">{shipment.contactName}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Phone className="h-4 w-4" />
                    <p>Téléphone</p>
                  </div>
                  <p className="font-medium">{shipment.contactPhone}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Mail className="h-4 w-4" />
                    <p>Email</p>
                  </div>
                  <p className="font-medium">{shipment.contactEmail}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <p>Notes</p>
                  </div>
                  <p>{shipment.notes}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Suivi de l'expédition</CardTitle>
              <CardDescription>Progression: {shipment.progress}%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Progress value={shipment.progress} className="h-2" />
              </div>
              
              <ShipmentTracker />
            </CardContent>
          </Card>
          
          <Tabs defaultValue="documents">
            <TabsList className="mb-4">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="issues">Problèmes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents d'expédition</CardTitle>
                  <CardDescription>Documents associés à cette expédition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <p className="font-medium">Connaissement maritime</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => handleDownloadDocument("connaissement maritime")}>
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <p className="font-medium">Facture commerciale</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => handleDownloadDocument("facture commerciale")}>
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-amber-600" />
                        <p className="font-medium">Liste de colisage</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => handleDownloadDocument("liste de colisage")}>
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-red-600" />
                        <p className="font-medium">Certificat d'origine</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => handleDownloadDocument("certificat d'origine")}>
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes de suivi</CardTitle>
                  <CardDescription>Ajoutez des notes internes sur cette expédition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Textarea placeholder="Ajoutez une note interne sur cette expédition..." className="min-h-32" />
                      <div className="flex justify-end">
                        <Button className="gap-1" onClick={handleAddNote}>
                          <Plus className="h-4 w-4" />
                          Ajouter une note
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Marie Martin</p>
                          <p className="text-sm text-muted-foreground">24/05/2023 14:32</p>
                        </div>
                        <p className="text-sm">Le client a été informé du retard de 2 jours dû aux contrôles douaniers supplémentaires. Il comprend la situation.</p>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Jean Dupont</p>
                          <p className="text-sm text-muted-foreground">22/05/2023 09:15</p>
                        </div>
                        <p className="text-sm">Expedition prise en charge par le transporteur maritime Ocean Line Express. Départ confirmé pour aujourd'hui à 14h00.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <CardTitle>Problèmes et incidents</CardTitle>
                  <CardDescription>Signalez et suivez les problèmes liés à cette expédition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Textarea placeholder="Décrivez le problème rencontré..." className="min-h-32" />
                      <div className="flex justify-end">
                        <Button variant="destructive" className="gap-1" onClick={handleReportIssue}>
                          <AlertTriangle className="h-4 w-4" />
                          Signaler un problème
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                      <div className="p-3 border border-amber-200 bg-amber-50 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <p className="font-medium text-amber-800">Retard de livraison</p>
                          </div>
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">En cours</Badge>
                        </div>
                        <p className="text-sm text-amber-700 mb-2">Contrôles douaniers supplémentaires au port de Shanghai. Retard estimé de 2 jours.</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-amber-600">Signalé par: Marie Martin - 24/05/2023</p>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Voir détails</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => handleDownloadDocument("rapport complet")}>
                <Download className="h-4 w-4" />
                Exporter rapport
              </Button>
            </div>
            <div>
              <Button variant="outline" className="gap-2 mr-2" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ajout de l'export par défaut pour résoudre l'erreur TS1192
export default ShipmentDetail;
