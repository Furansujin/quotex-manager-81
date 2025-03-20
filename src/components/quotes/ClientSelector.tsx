
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, User, Building, Mail, Phone, MapPin, CalendarClock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
}

interface ClientSelectorProps {
  onClose: () => void;
  onSelectClient: (clientId: string, clientName: string) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ onClose, onSelectClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    type: 'business'
  });
  const { toast } = useToast();

  // Liste de clients fictive
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
      createdAt: '15/01/2023' 
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
      createdAt: '03/02/2023' 
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
      createdAt: '22/02/2023' 
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
      createdAt: '10/03/2023' 
    }
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = () => {
    // Vérifier si les champs requis sont remplis
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Simuler la création d'un client
    toast({
      title: "Client créé",
      description: `Le client ${newClient.name} a été créé avec succès.`,
    });

    // Retour à la liste des clients
    setShowNewClientForm(false);
    
    // Réinitialiser le formulaire
    setNewClient({
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      type: 'business'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {showNewClientForm ? "Ajouter un nouveau client" : "Sélectionner un client"}
          </DialogTitle>
        </DialogHeader>

        {showNewClientForm ? (
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de l'entreprise *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="name"
                    value={newClient.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du contact</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="contact"
                    value={newClient.contact}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="Nom du contact"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="email"
                    value={newClient.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="email@exemple.com"
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="phone"
                    value={newClient.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="address"
                  value={newClient.address}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="123 Rue Exemple, 75000 Paris"
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setShowNewClientForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateClient}>
                Créer le client
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  placeholder="Rechercher par nom, contact ou ID..."
                />
              </div>
              <Button className="gap-2" onClick={() => setShowNewClientForm(true)}>
                <UserPlus className="h-4 w-4" />
                Nouveau Client
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
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
                        <Button variant="link" onClick={() => setShowNewClientForm(true)}>
                          créez un nouveau client
                        </Button>
                      </div>
                    ) : (
                      filteredClients.map((client) => (
                        <div 
                          key={client.id}
                          className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                          onClick={() => onSelectClient(client.id, client.name)}
                        >
                          <div>
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
                          </div>
                          
                          <div className="flex items-center gap-2 md:flex-col md:items-end text-sm">
                            {client.lastQuote && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <CalendarClock className="h-3 w-3 mr-1" />
                                Dernier devis: {client.lastQuote}
                              </div>
                            )}
                            <div className="flex items-center text-xs text-muted-foreground">
                              Créé le: {client.createdAt}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Contenu similaire pour les autres onglets */}
              <TabsContent value="active">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {filteredClients.filter(c => c.status === 'active').map((client) => (
                      <div 
                        key={client.id}
                        className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                        onClick={() => onSelectClient(client.id, client.name)}
                      >
                        <div>
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
                        </div>
                        
                        <div className="flex items-center gap-2 md:flex-col md:items-end text-sm">
                          {client.lastQuote && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <CalendarClock className="h-3 w-3 mr-1" />
                              Dernier devis: {client.lastQuote}
                            </div>
                          )}
                          <div className="flex items-center text-xs text-muted-foreground">
                            Créé le: {client.createdAt}
                          </div>
                        </div>
                      </div>
                    ))}
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
