
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Download, MapPin, Calendar, DollarSign, Layers } from 'lucide-react';
import { Quote } from '@/hooks/useQuotesData';
import { Progress } from '@/components/ui/progress';

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

  // Helper function to get icon based on transport type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Maritime':
        return <div className="p-2 rounded-md bg-blue-100"><Layers className="h-5 w-5 text-blue-600" /></div>;
      case 'Aérien':
        return <div className="p-2 rounded-md bg-sky-100"><Layers className="h-5 w-5 text-sky-600" /></div>;
      case 'Routier':
        return <div className="p-2 rounded-md bg-amber-100"><Layers className="h-5 w-5 text-amber-600" /></div>;
      case 'Multimodal':
        return <div className="p-2 rounded-md bg-purple-100"><Layers className="h-5 w-5 text-purple-600" /></div>;
      default:
        return <div className="p-2 rounded-md bg-gray-100"><Layers className="h-5 w-5 text-gray-600" /></div>;
    }
  };

  // Helper function to get progress value based on status
  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending':
        return 40;
      case 'approved':
        return 100;
      case 'rejected':
        return 100;
      case 'expired':
        return 100;
      default:
        return 0;
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
    <div className="space-y-4">
      {quotes.map((quote) => (
        <Card 
          key={quote.id} 
          className="hover:border-primary/50 transition-colors cursor-pointer"
          onClick={(e) => {
            // Prevent click when action buttons are clicked
            if ((e.target as HTMLElement).closest('button')) return;
            onEdit(quote.id);
          }}
        >
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
              <div className="flex items-start gap-3">
                {getTypeIcon(quote.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{quote.id}</h3>
                    {getStatusBadge(quote.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{quote.client}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm flex-1">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <p>Trajet</p>
                  </div>
                  <p className="font-medium">{quote.origin} → {quote.destination}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <p>Date</p>
                  </div>
                  <p className="font-medium">{quote.date} {quote.validUntil ? `(valide jusqu'au ${quote.validUntil})` : ''}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <p>Montant</p>
                  </div>
                  <p className="font-medium">{quote.amount}</p>
                </div>
              </div>
              
              <div className="w-full md:w-32">
                <div className="flex justify-between text-xs mb-1">
                  <span>Statut</span>
                  <span>{quote.status === 'pending' ? 'En attente' : 
                         quote.status === 'approved' ? 'Approuvé' : 
                         quote.status === 'rejected' ? 'Rejeté' : 'Expiré'}</span>
                </div>
                <Progress value={getProgressValue(quote.status)} className="h-2" />
              </div>
              
              <div className="flex items-center justify-end space-x-1">
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuotesList;
