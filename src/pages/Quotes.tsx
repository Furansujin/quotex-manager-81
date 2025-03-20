
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  FileText,
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronDown,
  CalendarRange,
  UserCircle,
  ArrowUpDown,
  Euro,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import QuoteEditor from '@/components/quotes/QuoteEditor';
import QuotesList from '@/components/quotes/QuotesList';
import QuoteFilters from '@/components/quotes/QuoteFilters';
import ClientSelector from '@/components/quotes/ClientSelector';
import { useToast } from '@/hooks/use-toast';

const Quotes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuoteEditor, setShowQuoteEditor] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | undefined>(undefined);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewQuote = () => {
    if (selectedClient) {
      setEditingQuoteId(undefined);
      setShowQuoteEditor(true);
    } else {
      setShowClientSelector(true);
    }
  };

  const handleEditQuote = (id: string) => {
    setEditingQuoteId(id);
    setShowQuoteEditor(true);
  };

  const handleDuplicateQuote = (id: string) => {
    toast({
      title: "Devis dupliqué",
      description: `Le devis ${id} a été dupliqué avec succès.`,
    });
  };

  const handleDownloadQuote = (id: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Le devis ${id} est en cours de téléchargement.`,
    });
  };

  const handleClientSelect = (clientId: string, clientName: string) => {
    setSelectedClient(clientId);
    setShowClientSelector(false);
    setShowQuoteEditor(true);
    
    toast({
      title: "Client sélectionné",
      description: `Création d'un devis pour ${clientName}`,
    });
  };

  const quotes = [
    { 
      id: "QT-2023-0142", 
      client: "Tech Supplies Inc", 
      clientId: "CL-001",
      date: "22/05/2023", 
      origin: "Shanghai, CN", 
      destination: "Paris, FR",
      status: "approved",
      amount: "€ 3,450.00",
      type: "Maritime",
      commercial: "Jean Dupont",
      lastModified: "24/05/2023",
      validUntil: "22/06/2023",
      notes: "Client prioritaire, tarifs négociés"
    },
    { 
      id: "QT-2023-0141", 
      client: "Pharma Solutions", 
      clientId: "CL-002",
      date: "21/05/2023", 
      origin: "New York, US", 
      destination: "Madrid, ES",
      status: "pending",
      amount: "€ 2,120.50",
      type: "Aérien",
      commercial: "Marie Martin",
      lastModified: "21/05/2023",
      validUntil: "21/06/2023",
      notes: "Expédition urgente, délai de livraison critique"
    },
    { 
      id: "QT-2023-0140", 
      client: "Global Imports Ltd", 
      clientId: "CL-003",
      date: "20/05/2023", 
      origin: "Rotterdam, NL", 
      destination: "Marseille, FR",
      status: "pending",
      amount: "€ 1,780.25",
      type: "Maritime",
      commercial: "Jean Dupont",
      lastModified: "22/05/2023",
      validUntil: "20/06/2023",
      notes: ""
    },
    { 
      id: "QT-2023-0139", 
      client: "Eurotech GmbH", 
      clientId: "CL-004",
      date: "19/05/2023", 
      origin: "Munich, DE", 
      destination: "Lyon, FR",
      status: "rejected",
      amount: "€ 890.00",
      type: "Routier",
      commercial: "Pierre Durand",
      lastModified: "20/05/2023",
      validUntil: "19/06/2023",
      notes: "Client a demandé une révision des tarifs"
    },
    { 
      id: "QT-2023-0138", 
      client: "Tech Supplies Inc", 
      clientId: "CL-001",
      date: "18/05/2023", 
      origin: "Hong Kong, HK", 
      destination: "Paris, FR",
      status: "expired",
      amount: "€ 4,230.75",
      type: "Maritime",
      commercial: "Jean Dupont",
      lastModified: "18/05/2023",
      validUntil: "18/06/2023",
      notes: "Devis remplacé par QT-2023-0142"
    },
  ];

  // Filtrer les devis en fonction de l'onglet actif
  const filteredQuotes = quotes.filter(quote => {
    if (activeTab === 'all') return true;
    return quote.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion des Devis</h1>
              <p className="text-muted-foreground">Créez et gérez vos demandes de devis</p>
            </div>
            <div className="flex gap-2">
              <Button 
                className="gap-2" 
                onClick={handleNewQuote}
                variant="default"
              >
                <PlusCircle className="h-4 w-4" />
                Nouveau Devis
              </Button>
              <Button 
                className="gap-2" 
                variant="outline"
                onClick={() => setShowClientSelector(true)}
              >
                <Users className="h-4 w-4" />
                Gérer Clients
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher par client, n° devis, destination..." className="pl-10" />
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
              <QuoteFilters show={showAdvancedFilters} onClose={() => setShowAdvancedFilters(false)} />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous les devis</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="approved">Approuvés</TabsTrigger>
              <TabsTrigger value="rejected">Rejetés</TabsTrigger>
              <TabsTrigger value="expired">Expirés</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
              />
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
              />
            </TabsContent>
            
            <TabsContent value="rejected" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
              />
            </TabsContent>
            
            <TabsContent value="expired" className="space-y-4">
              <QuotesList 
                quotes={filteredQuotes} 
                onEdit={handleEditQuote} 
                onDuplicate={handleDuplicateQuote} 
                onDownload={handleDownloadQuote}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showQuoteEditor && (
        <QuoteEditor 
          quoteId={editingQuoteId} 
          clientId={selectedClient || undefined}
          onClose={() => setShowQuoteEditor(false)} 
        />
      )}

      {showClientSelector && (
        <ClientSelector 
          onClose={() => setShowClientSelector(false)}
          onSelectClient={handleClientSelect}
        />
      )}
    </div>
  );
};

export default Quotes;
