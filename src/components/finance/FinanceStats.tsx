
import React from 'react';
import { 
  Euro, 
  AlertTriangle, 
  PieChart, 
  FileText,
  TrendingUp 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FinanceStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Chiffre d'affaires</p>
              <h3 className="text-2xl font-bold">€248,500</h3>
              <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                +12.5% vs période précédente
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Euro className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Factures impayées</p>
              <h3 className="text-2xl font-bold">€54,320</h3>
              <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                +4.8% vs période précédente
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Marge brute</p>
              <h3 className="text-2xl font-bold">32.4%</h3>
              <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                +1.2 points vs période précédente
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <PieChart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Factures ce mois</p>
              <h3 className="text-2xl font-bold">42</h3>
              <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                +8 vs mois précédent
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceStats;
