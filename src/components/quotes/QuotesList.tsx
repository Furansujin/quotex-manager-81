
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Download, MapPin, Calendar, DollarSign, Layers, ArrowRight } from 'lucide-react';
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
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20">Rejeté</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-500/20">Expiré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to get transport type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Maritime':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Maritime</Badge>;
      case 'Aérien':
        return <Badge variant="outline" className="bg-sky-500/10 text-sky-600 border-sky-500/20">Aérien</Badge>;
      case 'Routier':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Routier</Badge>;
      case 'Multimodal':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">Multimodal</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Helper function to get icon based on transport type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Maritime':
        return <div className="p-2 rounded-md bg-blue-500/10"><Layers className="h-5 w-5 text-blue-600" /></div>;
      case 'Aérien':
        return <div className="p-2 rounded-md bg-sky-500/10"><Layers className="h-5 w-5 text-sky-600" /></div>;
      case 'Routier':
        return <div className="p-2 rounded-md bg-amber-500/10"><Layers className="h-5 w-5 text-amber-600" /></div>;
      case 'Multimodal':
        return <div className="p-2 rounded-md bg-purple-500/10"><Layers className="h-5 w-5 text-purple-600" /></div>;
      default:
        return <div className="p-2 rounded-md bg-gray-500/10"><Layers className="h-5 w-5 text-gray-600" /></div>;
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
      <Card className="p-8 text-center bg-muted/30 border-dashed">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Layers className="h-8 w-8 text-primary/80" />
          </div>
          <h3 className="font-medium text-lg">Aucun devis trouvé</h3>
          <p className="text-muted-foreground max-w-sm">
            Aucun devis ne correspond à votre recherche ou à vos filtres actuels.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <Card 
          key={quote.id} 
          className="hover:shadow-md transition-all duration-200 hover:border-primary/40 overflow-hidden group"
          onClick={(e) => {
            // Prevent click when action buttons are clicked
            if ((e.target as HTMLElement).closest('button')) return;
            onEdit(quote.id);
          }}
        >
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 relative">
              <div className="absolute top-0 left-0 w-full h-1">
                <Progress value={getProgressValue(quote.status)} className="h-1 rounded-none" />
              </div>
              
              <div className="flex items-start gap-3 pt-2">
                {getTypeIcon(quote.type)}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{quote.id}</h3>
                    {getStatusBadge(quote.status)}
                    {getTypeBadge(quote.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{quote.client}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm flex-1">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    <p>Trajet</p>
                  </div>
                  <p className="font-medium truncate">
                    <span className="text-primary/90">{quote.origin}</span>
                    <ArrowRight className="h-3 w-3 inline mx-1" />
                    <span className="text-primary/90">{quote.destination}</span>
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    <p>Date</p>
                  </div>
                  <p className="font-medium">
                    {quote.date}
                    {quote.validUntil && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (valide jusqu'au {quote.validUntil})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <DollarSign className="h-3 w-3" />
                    <p>Montant</p>
                  </div>
                  <p className="font-medium">{quote.amount}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {renderFollowUpButton && renderFollowUpButton(quote)}
                
                <div className="flex items-center -mr-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(quote.id); }} 
                    className="h-8 w-8 p-0 rounded-full">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDuplicate(quote.id); }} 
                    className="h-8 w-8 p-0 rounded-full">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Dupliquer</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDownload(quote.id); }} 
                    className="h-8 w-8 p-0 rounded-full">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Télécharger</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuotesList;
