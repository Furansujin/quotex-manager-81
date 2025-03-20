
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Download, ArrowRight } from 'lucide-react';
import { Quote } from '@/hooks/useQuotesData';

interface QuotesListProps {
  quotes: Quote[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDownload: (id: string) => void;
  renderFollowUpButton?: (quote: Quote) => React.ReactNode;
}

const QuotesList: React.FC<QuotesListProps> = ({ quotes, onEdit, onDuplicate, onDownload, renderFollowUpButton }) => {
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
              <TableHead>N° Devis</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.id}</TableCell>
                <TableCell>{quote.client}</TableCell>
                <TableCell>{quote.date}</TableCell>
                <TableCell>{getTypeBadge(quote.type)}</TableCell>
                <TableCell>{quote.destination}</TableCell>
                <TableCell>{quote.amount}</TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    {renderFollowUpButton && renderFollowUpButton(quote)}
                    <Button variant="ghost" size="sm" onClick={() => onEdit(quote.id)} className="h-8 px-2">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDuplicate(quote.id)} className="h-8 px-2">
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Dupliquer</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDownload(quote.id)} className="h-8 px-2">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Télécharger</span>
                    </Button>
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
