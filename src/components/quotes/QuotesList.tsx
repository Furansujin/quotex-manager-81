
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  SlidersHorizontal,
  CalendarRange,
  User,
  Pencil,
  Copy,
  Download,
  Trash,
  MessageSquare,
  Archive
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Quote {
  id: string;
  client: string;
  clientId: string;
  date: string;
  origin: string;
  destination: string;
  status: string;
  amount: string;
  type: string;
  commercial?: string;
  lastModified?: string;
  validUntil?: string;
  notes?: string;
}

interface QuotesListProps {
  quotes: Quote[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDownload: (id: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="success">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Approuvé
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="warning">
          <Clock className="h-3 w-3 mr-1" />
          En attente
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Rejeté
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="outline">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expiré
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
  }
};

const QuotesList: React.FC<QuotesListProps> = ({ quotes, onEdit, onDuplicate, onDownload }) => {
  const { toast } = useToast();

  const handleArchive = (id: string) => {
    toast({
      title: "Devis archivé",
      description: `Le devis ${id} a été archivé avec succès.`,
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Devis supprimé",
      description: `Le devis ${id} a été supprimé avec succès.`,
      variant: "destructive"
    });
  };

  const handleSendToClient = (id: string) => {
    toast({
      title: "Devis envoyé",
      description: `Le devis ${id} a été envoyé au client avec succès.`,
    });
  };

  const handleAddNote = (id: string) => {
    toast({
      title: "Note ajoutée",
      description: `Une note a été ajoutée au devis ${id}.`,
    });
  };

  return (
    <div className="space-y-4">
      {quotes.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Aucun devis trouvé pour les critères sélectionnés</p>
          </CardContent>
        </Card>
      ) : (
        quotes.map((quote) => (
          <Card 
            key={quote.id} 
            className="hover:border-primary/50 transition-colors cursor-pointer" 
            onClick={() => onEdit(quote.id)}
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{quote.id}</h3>
                      {getStatusBadge(quote.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{quote.client}</p>
                    {quote.notes && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Note
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{quote.notes}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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
                    <div className="flex items-center gap-1">
                      <CalendarRange className="h-3 w-3" />
                      <p className="font-medium">{quote.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Montant</p>
                    <p className="font-medium">{quote.amount}</p>
                  </div>
                </div>

                <div className="md:flex items-center gap-2 hidden">
                  {quote.commercial && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {quote.commercial}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Commercial assigné</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div className="flex">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onEdit(quote.id);
                        }}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onDuplicate(quote.id);
                        }}>
                          <Copy className="h-4 w-4 mr-2" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onDownload(quote.id);
                        }}>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleSendToClient(quote.id);
                        }}>
                          <FileText className="h-4 w-4 mr-2" />
                          Envoyer au client
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleAddNote(quote.id);
                        }}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Ajouter une note
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(quote.id);
                        }}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archiver
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(quote.id);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default QuotesList;
