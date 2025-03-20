
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useQuoteActions = () => {
  const [showQuoteEditor, setShowQuoteEditor] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | undefined>(undefined);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleNewQuote = () => {
    setEditingQuoteId(undefined);
    setShowClientSelector(true);
  };

  const handleEditQuote = (id: string) => {
    setEditingQuoteId(id);
    setShowQuoteEditor(true);
  };

  const handleDuplicateQuote = (id: string) => {
    toast({
      title: "Devis dupliqué",
      description: `Le devis ${id} a été dupliqué avec succès.`,
    });
  };

  const handleDownloadQuote = (id: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Le devis ${id} est en cours de téléchargement.`,
    });
  };

  const handleClientSelect = (clientId: string, clientName: string) => {
    setSelectedClient(clientId);
    setSelectedClientName(clientName);
    setShowClientSelector(false);
    setShowQuoteEditor(true);
    
    toast({
      title: "Client sélectionné",
      description: `Création d'un devis pour ${clientName}`,
    });
  };

  return {
    showQuoteEditor,
    setShowQuoteEditor,
    editingQuoteId,
    setEditingQuoteId,
    showClientSelector,
    setShowClientSelector,
    selectedClient,
    selectedClientName,
    handleNewQuote,
    handleEditQuote,
    handleDuplicateQuote,
    handleDownloadQuote,
    handleClientSelect
  };
};
