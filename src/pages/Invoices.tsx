
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Filter, X, MoreHorizontal, Eye, Send, CreditCard, FileInvoice, AlertCircle, Download } from 'lucide-react';
import { useInvoiceService } from '@/hooks/useInvoiceService';
import InvoiceViewer from '@/components/invoices/InvoiceViewer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const Invoices = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  const {
    invoices,
    openInvoice,
    closeInvoice,
    currentInvoice,
    showInvoiceModal,
    sendInvoice,
    markAsPaid,
    updateInvoice
  } = useInvoiceService();

  const { toast } = useToast();

  // Mise à jour du titre de la page
  useEffect(() => {
    document.title = "Gestion des Factures";
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Filtrer les factures en fonction de l'onglet actif et du terme de recherche
  const filteredInvoices = invoices.filter(invoice => {
    // Filtre par onglet
    if (activeTab !== 'all' && invoice.status !== activeTab) {
      return false;
    }
    
    // Filtre par recherche texte
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchLower) ||
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.client.toLowerCase().includes(searchLower) ||
        invoice.amount.toLowerCase().includes(searchLower);
        
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-200">En attente</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-200">Payée</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-200">En retard</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculer les statistiques des factures
  const totalInvoices = invoices.length;
  const totalPaid = invoices.filter(i => i.status === 'paid').length;
  const totalOverdue = invoices.filter(i => i.status === 'overdue').length;
  const totalPending = invoices.filter(i => i.status === 'pending').length;

  const handleSendEmail = async (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    openInvoice(invoice);
  };

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    openInvoice(invoice);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    markAsPaid(invoiceId);
  };

  const handleSendReminder = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    toast({
      title: "Relance envoyée",
      description: `Une relance a été envoyée pour la facture ${invoice.invoiceNumber}.`
    });
  };

  const handleDownload = (invoiceId: string) => {
    toast({
      title: "Téléchargement",
      description: "Le téléchargement de la facture va démarrer."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion des Factures</h1>
              <p className="text-muted-foreground">Suivi et gestion de vos factures clients</p>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Factures</p>
                  <p className="text-2xl font-bold">{totalInvoices}</p>
                </div>
                <FileInvoice className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Payées</p>
                  <p className="text-2xl font-bold text-green-600">{totalPaid}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-500 opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">En attente</p>
                  <p className="text-2xl font-bold text-amber-600">{totalPending}</p>
                </div>
                <FileInvoice className="h-8 w-8 text-amber-500 opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">En retard</p>
                  <p className="text-2xl font-bold text-red-600">{totalOverdue}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500 opacity-80" />
              </CardContent>
            </Card>
          </div>

          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Input 
                placeholder="Rechercher par client, n° facture, montant..." 
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

          {/* Advanced filters */}
          {showAdvancedFilters && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Toutes</Badge>
                      <Badge variant="outline" className="cursor-pointer bg-amber-100 text-amber-700">En attente</Badge>
                      <Badge variant="outline" className="cursor-pointer bg-green-100 text-green-700">Payées</Badge>
                      <Badge variant="outline" className="cursor-pointer bg-red-100 text-red-700">En retard</Badge>
                      <Badge variant="outline" className="cursor-pointer bg-gray-100 text-gray-700">Annulées</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Période</label>
                    <div className="flex gap-2">
                      <Input type="date" className="w-full" placeholder="Date début" />
                      <Input type="date" className="w-full" placeholder="Date fin" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Montant</label>
                    <div className="flex gap-2">
                      <Input placeholder="Min (€)" type="number" />
                      <Input placeholder="Max (€)" type="number" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="mr-2" onClick={() => {
                    setSearchTerm('');
                    setShowAdvancedFilters(false);
                  }}>Réinitialiser</Button>
                  <Button onClick={() => {
                    setShowAdvancedFilters(false);
                  }}>Appliquer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs and invoices list */}
          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="paid">Payées</TabsTrigger>
              <TabsTrigger value="overdue">En retard</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <div className="overflow-x-auto">
                  {filteredInvoices.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>N° Facture</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Date émission</TableHead>
                          <TableHead>Échéance</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map((invoice) => (
                          <TableRow 
                            key={invoice.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleViewInvoice(invoice.id)}
                            onMouseEnter={() => setHoveredRow(invoice.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.client}</TableCell>
                            <TableCell>{invoice.issueDate}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className={`h-8 px-2 transition-opacity ${hoveredRow === invoice.id ? 'opacity-100' : 'opacity-70'}`}
                                  onClick={() => handleViewInvoice(invoice.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Voir</span>
                                </Button>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className={`h-8 px-2 transition-opacity ${hoveredRow === invoice.id ? 'opacity-100' : 'opacity-70'}`}
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem onClick={() => handleViewInvoice(invoice.id)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>Voir la facture</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSendEmail(invoice.id)}>
                                      <Send className="mr-2 h-4 w-4" />
                                      <span>Envoyer par email</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDownload(invoice.id)}>
                                      <Download className="mr-2 h-4 w-4" />
                                      <span>Télécharger</span>
                                    </DropdownMenuItem>
                                    {invoice.status === 'pending' && (
                                      <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                                        <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                                        <span>Marquer comme payée</span>
                                      </DropdownMenuItem>
                                    )}
                                    {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                      <DropdownMenuItem onClick={() => handleSendReminder(invoice.id)}>
                                        <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                                        <span>Envoyer une relance</span>
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Aucune facture trouvée.
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            {/* Duplicate structure for other tabs (pending, paid, overdue, cancelled) */}
            {['pending', 'paid', 'overdue', 'cancelled'].map(tab => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                <Card>
                  <div className="overflow-x-auto">
                    {filteredInvoices.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>N° Facture</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date émission</TableHead>
                            <TableHead>Échéance</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvoices.map((invoice) => (
                            <TableRow 
                              key={invoice.id}
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleViewInvoice(invoice.id)}
                              onMouseEnter={() => setHoveredRow(invoice.id)}
                              onMouseLeave={() => setHoveredRow(null)}
                            >
                              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                              <TableCell>{invoice.client}</TableCell>
                              <TableCell>{invoice.issueDate}</TableCell>
                              <TableCell>{invoice.dueDate}</TableCell>
                              <TableCell>{invoice.amount}</TableCell>
                              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`h-8 px-2 transition-opacity ${hoveredRow === invoice.id ? 'opacity-100' : 'opacity-70'}`}
                                    onClick={() => handleViewInvoice(invoice.id)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Voir</span>
                                  </Button>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className={`h-8 px-2 transition-opacity ${hoveredRow === invoice.id ? 'opacity-100' : 'opacity-70'}`}
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                      <DropdownMenuItem onClick={() => handleViewInvoice(invoice.id)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>Voir la facture</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleSendEmail(invoice.id)}>
                                        <Send className="mr-2 h-4 w-4" />
                                        <span>Envoyer par email</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDownload(invoice.id)}>
                                        <Download className="mr-2 h-4 w-4" />
                                        <span>Télécharger</span>
                                      </DropdownMenuItem>
                                      {invoice.status === 'pending' && (
                                        <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                                          <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                                          <span>Marquer comme payée</span>
                                        </DropdownMenuItem>
                                      )}
                                      {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                        <DropdownMenuItem onClick={() => handleSendReminder(invoice.id)}>
                                          <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                                          <span>Envoyer une relance</span>
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        Aucune facture trouvée.
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      {/* Invoice Viewer Modal */}
      {showInvoiceModal && (
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
