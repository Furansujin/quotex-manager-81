
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  UserPlus, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  CalendarClock,
  Tag,
  FileText,
  Clock,
  Euro
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Modèle de client
interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  status: string;
  lastQuote?: string;
  createdAt: string;
  tags?: string[];
  quoteCount?: number;
  preferredShipping?: string;
}

// Formulaire de client validé avec Zod
const clientFormSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  contact: z.string().optional(),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  type: z.string().default("business"),
  tags: z.string().optional()
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientSelectorProps {
  onClose: () => void;
  onSelectClient: (clientId: string, clientName: string) => void;
  initialSearchTerm?: string;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ onClose, onSelectClient, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const [isViewingClientDetails, setIsViewingClientDetails] = useState(false);

  // Formulaire pour la création/édition de client
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      type: 'business',
      tags: ''
    }
  });

  // Liste de clients fictive avec données enrichies
  const clients: Client[] = [
    { 
      id: 'CL-001', 
      name: 'Tech Supplies Inc', 
      contact: 'John Doe', 
      email: 'john.doe@techsupplies.com', 
      phone: '+33 1 23 45 67 89', 
      address: '123 Tech Avenue, Paris', 
      type: 'business',
      status: 'active',
      lastQuote: '22/05/2023',
      createdAt: '15/01/2023',
      tags: ['VIP', 'Tech', 'International'],
      quoteCount: 12,
      preferredShipping: 'Maritime'
    },
    { 
      id: 'CL-002', 
      name: 'Pharma Solutions', 
      contact: 'Jane Smith', 
      email: 'jane.smith@pharmasolutions.com', 
      phone: '+33 9 87 65 43 21', 
      address: '456 Health Street, Lyon', 
      type: 'business',
      status: 'active',
      lastQuote: '21/05/2023',
      createdAt: '03/02/2023',
      tags: ['Pharmacie', 'Prioritaire'],
      quoteCount: 8,
      preferredShipping: 'Aérien'
    },
    { 
      id: 'CL-003', 
      name: 'Global Imports Ltd', 
      contact: 'Robert Johnson', 
      email: 'robert@globalimports.com', 
      phone: '+33 6 11 22 33 44', 
      address: '789 Import Road, Marseille', 
      type: 'business',
      status: 'active',
      lastQuote: '20/05/2023',
      createdAt: '22/02/2023',
      tags: ['Import', 'Volumineux'],
      quoteCount: 5,
      preferredShipping: 'Maritime'
    },
    { 
      id: 'CL-004', 
      name: 'Eurotech GmbH', 
      contact: 'Anna Müller', 
      email: 'anna.muller@eurotech.de', 
      phone: '+49 30 1234567', 
      address: '10 Tech Straße, Berlin', 
      type: 'business',
      status: 'inactive',
      lastQuote: '19/05/2023',
      createdAt: '10/03/2023',
      tags: ['Europe', 'Tech'],
      quoteCount: 3,
      preferredShipping: 'Routier'
    }
  ];

  // Filtrer les clients en fonction du terme de recherche et de l'onglet actif
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.tags && client.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Filtrer par statut si l'onglet n'est pas "all"
    if (activeTab !== 'all') {
      return matchesSearch && client.status === activeTab;
    }
    
    // Filtre spécial pour l'onglet "recent"
    if (activeTab === 'recent') {
      // Simuler les clients récents (derniers 30 jours)
      return matchesSearch && new Date(client.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
    }
    
    return matchesSearch;
  });

  // Récupérer le client sélectionné
  const selectedClient = clients.find(client => client.id === selectedClientId);

  // Fonction pour éditer un client existant
  const handleEditClient = (client: Client) => {
    form.reset({
      name: client.name,
      contact: client.contact,
      email: client.email,
      phone: client.phone,
      address: client.address,
      type: client.type,
      tags: client.tags?.join(', ')
    });
    
    setSelectedClientId(client.id);
    setShowNewClientForm(true);
  };

  // Fonction pour créer un nouveau client
  const handleCreateClient = (data: ClientFormValues) => {
    // Simuler la création ou mise à jour du client
    const isEditing = !!selectedClientId;
    
    toast({
      title: isEditing ? "Client mis à jour" : "Client créé",
      description: `Le client ${data.name} a été ${isEditing ? 'mis à jour' : 'créé'} avec succès.`,
    });

    // Retour à la liste des clients
    setShowNewClientForm(false);
    setSelectedClientId(null);
    
    // Réinitialiser le formulaire
    form.reset({
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      type: 'business',
      tags: ''
    });
  };

  useEffect(() => {
    // Auto-focus sur le champ de recherche à l'ouverture
    const timeout = setTimeout(() => {
      const searchInput = document.getElementById('client-search');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [showNewClientForm]);

  // Composant pour afficher les détails du client
  const ClientDetails = () => {
    if (!selectedClient) return null;
    
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">{selectedClient.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {selectedClient.id}</p>
          </div>
          <Badge variant={selectedClient.status === 'active' ? 'success' : 'outline'}>
            {selectedClient.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedClient.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="gap-1">
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Informations de contact</h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient.address}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Activité</h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient.quoteCount} devis au total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Dernier devis: {selectedClient.lastQuote}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span>Client depuis: {selectedClient.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <span>Préférence d'expédition: {selectedClient.preferredShipping}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 mt-6 border-t">
          <Button variant="outline" onClick={() => setIsViewingClientDetails(false)}>
            Retour à la liste
          </Button>
          <Button variant="outline" onClick={() => handleEditClient(selectedClient)}>
            Modifier
          </Button>
          <Button onClick={() => onSelectClient(selectedClient.id, selectedClient.name)}>
            Sélectionner pour le devis
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {showNewClientForm 
              ? (selectedClientId ? "Modifier le client" : "Ajouter un nouveau client") 
              : (isViewingClientDetails ? "Détails du client" : "Sélectionner un client")}
          </DialogTitle>
          <DialogDescription>
            {showNewClientForm 
              ? "Remplissez les informations du client ci-dessous." 
              : (isViewingClientDetails 
                ? "Consultez et modifiez les informations du client." 
                : "Recherchez un client existant ou créez-en un nouveau.")}
          </DialogDescription>
        </DialogHeader>

        {showNewClientForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateClient)} className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Nom de l'entreprise *</FormLabel>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            {...field}
                            className="pl-10"
                            placeholder="Nom de l'entreprise"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Nom du contact</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            {...field}
                            className="pl-10"
                            placeholder="Nom du contact"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Email *</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            {...field}
                            className="pl-10"
                            placeholder="email@exemple.com"
                            type="email"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Téléphone</FormLabel>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            {...field}
                            className="pl-10"
                            placeholder="+33 1 23 45 67 89"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Adresse</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          className="pl-10"
                          placeholder="123 Rue Exemple, 75000 Paris"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Type de client</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="business">Entreprise</SelectItem>
                          <SelectItem value="individual">Particulier</SelectItem>
                          <SelectItem value="government">Gouvernement</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Tags (séparés par des virgules)</FormLabel>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            {...field}
                            className="pl-10"
                            placeholder="VIP, International, Prioritaire"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => {
                  setShowNewClientForm(false);
                  setSelectedClientId(null);
                  form.reset();
                }}>
                  Annuler
                </Button>
                <Button type="submit">
                  {selectedClientId ? 'Mettre à jour' : 'Créer le client'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : isViewingClientDetails ? (
          <ClientDetails />
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="client-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  placeholder="Rechercher par nom, contact, ID ou tag..."
                  autoComplete="off"
                />
              </div>
              <Button className="gap-2" onClick={() => {
                setShowNewClientForm(true);
                setSelectedClientId(null);
              }}>
                <UserPlus className="h-4 w-4" />
                Nouveau Client
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="active">Actifs</TabsTrigger>
                <TabsTrigger value="inactive">Inactifs</TabsTrigger>
                <TabsTrigger value="recent">Récents</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="h-full">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {filteredClients.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Aucun client trouvé. Essayez de modifier votre recherche ou 
                        <Button variant="link" onClick={() => {
                          setShowNewClientForm(true);
                          setSelectedClientId(null);
                        }}>
                          créez un nouveau client
                        </Button>
                      </div>
                    ) : (
                      filteredClients.map((client) => (
                        <div 
                          key={client.id}
                          className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div onClick={() => {
                            setSelectedClientId(client.id);
                            setIsViewingClientDetails(true);
                          }}>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{client.name}</h3>
                              <Badge variant={client.status === 'active' ? 'success' : 'outline'}>
                                {client.status === 'active' ? 'Actif' : 'Inactif'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {client.id}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <User className="h-3 w-3 mr-1" />
                                {client.contact}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1" />
                                {client.email}
                              </div>
                            </div>
                            {client.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {client.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex md:flex-col gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => onSelectClient(client.id, client.name)}
                              className="w-full"
                            >
                              Sélectionner
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClientId(client.id);
                                setIsViewingClientDetails(true);
                              }}
                              className="w-full"
                            >
                              Détails
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Contenu similaire pour les autres onglets - utilise les mêmes filtres */}
              <TabsContent value="active">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {filteredClients.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Aucun client actif trouvé.
                      </div>
                    ) : (
                      filteredClients.map((client) => (
                        // Structure identique au TabsContent "all"
                        <div 
                          key={client.id}
                          className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div onClick={() => {
                            setSelectedClientId(client.id);
                            setIsViewingClientDetails(true);
                          }}>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{client.name}</h3>
                              <Badge variant="success">Actif</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {client.id}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <User className="h-3 w-3 mr-1" />
                                {client.contact}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1" />
                                {client.email}
                              </div>
                            </div>
                            {client.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {client.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex md:flex-col gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => onSelectClient(client.id, client.name)}
                              className="w-full"
                            >
                              Sélectionner
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClientId(client.id);
                                setIsViewingClientDetails(true);
                              }}
                              className="w-full"
                            >
                              Détails
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Les autres TabsContent fonctionnent de la même manière */}
              <TabsContent value="inactive">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {filteredClients.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Aucun client inactif trouvé.
                      </div>
                    ) : (
                      filteredClients.map((client) => (
                        // Même structure que les autres onglets
                        <div 
                          key={client.id}
                          className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div onClick={() => {
                            setSelectedClientId(client.id);
                            setIsViewingClientDetails(true);
                          }}>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{client.name}</h3>
                              <Badge variant="outline">Inactif</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {client.id}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <User className="h-3 w-3 mr-1" />
                                {client.contact}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1" />
                                {client.email}
                              </div>
                            </div>
                            {client.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {client.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex md:flex-col gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => onSelectClient(client.id, client.name)}
                              className="w-full"
                            >
                              Sélectionner
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClientId(client.id);
                                setIsViewingClientDetails(true);
                              }}
                              className="w-full"
                            >
                              Détails
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="recent">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {filteredClients.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Aucun client récent trouvé.
                      </div>
                    ) : (
                      filteredClients.map((client) => (
                        // Même structure que les autres onglets
                        <div 
                          key={client.id}
                          className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div onClick={() => {
                            setSelectedClientId(client.id);
                            setIsViewingClientDetails(true);
                          }}>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{client.name}</h3>
                              <Badge variant={client.status === 'active' ? 'success' : 'outline'}>
                                {client.status === 'active' ? 'Actif' : 'Inactif'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {client.id}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <User className="h-3 w-3 mr-1" />
                                {client.contact}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1" />
                                {client.email}
                              </div>
                            </div>
                            {client.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {client.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex md:flex-col gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => onSelectClient(client.id, client.name)}
                              className="w-full"
                            >
                              Sélectionner
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClientId(client.id);
                                setIsViewingClientDetails(true);
                              }}
                              className="w-full"
                            >
                              Détails
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelector;
