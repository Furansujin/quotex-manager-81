
import React from 'react';
import { 
  BarChart4, 
  PieChart, 
  CalendarRange 
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FinanceCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Évolution du CA</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <CalendarRange className="h-3 w-3" />
                Cette année
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center bg-muted/30 rounded-md">
              <BarChart4 className="h-8 w-8 text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Graphique d'évolution du CA</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Répartition des revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-center justify-center bg-muted/30 rounded-md mb-4">
              <PieChart className="h-8 w-8 text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Graphique de répartition</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Maritime</span>
                  <span className="text-sm text-muted-foreground">€145,230</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Aérien</span>
                  <span className="text-sm text-muted-foreground">€68,450</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Routier</span>
                  <span className="text-sm text-muted-foreground">€34,820</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceCharts;
