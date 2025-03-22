
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, User, Mail, Phone, MapPin, Package, Calendar, Link } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  lastQuote?: string;
  createdAt: string;
  tags?: string[];
  quoteCount?: number;
  preferredShipping?: string;
}

interface ClientInfoCardProps {
  client: string;
  setClient: (value: string) => void;
  clientDetails: Client | undefined;
  showClientInfo: boolean;
  setShowClientInfo: (value: boolean) => void;
  clientId?: string;
  initialClientName?: string | null;
  onTagClick?: (tag: string) => void;
}

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  client,
  setClient,
  clientDetails,
  showClientInfo,
  setShowClientInfo,
  clientId,
  initialClientName,
  onTagClick
}) => {
  // Set the client name from initialClientName if it's provided
  useEffect(() => {
    if (initialClientName && !client) {
      setClient(initialClientName);
    }
  }, [initialClientName, client, setClient]);

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Client *</label>
        {clientDetails && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs gap-1"
            onClick={() => setShowClientInfo(!showClientInfo)}
          >
            <Info className="h-3 w-3" />
            {showClientInfo ? 'Masquer infos' : 'Voir infos'}
          </Button>
        )}
      </div>
      
      <Input 
        placeholder="Nom du client" 
        value={client} 
        onChange={(e) => setClient(e.target.value)} 
        disabled={!!clientId}
        className={clientId ? "bg-muted" : ""}
      />
      
      {showClientInfo && clientDetails && (
        <Card className="mt-2 border border-muted bg-muted/30">
          <CardContent className="p-3 text-sm space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{clientDetails.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{clientDetails.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{clientDetails.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{clientDetails.address}</span>
              </div>
              {clientDetails.preferredShipping && (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Transport préféré: {clientDetails.preferredShipping}</span>
                </div>
              )}
              {clientDetails.quoteCount !== undefined && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Devis précédents: {clientDetails.quoteCount}</span>
                </div>
              )}
            </div>
            
            {clientDetails.tags && clientDetails.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {clientDetails.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-primary/10 flex items-center gap-1"
                    onClick={(e) => handleTagClick(tag, e)}
                  >
                    <Link className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientInfoCard;
