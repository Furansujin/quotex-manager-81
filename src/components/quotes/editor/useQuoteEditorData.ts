import { useState, useEffect } from 'react';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

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

// Mock clients data
const clientsData: Client[] = [
  { 
    id: 'CL-001', 
    name: 'Tech Supplies Inc', 
    contact: 'John Doe', 
    email: 'john.doe@techsupplies.com', 
    phone: '+33 1 23 45 67 89', 
    address: '123 Tech Avenue, Paris', 
    type: 'business',
    status: 'active',
    lastQuote: '22/05/2023',
    createdAt: '15/01/2023',
    tags: ['VIP', 'Tech', 'International'],
    quoteCount: 12,
    preferredShipping: 'Maritime'
  },
  { 
    id: 'CL-002', 
    name: 'Pharma Solutions', 
    contact: 'Jane Smith', 
    email: 'jane.smith@pharmasolutions.com', 
    phone: '+33 9 87 65 43 21', 
    address: '456 Health Street, Lyon', 
    type: 'business',
    status: 'active',
    lastQuote: '21/05/2023',
    createdAt: '03/02/2023',
    tags: ['Pharmacie', 'Prioritaire'],
    quoteCount: 8,
    preferredShipping: 'Aérien'
  },
  { 
    id: 'CL-003', 
    name: 'Global Imports Ltd', 
    contact: 'Robert Johnson', 
    email: 'robert@globalimports.com', 
    phone: '+33 6 11 22 33 44', 
    address: '789 Import Road, Marseille', 
    type: 'business',
    status: 'active',
    lastQuote: '20/05/2023',
    createdAt: '22/02/2023',
    tags: ['Import', 'Volumineux'],
    quoteCount: 5,
    preferredShipping: 'Maritime'
  },
  { 
    id: 'CL-004', 
    name: 'Eurotech GmbH', 
    contact: 'Anna Müller', 
    email: 'anna.muller@eurotech.de', 
    phone: '+49 30 1234567', 
    address: '10 Tech Straße, Berlin', 
    type: 'business',
    status: 'inactive',
    lastQuote: '19/05/2023',
    createdAt: '10/03/2023',
    tags: ['Europe', 'Tech'],
    quoteCount: 3,
    preferredShipping: 'Routier'
  }
];

// Suggested items by transport type
const suggestedItemsData = {
  Maritime: [
    { description: 'Transport maritime container 20FT', unitPrice: 950 },
    { description: 'Transport maritime container 40HC', unitPrice: 1200 },
    { description: 'Frais de manutention portuaire', unitPrice: 350 },
    { description: 'Assurance fret (Ad Valorem)', unitPrice: 680 },
    { description: 'Douanes et dédouanement maritime', unitPrice: 450 }
  ],
  Aérien: [
    { description: 'Transport aérien - Fret standard (<100kg)', unitPrice: 1500 },
    { description: 'Transport aérien - Fret volumique', unitPrice: 2200 },
    { description: 'Frais de manutention aéroportuaire', unitPrice: 280 },
    { description: 'Assurance fret aérien', unitPrice: 750 },
    { description: 'Douanes et dédouanement aérien', unitPrice: 350 }
  ],
  Routier: [
    { description: 'Transport routier - Camion complet', unitPrice: 850 },
    { description: 'Transport routier - Groupage', unitPrice: 450 },
    { description: 'Assurance transport routier', unitPrice: 250 },
    { description: 'Frais de passage frontière', unitPrice: 150 },
    { description: 'Frais de livraison à domicile', unitPrice: 120 }
  ],
  Ferroviaire: [
    { description: 'Transport ferroviaire - Container', unitPrice: 780 },
    { description: 'Manutention ferroviaire', unitPrice: 320 },
    { description: 'Assurance transport ferroviaire', unitPrice: 400 },
    { description: 'Frais de passage frontière ferroviaire', unitPrice: 180 }
  ],
  Multimodal: [
    { description: 'Transport multimodal - Maritime + Routier', unitPrice: 1650 },
    { description: 'Transport multimodal - Maritime + Ferroviaire', unitPrice: 1450 },
    { description: 'Coordination multimodale', unitPrice: 400 },
    { description: 'Assurance multimodale', unitPrice: 850 }
  ]
};

export function useQuoteEditorData(quoteId?: string, clientId?: string, quotes: any[] = []) {
  const isEditing = !!quoteId;
  
  // Get the selected client
  const selectedClient = clientsData.find(c => c.id === clientId);
  
  // State
  const [client, setClient] = useState(isEditing ? 'Tech Supplies Inc' : selectedClient?.name || '');
  const [clientDetails, setClientDetails] = useState<Client | undefined>(selectedClient);
  const [origin, setOrigin] = useState(isEditing ? 'Shanghai, CN' : '');
  const [destination, setDestination] = useState(isEditing ? 'Paris, FR' : '');
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [type, setType] = useState(isEditing ? 'Maritime' : selectedClient?.preferredShipping || 'Maritime');
  const [incoterm, setIncoterm] = useState('FOB');
  const [currency, setCurrency] = useState('EUR');
  const [showClientInfo, setShowClientInfo] = useState(false);
  const [items, setItems] = useState<QuoteItem[]>(
    isEditing 
      ? [
          { 
            id: '1', 
            description: 'Transport maritime container 40HC', 
            quantity: 2, 
            unitPrice: 1200, 
            discount: 0, 
            tax: 20, 
            total: 2400 
          },
          { 
            id: '2', 
            description: 'Frais de manutention portuaire', 
            quantity: 1, 
            unitPrice: 350, 
            discount: 0, 
            tax: 20, 
            total: 350 
          },
          { 
            id: '3', 
            description: 'Assurance fret (Ad Valorem)', 
            quantity: 1, 
            unitPrice: 680, 
            discount: 5, 
            tax: 20, 
            total: 646 
          }
        ]
      : []
  );

  // Load quote data if editing
  useEffect(() => {
    if (isEditing && quoteId) {
      const quoteData = quotes.find(q => q.id === quoteId);
      if (quoteData) {
        setClient(quoteData.client);
        setOrigin(quoteData.origin);
        setDestination(quoteData.destination);
        setType(quoteData.type);
        setNotes(quoteData.notes || '');
        // In a real app, you would load the items as well
      }
    }
  }, [isEditing, quoteId, quotes]);

  // Handle client selection
  useEffect(() => {
    if (selectedClient) {
      console.log("Selected client found:", selectedClient.name);
      setClient(selectedClient.name);
      setClientDetails(selectedClient);
      setType(selectedClient.preferredShipping || 'Maritime');
      
      // If the client history shows route preferences
      if (selectedClient.id === 'CL-001') {
        setOrigin('Shanghai, CN');
        setDestination('Paris, FR');
      }
    } else {
      console.log("No selected client found with ID:", clientId);
    }
  }, [selectedClient, clientId]);

  // Item management functions
  const addItem = (predefinedItem?: {description: string, unitPrice: number}) => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: predefinedItem?.description || '',
      quantity: 1,
      unitPrice: predefinedItem?.unitPrice || 0,
      discount: 0,
      tax: 20,
      total: predefinedItem?.unitPrice || 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount' || field === 'tax') {
          const quantity = field === 'quantity' ? value : item.quantity;
          const unitPrice = field === 'unitPrice' ? value : item.unitPrice;
          const discount = field === 'discount' ? value : item.discount;
          
          const subtotal = quantity * unitPrice;
          const discountAmount = subtotal * (discount / 100);
          updatedItem.total = subtotal - discountAmount;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Calculation functions
  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.total, 0);
  };

  const calculateTaxAmount = () => {
    return items.reduce((acc, item) => {
      const taxRate = item.tax / 100;
      return acc + (item.total * taxRate);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };

  // Location suggestions
  const originSuggestions = [
    "Shanghai, CN", 
    "Rotterdam, NL", 
    "Singapour, SG", 
    "Anvers, BE",
    "Hambourg, DE",
    "Hong Kong, HK",
    "New York, US",
    "Dubaï, AE"
  ];
  
  const destinationSuggestions = [
    "Paris, FR", 
    "Marseille, FR", 
    "Lyon, FR", 
    "Bordeaux, FR", 
    "Le Havre, FR",
    "Madrid, ES",
    "Barcelone, ES",
    "Berlin, DE"
  ];

  return {
    // State
    isEditing,
    client,
    setClient,
    clientDetails,
    setClientDetails,
    origin,
    setOrigin,
    destination,
    setDestination,
    validUntil,
    setValidUntil,
    notes,
    setNotes,
    type,
    setType,
    incoterm,
    setIncoterm,
    currency,
    setCurrency,
    showClientInfo,
    setShowClientInfo,
    items,
    setItems,
    
    // Functions
    addItem,
    removeItem,
    updateItem,
    calculateSubtotal,
    calculateTaxAmount,
    calculateTotal,
    
    // Data
    suggestedItems: suggestedItemsData,
    originSuggestions,
    destinationSuggestions,
    clients: clientsData
  };
}
