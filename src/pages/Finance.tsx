
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileSpreadsheet, 
  Euro, 
  CalendarRange,
  BarChart4,
  PieChart,
  TrendingUp,
  AlertTriangle,
  FileText,
  Plus,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import FinanceFilters from '@/components/finance/FinanceFilters';

interface FinanceFilterValues {
  status: string[];
  clientTypes: string[];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  commercial?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const Finance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FinanceFilterValues | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleApplyFilters = (filters: FinanceFilterValues) => {
    setActiveFilters(filters);
    
    // Si des filtres de statut sont appliqués, on peut basculer sur l'onglet correspondant
    if (filters.status && filters.status.length === 1) {
      setActiveTab(filters.status[0]);
    } else if (filters.status && filters.status.length === 0) {
      setActiveTab('all');
    }
    
    toast({
      title: "Filtres appliqués",
      description: "Les factures ont été filtrées selon vos critères.",
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
  
  const handleSortToggle = (field: string) => {
    let newDirection: 'asc' | 'desc' | null = null;
    let newField = field;
    
    if (activeFilters?.sortField === field) {
      // Basculer la direction: asc -> desc -> null
      if (activeFilters.sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (activeFilters.sortDirection === 'desc') {
        newField = '';
        newDirection = null;
      }
    } else {
      // Nouveau champ, commencer par ascendant
      newDirection = 'asc';
    }
    
    const newFilters = {
      ...activeFilters || { status: [], clientTypes: [] },
      sortField: newField || undefined,
      sortDirection: newDirection || undefined
    };
    
    handleApplyFilters(newFilters);
  };

  // Rendu des icônes de tri
  const renderSortIcon = (field: string) => {
    if (activeFilters?.sortField === field) {
      if (activeFilters.sortDirection === 'asc') {
        return <ArrowUp className="h-3.5 w-3.5 text-primary ml-1" />;
      } else if (activeFilters.sortDirection === 'desc') {
        return <ArrowDown className="h-3.5 w-3.5 text-primary ml-1" />;
      }
    }
    return <span className="h-3.5 w-3.5 opacity-0 group-hover:opacity-30 ml-1">↕</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion Financière</h1>
              <p className="text-muted-foreground">Suivi des factures, paiements et performance financière</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Rapports
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle Facture
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Chiffre d'affaires</p>
                    <h3 className="text-2xl font-bold">€248,500</h3>
                    <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +12.5% vs période précédente
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Euro className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Factures impayées</p>
                    <h3 className="text-2xl font-bold">€54,320</h3>
                    <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +4.8% vs période précédente
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Marge brute</p>
                    <h3 className="text-2xl font-bold">32.4%</h3>
                    <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +1.2 points vs période précédente
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <PieChart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Factures ce mois</p>
                    <h3 className="text-2xl font-bold">42</h3>
                    <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +8 vs mois précédent
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">Évolution du CA</CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <CalendarRange className="h-3 w-3" />
                      Cette année
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center bg-muted/30 rounded-md">
                    <BarChart4 className="h-8 w-8 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Graphique d'évolution du CA</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Répartition des revenus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 flex items-center justify-center bg-muted/30 rounded-md mb-4">
                    <PieChart className="h-8 w-8 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Graphique de répartition</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Maritime</span>
                        <span className="text-sm text-muted-foreground">€145,230</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '58%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Aérien</span>
                        <span className="text-sm text-muted-foreground">€68,450</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Routier</span>
                        <span className="text-sm text-muted-foreground">€34,820</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '14%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <FinanceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            activeFilters={activeFilters}
            onApplyFilters={handleApplyFilters}
            clearAllFilters={clearAllFilters}
          />

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Factures</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="paid">Payées</TabsTrigger>
                  <TabsTrigger value="pending">En attente</TabsTrigger>
                  <TabsTrigger value="overdue">En retard</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 gap-4 p-3 bg-muted/30 text-sm font-medium border-b">
                      <div className="flex items-center group cursor-pointer" onClick={() => handleSortToggle('id')}>
                        N° Facture {renderSortIcon('id')}
                      </div>
                      <div className="flex items-center group cursor-pointer" onClick={() => handleSortToggle('client')}>
                        Client {renderSortIcon('client')}
                      </div>
                      <div className="flex items-center group cursor-pointer" onClick={() => handleSortToggle('issueDate')}>
                        Émission {renderSortIcon('issueDate')}
                      </div>
                      <div className="flex items-center group cursor-pointer" onClick={() => handleSortToggle('dueDate')}>
                        Échéance {renderSortIcon('dueDate')}
                      </div>
                      <div className="flex items-center justify-end group cursor-pointer" onClick={() => handleSortToggle('amount')}>
                        Montant {renderSortIcon('amount')}
                      </div>
                      <div className="flex items-center justify-end group cursor-pointer" onClick={() => handleSortToggle('status')}>
                        Statut {renderSortIcon('status')}
                      </div>
                    </div>
                    {[
                      { 
                        id: "INV-2023-0045", 
                        client: "Tech Supplies Inc", 
                        issueDate: "05/06/2023", 
                        dueDate: "05/07/2023",
                        amount: "€4,250.00",
                        status: "pending"
                      },
                      { 
                        id: "INV-2023-0044", 
                        client: "Pharma Solutions", 
                        issueDate: "02/06/2023", 
                        dueDate: "02/07/2023",
                        amount: "€2,840.50",
                        status: "pending"
                      },
                      { 
                        id: "INV-2023-0043", 
                        client: "Global Imports Ltd", 
                        issueDate: "28/05/2023", 
                        dueDate: "27/06/2023",
                        amount: "€3,620.75",
                        status: "paid"
                      },
                      { 
                        id: "INV-2023-0042", 
                        client: "Eurotech GmbH", 
                        issueDate: "25/05/2023", 
                        dueDate: "24/06/2023",
                        amount: "€1,480.00",
                        status: "paid"
                      },
                      { 
                        id: "INV-2023-0041", 
                        client: "Tech Supplies Inc", 
                        issueDate: "20/05/2023", 
                        dueDate: "19/06/2023",
                        amount: "€2,980.25",
                        status: "overdue"
                      },
                    ].map((invoice, index) => (
                      <div key={invoice.id} className={`grid grid-cols-6 gap-4 p-3 text-sm hover:bg-muted/30 ${index !== 4 ? 'border-b' : ''}`}>
                        <div className="font-medium">{invoice.id}</div>
                        <div>{invoice.client}</div>
                        <div>{invoice.issueDate}</div>
                        <div>{invoice.dueDate}</div>
                        <div className="text-right font-medium">{invoice.amount}</div>
                        <div className="text-right">
                          <Badge variant={
                            invoice.status === "paid" ? "success" : 
                            invoice.status === "pending" ? "outline" :
                            "destructive"
                          }>
                            {invoice.status === "paid" ? "Payée" : 
                             invoice.status === "pending" ? "En attente" : 
                             "En retard"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Autres onglets */}
                <TabsContent value="paid">
                  <p className="text-center text-muted-foreground p-4">Liste des factures payées</p>
                </TabsContent>
                <TabsContent value="pending">
                  <p className="text-center text-muted-foreground p-4">Liste des factures impayées</p>
                </TabsContent>
                <TabsContent value="overdue">
                  <p className="text-center text-muted-foreground p-4">Liste des factures en retard</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Finance;
