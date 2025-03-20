
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, User, Mail, Phone, MapPin } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  type: string;
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
}

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  client,
  setClient,
  clientDetails,
  showClientInfo,
  setShowClientInfo,
  clientId
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center justify-between">
        <span>Client *</span>
        {clientDetails && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs gap-1"
            onClick={() => setShowClientInfo(!showClientInfo)}
          >
            <Info className="h-3 w-3" />
            {showClientInfo ? 'Masquer détails' : 'Voir détails'}
          </Button>
        )}
      </label>
      <Input 
        placeholder="Nom du client" 
        value={client} 
        onChange={(e) => setClient(e.target.value)} 
        disabled={!!clientId}
        className={clientId ? "bg-muted" : ""}
      />
      
      {showClientInfo && clientDetails && (
        <Card className="mt-2 border border-muted">
          <CardContent className="p-3 text-sm space-y-1">
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
            {clientDetails.tags && clientDetails.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {clientDetails.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
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
