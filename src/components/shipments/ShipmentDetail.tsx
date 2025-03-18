
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import ShipmentTracker from './ShipmentTracker';
import { 
  X, 
  Ship, 
  Truck, 
  PlaneTakeoff, 
  FileText, 
  MessageSquare, 
  Clock, 
  Package2, 
  Clipboard, 
  Building2, 
  UserCircle2,
  MapPin,
  Phone,
  Mail,
  CalendarClock,
  ArrowUpDown,
  Pencil,
  Save,
  AlertCircle,
  Send,
  Download,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types definitions
type ShipmentType = 'maritime' | 'aérien' | 'routier' | 'ferroviaire' | 'multimodal';
type ShipmentStatus = 'planifiée' | 'en cours' | 'terminée' | 'retardée';
type StopStatus = 'completed' | 'current' | 'upcoming';
type EventType = 'success' | 'warning' | 'info';

interface Stop {
  location: string;
  date: string;
  status: StopStatus;
}

interface Event {
  date: string;
  description: string;
  type: EventType;
}

interface Document {
  name: string;
  status: string;
  date: string;
}

interface Contact {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
}

interface Comment {
  user: string;
  date: string;
  text: string;
}

interface ShipmentData {
  id: string;
  client: string;
  reference: string;
  type: ShipmentType;
  status: ShipmentStatus;
  progress: number;
  origin: string;
  destination: string;
  departureDate: string;
  estimatedArrival: string;
  containers: string;
  incoterm: string;
  carrier: string;
  trackingNumber: string;
  weight: string;
  volume: string;
  stops: Stop[];
  events: Event[];
  documents: Document[];
  contacts: Contact[];
  comments: Comment[];
}

interface ShipmentDetailProps {
  shipmentId: string;
  onClose: () => void;
}

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipmentId, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const shipmentData: ShipmentData = {
    id: shipmentId,
    client: "Tech Supplies Inc",
    reference: "PO-78945",
    type: "maritime",
    status: "en cours",
    progress: 65,
    origin: "Shanghai, CN",
    destination: "Paris, FR",
    departureDate: "22/05/2023",
    estimatedArrival: "15/06/2023",
    containers: "2 x 40HC",
    incoterm: "FOB Shanghai",
    carrier: "Ocean Line Express",
    trackingNumber: "OCLX-78945612",
    weight: "15,400 kg",
    volume: "120 m³",
    stops: [
      {
        location: "Port de Shanghai",
        date: "22/05/2023",
        status: "completed",
      },
      {
        location: "Départ du navire",
        date: "24/05/2023",
        status: "completed",
      },
      {
        location: "En transit (Mer de Chine méridionale)",
        date: "30/05/2023",
        status: "current",
      },
      {
        location: "Transit par Suez",
        date: "07/06/2023",
        status: "upcoming",
      },
      {
        location: "Arrivée Port du Havre",
        date: "14/06/2023",
        status: "upcoming",
      },
      {
        location: "Livraison Paris",
        date: "15/06/2023",
        status: "upcoming",
      }
    ],
    events: [
      {
        date: "30/05/2023 - 10:45",
        description: "Le navire a quitté le port de Singapour",
        type: "info"
      },
      {
        date: "24/05/2023 - 08:30",
        description: "Le navire a quitté le port de Shanghai",
        type: "success"
      },
      {
        date: "22/05/2023 - 14:20",
        description: "Conteneurs chargés sur le navire MSC VALENCIA",
        type: "success"
      }
    ],
    documents: [
      {
        name: "Bill of Lading",
        status: "Validé",
        date: "22/05/2023"
      },
      {
        name: "Facture commerciale",
        status: "Validé",
        date: "21/05/2023"
      },
      {
        name: "Liste de colisage",
        status: "Validé",
        date: "21/05/2023"
      },
      {
        name: "Certificat d'origine",
        status: "En attente",
        date: "Pending"
      }
    ],
    contacts: [
      {
        name: "Marie Dupont",
        role: "Transitaire",
        company: "QuoteX Logistics",
        email: "marie.dupont@quotex.com",
        phone: "+33 6 12 34 56 78"
      },
      {
        name: "John Smith",
        role: "Représentant client",
        company: "Tech Supplies Inc",
        email: "john.smith@techsupplies.com",
        phone: "+1 555-123-4567"
      },
      {
        name: "Li Wei",
        role: "Agent local Shanghai",
        company: "Shanghai Logistics Co.",
        email: "li.wei@shanghailog.cn",
        phone: "+86 123 4567 8901"
      }
    ],
    comments: [
      {
        user: "Jean Dupont",
        date: "28/05/2023 - 09:15",
        text: "Le transporteur nous a informés que le navire a pris un peu d'avance et pourrait arriver avec 1 jour d'avance."
      },
      {
        user: "Marie Martin",
        date: "25/05/2023 - 14:30",
        text: "Documents douaniers envoyés au client pour validation."
      }
    ]
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      // Add comment logic would go here
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été ajouté avec succès.",
      });
      setComment('');
    }
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast({
      title: "Modifications enregistrées",
      description: "Les informations de l'expédition ont été mises à jour.",
    });
  };

  const handleUpdateStatus = (status: ShipmentStatus) => {
    toast({
      title: "Statut mis à jour",
      description: `Le statut de l'expédition a été changé en "${status}".`,
    });
  };

  // Helper function to get the appropriate icon based on shipment type
  const getShipmentIcon = (type: ShipmentType) => {
    switch (type) {
      case 'maritime':
        return <Ship className="h-5 w-5 text-blue-600" />;
      case 'aérien':
        return <PlaneTakeoff className="h-5 w-5 text-green-600" />;
      case 'routier':
        return <Truck className="h-5 w-5 text-amber-600" />;
      default:
        return <Ship className="h-5 w-5 text-primary" />;
    }
  };

  // Helper function to determine badge variant based on shipment status
  const getStatusVariant = (status: ShipmentStatus) => {
    switch (status) {
      case 'terminée':
        return "success";
      case 'en cours':
        return "default";
      case 'planifiée':
        return "outline";
      case 'retardée':
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              {getShipmentIcon(shipmentData.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{shipmentData.id}</h2>
                <Badge variant={getStatusVariant(shipmentData.status)}>
                  {shipmentData.status.charAt(0).toUpperCase() + shipmentData.status.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground">{shipmentData.client}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
                Modifier
              </Button>
            )}
            {isEditing && (
              <Button className="gap-2" onClick={handleSaveChanges}>
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="tracking">Suivi</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="comments">Commentaires</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Client</p>
                      {isEditing ? (
                        <Input defaultValue={shipmentData.client} />
                      ) : (
                        <p className="font-medium">{shipmentData.client}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Référence client</p>
                      {isEditing ? (
                        <Input defaultValue={shipmentData.reference} />
                      ) : (
                        <p className="font-medium">{shipmentData.reference}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Type de transport</p>
                      {isEditing ? (
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          defaultValue={shipmentData.type}
                        >
                          <option value="maritime">Maritime</option>
                          <option value="aérien">Aérien</option>
                          <option value="routier">Routier</option>
                          <option value="ferroviaire">Ferroviaire</option>
                          <option value="multimodal">Multimodal</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getShipmentIcon(shipmentData.type)}
                          <p className="font-medium capitalize">{shipmentData.type}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Statut</p>
                      {isEditing ? (
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          defaultValue={shipmentData.status}
                        >
                          <option value="planifiée">Planifiée</option>
                          <option value="en cours">En cours</option>
                          <option value="terminée">Terminée</option>
                          <option value="retardée">Retardée</option>
                        </select>
                      ) : (
                        <Badge variant={getStatusVariant(shipmentData.status)}>
                          {shipmentData.status.charAt(0).toUpperCase() + shipmentData.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Origine</p>
                      {isEditing ? (
                        <Input defaultValue={shipmentData.origin} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{shipmentData.origin}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Destination</p>
                      {isEditing ? (
                        <Input defaultValue={shipmentData.destination} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{shipmentData.destination}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Date de départ</p>
                      {isEditing ? (
                        <Input type="date" defaultValue="2023-05-22" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{shipmentData.departureDate}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Arrivée estimée</p>
                      {isEditing ? (
                        <Input type="date" defaultValue="2023-06-15" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{shipmentData.estimatedArrival}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Transporteur</p>
                      {isEditing ? (
                        <Input defaultValue={shipmentData.carrier} />
                      ) : (
                        <p className="font-medium">{shipmentData.carrier}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Numéro de suivi</p>
                      {isEditing ? (
                        <Input defaultValue={shipmentData.trackingNumber} />
                      ) : (
                        <p className="font-medium">{shipmentData.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Incoterm</p>
                      {isEditing ? (
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          defaultValue="FOB Shanghai"
                        >
                          <option value="EXW">EXW</option>
                          <option value="FOB Shanghai">FOB Shanghai</option>
                          <option value="CIF Paris">CIF Paris</option>
                          <option value="DAP">DAP</option>
                          <option value="DDP">DDP</option>
                        </select>
                      ) : (
                        <p className="font-medium">{shipmentData.incoterm}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Fret</p>
                      {isEditing ? (
                        <Input defaultValue={shipmentData.containers} />
                      ) : (
                        <p className="font-medium">{shipmentData.containers}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Poids</p>
                      {isEditing ? (
                        <Input defaultValue={shipmentData.weight.replace(' kg', '')} />
                      ) : (
                        <p className="font-medium">{shipmentData.weight}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Volume</p>
                      {isEditing ? (
                        <Input defaultValue={shipmentData.volume.replace(' m³', '')} />
                      ) : (
                        <p className="font-medium">{shipmentData.volume}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-sm text-muted-foreground">Progression</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avancement</span>
                        <span>{shipmentData.progress}%</span>
                      </div>
                      <Progress value={shipmentData.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-medium mb-3">Documents récents</h3>
                    <div className="space-y-2">
                      {shipmentData.documents.slice(0, 3).map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{doc.name}</span>
                          </div>
                          <Badge variant={doc.status === "Validé" ? "success" : "warning"}>
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Activité récente</h3>
                    <div className="space-y-2">
                      {shipmentData.events.slice(0, 3).map((event, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {!isEditing && (
                <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                  <Button variant="outline" className="gap-2" onClick={() => handleUpdateStatus("terminée")}>
                    <ArrowUpDown className="h-4 w-4" />
                    Changer le statut
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => {
                    toast({
                      title: "ETD mise à jour",
                      description: "La date de départ estimée a été mise à jour.",
                    });
                  }}>
                    <Clock className="h-4 w-4" />
                    Mettre à jour l'ETD
                  </Button>
                  <Button className="gap-2" onClick={() => {
                    toast({
                      title: "Signalement créé",
                      description: "Un nouveau signalement a été créé pour cette expédition.",
                    });
                  }}>
                    <AlertCircle className="h-4 w-4" />
                    Signaler un problème
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tracking">
              <ShipmentTracker
                shipmentType={shipmentData.type}
                status={shipmentData.status}
                progress={shipmentData.progress}
                origin={shipmentData.origin}
                destination={shipmentData.destination}
                departureDate={shipmentData.departureDate}
                estimatedArrival={shipmentData.estimatedArrival}
                stops={shipmentData.stops}
                events={shipmentData.events}
              />
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">Documents associés</h3>
                  <Button className="gap-2" onClick={() => {
                    toast({
                      title: "Document ajouté",
                      description: "Un nouveau document a été ajouté à l'expédition.",
                    });
                  }}>
                    <Plus className="h-4 w-4" />
                    Ajouter un document
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {shipmentData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">Mis à jour le: {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={doc.status === "Validé" ? "success" : "warning"}>
                          {doc.status}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => {
                          toast({
                            title: "Téléchargement du document",
                            description: `Le document "${doc.name}" est en cours de téléchargement.`,
                          });
                        }}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-4">Ajouter un nouveau document</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Type de document</label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Sélectionner un type</option>
                        <option value="bill-of-lading">Bill of Lading</option>
                        <option value="commercial-invoice">Facture commerciale</option>
                        <option value="packing-list">Liste de colisage</option>
                        <option value="origin-certificate">Certificat d'origine</option>
                        <option value="customs-declaration">Déclaration douanière</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Document</label>
                      <Input type="file" />
                    </div>
                    <div className="flex items-end">
                      <Button className="gap-2" onClick={() => {
                        toast({
                          title: "Document téléchargé",
                          description: "Le document a été téléchargé avec succès.",
                        });
                      }}>
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contacts">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">Contacts associés</h3>
                  <Button className="gap-2" onClick={() => {
                    toast({
                      title: "Ajout de contact",
                      description: "Veuillez compléter les informations du nouveau contact.",
                    });
                  }}>
                    <Plus className="h-4 w-4" />
                    Ajouter un contact
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {shipmentData.contacts.map((contact, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <UserCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.role} - {contact.company}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => {
                              toast({
                                title: "Édition du contact",
                                description: "Vous pouvez maintenant modifier les informations du contact.",
                              });
                            }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{contact.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{contact.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="comments">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="font-medium mb-4">Commentaires</h3>
                
                <div className="space-y-4 mb-6">
                  {shipmentData.comments.map((comment, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{comment.user}</p>
                            <p className="text-sm text-muted-foreground">{comment.date}</p>
                          </div>
                          <p className="mt-2">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Ajouter un commentaire</h3>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Saisissez votre commentaire..." 
                      className="min-h-[100px]"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button className="gap-2" onClick={handleAddComment} disabled={!comment.trim()}>
                        <Send className="h-4 w-4" />
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;
