
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, Calendar, FileText, Send, CheckCircle, MoreHorizontal, User, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInvoiceService, Invoice } from '@/hooks/useInvoiceService';
import InvoiceViewer from '@/components/invoices/InvoiceViewer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const InvoiceStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-amber-100 text-amber-700">En attente</Badge>;
    case 'paid':
      return <Badge variant="outline" className="bg-green-100 text-green-700">Payée</Badge>;
    case 'overdue':
      return <Badge variant="outline" className="bg-red-100 text-red-700">En retard</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-gray-100 text-gray-700">Annulée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Invoices = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const {
    invoices,
    currentInvoice,
    showInvoiceModal,
    openInvoice,
    closeInvoice,
    sendInvoice,
    markAsPaid,
    updateInvoice
  } = useInvoiceService();
  
  // Filtrer les factures en fonction de l'onglet actif et du terme de recherche
  const filteredInvoices = invoices.filter(invoice => {
    // Filtre par onglet
    if (activeTab !== 'all' && invoice.status !== activeTab) {
      return false;
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.client.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Mettre à jour le titre de la page
  useEffect(() => {
    document.title = "Gestion des Factures";
  }, []);
  
  // Ouvrir le modal de visualisation de facture
  const handleViewInvoice = (invoice: Invoice) => {
    openInvoice(invoice);
  };
  
  // Envoyer une facture par email
  const handleSendInvoice = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    
    const email = prompt("Entrez l'adresse email du destinataire :");
    if (!email) return;
    
    await sendInvoice(invoiceId, email);
  };
  
  // Marquer une facture comme payée
  const handleMarkAsPaid = (invoiceId: string) => {
    markAsPaid(invoiceId);
  };
  
  // Télécharger une facture
  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: "La facture est en cours de téléchargement...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Factures</h1>
              <p className="text-muted-foreground">Gestion et suivi des factures clients</p>
            </div>
          </div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total facturé</p>
                  <p className="text-2xl font-bold">
                    {invoices
                      .reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[^0-9.-]+/g, "")), 0)
                      .toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Factures en attente</p>
                  <p className="text-2xl font-bold">
                    {invoices.filter(inv => inv.status === 'pending').length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Paiements reçus</p>
                  <p className="text-2xl font-bold">
                    {invoices
                      .filter(inv => inv.status === 'paid')
                      .reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[^0-9.-]+/g, "")), 0)
                      .toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <Input 
              placeholder="Rechercher par n° facture, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Onglets et tableau des factures */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="paid">Payées</TabsTrigger>
              <TabsTrigger value="overdue">En retard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Facture</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date d'émission</TableHead>
                        <TableHead>Échéance</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                            Aucune facture trouvée
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewInvoice(invoice)}>
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.client}</TableCell>
                            <TableCell>{invoice.issueDate}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>
                              <InvoiceStatusBadge status={invoice.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>Voir</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice.id)}>
                                      <Download className="mr-2 h-4 w-4" />
                                      <span>Télécharger</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSendInvoice(invoice.id)}>
                                      <Send className="mr-2 h-4 w-4" />
                                      <span>Envoyer par email</span>
                                    </DropdownMenuItem>
                                    
                                    {invoice.status === 'pending' && (
                                      <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                          <span>Marquer comme payée</span>
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {/* Table for pending invoices - same structure as above */}
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Facture</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date d'émission</TableHead>
                        <TableHead>Échéance</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                            Aucune facture en attente
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewInvoice(invoice)}>
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.client}</TableCell>
                            <TableCell>{invoice.issueDate}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>
                              <InvoiceStatusBadge status={invoice.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleMarkAsPaid(invoice.id)}>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="sr-only">Marquer comme payée</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleSendInvoice(invoice.id)}>
                                  <Send className="h-4 w-4" />
                                  <span className="sr-only">Envoyer</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewInvoice(invoice)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Voir</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="paid" className="space-y-4">
              {/* Table for paid invoices */}
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Facture</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date d'émission</TableHead>
                        <TableHead>Date de paiement</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                            Aucune facture payée
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewInvoice(invoice)}>
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.client}</TableCell>
                            <TableCell>{invoice.issueDate}</TableCell>
                            <TableCell>{'01/01/2023'}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>
                              <InvoiceStatusBadge status={invoice.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownloadInvoice(invoice.id)}>
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Télécharger</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewInvoice(invoice)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Voir</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="overdue" className="space-y-4">
              {/* Table for overdue invoices */}
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Facture</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date d'émission</TableHead>
                        <TableHead>Échéance</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Retard</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                            Aucune facture en retard
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewInvoice(invoice)}>
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.client}</TableCell>
                            <TableCell>{invoice.issueDate}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">+30 jours</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleMarkAsPaid(invoice.id)}>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="sr-only">Marquer comme payée</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleSendInvoice(invoice.id)}>
                                  <Send className="h-4 w-4" />
                                  <span className="sr-only">Relancer</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewInvoice(invoice)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Voir</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Clients à risque */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Clients à surveiller</h2>
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Factures en retard</TableHead>
                      <TableHead>Montant dû</TableHead>
                      <TableHead>Retard moyen</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Tech Supplies Inc</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>3 450,00 €</TableCell>
                      <TableCell>15 jours</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-8">
                          <User className="mr-2 h-4 w-4" />
                          <span>Voir client</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      
      {/* Modal de visualisation de facture */}
      {showInvoiceModal && currentInvoice && (
        <InvoiceViewer
          invoice={currentInvoice}
          isOpen={showInvoiceModal}
          onClose={closeInvoice}
          onSendEmail={sendInvoice}
          onMarkAsPaid={markAsPaid}
          onUpdateInvoice={updateInvoice}
        />
      )}
    </div>
  );
};

export default Invoices;
