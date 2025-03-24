
import React from 'react';
import { 
  Building, 
  Edit, 
  FileText, 
  Mail, 
  MapPin, 
  MoreHorizontal, 
  Phone, 
  Ship, 
  Tag, 
  Trash2, 
  UserCircle,
  Link
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

  const handleClientCardClick = (id: string) => {
    if (onClientClick) {
      onClientClick(id);
    }
  };

  const handleCardButtonClick = (e: React.MouseEvent) => {
    // Empêcher la propagation pour éviter de déclencher le clic sur la carte
    e.stopPropagation();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <Card 
          key={client.id} 
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleClientCardClick(client.id)}
        >
          <CardContent className="p-0">
            <div className="flex items-center p-4 pb-2">
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-medium mr-3">
                {client.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{client.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={handleCardButtonClick}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEdit(client.id);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
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
                </div>
                <p className="text-sm text-muted-foreground truncate">{client.id}</p>
              </div>
            </div>
            
            <div className="px-4 py-2">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.contactName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.address}</span>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-2">
              <div className="flex flex-wrap gap-1 mb-3">
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
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Devis</span>
                  <span className="font-medium">{client.quotesCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Envois</span>
                  <span className="font-medium">{client.shipmentsCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Dernière activité</span>
                  <span className="font-medium">{client.lastActivity}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Statut</span>
                  <span className="font-medium flex items-center">
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {client.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>
            
            {client.notes && (
              <div className="px-4 py-2 border-t text-sm">
                <p className="text-muted-foreground">{client.notes}</p>
              </div>
            )}

            <div className="flex border-t divide-x">
              <Button 
                variant="ghost" 
                className="flex-1 rounded-none py-2 h-10" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(client.id);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1 rounded-none py-2 h-10"
                onClick={handleCardButtonClick}
              >
                <FileText className="h-4 w-4 mr-2" />
                Devis
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientsList;
