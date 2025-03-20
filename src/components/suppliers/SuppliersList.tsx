import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Définir les types pour les fournisseurs
interface Supplier {
  id: string;
  name: string;
  category: 'maritime' | 'aérien' | 'routier' | 'ferroviaire' | 'multimodal';
  contactName: string;
  email: string;
  phone: string;
  status: 'actif' | 'inactif';
  lastOrder?: string;
  notes?: string;
}

// Données de démonstration
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Maersk',
    category: 'maritime',
    contactName: 'Jean Dupont',
    email: 'jean.dupont@maersk.com',
    phone: '+33 1 23 45 67 89',
    status: 'actif',
    lastOrder: '2023-12-01',
    notes: 'Partenaire principal pour les routes transatlantiques'
  },
  {
    id: '2',
    name: 'CMA CGM',
    category: 'maritime',
    contactName: 'Marie Martin',
    email: 'marie.martin@cma-cgm.com',
    phone: '+33 1 23 45 67 90',
    status: 'actif',
    lastOrder: '2023-11-15',
    notes: 'Contrat préférentiel sur les routes Asie-Europe'
  },
  {
    id: '3',
    name: 'Air France Cargo',
    category: 'aérien',
    contactName: 'Pierre Lefebvre',
    email: 'pierre.lefebvre@airfrance.fr',
    phone: '+33 1 23 45 67 91',
    status: 'actif',
    lastOrder: '2023-12-10'
  },
  {
    id: '4',
    name: 'DB Schenker',
    category: 'routier',
    contactName: 'Sophie Dubois',
    email: 'sophie.dubois@dbschenker.com',
    phone: '+33 1 23 45 67 92',
    status: 'inactif'
  }
];

// Schéma de validation pour le formulaire
const supplierFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  category: z.enum(['maritime', 'aérien', 'routier', 'ferroviaire', 'multimodal']),
  contactName: z.string().min(2, { message: "Le nom du contact doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().min(5, { message: "Numéro de téléphone invalide" }),
  status: z.enum(['actif', 'inactif']),
  lastOrder: z.string().optional(),
  notes: z.string().optional()
});

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof supplierFormSchema>>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      category: 'maritime',
      contactName: '',
      email: '',
      phone: '',
      status: 'actif',
      lastOrder: '',
      notes: ''
    }
  });

  // Filtrer les fournisseurs en fonction des critères
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || supplier.category === selectedCategory;
    const matchesStatus = !selectedStatus || supplier.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Gérer l'ajout d'un fournisseur
  const handleAddSupplier = (values: z.infer<typeof supplierFormSchema>) => {
    const newSupplier: Supplier = {
      id: (suppliers.length + 1).toString(),
      name: values.name,
      category: values.category,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
      status: values.status,
      lastOrder: values.lastOrder,
      notes: values.notes
    };
    
    setSuppliers([...suppliers, newSupplier]);
    setIsAddDialogOpen(false);
    form.reset();
    
    toast({
      title: "Fournisseur ajouté",
      description: `${values.name} a été ajouté avec succès.`
    });
  };

  // Gérer la modification d'un fournisseur
  const handleEditSupplier = (values: z.infer<typeof supplierFormSchema>) => {
    if (!editingSupplier) return;
    
    const updatedSuppliers = suppliers.map(supplier => 
      supplier.id === editingSupplier.id ? { 
        ...supplier, 
        name: values.name,
        category: values.category,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        status: values.status,
        lastOrder: values.lastOrder,
        notes: values.notes
      } : supplier
    );
    
    setSuppliers(updatedSuppliers);
    setEditingSupplier(null);
    form.reset();
    
    toast({
      title: "Fournisseur modifié",
      description: `${values.name} a été modifié avec succès.`
    });
  };

  // Gérer la suppression d'un fournisseur
  const handleDeleteSupplier = () => {
    if (!supplierToDelete) return;
    
    setSuppliers(suppliers.filter(supplier => supplier.id !== supplierToDelete.id));
    setSupplierToDelete(null);
    
    toast({
      title: "Fournisseur supprimé",
      description: `${supplierToDelete.name} a été supprimé.`
    });
  };

  // Gérer l'ouverture du formulaire de modification
  const handleOpenEditDialog = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.reset({
      name: supplier.name,
      category: supplier.category,
      contactName: supplier.contactName,
      email: supplier.email,
      phone: supplier.phone,
      status: supplier.status,
      lastOrder: supplier.lastOrder || '',
      notes: supplier.notes || ''
    });
  };

  // Gérer l'ouverture du dialogue de détails
  const handleOpenDetailDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailDialogOpen(true);
  };

  // Changer le statut d'un fournisseur rapidement
  const handleToggleStatus = (supplier: Supplier) => {
    const newStatus = supplier.status === 'actif' ? 'inactif' : 'actif';
    const updatedSuppliers = suppliers.map(s => 
      s.id === supplier.id ? { ...s, status: newStatus as 'actif' | 'inactif' } : s
    );
    
    setSuppliers(updatedSuppliers);
    
    toast({
      title: "Statut modifié",
      description: `${supplier.name} est maintenant ${newStatus}.`
    });
  };

  // Traduire la catégorie en français
  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'maritime': 'Maritime',
      'aérien': 'Aérien',
      'routier': 'Routier',
      'ferroviaire': 'Ferroviaire',
      'multimodal': 'Multimodal'
    };
    return categories[category] || category;
  };
  
  // Formater une date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les catégories</SelectItem>
              <SelectItem value="maritime">Maritime</SelectItem>
              <SelectItem value="aérien">Aérien</SelectItem>
              <SelectItem value="routier">Routier</SelectItem>
              <SelectItem value="ferroviaire">Ferroviaire</SelectItem>
              <SelectItem value="multimodal">Multimodal</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              Ajouter un fournisseur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un fournisseur</DialogTitle>
              <DialogDescription>
                Complétez les informations du nouveau fournisseur
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddSupplier)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du fournisseur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une catégorie" />
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
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email du contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro de téléphone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="actif">Actif</SelectItem>
                            <SelectItem value="inactif">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Notes (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Notes additionnelles" {...field} value={field.value || ''} />
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
        
        <Dialog open={!!editingSupplier} onOpenChange={(open) => !open && setEditingSupplier(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier un fournisseur</DialogTitle>
              <DialogDescription>
                Modifiez les informations du fournisseur
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditSupplier)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du fournisseur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une catégorie" />
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
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email du contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro de téléphone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="actif">Actif</SelectItem>
                            <SelectItem value="inactif">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Notes (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Notes additionnelles" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Enregistrer</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {selectedSupplier && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedSupplier.name}
                    <Badge variant={selectedSupplier.status === 'actif' ? 'default' : 'outline'}>
                      {selectedSupplier.status === 'actif' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Détails du fournisseur
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Catégorie</h4>
                      <p>{getCategoryLabel(selectedSupplier.category)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                      <p>{selectedSupplier.contactName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                      <p>{selectedSupplier.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Téléphone</h4>
                      <p>{selectedSupplier.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Dernière commande</h4>
                      <p>{formatDate(selectedSupplier.lastOrder)}</p>
                    </div>
                  </div>
                  
                  {selectedSupplier.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                      <p>{selectedSupplier.notes}</p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => handleOpenEditDialog(selectedSupplier)}>
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog 
          open={!!supplierToDelete} 
          onOpenChange={(open) => !open && setSupplierToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera définitivement le fournisseur
                {supplierToDelete?.name && <span className="font-semibold"> {supplierToDelete.name}</span>}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSupplier} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleOpenDetailDialog(supplier)}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{getCategoryLabel(supplier.category)}</TableCell>
                  <TableCell>{supplier.contactName}</TableCell>
                  <TableCell className="hidden md:table-cell">{supplier.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{supplier.phone}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={supplier.status === 'actif' ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(supplier);
                      }}
                    >
                      {supplier.status === 'actif' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
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
                                handleOpenDetailDialog(supplier);
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
                                handleOpenEditDialog(supplier);
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
                                setSupplierToDelete(supplier);
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
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Aucun fournisseur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredSuppliers.length > 0 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>
            Affichage de {filteredSuppliers.length} fournisseur{filteredSuppliers.length > 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersList;
