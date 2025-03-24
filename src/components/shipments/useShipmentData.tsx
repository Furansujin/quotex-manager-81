
import { useState } from 'react';
import { Shipment } from './ShipmentTable';

export const useShipmentData = () => {
  // Mock shipment data with enhanced properties
  const shipmentData: Shipment[] = [
    { 
      id: "SHP-2023-0089", 
      client: "Tech Supplies Inc", 
      departureDate: "22/05/2023", 
      arrivalDate: "15/06/2023",
      origin: "Shanghai, CN", 
      destination: "Paris, FR",
      status: "en cours",
      progress: 65,
      type: "Maritime",
      containers: "2 x 40HC",
      isWatched: true,
      hasDocumentIssues: true
    },
    { 
      id: "SHP-2023-0088", 
      client: "Pharma Solutions", 
      departureDate: "18/05/2023", 
      arrivalDate: "20/05/2023",
      origin: "New York, US", 
      destination: "Madrid, ES",
      status: "terminée",
      progress: 100,
      type: "Aérien",
      containers: "250 kg"
    },
    { 
      id: "SHP-2023-0087", 
      client: "Global Imports Ltd", 
      departureDate: "26/05/2023", 
      arrivalDate: "14/06/2023",
      origin: "Rotterdam, NL", 
      destination: "Marseille, FR",
      status: "planifiée",
      progress: 20,
      type: "Maritime",
      containers: "1 x 20GP",
      priority: "haute"
    },
    { 
      id: "SHP-2023-0086", 
      client: "Eurotech GmbH", 
      departureDate: "15/05/2023", 
      arrivalDate: "17/05/2023",
      origin: "Munich, DE", 
      destination: "Lyon, FR",
      status: "retardée",
      progress: 80,
      type: "Routier",
      containers: "Camion complet",
      hasDocumentIssues: true
    },
    { 
      id: "SHP-2023-0085", 
      client: "Tech Innovations SA", 
      departureDate: "10/05/2023", 
      arrivalDate: "25/05/2023",
      origin: "Hambourg, DE", 
      destination: "Barcelone, ES",
      status: "en cours",
      progress: 45,
      type: "Maritime",
      containers: "1 x 40HC",
      isWatched: true
    },
    { 
      id: "SHP-2023-0084", 
      client: "Medical Supplies", 
      departureDate: "05/05/2023", 
      arrivalDate: "07/05/2023",
      origin: "Paris, FR", 
      destination: "Milan, IT",
      status: "terminée",
      progress: 100,
      type: "Routier",
      containers: "Camionnette"
    },
  ];
  
  const [shipments] = useState<Shipment[]>(shipmentData);
  
  return {
    shipments
  };
};
