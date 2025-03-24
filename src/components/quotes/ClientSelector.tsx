import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  UserPlus, 
  User, 
  X, 
  Building, 
  MoreHorizontal, 
  Phone, 
  Link,
  Mail,
  MapPin
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mocked clients data
const mockClients = [
  {
    id: 'CL-001',
    name: 'Tech Supplies Inc',
    industry: 'Technologie',
    contact: 'John Smith',
    email: 'john@techsupplies.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Tech Avenue, Paris',
    lastActivity: '22/05/2023',
    quotesCount: 12,
    tags: ['VIP', 'International'],
    status: 'active'
  },
  {
    id: 'CL-002',
    name: 'Pharma Solutions',
    industry: 'Pharmaceutique',
    contact: 'Marie Dupont',
    email: 'marie@pharmasol.com',
    phone: '+33 1 23 45 67 90',
    address: '45 Avenue Foch, Lyon',
    lastActivity: '21/05/2023',
    quotesCount: 8,
    tags: ['Prioritaire'],
    status: 'active'
  },
  {
    id: 'CL-003',
    name: 'Global Imports Ltd',
    industry: 'Import/Export',
    contact: 'Carlos Rodriguez',
    email: 'carlos@globalimports.com',
    phone: '+33 1 23 45 67 91',
    address: '78 Rue de Commerce, Marseille',
    lastActivity: '20/05/2023',
    quotesCount: 15,
    tags: ['International'],
    status: 'active'
  },
  {
    id: 'CL-004',
    name: 'Eurotech GmbH',
    industry: 'Électronique',
    contact: 'Hans Meyer',
    email: 'hans@eurotech.de',
    phone: '+33 1 23 45 67 92',
    address: '15 Rue de l\'Innovation, Strasbourg',
    lastActivity: '19/05/2023',
    quotesCount: 5,
    tags: ['International', 'Premium'],
    status: 'active'
  },
  {
    id: 'CL-005',
    name: 'Fresh Foods SAS',
    industry: 'Agroalimentaire',
    contact: 'Jean Martin',
    email: 'jean.martin@freshfoods.fr',
    phone: '+33 1 23 45 67 93',
    address: '42 Avenue des Champs, Bordeaux',
    lastActivity: '18/05/2023',
    quotesCount: 2,
    tags: ['Nouveau'],
    status: 'inactive'
  },
];

interface ClientSelectorProps {
  onClose: () => void;
  onSelectClient: (clientId: string, clientName: string) => void;
  initialSearchTerm?: string;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ 
  onClose, 
  onSelectClient,
  initialSearchTerm = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const { toast } = useToast();
  
  // New client form state
  const [newClient, setNewClient] = useState({
    name: '',
    industry: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Filtrer les clients en fonction de la recherche et des filtres
  const filteredClients = mockClients.filter(client => {
    // Filtre de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        client.name.toLowerCase().includes(searchLower) ||
        client.contact.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.id.toLowerCase().includes(searchLower);
        
      if (!matchesSearch) return false;
    }
    
    // Filtre supplémentaire
    if (selectedFilter === "vip" && !client.tags.includes("VIP") && 
        !client.tags.includes("Premium") && !client.tags.includes("Prioritaire")) return false;
    if (selectedFilter === "international" && !client.tags.includes("International")) return false;
    if (selectedFilter === "new" && !client.tags.includes("Nouveau")) return false;
    
    return true;
  });

  // Sélectionner un client
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = mockClients.find(c => c.id === clientId);
    if (client) {
      onSelectClient(client.id, client.name);
    }
  };

  // Handle tag click
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Set filter based on tag
    if (tag === 'VIP' || tag === 'Premium' || tag === 'Prioritaire') {
      setSelectedFilter('vip');
    } else if (tag === 'International') {
      setSelectedFilter('international');
    } else if (tag === 'Nouveau') {
      setSelectedFilter('new');
    }
  };

  // Handle new client form input changes
  const handleNewClientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle new client creation
  const handleNewClientSubmit = () => {
    // Validation
    if (!newClient.name) {
      toast({
        title: "Champ requis",
        description: "Le nom du client est requis.",
        variant: "destructive"
      });
      return;
    }

    if (!newClient.industry) {
      toast({
        title: "Champ requis",
        description: "Le secteur d'activité est requis.",
        variant: "destructive"
      });
      return;
    }

    if (!newClient.email || !newClient.phone) {
      toast({
        title: "Champs requis",
        description: "L'email et le téléphone sont requis.",
        variant: "destructive"
      });
      return;
    }

    // Generate a mock ID
    const newClientId = `CL-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // In a real application, you would send this to your API
    // For now, we'll just simulate success and return the new client
    toast({
      title: "Client créé",
      description: `${newClient.name} a été ajouté avec succès.`,
    });
    
    // Select the newly created client
    onSelectClient(newClientId, newClient.name);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {!showNewClientForm ? (
          <>
            <DialogHeader>
              <DialogTitle>Sélectionner un client</DialogTitle>
            </DialogHeader>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un client par nom, contact, email..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {searchTerm && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowNewClientForm(true)}
              >
                <UserPlus className="h-4 w-4" />
                Nouveau client
              </Button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Badge 
                  variant={selectedFilter === "all" ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedFilter("all")}
                >
                  Tous
                </Badge>
                <Badge 
                  variant={selectedFilter === "recent" ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedFilter("recent")}
                >
                  Récents
                </Badge>
                <Badge 
                  variant={selectedFilter === "vip" ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedFilter("vip")}
                >
                  VIP/Premium
                </Badge>
                <Badge 
                  variant={selectedFilter === "international" ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedFilter("international")}
                >
                  International
                </Badge>
                <Badge 
                  variant={selectedFilter === "new" ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedFilter("new")}
                >
                  Nouveaux
                </Badge>
              </div>
            </div>
            
            <ScrollArea className="h-[50vh]">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow 
                        key={client.id}
                        className={cn(
                          "hover:bg-muted/50 cursor-pointer",
                          selectedClientId === client.id ? "bg-primary/10" : ""
                        )}
                        onClick={() => handleSelectClient(client.id)}
                      >
                        <TableCell className="font-medium">
                          {client.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{client.contact}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{client.address}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{client.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {client.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs cursor-pointer hover:bg-primary/10 flex items-center gap-1"
                                onClick={(e) => handleTagClick(tag, e)}
                              >
                                <Link className="h-3 w-3" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {client.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredClients.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Building className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="font-medium text-lg mb-1">Aucun client trouvé</h3>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      Aucun client ne correspond à vos critères de recherche ou aucun client n'a été créé.
                    </p>
                    <Button onClick={() => setShowNewClientForm(true)}>Créer un client</Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Nouveau client</DialogTitle>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[70vh] px-1">
              <div className="space-y-6">
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom / Raison sociale *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={newClient.name} 
                        onChange={handleNewClientInputChange}
                        placeholder="Nom du client"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry">Secteur d'activité *</Label>
                      <Select 
                        value={newClient.industry}
                        onValueChange={(value) => {
                          setNewClient(prev => ({ ...prev, industry: value }));
                        }}
                      >
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Sélectionnez un secteur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technologie">Technologie</SelectItem>
                          <SelectItem value="Pharmaceutique">Pharmaceutique</SelectItem>
                          <SelectItem value="Import/Export">Import/Export</SelectItem>
                          <SelectItem value="Automobile">Automobile</SelectItem>
                          <SelectItem value="Énergie">Énergie</SelectItem>
                          <SelectItem value="Agroalimentaire">Agroalimentaire</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact">Personne à contacter *</Label>
                      <Input 
                        id="contact" 
                        name="contact" 
                        value={newClient.contact} 
                        onChange={handleNewClientInputChange}
                        placeholder="Nom et prénom"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <div className="flex">
                          <Mail className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={newClient.email} 
                            onChange={handleNewClientInputChange}
                            placeholder="email@exemple.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <div className="flex">
                          <Phone className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={newClient.phone} 
                            onChange={handleNewClientInputChange}
                            placeholder="+33 1 23 45 67 89"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <div className="flex">
                        <MapPin className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                        <Input 
                          id="address" 
                          name="address" 
                          value={newClient.address} 
                          onChange={handleNewClientInputChange}
                          placeholder="Adresse complète"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea 
                        id="notes" 
                        name="notes" 
                        value={newClient.notes} 
                        onChange={handleNewClientInputChange}
                        placeholder="Informations supplémentaires, préférences, etc."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex justify-between border-t p-4 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowNewClientForm(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleNewClientSubmit}
              >
                Créer le client
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelector;
