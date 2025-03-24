
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  CalendarClock
} from 'lucide-react';
import { Invoice, InvoiceSummary } from './types/financeTypes';
import { format, subDays, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FinanceStatisticsProps {
  invoices: Invoice[];
  invoiceSummary: InvoiceSummary;
}

const FinanceStatistics: React.FC<FinanceStatisticsProps> = ({ 
  invoices,
  invoiceSummary
}) => {
  // Calculer les statistiques supplémentaires
  const calculateStats = () => {
    const today = new Date();
    
    // Factures ce mois
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    const invoicesThisMonth = invoices.filter(inv => {
      const date = new Date(inv.issueDate);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    
    // Délai moyen de paiement (pour les factures payées)
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const paymentDelays = paidInvoices.map(inv => {
      const issueDate = new Date(inv.issueDate);
      const dueDate = new Date(inv.dueDate);
      return differenceInDays(dueDate, issueDate);
    });
    
    const avgPaymentDelay = paymentDelays.length > 0 
      ? Math.round(paymentDelays.reduce((sum, delay) => sum + delay, 0) / paymentDelays.length) 
      : 0;
    
    // Taux de ponctualité
    const onTimeRate = paidInvoices.length > 0
      ? Math.round((paidInvoices.filter(inv => new Date(inv.dueDate) >= new Date(inv.issueDate)).length / paidInvoices.length) * 100)
      : 0;
    
    return {
      invoicesThisMonth: invoicesThisMonth.length,
      invoicesThisMonthValue: invoicesThisMonth.reduce((sum, inv) => sum + inv.amount, 0),
      avgPaymentDelay,
      onTimeRate
    };
  };
  
  const stats = calculateStats();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Statistiques Financières</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Délai moyen de paiement</p>
                <h3 className="text-2xl font-bold mt-1">{stats.avgPaymentDelay} jours</h3>
                <p className="text-sm text-muted-foreground mt-1">Basé sur les factures payées</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarClock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de ponctualité</p>
                <h3 className="text-2xl font-bold mt-1">{stats.onTimeRate}%</h3>
                <p className="text-sm text-muted-foreground mt-1">Paiements reçus avant échéance</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Factures ce mois</p>
                <h3 className="text-2xl font-bold mt-1">{stats.invoicesThisMonth}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Valeur: {formatCurrency(stats.invoicesThisMonthValue)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceStatistics;
