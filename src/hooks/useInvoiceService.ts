
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Quote } from '@/hooks/useQuotesData';

export interface Invoice {
  id: string;
  quoteId: string;
  client: string;
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  items: InvoiceItem[];
  notes?: string;
  legalNotice?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export const useInvoiceService = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const { toast } = useToast();

  // Générer une facture à partir d'un devis
  const generateInvoice = async (quote: Quote): Promise<Invoice> => {
    setIsGenerating(true);
    
    try {
      // Dans une application réelle, cette logique serait sur le serveur
      // Ici on simule un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Extraire les éléments du devis pour la facture
      // Dans une situation réelle, nous récupérerions les informations des articles
      // à partir de la base de données
      const items: InvoiceItem[] = [
        {
          description: `Service de transport ${quote.type} de ${quote.origin} à ${quote.destination}`,
          quantity: 1,
          unitPrice: parseFloat(quote.amount.replace(/[^0-9.-]+/g, "")),
          tax: 20, // TVA 20%
          total: parseFloat(quote.amount.replace(/[^0-9.-]+/g, "")) * 1.2
        }
      ];
      
      // Générer un numéro de facture unique
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Configurer les dates
      const issueDate = new Date().toLocaleDateString('fr-FR');
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'); // +30 jours
      
      // Créer l'objet facture
      const newInvoice: Invoice = {
        id: `invoice_${Date.now()}`,
        quoteId: quote.id,
        client: quote.client,
        clientId: quote.clientId,
        invoiceNumber,
        issueDate,
        dueDate,
        amount: quote.amount,
        status: 'pending',
        paymentTerms: 'Paiement à 30 jours',
        items,
        notes: 'Merci pour votre confiance.',
        legalNotice: 'En cas de retard de paiement, des pénalités seront appliquées selon la législation en vigueur.'
      };
      
      // Ajouter la facture à la liste des factures
      setInvoices(prev => [newInvoice, ...prev]);
      
      toast({
        title: "Facture générée",
        description: `La facture ${invoiceNumber} a été créée avec succès.`
      });
      
      return newInvoice;
    } catch (error) {
      console.error('Erreur lors de la génération de la facture', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la facture. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Ouvre le modal d'édition de facture
  const openInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setShowInvoiceModal(true);
  };

  // Ferme le modal d'édition de facture
  const closeInvoice = () => {
    setCurrentInvoice(null);
    setShowInvoiceModal(false);
  };

  // Envoyer la facture par email
  const sendInvoice = async (invoiceId: string, email: string) => {
    try {
      // Simuler l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Facture envoyée",
        description: `La facture a été envoyée à ${email}.`
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la facture. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Marquer une facture comme payée
  const markAsPaid = (invoiceId: string) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, status: 'paid' } 
          : invoice
      )
    );
    
    toast({
      title: "Statut mis à jour",
      description: "La facture a été marquée comme payée."
    });
  };

  // Trouver une facture par son ID
  const findInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  // Trouver une facture par l'ID du devis associé
  const findInvoiceByQuoteId = (quoteId: string) => {
    return invoices.find(invoice => invoice.quoteId === quoteId);
  };

  // Mettre à jour les notes ou mentions légales d'une facture
  const updateInvoice = (
    invoiceId: string, 
    updates: { notes?: string; legalNotice?: string; paymentTerms?: string }
  ) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, ...updates } 
          : invoice
      )
    );
    
    toast({
      title: "Facture mise à jour",
      description: "Les modifications ont été enregistrées."
    });
  };

  return {
    invoices,
    isGenerating,
    currentInvoice,
    showInvoiceModal,
    generateInvoice,
    openInvoice,
    closeInvoice,
    sendInvoice,
    markAsPaid,
    findInvoiceById,
    findInvoiceByQuoteId,
    updateInvoice
  };
};
