
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  CalendarClock,
  PieChart,
  LineChart
} from 'lucide-react';
import { Invoice, InvoiceSummary } from './types/financeTypes';
import { format, subDays, differenceInDays, isSameMonth, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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
    
    // Taux de recouvrement
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
    const recoveryRate = invoices.length > 0
      ? 100 - Math.round((overdueInvoices.length / invoices.length) * 100)
      : 100;
    
    // Tendance mensuelle
    const lastMonth = subMonths(today, 1);
    const lastMonthInvoices = invoices.filter(inv => {
      const date = new Date(inv.issueDate);
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
    });
    
    const lastMonthValue = lastMonthInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const thisMonthValue = invoicesThisMonth.reduce((sum, inv) => sum + inv.amount, 0);
    
    const monthlyTrend = lastMonthValue > 0
      ? Math.round(((thisMonthValue - lastMonthValue) / lastMonthValue) * 100)
      : 0;
    
    return {
      invoicesThisMonth: invoicesThisMonth.length,
      invoicesThisMonthValue: invoicesThisMonth.reduce((sum, inv) => sum + inv.amount, 0),
      avgPaymentDelay,
      onTimeRate,
      recoveryRate,
      monthlyTrend
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

  // Préparer les données pour le graphique de répartition par statut
  const prepareStatusData = () => {
    const statusData = [
      { name: 'Payées', value: invoiceSummary.paidAmount, color: '#22c55e' },
      { name: 'En attente', value: invoiceSummary.pendingAmount, color: '#eab308' },
      { name: 'En retard', value: invoiceSummary.overdueAmount, color: '#ef4444' },
    ];
    
    return statusData;
  };

  // Préparer les données pour les tendances mensuelles
  const prepareMonthlyTrendData = () => {
    const now = new Date();
    const data = [];
    
    // Créer les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthName = format(monthDate, 'MMM', { locale: fr });
      
      // Filtrer les factures pour ce mois
      const monthInvoices = invoices.filter(inv => {
        const date = parseISO(inv.issueDate);
        return date >= monthStart && date <= monthEnd;
      });
      
      const value = monthInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      
      data.push({
        name: monthName,
        value
      });
    }
    
    return data;
  };

  const statusData = prepareStatusData();
  const monthlyTrendData = prepareMonthlyTrendData();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Statistiques Financières</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de recouvrement</p>
                <h3 className="text-2xl font-bold mt-1">{stats.recoveryRate}%</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.monthlyTrend > 0 ? (
                    <span className="text-green-600">↑ {stats.monthlyTrend}%</span>
                  ) : stats.monthlyTrend < 0 ? (
                    <span className="text-red-600">↓ {Math.abs(stats.monthlyTrend)}%</span>
                  ) : (
                    <span>Stable</span>
                  )}
                  {' '}vs mois précédent
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tendance mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value/1000}k€`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceStatistics;
