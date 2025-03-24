// Vous pouvez importer DocumentManager ici pour l'utiliser dans le composant
import DocumentManager from './DocumentManager';

// La partie ci-dessous fixe le problème de type
// Remplacez la définition du type ShipmentType
type ShipmentType = "maritime" | "aérien" | "routier" | "ferroviaire";

import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, Truck, Ship, PlaneTakeoff, Train, Package, FileText, User, Phone, Mail, Building, Download, MessageSquare, Plus, AlertTriangle, Edit, Trash, CheckCircle, Upload, Copy, MoreHorizontal, Maximize, Minimize, PaperclipIcon, ThumbsUp, ThumbsDown, Filter, RefreshCw, SortDesc, Eye, CircleAlert, Users } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Nouvelle interface pour les notes
interface Note {
  id: string;
  text: string;
  author: string;
  date: string;
  isPrivate: boolean;
  attachments?: string[];
}

// Nouvelle interface pour les problèmes
interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'inProgress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  author: string;
  date: string;
  assignee?: string;
  tags?: string[];
}

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipmentId, onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddStopDialog, setShowAddStopDialog] = useState(false);
  const [newStop, setNewStop] = useState({ location: '', date: '', status: 'upcoming' });
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteIsPrivate, setNoteIsPrivate] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: '', description: '', priority: 'medium' as Issue['priority'] });
  const [notesFilter, setNotesFilter] = useState('all');
  const [issueStatusFilter, setIssueStatusFilter] = useState('all');
  const [issueSort, setIssueSort] = useState('dateDesc');

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

  // Modification des événements pour supprimer le champ type
  const [trackerEvents, setTrackerEvents] = useState([
    {
      date: "05/06/2023",
      description: "Passage du Canal de Suez en cours"
    },
    {
      date: "29/05/2023",
      description: "Transbordement effectué à Singapour"
    },
    {
      date: "22/05/2023",
      description: "Départ du port de Shanghai"
    }
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, name: "Connaissement maritime", uploaded: true, date: "22/05/2023", mandatory: true },
    { id: 2, name: "Facture commerciale", uploaded: true, date: "22/05/2023", mandatory: true },
    { id: 3, name: "Liste de colisage", uploaded: true, date: "22/05/2023", mandatory: true },
    { id: 4, name: "Certificat d'origine", uploaded: false, date: "", mandatory: false }
  ]);

  // Données factices pour les notes
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      text: 'Le client a été informé du retard de 2 jours dû aux contrôles douaniers supplémentaires. Il comprend la situation.',
      author: 'Marie Martin',
      date: '24/05/2023 14:32',
      isPrivate: false,
    },
    {
      id: '2',
      text: 'Expedition prise en charge par le transporteur maritime Ocean Line Express. Départ confirmé pour aujourd\'hui à 14h00.',
      author: 'Jean Dupont',
      date: '22/05/2023 09:15',
      isPrivate: false,
    },
    {
      id: '3',
      text: 'Note interne: Le client est VIP, assurons-nous de lui donner la priorité lors de toute communication.',
      author: 'Sophie Bernard',
      date: '20/05/2023 11:20',
      isPrivate: true,
    }
  ]);

  // Données factices pour les problèmes
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      title: 'Retard de livraison',
      description: 'Contrôles douaniers supplémentaires au port de Shanghai. Retard estimé de 2 jours.',
      status: 'open',
      priority: 'medium',
      author: 'Marie Martin',
      date: '24/05/2023',
      assignee: 'Pierre Durand',
      tags: ['douane', 'retard'],
    },
    {
      id: '2',
      title: 'Documents manquants',
      description: 'Le certificat d\'origine n\'a pas été fourni par le client, ce qui pourrait retarder le dédouanement.',
      status: 'resolved',
      priority: 'high',
      author: 'Jean Dupont',
      date: '23/05/2023',
      assignee: 'Marie Martin',
      tags: ['document', 'client'],
    }
  ]);

  const handleDownloadDocument = (docType: string) => {
    toast({
      title: `Téléchargement du document`,
      description: `Le ${docType} est en cours de téléchargement.`,
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.toLocaleDateString('fr-FR')} ${currentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      
      const note: Note = {
        id: `note-${Date.now()}`,
        text: newNote,
        author: 'Utilisateur actuel',
        date: formattedDate,
        isPrivate: noteIsPrivate,
      };
      
      setNotes([note, ...notes]);
      setNewNote('');
      setNoteIsPrivate(false);
      
      toast({
        title: "Note ajoutée",
        description: "Votre note a été ajoutée à l'expédition."
      });
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le texte de la note",
        variant: "destructive"
      });
    }
  };

  const handleAddIssue = () => {
    if (newIssue.title.trim() && newIssue.description.trim()) {
      const currentDate = new Date().toLocaleDateString('fr-FR');
      
      const issue: Issue = {
        id: `issue-${Date.now()}`,
        title: newIssue.title,
        description: newIssue.description,
        status: 'open',
        priority: newIssue.priority,
        author: 'Utilisateur actuel',
        date: currentDate,
      };
      
      setIssues([issue, ...issues]);
      setNewIssue({ title: '', description: '', priority: 'medium' });
      
      toast({
        title: "Problème signalé",
        description: "Le problème a été signalé et assigné à l'équipe responsable."
      });
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
    }
  };

  const handleUpdateIssueStatus = (issueId: string, status: Issue['status']) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, status } : issue
    ));
    
    const statusText = status === 'inProgress' ? 'en cours de traitement' : 
                       status === 'resolved' ? 'résolu' : 'ouvert';
    
    toast({
      title: "Statut mis à jour",
      description: `Le problème est maintenant ${statusText}.`
    });
  };

  const getIssueStatusBadge = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-red-100 text-red-700">Ouvert</Badge>;
      case 'inProgress':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700">En cours</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-700">Résolu</Badge>;
    }
  };

  const getIssuePriorityBadge = (priority: Issue['priority']) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Faible</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700">Moyen</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-700">Élevé</Badge>;
      case 'urgent':
        return <Badge variant="outline" className="bg-red-100 text-red-700">Urgent</Badge>;
    }
  };

  const filteredNotes = notes.filter(note => {
    if (notesFilter === 'all') return true;
    if (notesFilter === 'public') return !note.isPrivate;
    if (notesFilter === 'private') return note.isPrivate;
    return true;
  });

  const filteredIssues = issues
    .filter(issue => {
      if (issueStatusFilter === 'all') return true;
      return issue.status === issueStatusFilter;
    })
    .sort((a, b) => {
      if (issueSort === 'dateDesc') {
        return new Date(b.date.split('/').reverse().join('-')).getTime() - 
               new Date(a.date.split('/').reverse().join('-')).getTime();
      } else if (issueSort === 'dateAsc') {
        return new Date(a.date.split('/').reverse().join('-')).getTime() - 
               new Date(b.date.split('/').reverse().join('-')).getTime();
      } else if (issueSort === 'priorityDesc') {
        const priorityValues = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return priorityValues[b.priority] - priorityValues[a.priority];
      }
      return 0;
    });

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-background rounded-lg shadow-lg ${isFullscreen ? 'w-full h-full max-w-none max-h-none rounded-none' : 'w-full max-w-5xl max-h-[90vh]'} overflow-y-auto transition-all duration-300`}>
        
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getShipmentIcon(shipment.type)}
            <h2 className="text-xl font-bold">{shipment.id}</h2>
            {getStatusBadge(shipment.status)}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Notes de suivi
                    </CardTitle>
                    <Select value={notesFilter} onValueChange={setNotesFilter}>
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue placeholder="Filtrer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les notes</SelectItem>
                        <SelectItem value="public">Notes publiques</SelectItem>
                        <SelectItem value="private">Notes privées</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <CardDescription>Ajoutez des notes internes ou partagées sur cette expédition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Textarea 
                        placeholder="Ajoutez une note sur cette expédition..." 
                        className="min-h-24 resize-none"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="privateNote" 
                              className="rounded text-primary border-gray-300 focus:ring-primary" 
                              checked={noteIsPrivate}
                              onChange={() => setNoteIsPrivate(!noteIsPrivate)}
                            />
                            <label htmlFor="privateNote" className="text-sm text-muted-foreground">
                              Note privée (visible uniquement par l'équipe)
                            </label>
                          </div>
                          <Button variant="outline" size="sm" className="gap-1 h-8">
                            <PaperclipIcon className="h-3.5 w-3.5" />
                            Joindre
                          </Button>
                        </div>
                        <Button 
                          className="gap-1" 
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          size
