
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Invoice, InvoiceSummary } from './types/financeTypes';
import { 
  FileText, 
  ArrowUpDown, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface FinanceDashboardProps {
  invoiceSummary: InvoiceSummary;
  onNavigate: (tab: string) => void;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ 
  invoiceSummary,
  onNavigate
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow" onClick={() => onNavigate('all')}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total factures</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(invoiceSummary.totalAmount)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{invoiceSummary.count.total} factures</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow" onClick={() => onNavigate('pending')}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(invoiceSummary.pendingAmount)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{invoiceSummary.count.pending} factures</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow" onClick={() => onNavigate('paid')}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payées</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(invoiceSummary.paidAmount)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{invoiceSummary.count.paid} factures</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow" onClick={() => onNavigate('overdue')}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En retard</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(invoiceSummary.overdueAmount)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{invoiceSummary.count.overdue} factures</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Aperçu financier</h3>
                <p className="text-sm text-muted-foreground">
                  Vue d'ensemble des performances financières récentes
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Tendances des paiements</h3>
                <p className="text-sm text-muted-foreground">
                  Analyse des délais de paiement et des tendances clients
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Échéancier</h3>
                <p className="text-sm text-muted-foreground">
                  Visualisation des échéances de paiement à venir
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceDashboard;
