
import React from 'react';
import { Check, X, Mail, MessageSquare, Bell, Calendar } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface FollowUp {
  id: string;
  quoteId: string;
  date: string;
  method: string;
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'responded';
}

interface FollowUpHistoryProps {
  followUps: FollowUp[];
  isExpanded: boolean;
  onToggle: () => void;
}

const FollowUpHistory: React.FC<FollowUpHistoryProps> = ({ 
  followUps,
  isExpanded,
  onToggle
}) => {
  if (followUps.length === 0) {
    return null;
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'notification': return <Bell className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="outline" className="text-blue-500">Envoyée</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="text-amber-500">Livrée</Badge>;
      case 'read':
        return <Badge variant="outline" className="text-green-500">Lue</Badge>;
      case 'responded':
        return <Badge variant="success">Répondue</Badge>;
      default:
        return null;
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle} className="w-full">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-7 mb-2 text-muted-foreground hover:text-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          Historique des relances ({followUps.length})
          <span className="ml-1">{isExpanded ? '▲' : '▼'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 pl-2 border-l-2 border-muted mt-2">
          {followUps.map((followUp) => (
            <div key={followUp.id} className="relative pl-4">
              <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-muted" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{followUp.date}</span>
                  <div className="flex items-center gap-1 text-xs">
                    {getMethodIcon(followUp.method)}
                    <span className="capitalize">{followUp.method}</span>
                  </div>
                  {getStatusBadge(followUp.status)}
                </div>
                <p className="text-sm whitespace-pre-line">{followUp.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FollowUpHistory;
