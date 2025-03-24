import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Ship, 
  ArrowLeft, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Tag, 
  Link as LinkIcon, 
  Edit,
  Power
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Quote {
  id: string;
  reference: string;
  date: string;
  status: string;
  amount: string;
  client: string;
}

interface Shipment {
  id: string;
  reference: string;
  status: string;
  origin: string;
  destination: string;
  date: string;
  type: string;
  priority: string;
}

interface ClientDetailProps {
  clientId: string;
  onClose: () => void;
  onEdit?: (clientId: string) => void;
  onStatusChange?: (clientId: string, newStatus: "active" | "inactive") => void;
}

const ClientDetail = ({ clientId, onClose, onEdit, onStatusChange }: ClientDetailProps) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [client, setClient] = useState<any>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulation de chargement des données du client
    setLoading(true);
    setTimeout(() => {
      const clientData = {
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
      };

      // Simulations de quotes pour ce client
      const mockQuotes = [
        {
          id: "QT-001234",
          reference: "QT-001234",
          date: "10/05/2023",
          status: "pending",
          amount: "2,450.00 €",
          client: clientData.name
        },
        {
          id: "QT-001235",
          reference: "QT-001235",
          date: "15/05/2023",
          status: "accepted",
          amount: "1,890.00 €",
          client: clientData.name
        },
        {
          id: "QT-001236",
          reference: "QT-001236",
          date: "20/05/2023",
          status: "draft",
          amount: "3,200.00 €",
          client: clientData.name
        }
      ];

      // Simulations d'expéditions pour ce client
      const mockShipments = [
        {
          id: "SH-002345",
          reference: "SH-002345",
          status: "in_transit",
          origin: "Paris, FR",
          destination: "Berlin, DE",
          date: "12/05/2023",
          type: "road",
          priority: "standard"
        },
        {
          id: "SH-002346",
          reference: "SH-002346",
          status: "delivered",
          origin: "Paris, FR",
          destination: "Lyon, FR",
          date: "18/05/2023",
          type: "road",
          priority: "express"
        }
      ];

      setClient(clientData);
      setQuotes(mockQuotes);
      setShipments(mockShipments);
      setLoading(false);
    }, 700);
  }, [clientId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Accepté</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Refusé</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">Brouillon</Badge>;
      case 'in_transit':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">En transit</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Livré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleQuoteClick = (quoteId: string) => {
    toast({
      title: "Navigation vers le devis",
      description: `Redirection vers le devis ${quoteId}`,
    });
    onClose();
    navigate(`/quotes?id=${quoteId}`);
  };

  const handleShipmentClick = (shipmentId: string) => {
    toast({
      title: "Navigation vers l'expédition",
      description: `Redirection vers l'expédition ${shipmentId}`,
    });
    onClose();
    navigate(`/shipments?id=${shipmentId}`);
  };

  const handleEditClient = () => {
    if (onEdit && client) {
      onEdit(client.id);
      onClose();
    }
  };

  const toggleClientStatus = () => {
    if (!client) return;
    
    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    setClient({...client, status: newStatus});
    
    toast({
      title: `Client ${newStatus === 'active' ? 'activé' : 'rendu inactif'}`,
      description: `Le statut du client ${client.name} a été mis à jour.`,
    });
    
    // Call the onStatusChange callback if it exists
    if (onStatusChange) {
      onStatusChange(clientId, newStatus as "active" | "inactive");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-300">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {loading ? 'Chargement...' : client?.name}
                {client?.status === 'active' ? (
                  <Badge variant="default" className="ml-2">Actif</Badge>
                ) : (
                  <Badge variant="destructive" className="ml-2">Inactif</Badge>
                )}
              </h2>
              {!loading && client && <p className="text-sm text-muted-foreground">{client.id}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            {!loading && client && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={toggleClientStatus}
                >
                  <Power className="h-4 w-4" />
                  {client.status === 'active' ? 'Inactif' : 'Actif'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleEditClient}
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="quotes">Devis ({quotes.length})</TabsTrigger>
                <TabsTrigger value="shipments">Expéditions ({shipments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informations de contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${client.email}`} className="text-primary hover:underline truncate">
                          {client.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${client.phone}`} className="hover:underline truncate">
                          {client.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Détails du client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-32">Contact principal:</span>
                        <span className="font-medium">{client.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-32">Dernière activité:</span>
                        <span className="font-medium">{client.lastActivity}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground w-32">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                          {client.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs flex items-center gap-1">
                              <LinkIcon className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {client.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{client.notes}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                  <Card className="flex-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Devis récents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {quotes.length > 0 ? (
                        <div className="space-y-2">
                          {quotes.slice(0, 3).map((quote) => (
                            <div 
                              key={quote.id} 
                              className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer"
                              onClick={() => handleQuoteClick(quote.id)}
                            >
                              <div>
                                <p className="font-medium">{quote.reference}</p>
                                <p className="text-sm text-muted-foreground">{quote.date}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(quote.status)}
                                <span className="font-medium">{quote.amount}</span>
                              </div>
                            </div>
                          ))}
                          {quotes.length > 3 && (
                            <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab('quotes')}>
                              Voir tous les devis
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-center py-4 text-muted-foreground">Aucun devis</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="flex-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Ship className="h-5 w-5 mr-2 text-primary" />
                        Expéditions récentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {shipments.length > 0 ? (
                        <div className="space-y-2">
                          {shipments.slice(0, 3).map((shipment) => (
                            <div 
                              key={shipment.id} 
                              className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer"
                              onClick={() => handleShipmentClick(shipment.id)}
                            >
                              <div>
                                <p className="font-medium">{shipment.reference}</p>
                                <p className="text-sm text-muted-foreground">{shipment.date}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(shipment.status)}
                              </div>
                            </div>
                          ))}
                          {shipments.length > 3 && (
                            <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab('shipments')}>
                              Voir toutes les expéditions
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-center py-4 text-muted-foreground">Aucune expédition</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Créer un devis
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Ship className="h-4 w-4" />
                    Créer une expédition
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="quotes" className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="font-medium text-left p-3">Référence</th>
                        <th className="font-medium text-left p-3">Date</th>
                        <th className="font-medium text-left p-3">Statut</th>
                        <th className="font-medium text-left p-3">Montant</th>
                        <th className="font-medium text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.length > 0 ? (
                        quotes.map((quote) => (
                          <tr 
                            key={quote.id} 
                            className="border-b hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleQuoteClick(quote.id)}
                          >
                            <td className="p-3 font-medium">{quote.reference}</td>
                            <td className="p-3">{quote.date}</td>
                            <td className="p-3">{getStatusBadge(quote.status)}</td>
                            <td className="p-3 font-medium">{quote.amount}</td>
                            <td className="p-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuoteClick(quote.id);
                                }}
                              >
                                Voir
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-5 text-center text-muted-foreground">
                            Aucun devis trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Créer un devis
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="shipments" className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="font-medium text-left p-3">Référence</th>
                        <th className="font-medium text-left p-3">Date</th>
                        <th className="font-medium text-left p-3">Origine/Destination</th>
                        <th className="font-medium text-left p-3">Type</th>
                        <th className="font-medium text-left p-3">Statut</th>
                        <th className="font-medium text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipments.length > 0 ? (
                        shipments.map((shipment) => (
                          <tr 
                            key={shipment.id} 
                            className="border-b hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleShipmentClick(shipment.id)}
                          >
                            <td className="p-3 font-medium">{shipment.reference}</td>
                            <td className="p-3">{shipment.date}</td>
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span>{shipment.origin}</span>
                                <span className="text-muted-foreground">{shipment.destination}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge variant="outline" className="capitalize">
                                {shipment.type === 'road' ? 'Routier' : shipment.type}
                              </Badge>
                            </td>
                            <td className="p-3">{getStatusBadge(shipment.status)}</td>
                            <td className="p-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShipmentClick(shipment.id);
                                }}
                              >
                                Voir
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-5 text-center text-muted-foreground">
                            Aucune expédition trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Ship className="h-4 w-4" />
                    Créer une expédition
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;
