// Vous pouvez importer DocumentManager ici pour l'utiliser dans le composant
import DocumentManager from './DocumentManager';

// La partie ci-dessous fixe le problème de type
// Remplacez la définition du type ShipmentType
type ShipmentType = "maritime" | "aérien" | "routier" | "ferroviaire";

import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, Truck, Ship, PlaneTakeoff, Train, Package, FileText, User, Phone, Mail, Building, Download, MessageSquare, Plus, AlertTriangle, Edit, Trash, CheckCircle, Upload, Copy, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ShipmentTracker from './ShipmentTracker';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      return <Badge variant="outline" className="bg-amber-100 text-amber-700">En cours</Badge>;
    case 'terminée':
      return <Badge variant="outline" className="bg-green-100 text-green-700">Terminée</Badge>;
    case 'planifiée':
      return <Badge variant="outline" className="bg-blue-100 text-blue-700">Planifiée</Badge>;
    case 'retardée':
      return <Badge variant="outline" className="bg-red-100 text-red-700">Retardée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const requiredDocuments = {
  'maritime': [
    { name: 'Connaissement maritime (B/L)', mandatory: true },
    { name: 'Facture commerciale', mandatory: true },
    { name: 'Liste de colisage', mandatory: true },
    { name: 'Certificat d\'origine', mandatory: false },
    { name: 'Certificat phytosanitaire', mandatory: false },
  ],
  'aérien': [
    { name: 'Lettre de transport aérien (LTA)', mandatory: true },
    { name: 'Facture commerciale', mandatory: true },
    { name: 'Liste de colisage', mandatory: true },
    { name: 'Certificat d\'origine', mandatory: false },
  ],
  'routier': [
    { name: 'Lettre de voiture CMR', mandatory: true },
    { name: 'Facture commerciale', mandatory: true },
    { name: 'Liste de colisage', mandatory: true },
  ],
  'ferroviaire': [
    { name: 'Lettre de voiture CIM', mandatory: true },
    { name: 'Facture commerciale', mandatory: true },
    { name: 'Liste de colisage', mandatory: true },
  ]
};

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipmentId, onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddStopDialog, setShowAddStopDialog] = useState(false);
  const [newStop, setNewStop] = useState({ location: '', date: '', status: 'upcoming' });
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);

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
    notes: "Le client souhaite être informé de tout retard éventuel. Livraison prioritaire.",
    cargoType: "Électronique / Fragile"
  };

  // Données pour le ShipmentTracker
  const [trackerStops, setTrackerStops] = useState([
    {
      location: "Shanghai, CN",
      date: "22/05/2023",
      status: "completed" as const
    },
    {
      location: "Singapour, SG",
      date: "29/05/2023",
      status: "completed" as const
    },
    {
      location: "Canal de Suez, EG",
      date: "05/06/2023",
      status: "current" as const
    },
    {
      location: "Marseille, FR",
      date: "12/06/2023",
      status: "upcoming" as const
    },
    {
      location: "Paris, FR",
      date: "15/06/2023",
      status: "upcoming" as const
    }
  ]);

  const [trackerEvents, setTrackerEvents] = useState([
    {
      date: "05/06/2023",
      description: "Passage du Canal de Suez en cours",
      type: "info" as const
    },
    {
      date: "29/05/2023",
      description: "Transbordement effectué à Singapour",
      type: "success" as const
    },
    {
      date: "22/05/2023",
      description: "Départ du port de Shanghai",
      type: "success" as const
    }
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, name: "Connaissement maritime", uploaded: true, date: "22/05/2023", mandatory: true },
    { id: 2, name: "Facture commerciale", uploaded: true, date: "22/05/2023", mandatory: true },
    { id: 3, name: "Liste de colisage", uploaded: true, date: "22/05/2023", mandatory: true },
    { id: 4, name: "Certificat d'origine", uploaded: false, date: "", mandatory: false }
  ]);

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

  const handleAddStop = () => {
    if (newStop.location && newStop.date) {
      setTrackerStops([...trackerStops, { ...newStop, status: newStop.status as any }]);
      setShowAddStopDialog(false);
      setNewStop({ location: '', date: '', status: 'upcoming' });
      
      toast({
        title: "Étape ajoutée",
        description: "L'étape a été ajoutée au parcours d'expédition."
      });
    }
  };

  const handleAddDocument = () => {
    const newDocument = {
      id: documents.length + 1,
      name: "Nouveau document",
      uploaded: false,
      date: "",
      mandatory: false
    };
    
    setDocuments([...documents, newDocument]);
    setShowAddDocumentDialog(false);
    
    toast({
      title: "Document ajouté",
      description: "Un nouveau document a été ajouté à l'expédition."
    });
  };

  const handleUploadDocument = (docId: number) => {
    const updatedDocs = documents.map(doc => 
      doc.id === docId ? { ...doc, uploaded: true, date: new Date().toLocaleDateString('fr-FR') } : doc
    );
    
    setDocuments(updatedDocs);
    
    toast({
      title: "Document téléversé",
      description: "Le document a été téléversé avec succès."
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

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="p-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="tracking">Suivi de parcours</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes & Problèmes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
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
                      <Package className="h-4 w-4" />
                      <p>Type de marchandise</p>
                    </div>
                    <p className="font-medium">{shipment.cargoType}</p>
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
                <CardTitle>Progression de l'expédition</CardTitle>
                <CardDescription>Statut actuel: {shipment.progress}% complété</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Progress value={shipment.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-amber-100">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Départ</p>
                        <p className="font-medium">{shipment.departureDate}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Ship className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">{shipment.type}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fret</p>
                        <p className="font-medium">{shipment.containers}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-purple-100">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Arrivée estimée</p>
                        <p className="font-medium">{shipment.arrivalDate}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Suivi détaillé de l'expédition</CardTitle>
                  <CardDescription>Parcours et étapes de l'expédition</CardDescription>
                </div>
                <Dialog open={showAddStopDialog} onOpenChange={setShowAddStopDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ajouter une étape
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une étape</DialogTitle>
                      <DialogDescription>
                        Définissez les détails de la nouvelle étape du parcours d'expédition.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Localisation</label>
                        <Input 
                          placeholder="ex: Rotterdam, NL" 
                          value={newStop.location}
                          onChange={(e) => setNewStop({...newStop, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input 
                          type="date" 
                          value={newStop.date}
                          onChange={(e) => setNewStop({...newStop, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Statut</label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={newStop.status}
                          onChange={(e) => setNewStop({...newStop, status: e.target.value})}
                        >
                          <option value="upcoming">À venir</option>
                          <option value="current">En cours</option>
                          <option value="completed">Terminé</option>
                          <option value="delayed">Retardé</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddStopDialog(false)}>Annuler</Button>
                      <Button onClick={handleAddStop}>Ajouter</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <ShipmentTracker 
                  shipmentType={shipment.type as "maritime" | "aérien" | "routier"}
                  status={shipment.status as "planifiée" | "en cours" | "terminée" | "retardée"}
                  progress={shipment.progress}
                  origin={shipment.origin}
                  destination={shipment.destination}
                  departureDate={shipment.departureDate}
                  estimatedArrival={shipment.arrivalDate}
                  stops={trackerStops}
                  events={trackerEvents}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <DocumentManager 
                  documents={documents}
                  shipmentType={shipment.type as "maritime" | "aérien" | "routier"}
                  onUploadDocument={handleUploadDocument}
                  onDownloadDocument={(docId) => handleDownloadDocument(documents.find(d => d.id === docId)?.name || 'document')}
                  onAddDocument={handleAddDocument}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-6">
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
        
        <div className="p-6 pt-0 flex justify-between items-center">
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
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Sauvegarder les modifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;
