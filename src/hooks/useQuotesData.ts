
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { QuoteFilterValues } from '@/components/quotes/QuoteFilters';

export interface CargoDimensions {
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  volume?: string;
}

export interface CargoDetails {
  description?: string;
  type?: string;
  nature?: string;
  dimensions?: CargoDimensions;
  packaging?: string;
  packageCount?: string;
}

export interface Quote {
  id: string;
  client: string;
  clientId: string;
  date: string;
  origin: string;
  destination: string;
  status: string;
  amount: string;
  type: string;
  commercial?: string;
  lastModified?: string;
  validUntil?: string;
  notes?: string;
  cargoDetails?: CargoDetails;
}

export const useQuotesData = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<QuoteFilterValues | null>(null);
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([
    { 
      id: "QT-2023-0142", 
      client: "Tech Supplies Inc", 
      clientId: "CL-001",
      date: "22/05/2023", 
      origin: "Shanghai, CN", 
      destination: "Paris, FR",
      status: "approved",
      amount: "€ 3,450.00",
      type: "Maritime",
      commercial: "Jean Dupont",
      lastModified: "24/05/2023",
      validUntil: "22/06/2023",
      notes: "Client prioritaire, tarifs négociés"
    },
    { 
      id: "QT-2023-0141", 
      client: "Pharma Solutions", 
      clientId: "CL-002",
      date: "21/05/2023", 
      origin: "New York, US", 
      destination: "Madrid, ES",
      status: "pending",
      amount: "€ 2,120.50",
      type: "Aérien",
      commercial: "Marie Martin",
      lastModified: "21/05/2023",
      validUntil: "21/06/2023",
      notes: "Expédition urgente, délai de livraison critique"
    },
    { 
      id: "QT-2023-0140", 
      client: "Global Imports Ltd", 
      clientId: "CL-003",
      date: "20/05/2023", 
      origin: "Rotterdam, NL", 
      destination: "Marseille, FR",
      status: "pending",
      amount: "€ 1,780.25",
      type: "Maritime",
      commercial: "Jean Dupont",
      lastModified: "22/05/2023",
      validUntil: "20/06/2023",
      notes: ""
    },
    { 
      id: "QT-2023-0139", 
      client: "Eurotech GmbH", 
      clientId: "CL-004",
      date: "19/05/2023", 
      origin: "Munich, DE", 
      destination: "Lyon, FR",
      status: "rejected",
      amount: "€ 890.00",
      type: "Routier",
      commercial: "Pierre Durand",
      lastModified: "20/05/2023",
      validUntil: "19/06/2023",
      notes: "Client a demandé une révision des tarifs"
    },
    { 
      id: "QT-2023-0138", 
      client: "Tech Supplies Inc", 
      clientId: "CL-001",
      date: "18/05/2023", 
      origin: "Hong Kong, HK", 
      destination: "Paris, FR",
      status: "expired",
      amount: "€ 4,230.75",
      type: "Maritime",
      commercial: "Jean Dupont",
      lastModified: "18/05/2023",
      validUntil: "18/06/2023",
      notes: "Devis remplacé par QT-2023-0142"
    },
  ]);

  // Add a new quote to the list
  const addQuote = (quote: Quote) => {
    setQuotes(prevQuotes => {
      // Check if the quote already exists (for editing)
      const existingIndex = prevQuotes.findIndex(q => q.id === quote.id);
      
      if (existingIndex >= 0) {
        // Update the existing quote
        const updatedQuotes = [...prevQuotes];
        updatedQuotes[existingIndex] = quote;
        return updatedQuotes;
      } else {
        // Add the new quote at the beginning of the array
        return [quote, ...prevQuotes];
      }
    });
  };

  // Filter quotes based on active tab, search term, and filters
  const filteredQuotes = quotes.filter(quote => {
    // Filtre par onglet
    if (activeTab !== 'all' && quote.status !== activeTab) {
      return false;
    }
    
    // Filtre par recherche texte
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        quote.id.toLowerCase().includes(searchLower) ||
        quote.client.toLowerCase().includes(searchLower) ||
        quote.origin.toLowerCase().includes(searchLower) ||
        quote.destination.toLowerCase().includes(searchLower) ||
        quote.type.toLowerCase().includes(searchLower) ||
        quote.commercial?.toLowerCase().includes(searchLower) ||
        quote.notes?.toLowerCase().includes(searchLower);
        
      if (!matchesSearch) return false;
    }
    
    // Filtres avancés
    if (activeFilters) {
      // Filtre par status
      if (activeFilters.status.length > 0 && !activeFilters.status.includes(quote.status)) {
        return false;
      }
      
      // Filtre par type
      if (activeFilters.types.length > 0 && !activeFilters.types.includes(quote.type)) {
        return false;
      }
      
      // Filtre par commercial
      if (activeFilters.commercial && activeFilters.commercial !== 'all') {
        const commercialFirstName = quote.commercial?.split(' ')[0].toLowerCase();
        if (commercialFirstName !== activeFilters.commercial) {
          return false;
        }
      }
      
      // Filtre par montant
      if (activeFilters.minAmount) {
        const amount = parseFloat(quote.amount.replace('€', '').replace(',', '').trim());
        if (amount < activeFilters.minAmount) {
          return false;
        }
      }
      
      if (activeFilters.maxAmount) {
        const amount = parseFloat(quote.amount.replace('€', '').replace(',', '').trim());
        if (amount > activeFilters.maxAmount) {
          return false;
        }
      }
      
      // Filtre par date
      if (activeFilters.startDate) {
        const quoteDate = new Date(quote.date.split('/').reverse().join('-'));
        if (quoteDate < activeFilters.startDate) {
          return false;
        }
      }
      
      if (activeFilters.endDate) {
        const quoteDate = new Date(quote.date.split('/').reverse().join('-'));
        if (quoteDate > activeFilters.endDate) {
          return false;
        }
      }
    }
    
    // Si toutes les conditions sont passées, inclure le devis
    return true;
  });

  const handleApplyFilters = (filters: QuoteFilterValues) => {
    setActiveFilters(filters);
    
    toast({
      title: "Filtres appliqués",
      description: "Les devis ont été filtrés selon vos critères.",
    });
    
    // Reset to first tab if the filters apply to a specific status
    if (filters.status.length > 0) {
      // If only one status is selected, go to that tab
      if (filters.status.length === 1) {
        setActiveTab(filters.status[0]);
      } else {
        setActiveTab('all');
      }
    }
  };
  
  const clearAllFilters = () => {
    setActiveFilters(null);
    setSearchTerm('');
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés.",
    });
  };

  // Listen for new quotes added via useQuoteActions
  useEffect(() => {
    // In a real app, this would be a subscription to a backend service
    // or a websocket connection to get real-time updates
    
    // You could also use a more sophisticated state management solution
    // like React Context, Redux, or Zustand
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'newQuote') {
        try {
          const newQuote = JSON.parse(e.newValue || '');
          if (newQuote && newQuote.id) {
            addQuote(newQuote);
          }
        } catch (error) {
          console.error('Failed to parse new quote data', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    activeFilters,
    setActiveFilters,
    filteredQuotes,
    quotes,
    addQuote,
    handleApplyFilters,
    clearAllFilters
  };
};
