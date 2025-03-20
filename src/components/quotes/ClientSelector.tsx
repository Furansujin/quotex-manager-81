import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Building2, User, Calendar, Tag, Users, X, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mocked clients data
const mockClients = [
  {
    id: 'CL-001',
    name: 'Tech Supplies Inc',
    type: 'Entreprise',
    industry: 'Technologie',
    contact: 'John Smith',
    email: 'john@techsupplies.com',
    lastActivity: '22/05/2023',
    quotesCount: 12,
    tags: ['VIP', 'International']
  },
  {
    id: 'CL-002',
    name: 'Pharma Solutions',
    type: 'Entreprise',
    industry: 'Pharmaceutique',
    contact: 'Marie Dupont',
    email: 'marie@pharmasol.com',
    lastActivity: '21/05/2023',
    quotesCount: 8,
    tags: ['Prioritaire']
  },
  {
    id: 'CL-003',
    name: 'Global Imports Ltd',
    type: 'Entreprise',
    industry: 'Import/Export',
    contact: 'Carlos Rodriguez',
    email: 'carlos@globalimports.com',
    lastActivity: '20/05/2023',
    quotesCount: 15,
    tags: ['International']
  },
  {
    id: 'CL-004',
    name: 'Eurotech GmbH',
    type: 'Entreprise',
    industry: 'Électronique',
    contact: 'Hans Meyer',
    email: 'hans@eurotech.de',
    lastActivity: '19/05/2023',
    quotesCount: 5,
    tags: ['International', 'Premium']
  },
  {
    id: 'CL-005',
    name: 'Jean Martin',
    type: 'Particulier',
    industry: '',
    contact: 'Jean Martin',
    email: 'jean.martin@email.com',
    lastActivity: '18/05/2023',
    quotesCount: 2,
    tags: ['Nouveau']
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
  const [activeTab, setActiveTab] = useState<string>("all");

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
    
    // Filtre par type
    if (activeTab === "companies" && client.type !== "Entreprise") return false;
    if (activeTab === "individuals" && client.type !== "Particulier") return false;
    
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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
            onClick={() => {/* Functionality to add later */}}
          >
            <UserPlus className="h-4 w-4" />
            Nouveau client
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">Tous les clients</TabsTrigger>
              <TabsTrigger value="companies">Entreprises</TabsTrigger>
              <TabsTrigger value="individuals">Particuliers</TabsTrigger>
            </TabsList>
            
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
          
          <TabsContent value="all" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                {filteredClients.map((client) => (
                  <Card 
                    key={client.id} 
                    className={cn(
                      "cursor-pointer hover:border-primary transition-colors",
                      selectedClientId === client.id ? "border-primary bg-primary/5" : ""
                    )}
                    onClick={() => handleSelectClient(client.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white",
                          client.type === "Entreprise" ? "bg-blue-500" : "bg-emerald-500"
                        )}>
                          {client.type === "Entreprise" ? 
                            <Building2 className="h-5 w-5" /> : 
                            <User className="h-5 w-5" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{client.name}</h3>
                            <span className="text-xs text-muted-foreground">{client.id}</span>
                          </div>
                          
                          {client.type === "Entreprise" && (
                            <p className="text-sm text-muted-foreground">{client.industry}</p>
                          )}
                          
                          <div className="mt-2 flex flex-col gap-1">
                            <div className="flex items-center text-sm">
                              <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{client.contact}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>Dernière activité: {client.lastActivity}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{client.quotesCount} devis</span>
                            </div>
                          </div>
                          
                          {client.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {client.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredClients.length === 0 && (
                  <div className="col-span-3 py-8 text-center">
                    <Users className="mx-auto h-8 w-8 text-muted-foreground/60" />
                    <h3 className="mt-2 text-lg font-medium">Aucun client trouvé</h3>
                    <p className="text-muted-foreground">
                      Essayez d'ajuster votre recherche ou de créer un nouveau client
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="companies" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                {filteredClients.map((client) => (
                  <Card 
                    key={client.id} 
                    className={cn(
                      "cursor-pointer hover:border-primary transition-colors",
                      selectedClientId === client.id ? "border-primary bg-primary/5" : ""
                    )}
                    onClick={() => handleSelectClient(client.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{client.name}</h3>
                            <span className="text-xs text-muted-foreground">{client.id}</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{client.industry}</p>
                          
                          <div className="mt-2 flex flex-col gap-1">
                            <div className="flex items-center text-sm">
                              <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{client.contact}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>Dernière activité: {client.lastActivity}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{client.quotesCount} devis</span>
                            </div>
                          </div>
                          
                          {client.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {client.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredClients.length === 0 && (
                  <div className="col-span-3 py-8 text-center">
                    <Building2 className="mx-auto h-8 w-8 text-muted-foreground/60" />
                    <h3 className="mt-2 text-lg font-medium">Aucune entreprise trouvée</h3>
                    <p className="text-muted-foreground">
                      Essayez d'ajuster votre recherche ou de créer une nouvelle entreprise
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="individuals" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                {filteredClients.map((client) => (
                  <Card 
                    key={client.id} 
                    className={cn(
                      "cursor-pointer hover:border-primary transition-colors",
                      selectedClientId === client.id ? "border-primary bg-primary/5" : ""
                    )}
                    onClick={() => handleSelectClient(client.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{client.name}</h3>
                            <span className="text-xs text-muted-foreground">{client.id}</span>
                          </div>
                          
                          <div className="mt-2 flex flex-col gap-1">
                            <div className="flex items-center text-sm">
                              <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{client.contact}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>Dernière activité: {client.lastActivity}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{client.quotesCount} devis</span>
                            </div>
                          </div>
                          
                          {client.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {client.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredClients.length === 0 && (
                  <div className="col-span-3 py-8 text-center">
                    <User className="mx-auto h-8 w-8 text-muted-foreground/60" />
                    <h3 className="mt-2 text-lg font-medium">Aucun particulier trouvé</h3>
                    <p className="text-muted-foreground">
                      Essayez d'ajuster votre recherche ou de créer un nouveau particulier
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelector;
