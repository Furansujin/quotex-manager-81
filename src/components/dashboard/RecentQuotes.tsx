import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import ShipmentTypeIcon from '@/components/shipments/ShipmentTypeIcon';

interface Quote {
  id: string;
  client: string;
  type: 'maritime' | 'air' | 'road' | 'multimodal';
  date: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockQuotes: Quote[] = [
  {
    id: 'Q-2023-1589',
    client: 'Global Imports Ltd',
    type: 'maritime',
    date: '2023-06-15',
    amount: '$3,450.00',
    status: 'approved'
  },
  {
    id: 'Q-2023-1590',
    client: 'Tech Supplies Inc',
    type: 'air',
    date: '2023-06-14',
    amount: '$5,120.75',
    status: 'pending'
  },
  {
    id: 'Q-2023-1591',
    client: 'Furniture Express',
    type: 'road',
    date: '2023-06-12',
    amount: '$1,845.30',
    status: 'rejected'
  },
  {
    id: 'Q-2023-1592',
    client: 'Pharma Solutions',
    type: 'multimodal',
    date: '2023-06-10',
    amount: '$8,760.00',
    status: 'pending'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const RecentQuotes: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {mockQuotes.map((quote) => (
          <div 
            key={quote.id}
            className="p-4 rounded-lg border border-border bg-white hover:bg-muted/20 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{quote.client}</h4>
                  <div className="flex items-center">
                    <ShipmentTypeIcon type={
                      quote.type === 'air' ? 'aérien' : 
                      quote.type === 'road' ? 'routier' : 
                      quote.type === 'multimodal' ? 'multimodal' : 
                      'maritime'
                    } className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{quote.id}</p>
              </div>
              <div className="flex items-center space-x-1">
                {getStatusIcon(quote.status)}
                <span className="text-sm capitalize">
                  {quote.status}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-end mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">{quote.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-sm">{quote.date}</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">
                View <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="outline" className="w-full">View All Quotes</Button>
      </div>
    </div>
  );
};

export default RecentQuotes;
