
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
  UserCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Tag,
  Edit,
  Trash2,
  ChevronDown,
  ArrowUpDown,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import ClientSelector from '@/components/quotes/ClientSelector';
import ClientForm from '@/components/clients/ClientForm';
import ClientsList from '@/components/clients/ClientsList';
import ClientFilters from '@/components/clients/ClientFilters';

const Clients = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any | null>(null);
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

  const clearAllFilters = () => {
    setActiveFilters(null);
    setSearchTerm('');
    
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par nom, contact, email, tag..." 
                className="pl-10"
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
                variant={showAdvancedFilters || activeFilters ? "default" : "outline"} 
                className="gap-2"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4" />
                {activeFilters ? "Filtres actifs" : "Filtres"}
                {activeFilters && <Badge variant="outline" className="ml-1 text-xs">3</Badge>}
              </Button>
              
              {activeFilters && (
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={clearAllFilters}
                >
                  <X className="h-4 w-4" />
                  Effacer
                </Button>
              )}
              
              {showAdvancedFilters && (
                <ClientFilters 
                  show={showAdvancedFilters} 
                  onClose={() => setShowAdvancedFilters(false)}
                  onApplyFilters={(filters) => setActiveFilters(filters)}
                />
              )}
            </div>
          </div>

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
              />
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              <ClientsList 
                clients={filteredClients} 
                onEdit={handleEditClient} 
                onDelete={handleDeleteClient}
              />
            </TabsContent>
            
            <TabsContent value="inactive" className="space-y-4">
              <ClientsList 
                clients={filteredClients} 
                onEdit={handleEditClient} 
                onDelete={handleDeleteClient}
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
    </div>
  );
};

export default Clients;
