import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ClientForm from '@/components/clients/ClientForm';
import ClientsList from '@/components/clients/ClientsList';
import ClientDetail from '@/components/clients/ClientDetail';

const Clients = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { toast } = useToast();

  // Exemple de données clients
  const clients = [
    {
      id: "CL-001",
      name: "Tech Supplies Inc",
      contactName: "John Smith",
      email: "john@techsupplies.com",
      phone: "+33 1 23 45 67 89",
      address: "123 Tech Blvd, Paris, FR",
      type: "enterprise",
      tags: ["VIP", "International"],
      status: "active",
      lastActivity: "22/05/2023",
      quotesCount: 8,
      shipmentsCount: 5,
      notes: "Client prioritaire, tarifs négociés",
      logo: "TS"
    },
    {
      id: "CL-002",
      name: "Pharma Solutions",
      contactName: "Marie Dupont",
      email: "marie@pharmasolutions.com",
      phone: "+33 1 98 76 54 32",
      address: "45 Avenue Santé, Lyon, FR",
      type: "enterprise",
      tags: ["Healthcare"],
      status: "active",
      lastActivity: "18/05/2023",
      quotesCount: 4,
      shipmentsCount: 2,
      notes: "Expéditions sensibles, nécessite une manipulation spéciale",
      logo: "PS"
    },
    {
      id: "CL-003",
      name: "Global Imports Ltd",
      contactName: "Thomas Leroy",
      email: "thomas@globalimports.com",
      phone: "+33 6 12 34 56 78",
      address: "78 Rue Commerce, Marseille, FR",
      type: "enterprise",
      tags: ["Import", "Customs"],
      status: "inactive",
      lastActivity: "10/04/2023",
      quotesCount: 3,
      shipmentsCount: 1,
      notes: "",
      logo: "GI"
    },
    {
      id: "CL-004",
      name: "Eurotech GmbH",
      contactName: "Hans Mueller",
      email: "hans@eurotech.de",
      phone: "+49 30 1234567",
      address: "15 Technikstraße, Berlin, DE",
      type: "enterprise",
      tags: ["Tech", "EU"],
      status: "active",
      lastActivity: "20/05/2023",
      quotesCount: 6,
      shipmentsCount: 4,
      notes: "Client allemand, documentation spécifique requise",
      logo: "ET"
    },
    {
      id: "CL-005",
      name: "Fresh Foods SAS",
      contactName: "Sophie Martin",
      email: "sophie@freshfoods.fr",
      phone: "+33 4 56 78 90 12",
      address: "32 Chemin des Récoltes, Nantes, FR",
      type: "sme",
      tags: ["Food", "Perishable"],
      status: "active",
      lastActivity: "15/05/2023",
      quotesCount: 2,
      shipmentsCount: 2,
      notes: "Marchandises périssables, transport réfrigéré requis",
      logo: "FF"
    },
  ];

  // Get all unique tags from clients
  const allTags = Array.from(new Set(clients.flatMap(client => client.tags)));

  // Filtrer les clients en fonction de la recherche et des filtres
  const filteredClients = clients.filter(client => {
    // Filtre par onglet
    if (activeTab === 'active' && client.status !== 'active') {
      return false;
    }
    if (activeTab === 'inactive' && client.status !== 'inactive') {
      return false;
    }
    
    // Filtre par recherche texte
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        client.id.toLowerCase().includes(searchLower) ||
        client.name.toLowerCase().includes(searchLower) ||
        client.contactName.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.address.toLowerCase().includes(searchLower) ||
        client.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
      if (!matchesSearch) return false;
    }
    
    // Filtre par tags sélectionnés
    if (selectedTags.length > 0) {
      const hasSelectedTag = client.tags.some(tag => selectedTags.includes(tag));
      if (!hasSelectedTag) return false;
    }
    
    // Filtres avancés
    if (activeFilters) {
      // Appliquer d'autres filtres si nécessaire
      // ...
    }
    
    return true;
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewClient = () => {
    setEditingClientId(undefined);
    setShowClientForm(true);
  };

  const handleEditClient = (clientId: string) => {
    setEditingClientId(clientId);
    setShowClientForm(true);
  };

  const handleDeleteClient = (clientId: string) => {
    toast({
      title: "Client supprimé",
      description: `Le client ${clientId} a été supprimé avec succès.`,
    });
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      // If tag is already selected, remove it
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      // Otherwise, add it
      return [...prev, tag];
    });
  };

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const clearAllFilters = () => {
    setActiveFilters(null);
    setSearchTerm('');
    setSelectedTags([]);
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés.",
    });
  };

  // Mettre à jour le titre de la page
  useEffect(() => {
    document.title = "Gestion des Clients";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion des Clients</h1>
              <p className="text-muted-foreground">Recherchez, créez et gérez vos clients</p>
            </div>
            <div>
              <Button 
                className="gap-2" 
                onClick={handleNewClient}
                variant="default"
              >
                <PlusCircle className="h-4 w-4" />
                Nouveau Client
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Input 
                placeholder="Rechercher par nom, contact, email, tag..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="flex gap-2">
              <Button 
                variant={showAdvancedFilters ? "default" : "outline"} 
                className="gap-2"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Tags actifs */}
          {selectedTags.length > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-medium">Tags actifs:</span>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="default" 
                    className="cursor-pointer gap-1"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {selectedTags.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedTags([])}
                  >
                    Effacer tous
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Advanced filters panel */}
          {showAdvancedFilters && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Tous</Badge>
                      <Badge variant="default" className="cursor-pointer">Actif</Badge>
                      <Badge variant="secondary" className="cursor-pointer">Inactif</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type de client</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Tous</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-blue-500/10 text-blue-500">Entreprise</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-green-500/10 text-green-500">PME</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Dernière activité</label>
                    <div className="flex gap-2">
                      <Input type="date" className="w-full" placeholder="Date début" />
                      <Input type="date" className="w-full" placeholder="Date fin" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre min. de devis</label>
                    <Input placeholder="Minimum" type="number" min="0" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre max. de devis</label>
                    <Input placeholder="Maximum" type="number" min="0" />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="mr-2" onClick={clearAllFilters}>Réinitialiser</Button>
                  <Button onClick={() => {
                    // Logique simplifiée pour appliquer les filtres
                    setShowAdvancedFilters(false);
                  }}>Appliquer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous les clients</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="inactive">Inactifs</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <ClientsList 
                clients={filteredClients} 
                onEdit={handleEditClient} 
                onDelete={handleDeleteClient}
                onTagClick={handleTagClick}
                onClientClick={handleClientClick}
              />
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              <ClientsList 
                clients={filteredClients} 
                onEdit={handleEditClient} 
                onDelete={handleDeleteClient}
                onTagClick={handleTagClick}
                onClientClick={handleClientClick}
              />
            </TabsContent>
            
            <TabsContent value="inactive" className="space-y-4">
              <ClientsList 
                clients={filteredClients} 
                onEdit={handleEditClient} 
                onDelete={handleDeleteClient}
                onTagClick={handleTagClick}
                onClientClick={handleClientClick}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showClientForm && (
        <ClientForm 
          clientId={editingClientId} 
          onClose={() => setShowClientForm(false)} 
        />
      )}

      {selectedClientId && (
        <ClientDetail
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
        />
      )}
    </div>
  );
};

export default Clients;
