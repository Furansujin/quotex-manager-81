
import React from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const Quotes = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nouveau Devis
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher par client, n° devis, destination..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Trier
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous les devis</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="approved">Approuvés</TabsTrigger>
              <TabsTrigger value="rejected">Rejetés</TabsTrigger>
              <TabsTrigger value="expired">Expirés</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {[
                { 
                  id: "QT-2023-0142", 
                  client: "Tech Supplies Inc", 
                  date: "22/05/2023", 
                  origin: "Shanghai, CN", 
                  destination: "Paris, FR",
                  status: "approved",
                  amount: "€ 3,450.00",
                  type: "Maritime"
                },
                { 
                  id: "QT-2023-0141", 
                  client: "Pharma Solutions", 
                  date: "21/05/2023", 
                  origin: "New York, US", 
                  destination: "Madrid, ES",
                  status: "pending",
                  amount: "€ 2,120.50",
                  type: "Aérien"
                },
                { 
                  id: "QT-2023-0140", 
                  client: "Global Imports Ltd", 
                  date: "20/05/2023", 
                  origin: "Rotterdam, NL", 
                  destination: "Marseille, FR",
                  status: "pending",
                  amount: "€ 1,780.25",
                  type: "Maritime"
                },
                { 
                  id: "QT-2023-0139", 
                  client: "Eurotech GmbH", 
                  date: "19/05/2023", 
                  origin: "Munich, DE", 
                  destination: "Lyon, FR",
                  status: "rejected",
                  amount: "€ 890.00",
                  type: "Routier"
                },
                { 
                  id: "QT-2023-0138", 
                  client: "Tech Supplies Inc", 
                  date: "18/05/2023", 
                  origin: "Hong Kong, HK", 
                  destination: "Paris, FR",
                  status: "expired",
                  amount: "€ 4,230.75",
                  type: "Maritime"
                },
              ].map((quote) => (
                <Card key={quote.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{quote.id}</h3>
                            <Badge variant={
                              quote.status === "approved" ? "success" : 
                              quote.status === "pending" ? "warning" :
                              quote.status === "rejected" ? "destructive" : "outline"
                            }>
                              {quote.status === "approved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {quote.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                              {quote.status === "rejected" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {quote.status === "expired" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{quote.client}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium">{quote.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Trajet</p>
                          <p className="font-medium">{quote.origin} → {quote.destination}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">{quote.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Montant</p>
                          <p className="font-medium">{quote.amount}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            {/* Autres onglets */}
            <TabsContent value="pending">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Affichage des devis en attente de validation</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="approved">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Affichage des devis approuvés</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="rejected">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Affichage des devis rejetés</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="expired">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Affichage des devis expirés</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Quotes;
