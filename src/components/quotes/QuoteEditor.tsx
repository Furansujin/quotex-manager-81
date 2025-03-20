
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  Download, 
  SendHorizontal, 
  X, 
  Printer, 
  FileText,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  status: string;
  lastQuote?: string;
  createdAt: string;
  tags?: string[];
  quoteCount?: number;
  preferredShipping?: string;
}

interface QuoteEditorProps {
  quoteId?: string;
  clientId?: string;
  onClose: () => void;
}

const QuoteEditor: React.FC<QuoteEditorProps> = ({ quoteId, clientId, onClose }) => {
  const { toast } = useToast();
  const isEditing = !!quoteId;
  
  // Récupérer les informations du client si clientId est fourni
  const clients: Client[] = [
    { 
      id: 'CL-001', 
      name: 'Tech Supplies Inc', 
      contact: 'John Doe', 
      email: 'john.doe@techsupplies.com', 
      phone: '+33 1 23 45 67 89', 
      address: '123 Tech Avenue, Paris', 
      type: 'business',
      status: 'active',
      lastQuote: '22/05/2023',
      createdAt: '15/01/2023',
      tags: ['VIP', 'Tech', 'International'],
      quoteCount: 12,
      preferredShipping: 'Maritime'
    },
    { 
      id: 'CL-002', 
      name: 'Pharma Solutions', 
      contact: 'Jane Smith', 
      email: 'jane.smith@pharmasolutions.com', 
      phone: '+33 9 87 65 43 21', 
      address: '456 Health Street, Lyon', 
      type: 'business',
      status: 'active',
      lastQuote: '21/05/2023',
      createdAt: '03/02/2023',
      tags: ['Pharmacie', 'Prioritaire'],
      quoteCount: 8,
      preferredShipping: 'Aérien'
    },
    { 
      id: 'CL-003', 
      name: 'Global Imports Ltd', 
      contact: 'Robert Johnson', 
      email: 'robert@globalimports.com', 
      phone: '+33 6 11 22 33 44', 
      address: '789 Import Road, Marseille', 
      type: 'business',
      status: 'active',
      lastQuote: '20/05/2023',
      createdAt: '22/02/2023',
      tags: ['Import', 'Volumineux'],
      quoteCount: 5,
      preferredShipping: 'Maritime'
    },
    { 
      id: 'CL-004', 
      name: 'Eurotech GmbH', 
      contact: 'Anna Müller', 
      email: 'anna.muller@eurotech.de', 
      phone: '+49 30 1234567', 
      address: '10 Tech Straße, Berlin', 
      type: 'business',
      status: 'inactive',
      lastQuote: '19/05/2023',
      createdAt: '10/03/2023',
      tags: ['Europe', 'Tech'],
      quoteCount: 3,
      preferredShipping: 'Routier'
    }
  ];
  
  const selectedClient = clients.find(c => c.id === clientId);
  
  const [client, setClient] = useState(isEditing ? 'Tech Supplies Inc' : selectedClient?.name || '');
  const [clientDetails, setClientDetails] = useState(selectedClient);
  const [origin, setOrigin] = useState(isEditing ? 'Shanghai, CN' : '');
  const [destination, setDestination] = useState(isEditing ? 'Paris, FR' : '');
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [type, setType] = useState(isEditing ? 'Maritime' : selectedClient?.preferredShipping || 'Maritime');
  const [incoterm, setIncoterm] = useState('FOB');
  const [currency, setCurrency] = useState('EUR');
  const [showClientInfo, setShowClientInfo] = useState(false);
  
  const [items, setItems] = useState<QuoteItem[]>(
    isEditing 
      ? [
          { 
            id: '1', 
            description: 'Transport maritime container 40HC', 
            quantity: 2, 
            unitPrice: 1200, 
            discount: 0, 
            tax: 20, 
            total: 2400 
          },
          { 
            id: '2', 
            description: 'Frais de manutention portuaire', 
            quantity: 1, 
            unitPrice: 350, 
            discount: 0, 
            tax: 20, 
            total: 350 
          },
          { 
            id: '3', 
            description: 'Assurance fret (Ad Valorem)', 
            quantity: 1, 
            unitPrice: 680, 
            discount: 5, 
            tax: 20, 
            total: 646 
          }
        ]
      : []
  );

  // Produits suggérés basés sur le type de transport
  const suggestedItems = {
    Maritime: [
      { description: 'Transport maritime container 20FT', unitPrice: 950 },
      { description: 'Transport maritime container 40HC', unitPrice: 1200 },
      { description: 'Frais de manutention portuaire', unitPrice: 350 },
      { description: 'Assurance fret (Ad Valorem)', unitPrice: 680 },
      { description: 'Douanes et dédouanement maritime', unitPrice: 450 }
    ],
    Aérien: [
      { description: 'Transport aérien - Fret standard (<100kg)', unitPrice: 1500 },
      { description: 'Transport aérien - Fret volumique', unitPrice: 2200 },
      { description: 'Frais de manutention aéroportuaire', unitPrice: 280 },
      { description: 'Assurance fret aérien', unitPrice: 750 },
      { description: 'Douanes et dédouanement aérien', unitPrice: 350 }
    ],
    Routier: [
      { description: 'Transport routier - Camion complet', unitPrice: 850 },
      { description: 'Transport routier - Groupage', unitPrice: 450 },
      { description: 'Assurance transport routier', unitPrice: 250 },
      { description: 'Frais de passage frontière', unitPrice: 150 },
      { description: 'Frais de livraison à domicile', unitPrice: 120 }
    ],
    Ferroviaire: [
      { description: 'Transport ferroviaire - Container', unitPrice: 780 },
      { description: 'Manutention ferroviaire', unitPrice: 320 },
      { description: 'Assurance transport ferroviaire', unitPrice: 400 },
      { description: 'Frais de passage frontière ferroviaire', unitPrice: 180 }
    ],
    Multimodal: [
      { description: 'Transport multimodal - Maritime + Routier', unitPrice: 1650 },
      { description: 'Transport multimodal - Maritime + Ferroviaire', unitPrice: 1450 },
      { description: 'Coordination multimodale', unitPrice: 400 },
      { description: 'Assurance multimodale', unitPrice: 850 }
    ]
  };

  const addItem = (predefinedItem?: {description: string, unitPrice: number}) => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: predefinedItem?.description || '',
      quantity: 1,
      unitPrice: predefinedItem?.unitPrice || 0,
      discount: 0,
      tax: 20,
      total: predefinedItem?.unitPrice || 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount' || field === 'tax') {
          const quantity = field === 'quantity' ? value : item.quantity;
          const unitPrice = field === 'unitPrice' ? value : item.unitPrice;
          const discount = field === 'discount' ? value : item.discount;
          
          const subtotal = quantity * unitPrice;
          const discountAmount = subtotal * (discount / 100);
          updatedItem.total = subtotal - discountAmount;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.total, 0);
  };

  const calculateTaxAmount = () => {
    return items.reduce((acc, item) => {
      const taxRate = item.tax / 100;
      return acc + (item.total * taxRate);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };

  const handleSave = () => {
    // Validation simple
    if (!client) {
      toast({
        title: "Champ requis",
        description: "Veuillez sélectionner un client pour ce devis.",
        variant: "destructive"
      });
      return;
    }
    
    if (!origin || !destination) {
      toast({
        title: "Champs requis",
        description: "L'origine et la destination sont requises.",
        variant: "destructive"
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Aucun service",
        description: "Veuillez ajouter au moins un service au devis.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Devis enregistré",
      description: "Le devis a été sauvegardé avec succès.",
    });
  };

  const handleSend = () => {
    // Vérification similaire à handleSave
    if (!client || !origin || !destination || items.length === 0) {
      toast({
        title: "Devis incomplet",
        description: "Veuillez remplir tous les champs obligatoires avant d'envoyer.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Devis envoyé",
      description: "Le devis a été envoyé au client par email.",
    });
  };

  const handleGeneratePdf = () => {
    toast({
      title: "PDF généré",
      description: "Le devis a été converti en PDF avec succès.",
    });
  };

  // Suggestion d'origine et destination basée sur le client sélectionné
  const originSuggestions = [
    "Shanghai, CN", 
    "Rotterdam, NL", 
    "Singapour, SG", 
    "Anvers, BE",
    "Hambourg, DE",
    "Hong Kong, HK",
    "New York, US",
    "Dubaï, AE"
  ];
  
  const destinationSuggestions = [
    "Paris, FR", 
    "Marseille, FR", 
    "Lyon, FR", 
    "Bordeaux, FR",
    "Le Havre, FR",
    "Madrid, ES",
    "Barcelone, ES",
    "Berlin, DE"
  ];

  // Effet pour préremplir les champs s'il y a un client sélectionné
  useEffect(() => {
    if (selectedClient) {
      setClient(selectedClient.name);
      setClientDetails(selectedClient);
      setType(selectedClient.preferredShipping || 'Maritime');
      
      // Si l'historique du client montre des préférences de route
      if (selectedClient.id === 'CL-001') {
        setOrigin('Shanghai, CN');
        setDestination('Paris, FR');
      }
    }
  }, [selectedClient]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{isEditing ? 'Modifier le devis' : 'Nouveau devis'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span>Client *</span>
                    {clientDetails && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs gap-1"
                        onClick={() => setShowClientInfo(!showClientInfo)}
                      >
                        <Info className="h-3 w-3" />
                        {showClientInfo ? 'Masquer détails' : 'Voir détails'}
                      </Button>
                    )}
                  </label>
                  <Input 
                    placeholder="Nom du client" 
                    value={client} 
                    onChange={(e) => setClient(e.target.value)} 
                    disabled={!!clientId}
                    className={clientId ? "bg-muted" : ""}
                  />
                  
                  {showClientInfo && clientDetails && (
                    <Card className="mt-2 border border-muted">
                      <CardContent className="p-3 text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{clientDetails.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{clientDetails.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{clientDetails.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{clientDetails.address}</span>
                        </div>
                        {clientDetails.tags && clientDetails.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {clientDetails.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Origine *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <Input 
                            placeholder="Port/Ville d'origine" 
                            value={origin} 
                            onChange={(e) => setOrigin(e.target.value)} 
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <div className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                          <div className="overflow-y-auto max-h-[300px]">
                            {originSuggestions
                              .filter(sug => sug.toLowerCase().includes(origin.toLowerCase()) || origin === '')
                              .map((suggestion, i) => (
                                <div
                                  key={i}
                                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                  onClick={() => {
                                    setOrigin(suggestion);
                                    document.body.click(); // Close the popover
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <Input 
                            placeholder="Port/Ville de destination" 
                            value={destination} 
                            onChange={(e) => setDestination(e.target.value)} 
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <div className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                          <div className="overflow-y-auto max-h-[300px]">
                            {destinationSuggestions
                              .filter(sug => sug.toLowerCase().includes(destination.toLowerCase()) || destination === '')
                              .map((suggestion, i) => (
                                <div
                                  key={i}
                                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                  onClick={() => {
                                    setDestination(suggestion);
                                    document.body.click(); // Close the popover
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de transport *</label>
                    <Select 
                      value={type}
                      onValueChange={(value) => {
                        setType(value);
                        // Auto-suggest services when type changes
                        if (items.length === 0) {
                          const serviceType = value as keyof typeof suggestedItems;
                          if (suggestedItems[serviceType]?.[0]) {
                            addItem(suggestedItems[serviceType][0]);
                          }
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maritime">Maritime</SelectItem>
                        <SelectItem value="Aérien">Aérien</SelectItem>
                        <SelectItem value="Routier">Routier</SelectItem>
                        <SelectItem value="Ferroviaire">Ferroviaire</SelectItem>
                        <SelectItem value="Multimodal">Multimodal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Valide jusqu'au *</label>
                    <Input 
                      type="date" 
                      value={validUntil} 
                      onChange={(e) => setValidUntil(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Incoterm</label>
                    <Select 
                      value={incoterm}
                      onValueChange={setIncoterm}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un incoterm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                        <SelectItem value="FCA">FCA - Free Carrier</SelectItem>
                        <SelectItem value="FOB">FOB - Free On Board</SelectItem>
                        <SelectItem value="CIF">CIF - Cost, Insurance & Freight</SelectItem>
                        <SelectItem value="DAP">DAP - Delivered At Place</SelectItem>
                        <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Devise</label>
                    <Select 
                      value={currency}
                      onValueChange={setCurrency}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="USD">USD - Dollar américain</SelectItem>
                        <SelectItem value="GBP">GBP - Livre sterling</SelectItem>
                        <SelectItem value="JPY">JPY - Yen japonais</SelectItem>
                        <SelectItem value="CNY">CNY - Yuan chinois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea 
                    placeholder="Informations complémentaires, conditions spéciales, etc." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations du devis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Numéro de devis</label>
                    <Input value="QT-2023-0142" disabled />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de création</label>
                  <Input type="date" value={new Date().toISOString().split('T')[0]} disabled />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Créé par</label>
                  <Input value="Jean Dupont" disabled />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <div className="p-3 bg-muted rounded-md">
                    {isEditing ? (
                      <Badge variant="success">Approuvé</Badge>
                    ) : (
                      <Badge variant="warning">Brouillon</Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Services suggérés</label>
                  <div className="bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
                    {type && suggestedItems[type as keyof typeof suggestedItems] ? (
                      <div className="space-y-2">
                        {suggestedItems[type as keyof typeof suggestedItems].map((item, index) => (
                          <div 
                            key={index} 
                            className="flex justify-between items-center p-2 hover:bg-background rounded-md cursor-pointer"
                            onClick={() => addItem(item)}
                          >
                            <div>
                              <div className="font-medium text-sm">{item.description}</div>
                              <div className="text-xs text-muted-foreground">{item.unitPrice.toFixed(2)} {currency}</div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 gap-1">
                              <PlusCircle className="h-3 w-3" />
                              <span className="text-xs">Ajouter</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        Sélectionnez un type de transport pour voir les suggestions
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Détails des services</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => addItem()}>
                    <PlusCircle className="h-4 w-4" />
                    Service personnalisé
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="sm" className="gap-1">
                        <PlusCircle className="h-4 w-4" />
                        Ajouter
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Services suggérés</h4>
                        <Tabs defaultValue={type} onValueChange={setType}>
                          <TabsList className="grid grid-cols-3 h-auto">
                            <TabsTrigger value="Maritime" className="text-xs">Maritime</TabsTrigger>
                            <TabsTrigger value="Aérien" className="text-xs">Aérien</TabsTrigger>
                            <TabsTrigger value="Routier" className="text-xs">Routier</TabsTrigger>
                          </TabsList>
                          <TabsContent value="Maritime" className="mt-2">
                            <div className="space-y-1">
                              {suggestedItems.Maritime.map((item, index) => (
                                <div 
                                  key={index} 
                                  className="flex justify-between items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                                  onClick={() => {
                                    addItem(item);
                                    document.body.click(); // Close the popover
                                  }}
                                >
                                  <div>
                                    <div className="font-medium text-xs">{item.description}</div>
                                    <div className="text-xs text-muted-foreground">{item.unitPrice.toFixed(2)} {currency}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="Aérien" className="mt-2">
                            <div className="space-y-1">
                              {suggestedItems.Aérien.map((item, index) => (
                                <div 
                                  key={index} 
                                  className="flex justify-between items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                                  onClick={() => {
                                    addItem(item);
                                    document.body.click(); // Close the popover
                                  }}
                                >
                                  <div>
                                    <div className="font-medium text-xs">{item.description}</div>
                                    <div className="text-xs text-muted-foreground">{item.unitPrice.toFixed(2)} {currency}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="Routier" className="mt-2">
                            <div className="space-y-1">
                              {suggestedItems.Routier.map((item, index) => (
                                <div 
                                  key={index} 
                                  className="flex justify-between items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                                  onClick={() => {
                                    addItem(item);
                                    document.body.click(); // Close the popover
                                  }}
                                >
                                  <div>
                                    <div className="font-medium text-xs">{item.description}</div>
                                    <div className="text-xs text-muted-foreground">{item.unitPrice.toFixed(2)} {currency}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead className="text-right">Prix unitaire</TableHead>
                      <TableHead className="text-right">Remise (%)</TableHead>
                      <TableHead className="text-right">TVA (%)</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input 
                            value={item.description} 
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Description du service"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="1"
                            value={item.quantity} 
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            className="text-right w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="0"
                            step="0.01"
                            value={item.unitPrice} 
                            onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                            className="text-right w-24"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="0"
                            max="100"
                            value={item.discount} 
                            onChange={(e) => updateItem(item.id, 'discount', Number(e.target.value))}
                            className="text-right w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="0"
                            max="100"
                            value={item.tax} 
                            onChange={(e) => updateItem(item.id, 'tax', Number(e.target.value))}
                            className="text-right w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.total.toFixed(2)} {currency}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Aucun service ajouté. Cliquez sur "Ajouter" pour commencer.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {items.length > 0 && (
                <div className="mt-6 space-y-2 w-72 ml-auto">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total:</span>
                    <span>{calculateSubtotal().toFixed(2)} {currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVA:</span>
                    <span>{calculateTaxAmount().toFixed(2)} {currency}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{calculateTotal().toFixed(2)} {currency}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <Button variant="outline" className="gap-2 mr-2" onClick={handleGeneratePdf}>
                <FileText className="h-4 w-4" />
                Générer PDF
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => {}}>
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
            </div>
            
            <div>
              <Button variant="outline" className="gap-2 mr-2" onClick={onClose}>
                Annuler
              </Button>
              <Button variant="default" className="gap-2 mr-2" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
              <Button variant="default" className="gap-2" onClick={handleSend}>
                <SendHorizontal className="h-4 w-4" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteEditor;
