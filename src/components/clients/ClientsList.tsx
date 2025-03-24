
import React from 'react';
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

interface Client {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  tags: string[];
  status: string;
  lastActivity: string;
  quotesCount: number;
  shipmentsCount: number;
  notes: string;
  logo: string;
}

interface ClientsListProps {
  clients: Client[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onClientClick?: (id: string) => void;
}

const ClientsList = ({ 
  clients, 
  onEdit, 
  onDelete, 
  onTagClick,
  onClientClick 
}: ClientsListProps) => {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Building className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg mb-1">Aucun client trouvé</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Aucun client ne correspond à vos critères de recherche ou aucun client n'a été créé.
        </p>
        <Button>Créer un client</Button>
      </div>
    );
  }

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="hidden md:table-cell">Téléphone</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow 
              key={client.id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => onClientClick && onClientClick(client.id)}
            >
              <TableCell className="font-medium">
                <div className="font-medium">{client.name}</div>
                <div className="text-xs text-muted-foreground">{client.id}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{client.contactName}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">{client.address}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {client.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-primary/10 flex items-center gap-1"
                      onClick={(e) => handleTagClick(tag, e)}
                    >
                      <Link className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {client.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onDelete(client.id);
                    }}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <FileText className="h-4 w-4 mr-2" />
                      Créer un devis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Ship className="h-4 w-4 mr-2" />
                      Créer un envoi
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsList;
