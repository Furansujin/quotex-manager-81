
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from './types/financeTypes';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { CalendarRange, TrendingUp } from 'lucide-react';
import { fr } from 'date-fns/locale';
import { parseISO, format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface FinanceTrendsProps {
  invoices: Invoice[];
}

const FinanceTrends: React.FC<FinanceTrendsProps> = ({ invoices }) => {
  const [timeRange, setTimeRange] = React.useState<'month' | 'quarter' | 'year'>('month');
  
  // Préparer les données pour les graphiques
  const prepareMonthlyData = () => {
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
      
      // Calculer les montants par statut
      const paid = monthInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      const pending = monthInvoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      const overdue = monthInvoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      data.push({
        name: monthName,
        paid,
        pending,
        overdue,
        total: paid + pending + overdue
      });
    }
    
    return data;
  };

  const monthlyData = prepareMonthlyData();
  
  // Préparer les données de répartition par type client
  const prepareClientTypeData = () => {
    const clientTypes: Record<string, number> = {};
    
    invoices.forEach(invoice => {
      const clientType = invoice.clientType || 'Non spécifié';
      if (!clientTypes[clientType]) {
        clientTypes[clientType] = 0;
      }
      clientTypes[clientType] += invoice.amount;
    });
    
    return Object.entries(clientTypes).map(([name, value]) => ({ name, value }));
  };
  
  const clientTypeData = prepareClientTypeData();
  
  // Formatter la devise
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Tendances Financières</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Évolution du chiffre d'affaires</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={timeRange === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTimeRange('month')}
                >
                  Mois
                </Button>
                <Button 
                  variant={timeRange === 'quarter' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTimeRange('quarter')}
                >
                  Trimestre
                </Button>
                <Button 
                  variant={timeRange === 'year' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTimeRange('year')}
                >
                  Année
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ChartContainer 
                config={{
                  paid: { 
                    label: "Payées",
                    theme: { light: '#22c55e', dark: '#22c55e' }
                  },
                  pending: { 
                    label: "En attente",
                    theme: { light: '#eab308', dark: '#eab308' }
                  },
                  overdue: { 
                    label: "En retard",
                    theme: { light: '#ef4444', dark: '#ef4444' }
                  }
                }}
              >
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `€${value/1000}k`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => formatCurrency(value as number)}
                      />
                    }
                  />
                  <Bar dataKey="paid" stackId="a" fill="var(--color-paid)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overdue" stackId="a" fill="var(--color-overdue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Délai moyen de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ChartContainer 
                config={{
                  paymentTime: { 
                    label: "Délai",
                    theme: { light: '#3b82f6', dark: '#3b82f6' }
                  }
                }}
              >
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value} j`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => `${value} jours`}
                      />
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="var(--color-paymentTime)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceTrends;
