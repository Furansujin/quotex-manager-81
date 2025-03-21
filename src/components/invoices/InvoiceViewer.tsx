
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Save, Printer, Send, Download, CreditCard } from 'lucide-react';
import { Invoice } from '@/hooks/useInvoiceService';
import { useToast } from '@/hooks/use-toast';

interface InvoiceViewerProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSendEmail?: (invoiceId: string, email: string) => Promise<boolean>;
  onMarkAsPaid?: (invoiceId: string) => void;
  onUpdateInvoice?: (
    invoiceId: string,
    updates: { notes?: string; legalNotice?: string; paymentTerms?: string }
  ) => void;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({
  invoice,
  isOpen,
  onClose,
  onSendEmail,
  onMarkAsPaid,
  onUpdateInvoice
}) => {
  const [notes, setNotes] = useState(invoice?.notes || '');
  const [legalNotice, setLegalNotice] = useState(invoice?.legalNotice || '');
  const [paymentTerms, setPaymentTerms] = useState(invoice?.paymentTerms || '');
  const [emailTo, setEmailTo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Met à jour les champs d'édition lorsque la facture change
  React.useEffect(() => {
    if (invoice) {
      setNotes(invoice.notes || '');
      setLegalNotice(invoice.legalNotice || '');
      setPaymentTerms(invoice.paymentTerms || '');
    }
  }, [invoice]);

  const handleSaveChanges = () => {
    if (invoice && onUpdateInvoice) {
      onUpdateInvoice(invoice.id, { notes, legalNotice, paymentTerms });
    }
  };

  const handleSendEmail = async () => {
    if (!emailTo) {
      toast({
        title: "Champ requis",
        description: "Veuillez saisir une adresse email.",
        variant: "destructive"
      });
      return;
    }

    if (!emailTo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Format incorrect",
        description: "Veuillez saisir une adresse email valide.",
        variant: "destructive"
      });
      return;
    }

    if (invoice && onSendEmail) {
      setIsSending(true);
      try {
        await onSendEmail(invoice.id, emailTo);
        setEmailTo('');
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleMarkAsPaid = () => {
    if (invoice && onMarkAsPaid) {
      onMarkAsPaid(invoice.id);
    }
  };

  const handlePrint = () => {
    // Dans une application réelle, cela pourrait utiliser une bibliothèque d'impression
    window.print();
  };

  const handleDownload = () => {
    // Dans une application réelle, cela déclencherait le téléchargement d'un PDF
    toast({
      title: "Téléchargement",
      description: "Le téléchargement de la facture a démarré."
    });
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Facture {invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="view">Aperçu</TabsTrigger>
            <TabsTrigger value="edit">Personnaliser</TabsTrigger>
            <TabsTrigger value="send">Envoyer</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <div className="bg-white p-8 rounded-lg border shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold">FACTURE</h1>
                  <p className="text-muted-foreground">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Transportix SARL</p>
                  <p>123 Avenue du Commerce</p>
                  <p>75001 Paris, France</p>
                  <p>contact@transportix.com</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="font-semibold mb-2">Facturé à:</h2>
                  <p>{invoice.client}</p>
                  <p>ID Client: {invoice.clientId}</p>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date d'émission:</p>
                      <p className="font-medium">{invoice.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date d'échéance:</p>
                      <p className="font-medium">{invoice.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conditions de paiement:</p>
                      <p className="font-medium">{invoice.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Statut:</p>
                      <p className={`font-medium ${
                        invoice.status === 'paid' ? 'text-green-600' :
                        invoice.status === 'overdue' ? 'text-red-600' :
                        invoice.status === 'cancelled' ? 'text-gray-600' :
                        'text-amber-600'
                      }`}>
                        {invoice.status === 'paid' ? 'Payée' :
                         invoice.status === 'overdue' ? 'En retard' :
                         invoice.status === 'cancelled' ? 'Annulée' :
                         'En attente'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <table className="w-full border-collapse mb-8">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Quantité</th>
                    <th className="text-right py-2">Prix unitaire</th>
                    <th className="text-right py-2">TVA</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">{item.unitPrice.toFixed(2)} €</td>
                      <td className="text-right py-2">{item.tax}%</td>
                      <td className="text-right py-2">{item.total.toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span>Sous-total:</span>
                    <span>
                      {invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>TVA (20%):</span>
                    <span>
                      {invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity * item.tax / 100), 0).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between py-2 font-bold border-t">
                    <span>Total:</span>
                    <span>{invoice.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Notes:</h3>
                  <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </div>
              )}

              {invoice.legalNotice && (
                <div className="text-xs text-muted-foreground border-t pt-4">
                  {invoice.legalNotice}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              {invoice.status !== 'paid' && onMarkAsPaid && (
                <Button variant="outline" onClick={handleMarkAsPaid} className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Marquer comme payée
                </Button>
              )}
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
              <Button variant="outline" onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Conditions de paiement</label>
                    <Input 
                      value={paymentTerms} 
                      onChange={(e) => setPaymentTerms(e.target.value)} 
                      placeholder="Ex: Paiement à 30 jours"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Notes</label>
                    <Textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      placeholder="Notes additionnelles pour le client"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Mentions légales</label>
                    <Textarea 
                      value={legalNotice} 
                      onChange={(e) => setLegalNotice(e.target.value)} 
                      placeholder="Mentions légales obligatoires"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveChanges} className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Envoyer par email</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Adresse email du destinataire</label>
                    <Input 
                      type="email"
                      value={emailTo} 
                      onChange={(e) => setEmailTo(e.target.value)} 
                      placeholder="client@example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSendEmail} 
                disabled={isSending || !emailTo}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isSending ? 'Envoi en cours...' : 'Envoyer la facture'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewer;
