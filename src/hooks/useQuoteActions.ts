
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Quote, CargoDetails } from '@/hooks/useQuotesData';

export const useQuoteActions = () => {
  const [showQuoteEditor, setShowQuoteEditor] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | undefined>(undefined);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleNewQuote = () => {
    setEditingQuoteId(undefined);
    setSelectedClient(null);
    setSelectedClientName(null);
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

  // New function to handle quote saving
  const saveQuote = (quoteData: Partial<Quote>): Promise<Quote> => {
    return new Promise((resolve) => {
      // In a real app, this would be an API call
      // For now, we'll simulate a server response
      setTimeout(() => {
        // Generate a new ID if it's a new quote
        const newId = quoteData.id || `QT-2023-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
        
        // Create a new quote object
        const savedQuote: Quote = {
          id: newId,
          client: quoteData.client || "Client non spécifié",
          clientId: quoteData.clientId || "UNKNOWN",
          date: quoteData.date || new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          origin: quoteData.origin || "",
          destination: quoteData.destination || "",
          status: quoteData.status || "pending",
          amount: quoteData.amount || "€ 0.00",
          type: quoteData.type || "Maritime",
          commercial: quoteData.commercial || "Jean Dupont",
          lastModified: new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          validUntil: quoteData.validUntil || "",
          notes: quoteData.notes || "",
          cargoDetails: quoteData.cargoDetails
        };
        
        toast({
          title: "Devis enregistré",
          description: `Le devis ${savedQuote.id} a été sauvegardé avec succès.`,
        });
        
        resolve(savedQuote);
      }, 800); // Simulate network delay
    });
  };

  // Function to generate PDF
  const generatePdf = (quoteId: string): Promise<string> => {
    return new Promise((resolve) => {
      // In a real app, this would call a PDF generation service
      setTimeout(() => {
        const pdfUrl = `quote_${quoteId.replace(/\-/g, '_')}.pdf`;
        
        toast({
          title: "PDF généré",
          description: "Le devis a été converti en PDF avec succès.",
        });
        
        resolve(pdfUrl);
      }, 1000);
    });
  };

  // Function to handle printing
  const printQuote = (quoteId: string): void => {
    // Create a hidden iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-9999px';
    printFrame.style.left = '-9999px';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    document.body.appendChild(printFrame);
    
    // Add the quote content
    printFrame.onload = () => {
      if (printFrame.contentDocument) {
        // In a real app, you would inject the actual quote data here
        printFrame.contentDocument.write(`
          <html>
            <head>
              <title>Devis ${quoteId}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { max-width: 150px; height: auto; }
                .quote-number { font-size: 18px; font-weight: bold; margin: 10px 0; }
                .company-info { margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f0f0f0; }
                .totals { margin-top: 30px; text-align: right; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>DEVIS</h1>
                <div class="quote-number">Référence: ${quoteId}</div>
                <div>Date: ${new Date().toLocaleDateString('fr-FR')}</div>
              </div>
              
              <div class="quote-details">
                <!-- Simulation de contenu -->
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Transport maritime container 40HC</td>
                      <td>2</td>
                      <td>1,200.00 €</td>
                      <td>2,400.00 €</td>
                    </tr>
                    <tr>
                      <td>Frais de manutention portuaire</td>
                      <td>1</td>
                      <td>350.00 €</td>
                      <td>350.00 €</td>
                    </tr>
                  </tbody>
                </table>
                
                <div class="totals">
                  <p>Sous-total: 2,750.00 €</p>
                  <p>TVA (20%): 550.00 €</p>
                  <p><strong>Total: 3,300.00 €</strong></p>
                </div>
              </div>
            </body>
          </html>
        `);
        
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        
        // Remove the iframe after printing
        setTimeout(() => {
          document.body.removeChild(printFrame);
          toast({
            title: "Impression lancée",
            description: "Le devis a été envoyé à l'imprimante.",
          });
        }, 1000);
      }
    };
    
    printFrame.src = 'about:blank';
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
    handleClientSelect,
    saveQuote,
    generatePdf,
    printQuote
  };
};
