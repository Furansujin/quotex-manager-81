
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Plus, Edit, Trash2, Calendar, ArrowUpDown, Tag, Euro, CalendarDays, Eye, Info, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DatePicker } from '@/components/ui/date-picker';

// Types pour les tarifs
interface SupplierPrice {
  id: string;
  supplier: string;
  origin: string;
  destination: string;
  transportType: 'maritime' | 'aérien' | 'routier' | 'ferroviaire' | 'multimodal';
  price: number;
  currency: string;
  transitTime: string;
  validUntil: string | Date;
  serviceLevel: 'express' | 'standard' | 'economy';
  notes?: string;
  contractRef?: string;
}

// Données de démonstration
const mockPrices: SupplierPrice[] = [
  {
    id: '1',
    supplier: 'Maersk',
    origin: 'Paris, France',
    destination: 'New York, États-Unis',
    transportType: 'maritime',
    price: 1250,
    currency: 'EUR',
    transitTime: '25-30 jours',
    validUntil: '2023-12-31',
    serviceLevel: 'standard',
    contractRef: 'CTR-MAE-2023-001'
  },
  {
    id: '2',
    supplier: 'CMA CGM',
    origin: 'Paris, France',
    destination: 'New York, États-Unis',
    transportType: 'maritime',
    price: 1150,
    currency: 'EUR',
    transitTime: '28-32 jours',
    validUntil: '2023-12-31',
    serviceLevel: 'standard',
    contractRef: 'CTR-CMA-2023-001'
  },
  {
    id: '3',
    supplier: 'Air France Cargo',
    origin: 'Paris, France',
    destination: 'New York, États-Unis',
    transportType: 'aérien',
    price: 2250,
    currency: 'EUR',
    transitTime: '3-5 jours',
    validUntil: '2023-12-15',
    serviceLevel: 'express',
    contractRef: 'CTR-AFC-2023-001'
  },
  {
    id: '4',
    supplier: 'DB Schenker',
    origin: 'Paris, France',
    destination: 'Madrid, Espagne',
    transportType: 'routier',
    price: 850,
    currency: 'EUR',
    transitTime: '5-7 jours',
    validUntil: '2023-12-15',
    serviceLevel: 'standard',
    contractRef: 'CTR-DBS-2023-001'
  }
];

// Schéma de validation pour le formulaire
const priceFormSchema = z.object({
  supplier: z.string().min(1, { message: "Veuillez sélectionner un fournisseur" }),
  origin: z.string().min(2, { message: "L'origine doit contenir au moins 2 caractères" }),
  destination: z.string().min(2, { message: "La destination doit contenir au moins 2 caractères" }),
  transportType: z.enum(['maritime', 'aérien', 'routier', 'ferroviaire', 'multimodal']),
  price: z.coerce.number().min(0, { message: "Le prix doit être positif" }),
  currency: z.string().min(1, { message: "Veuillez sélectionner une devise" }),
  transitTime: z.string().min(1, { message: "Veuillez indiquer le temps de transit" }),
  validUntil: z.date(),
  serviceLevel: z.enum(['express', 'standard', 'economy']),
  notes: z.string().optional(),
  contractRef: z.string().optional()
});

const SupplierPricing = () => {
  const [prices, setPrices] = useState<SupplierPrice[]>(mockPrices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<SupplierPrice | null>(null);
  const [priceToDelete, setPriceToDelete] = useState<SupplierPrice | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<SupplierPrice | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof priceFormSchema>>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      supplier: '',
      origin: '',
      destination: '',
      transportType: 'maritime',
      price: 0,
      currency: 'EUR',
      transitTime: '',
      validUntil: new Date(),
      serviceLevel: 'standard',
      notes: '',
      contractRef: ''
    }
  });

  // Liste des fournisseurs (normalement récupérée depuis une API)
  const suppliers = ['Maersk', 'CMA CGM', 'Air France Cargo', 'DB Schenker', 'Kuehne + Nagel', 'DSV'];
  
  // Liste des devises
  const currencies = ['EUR', 'USD', 'GBP', 'JPY', 'CNY'];

  // Filtrer les tarifs
  const filteredPrices = prices.filter(price => {
    const matchesSearch = 
      price.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (price.contractRef && price.contractRef.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesOrigin = !selectedOrigin || price.origin.includes(selectedOrigin);
    const matchesDestination = !selectedDestination || price.destination.includes(selectedDestination);
    const matchesType = !selectedType || price.transportType === selectedType;
    
    return matchesSearch && matchesOrigin && matchesDestination && matchesType;
  });

  // Obtenir les origines et destinations uniques pour les filtres
  const uniqueOrigins = Array.from(new Set(prices.map(price => price.origin)));
  const uniqueDestinations = Array.from(new Set(prices.map(price => price.destination)));

  // Gestion de l'ajout d'un tarif
  const handleAddPrice = (values: z.infer<typeof priceFormSchema>) => {
    const newPrice: SupplierPrice = {
      id: (prices.length + 1).toString(),
      supplier: values.supplier,
      origin: values.origin,
      destination: values.destination,
      transportType: values.transportType,
      price: values.price,
      currency: values.currency,
      transitTime: values.transitTime,
      validUntil: values.validUntil,
      serviceLevel: values.serviceLevel,
      notes: values.notes,
      contractRef: values.contractRef
    };
    
    setPrices([...prices, newPrice]);
    setIsAddDialogOpen(false);
    form.reset();
    
    toast({
      title: "Tarif ajouté",
      description: `Le tarif pour ${values.origin} → ${values.destination} a été ajouté.`
    });
  };

  // Gestion de la modification d'un tarif
  const handleEditPrice = (values: z.infer<typeof priceFormSchema>) => {
    if (!editingPrice) return;
    
    const updatedPrices = prices.map(price => 
      price.id === editingPrice.id ? { 
        ...price, 
        supplier: values.supplier,
        origin: values.origin,
        destination: values.destination,
        transportType: values.transportType,
        price: values.price,
        currency: values.currency,
        transitTime: values.transitTime,
        validUntil: values.validUntil,
        serviceLevel: values.serviceLevel,
        notes: values.notes,
        contractRef: values.contractRef
      } : price
    );
    
    setPrices(updatedPrices);
    setEditingPrice(null);
    form.reset();
    
    toast({
      title: "Tarif modifié",
      description: `Le tarif pour ${values.origin} → ${values.destination} a été modifié.`
    });
  };

  // Gestion de la suppression d'un tarif
  const handleDeletePrice = () => {
    if (!priceToDelete) return;
    
    setPrices(prices.filter(price => price.id !== priceToDelete.id));
    setPriceToDelete(null);
    
    toast({
      title: "Tarif supprimé",
      description: `Le tarif pour ${priceToDelete.origin} → ${priceToDelete.destination} a été supprimé.`
    });
  };

  // Ouverture du formulaire de modification
  const handleOpenEditDialog = (price: SupplierPrice) => {
    setEditingPrice(price);
    form.reset({
      supplier: price.supplier,
      origin: price.origin,
      destination: price.destination,
      transportType: price.transportType,
      price: price.price,
      currency: price.currency,
      transitTime: price.transitTime,
      validUntil: typeof price.validUntil === 'string' ? new Date(price.validUntil) : price.validUntil,
      serviceLevel: price.serviceLevel,
      notes: price.notes || '',
      contractRef: price.contractRef || ''
    });
  };

  // Ouvrir le dialogue de détails
  const handleOpenDetailDialog = (price: SupplierPrice) => {
    setSelectedPrice(price);
    setIsDetailDialogOpen(true);
  };

  // Récupérer le badge pour le niveau de service
  const getServiceLevelBadge = (level: string) => {
    switch (level) {
      case 'express':
        return <Badge variant="destructive">Express</Badge>;
      case 'standard':
        return <Badge variant="default">Standard</Badge>;
      case 'economy':
        return <Badge variant="outline">Économique</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  // Formatter la date
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Vérifier si un tarif est expiré
  const isPriceExpired = (dateString: string | Date) => {
    try {
      const validUntil = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return validUntil < new Date();
    } catch {
      return false;
    }
  };

  // Traduire le type de transport
  const getTransportTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'maritime': 'Maritime',
      'aérien': 'Aérien',
      'routier': 'Routier',
      'ferroviaire': 'Ferroviaire',
      'multimodal': 'Multimodal'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Origine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les origines</SelectItem>
              {uniqueOrigins.map((origin) => (
                <SelectItem key={origin} value={origin}>{origin}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedDestination} onValueChange={setSelectedDestination}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les destinations</SelectItem>
              {uniqueDestinations.map((destination) => (
                <SelectItem key={destination} value={destination}>{destination}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de transport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="maritime">Maritime</SelectItem>
              <SelectItem value="aérien">Aérien</SelectItem>
              <SelectItem value="routier">Routier</SelectItem>
              <SelectItem value="ferroviaire">Ferroviaire</SelectItem>
              <SelectItem value="multimodal">Multimodal</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un tarif
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un tarif</DialogTitle>
                <DialogDescription>
                  Complétez les informations du nouveau tarif
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddPrice)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="supplier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fournisseur</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un fournisseur" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {suppliers.map((supplier) => (
                                <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="transportType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de transport</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="maritime">Maritime</SelectItem>
                              <SelectItem value="aérien">Aérien</SelectItem>
                              <SelectItem value="routier">Routier</SelectItem>
                              <SelectItem value="ferroviaire">Ferroviaire</SelectItem>
                              <SelectItem value="multimodal">Multimodal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origine</FormLabel>
                          <FormControl>
                            <Input placeholder="Ville, Pays" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <FormControl>
                            <Input placeholder="Ville, Pays" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Devise</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une devise" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="transitTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temps de transit</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 5-7 jours" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="validUntil"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Valide jusqu'au</FormLabel>
                          <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="serviceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Niveau de service</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un niveau" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="express">Express</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="economy">Économique</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contractRef"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Référence contrat</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: CTR-2023-001" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Notes additionnelles" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Ajouter</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="hidden md:table-cell">Transit</TableHead>
              <TableHead className="hidden md:table-cell">Service</TableHead>
              <TableHead>Validité</TableHead>
              <TableHead className="hidden md:table-cell">Référence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrices.length > 0 ? (
              filteredPrices.map((price) => (
                <TableRow 
                  key={price.id} 
                  className={`hover:bg-muted/50 cursor-pointer ${isPriceExpired(price.validUntil) ? 'bg-red-50 dark:bg-red-950/10' : ''}`}
                  onClick={() => handleOpenDetailDialog(price)}
                >
                  <TableCell className="font-medium">{price.supplier}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">De:</span>
                      <span>{price.origin}</span>
                      <span className="text-xs text-muted-foreground mt-1">À:</span>
                      <span>{price.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTransportTypeLabel(price.transportType)}</TableCell>
                  <TableCell>{price.price.toFixed(2)} {price.currency}</TableCell>
                  <TableCell className="hidden md:table-cell">{price.transitTime}</TableCell>
                  <TableCell className="hidden md:table-cell">{getServiceLevelBadge(price.serviceLevel)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {formatDate(price.validUntil)}
                      {isPriceExpired(price.validUntil) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tarif expiré</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{price.contractRef || '-'}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetailDialog(price);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Voir les détails</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditDialog(price);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Modifier</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPriceToDelete(price);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supprimer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  Aucun tarif trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedPrice && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Tarif {selectedPrice.supplier}
                  {getServiceLevelBadge(selectedPrice.serviceLevel)}
                </DialogTitle>
                <DialogDescription>
                  Détails du tarif de transport
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Origine</h4>
                      <p className="text-lg">{selectedPrice.origin}</p>
                    </div>
                    <div className="flex items-center">
                      <ArrowUpDown className="mx-2 text-muted-foreground" />
                    </div>
                    <div className="text-right">
                      <h4 className="text-sm font-medium">Destination</h4>
                      <p className="text-lg">{selectedPrice.destination}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Type de transport</h4>
                    <p>{getTransportTypeLabel(selectedPrice.transportType)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Prix</h4>
                    <p className="text-lg font-semibold">{selectedPrice.price.toFixed(2)} {selectedPrice.currency}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Temps de transit</h4>
                    <p>{selectedPrice.transitTime}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Validité</h4>
                    <p className={isPriceExpired(selectedPrice.validUntil) ? 'text-red-500' : ''}>
                      {formatDate(selectedPrice.validUntil)}
                      {isPriceExpired(selectedPrice.validUntil) && ' (Expiré)'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Référence contrat</h4>
                    <p>{selectedPrice.contractRef || 'Non spécifié'}</p>
                  </div>
                </div>
                
                {selectedPrice.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <p className="text-sm">{selectedPrice.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenEditDialog(selectedPrice)}>
                  <Edit className="mr-2 h-4 w-4" /> Modifier
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog 
        open={!!priceToDelete} 
        onOpenChange={(open) => !open && setPriceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le tarif
              {priceToDelete && <span className="font-semibold"> {priceToDelete.origin} → {priceToDelete.destination}</span>}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePrice} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {filteredPrices.length > 0 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>
            Affichage de {filteredPrices.length} tarif{filteredPrices.length > 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPricing;
