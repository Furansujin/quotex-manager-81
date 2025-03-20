
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Bell, Clock, ArrowRight, Send, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface FollowUpReminderProps {
  quoteId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
  lastContact?: string;
  onFollowUpSent: (method: string, message: string) => void;
}

const FollowUpReminder: React.FC<FollowUpReminderProps> = ({
  quoteId,
  clientName,
  isOpen,
  onClose,
  lastContact,
  onFollowUpSent
}) => {
  const [activeTab, setActiveTab] = useState('email');
  const [message, setMessage] = useState(`Bonjour,\n\nJe me permets de vous recontacter concernant notre devis ${quoteId} envoyé le ${lastContact || 'récemment'}.\n\nCe devis est toujours en attente de votre validation. Pouvons-nous en discuter pour répondre à vos éventuelles questions ?\n\nCordialement,\nL'équipe commerciale`);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendFollowUp = async () => {
    if (!message.trim()) {
      toast({
        title: "Message requis",
        description: "Veuillez saisir un message pour la relance.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call for sending follow-up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the callback with the method and message
      onFollowUpSent(activeTab, message);
      
      toast({
        title: "Relance envoyée",
        description: `La relance a été envoyée avec succès via ${getMethodName(activeTab)}.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la relance.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'email': return 'email';
      case 'whatsapp': return 'WhatsApp';
      case 'notification': return 'notification interne';
      default: return method;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'notification': return <Bell className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Relance pour le devis {quoteId}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Client</p>
            <p className="font-medium">{clientName}</p>
          </div>
          
          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </TabsTrigger>
              <TabsTrigger value="notification" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notification</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="mt-0">
              <Textarea 
                placeholder="Saisissez votre message de relance..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[160px]"
              />
            </TabsContent>
            
            <TabsContent value="whatsapp" className="mt-0">
              <Textarea 
                placeholder="Saisissez votre message WhatsApp..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[160px]"
              />
            </TabsContent>
            
            <TabsContent value="notification" className="mt-0">
              <Textarea 
                placeholder="Saisissez votre notification interne..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[160px]"
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSendFollowUp} disabled={isSending} className="gap-2">
            <Send className="h-4 w-4" />
            {isSending ? 'Envoi en cours...' : 'Envoyer la relance'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FollowUpReminder;
