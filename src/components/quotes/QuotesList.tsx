
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Copy, 
  Download, 
  ArrowRight, 
  MoreHorizontal, 
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Quote } from '@/hooks/useQuotesData';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface QuotesListProps {
  quotes: Quote[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDownload: (id: string) => void;
  renderFollowUpButton?: (quote: Quote) => React.ReactNode;
  onSort?: (field: string) => void;
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc' | null;
}

const QuotesList: React.FC<QuotesListProps> = ({ 
  quotes, 
  onEdit, 
  onDuplicate, 
  onDownload, 
  renderFollowUpButton,
  onSort,
  sortField,
  sortDirection
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-200">En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-200">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-200">Rejeté</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200">Expiré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to get transport type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Maritime':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Maritime</Badge>;
      case 'Aérien':
        return <Badge variant="outline" className="bg-sky-100 text-sky-700">Aérien</Badge>;
      case 'Routier':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700">Routier</Badge>;
      case 'Multimodal':
        return <Badge variant="outline" className="bg-purple-100 text-purple-700">Multimodal</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Fonction pour rendre les icônes de tri
  const renderSortIcon = (field: string) => {
    if (!onSort) return null;
    
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onSort) onSort(field);
        }}
        className="ml-1 p-0 h-6 w-6 hover:bg-transparent"
      >
        {sortField === field && sortDirection === 'asc' && <ArrowUp className="h-3.5 w-3.5 text-primary" />}
        {sortField === field && sortDirection === 'desc' && <ArrowDown className="h-3.5 w-3.5 text-primary" />}
        {sortField !== field && <div className="h-3.5 w-3.5 opacity-0 group-hover:opacity-30">↕</div>}
      </Button>
    );
  };

  if (quotes.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        Aucun devis trouvé.
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="group">
                N° Devis
                {renderSortIcon('id')}
              </TableHead>
              <TableHead className="group">
                Client
                {renderSortIcon('client')}
              </TableHead>
              <TableHead className="group">
                Date
                {renderSortIcon('date')}
              </TableHead>
              <TableHead className="group">
                Type
                {renderSortIcon('type')}
              </TableHead>
              <TableHead className="group">
                Destination
                {renderSortIcon('destination')}
              </TableHead>
              <TableHead className="group">
                Montant
                {renderSortIcon('amount')}
              </TableHead>
              <TableHead className="group">
                Statut
                {renderSortIcon('status')}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow 
                key={quote.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onEdit(quote.id)}
                onMouseEnter={() => setHoveredRow(quote.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="font-medium">{quote.id}</TableCell>
                <TableCell>{quote.client}</TableCell>
                <TableCell>{quote.date}</TableCell>
                <TableCell>{getTypeBadge(quote.type)}</TableCell>
                <TableCell>{quote.destination}</TableCell>
                <TableCell>{quote.amount}</TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                    {quote.status === 'pending' && renderFollowUpButton && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-8 px-2 transition-opacity ${hoveredRow === quote.id ? 'opacity-100' : 'opacity-70'}`}
                          >
                            <ArrowRight className="h-4 w-4" />
                            <span className="sr-only">Relancer</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                          <div className="p-2">
                            {renderFollowUpButton(quote)}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 px-2 transition-opacity ${hoveredRow === quote.id ? 'opacity-100' : 'opacity-70'}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 pointer-events-auto">
                        <DropdownMenuItem onClick={() => onEdit(quote.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(quote.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Dupliquer</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownload(quote.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Télécharger</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default QuotesList;
