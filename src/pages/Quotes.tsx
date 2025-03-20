import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  FileText,
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import QuoteEditor from '@/components/quotes/QuoteEditor';
import QuotesList from '@/components/quotes/QuotesList';
import QuoteFilters, { QuoteFilterValues } from '@/components/quotes/QuoteFilters';
import ClientSelector from '@/components/quotes/ClientSelector';
import { useToast } from '@/hooks/use-toast';

const Quotes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuoteEditor, setShowQuoteEditor] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | undefined>(undefined);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<QuoteFilterValues | null>(null);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewQuote = () => {
    setEditingQuoteId(undefined);
    setShowClientSelector(true);
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
    setSelectedClientName(clientName);
    setShowClientSelector(false);
    setShowQuoteEditor(true);
    
    toast({
      title: "Client sélectionné",
      description: `Création d'un devis pour ${clientName}`,
    });
  };
  
  const handleApplyFilters = (filters: QuoteFilterValues) => {
    setActiveFilters(filters);
    
    toast({
      title: "Filtres appliqués",
      description: "Les devis ont été filtrés selon vos critères.",
    });
    
    // Reset to first tab if the filters apply to a specific status
    if (filters.status.length > 0) {
      // If only one status is selected, go to that tab
      if (filters.status.length === 1) {
        setActiveTab(filters.status[0]);
      } else {
        setActiveTab('all');
      }
    }
  };
  
  const clearAllFilters = () => {
    setActiveFilters(null);
    setSearchTerm('');
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés.",
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

  // Filtrer les devis en fonction de l'onglet actif et des filtres
  const filteredQuotes = quotes.filter(quote => {
    // Filtre par onglet
    if (activeTab !== 'all' && quote.status !== activeTab) {
      return false;
    }
    
    // Filtre par recherche texte
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        quote.id.toLowerCase().includes(searchLower) ||
        quote.client.toLowerCase().includes(searchLower) ||
        quote.origin.toLowerCase().includes(searchLower) ||
        quote.destination.toLowerCase().includes(searchLower) ||
        quote.type.toLowerCase().includes(searchLower) ||
        quote.commercial.toLowerCase().includes(searchLower) ||
        quote.notes.toLowerCase().includes(searchLower);
        
      if (!matchesSearch) return false;
    }
    
    // Filtres avancés
    if (activeFilters) {
      // Filtre par status
      if (activeFilters.status.length > 0 && !activeFilters.status.includes(quote.status)) {
        return false;
      }
      
      // Filtre par type
      if (activeFilters.types.length > 0 && !activeFilters.types.includes(quote.type)) {
        return false;
      }
      
      // Filtre par commercial
      if (activeFilters.commercial && activeFilters.commercial !== 'all') {
        const commercialFirstName = quote.commercial.split(' ')[0].toLowerCase();
        if (commercialFirstName !== activeFilters.commercial) {
          return false;
        }
      }
      
      // Filtre par montant
      if (activeFilters.minAmount) {
        const amount = parseFloat(quote.amount.replace('€', '').replace(',', '').trim());
        if (amount < activeFilters.minAmount) {
          return false;
        }
      }
      
      if (activeFilters.maxAmount) {
        const amount = parseFloat(quote.amount.replace('€', '').replace(',', '').trim());
        if (amount > activeFilters.maxAmount) {
          return false;
        }
      }
      
      // Filtre par date
      if (activeFilters.startDate) {
        const quoteDate = new Date(quote.date.split('/').reverse().join('-'));
        if (quoteDate < activeFilters.startDate) {
          return false;
        }
      }
      
      if (activeFilters.endDate) {
        const quoteDate = new Date(quote.date.split('/').reverse().join('-'));
        if (quoteDate > activeFilters.endDate) {
          return false;
        }
      }
    }
    
    // Si toutes les conditions sont passées, inclure le devis
    return true;
  });

  // Mettre à jour le titre de la page
  useEffect(() => {
    document.title = "Gestion des Devis";
  }, []);

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
            <div>
              <Button 
                className="gap-2" 
                onClick={handleNewQuote}
                variant="default"
              >
                <PlusCircle className="h-4 w-4" />
                Nouveau Devis
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par client, n° devis, destination..." 
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
                {activeFilters && <Badge variant="outline" className="ml-1 text-xs">{Object.keys(activeFilters).filter(k => {
                  const value = activeFilters[k as keyof QuoteFilterValues];
                  return value && (
                    Array.isArray(value) 
                      ? (value as any[]).length > 0 
                      : true
                  );
                }).length}</Badge>}
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
              
              <QuoteFilters 
                show={showAdvancedFilters} 
                onClose={() => setShowAdvancedFilters(false)}
                onApplyFilters={handleApplyFilters}
              />
            </div>
          </div>

          {/* Affichage des filtres actifs */}
          {activeFilters && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeFilters.status.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  Statut: {activeFilters.status.map(s => 
                    s === 'approved' ? 'Approuvé' : 
                    s === 'pending' ? 'En attente' : 
                    s === 'rejected' ? 'Rejeté' : 'Expiré'
                  ).join(', ')}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1" 
                    onClick={() => setActiveFilters({...activeFilters, status: []})}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {activeFilters.types.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  Type: {activeFilters.types.join(', ')}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1" 
                    onClick={() => setActiveFilters({...activeFilters, types: []})}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {activeFilters.commercial && activeFilters.commercial !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Commercial: {
                    activeFilters.commercial === 'jean' ? 'Jean' : 
                    activeFilters.commercial === 'marie' ? 'Marie' : 
                    'Pierre'
                  }
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1" 
                    onClick={() => setActiveFilters({...activeFilters, commercial: undefined})}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {(activeFilters.minAmount || activeFilters.maxAmount) && (
                <Badge variant="outline" className="gap-1">
                  Montant: {activeFilters.minAmount ? `Min ${activeFilters.minAmount}€` : ''} 
                  {activeFilters.minAmount && activeFilters.maxAmount ? ' - ' : ''}
                  {activeFilters.maxAmount ? `Max ${activeFilters.maxAmount}€` : ''}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1" 
                    onClick={() => setActiveFilters({...activeFilters, minAmount: undefined, maxAmount: undefined})}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {(activeFilters.startDate || activeFilters.endDate) && (
                <Badge variant="outline" className="gap-1">
                  Période: {activeFilters.startDate ? activeFilters.startDate.toLocaleDateString() : ''} 
                  {activeFilters.startDate && activeFilters.endDate ? ' - ' : ''}
                  {activeFilters.endDate ? activeFilters.endDate.toLocaleDateString() : ''}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1" 
                    onClick={() => setActiveFilters({...activeFilters, startDate: undefined, endDate: undefined})}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}

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
          initialSearchTerm={searchTerm}
        />
      )}
    </div>
  );
};

export default Quotes;
