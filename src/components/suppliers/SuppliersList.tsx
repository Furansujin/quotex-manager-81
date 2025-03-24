
import React, { useState } from 'react';
import { 
  Building, 
  MoreHorizontal, 
  Phone, 
  Trash2, 
  FileText, 
  Ship,
  Link
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import SupplierDetail from './SupplierDetail';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  lastActivity?: string;
}

interface SuppliersListProps {
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const SuppliersList: React.FC<SuppliersListProps> = ({ 
  sortField, 
  sortDirection,
  onSort
}) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Données fictives pour la démonstration
  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'CMA CGM',
      category: 'maritime',
      contact: 'Jean Dupont',
      email: 'jean.dupont@cmacgm.com',
      phone: '+33 1 23 45 67 89',
      address: '4 Quai d\'Arenc, 13002 Marseille',
      status: 'active',
      lastActivity: '11/05/2023'
    },
    {
      id: '2',
      name: 'Maersk',
      category: 'maritime',
      contact: 'Sophie Martin',
      email: 'sophie.martin@maersk.com',
      phone: '+33 2 34 56 78 90',
      address: '92 Cours Lafayette, 69003 Lyon',
      status: 'active',
      lastActivity: '15/05/2023'
    },
    {
      id: '3',
      name: 'Air France Cargo',
      category: 'aerien',
      contact: 'Pierre Dubois',
      email: 'pierre.dubois@airfrance.fr',
      phone: '+33 3 45 67 89 01',
      address: '45 Rue de Paris, 95700 Roissy-en-France',
      status: 'active',
      lastActivity: '05/06/2023'
    },
    {
      id: '4',
      name: 'DB Schenker',
      category: 'multimodal',
      contact: 'Marie Leroy',
      email: 'marie.leroy@dbschenker.com',
      phone: '+33 4 56 78 90 12',
      address: '110 Avenue du Général de Gaulle, 94000 Créteil',
      status: 'inactive',
      lastActivity: '20/04/2023'
    },
  ];

  const handleDelete = (id: string) => {
    setSupplierToDelete(id);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      toast({
        title: "Fournisseur supprimé",
        description: "Le fournisseur a été supprimé avec succès."
      });
      setSupplierToDelete(null);
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'maritime': return 'Maritime';
      case 'aerien': return 'Aérien';
      case 'routier': return 'Routier';
      case 'ferroviaire': return 'Ferroviaire';
      case 'multimodal': return 'Multimodal';
      default: return category;
    }
  };

  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Building className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg mb-1">Aucun fournisseur trouvé</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Aucun fournisseur ne correspond à vos critères de recherche ou aucun fournisseur n'a été créé.
        </p>
        <Button>Créer un fournisseur</Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center">
                  Nom
                  {sortField === 'name' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden md:table-cell">Téléphone</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow 
                key={supplier.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedSupplierId(supplier.id)}
              >
                <TableCell className="font-medium">
                  {supplier.name}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{supplier.contact}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{supplier.email}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    {supplier.category === 'maritime' && <Ship className="h-3 w-3" />}
                    {getCategoryDisplayName(supplier.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={supplier.status === 'active' ? 'default' : 'destructive'} 
                    className="text-xs">
                    {supplier.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSupplierId(supplier.id);
                      }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(supplier.id);
                      }}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <FileText className="h-4 w-4 mr-2" />
                        Créer un devis
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedSupplierId && (
        <SupplierDetail 
          supplierId={selectedSupplierId}
          onClose={() => setSelectedSupplierId(null)}
        />
      )}

      <AlertDialog open={!!supplierToDelete} onOpenChange={(open) => !open && setSupplierToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce fournisseur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce fournisseur seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SuppliersList;
