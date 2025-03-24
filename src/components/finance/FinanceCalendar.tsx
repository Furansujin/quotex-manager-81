
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Invoice } from './types/financeTypes';
import { Calendar } from '@/components/ui/calendar';
import { fr } from 'date-fns/locale';
import { format, parseISO, isSameDay } from 'date-fns';
import { getStatusLabel, getStatusVariant } from './data/mockData';

interface FinanceCalendarProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
}

const FinanceCalendar: React.FC<FinanceCalendarProps> = ({ 
  invoices,
  onSelectInvoice
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Trouver les factures qui ont une date d'échéance à la date sélectionnée
  const getDueInvoicesForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return invoices.filter(invoice => {
      const dueDate = parseISO(invoice.dueDate);
      return isSameDay(dueDate, date);
    });
  };
  
  // Créer des modificateurs de jours pour le calendrier
  const getDayHighlights = () => {
    const highlights: Record<string, { status: string; count: number }> = {};
    
    invoices.forEach(invoice => {
      const dueDate = format(parseISO(invoice.dueDate), 'yyyy-MM-dd');
      
      if (!highlights[dueDate]) {
        highlights[dueDate] = { status: invoice.status, count: 1 };
      } else {
        highlights[dueDate].count += 1;
        
        // Prioriser les statuts (overdue > pending > paid)
        if (invoice.status === 'overdue' || 
            (invoice.status === 'pending' && highlights[dueDate].status === 'paid')) {
          highlights[dueDate].status = invoice.status;
        }
      }
    });
    
    return highlights;
  };
  
  const dayHighlights = getDayHighlights();
  
  // Formatter la devise
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: currency 
    }).format(amount);
  };
  
  // Créer les modificateurs pour le calendrier
  const getCalendarModifiers = () => {
    const modifiers: Record<string, Date[]> = {
      overdue: [],
      pending: [],
      paid: [],
    };
    
    Object.entries(dayHighlights).forEach(([dateStr, data]) => {
      const date = parseISO(dateStr);
      modifiers[data.status].push(date);
    });
    
    return modifiers;
  };
  
  const calendarModifiers = getCalendarModifiers();
  
  // Styles spécifiques aux jours marqués
  const modifiersStyles = {
    overdue: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', fontWeight: 'bold' },
    pending: { backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04', fontWeight: 'bold' },
    paid: { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', fontWeight: 'bold' },
  };
  
  // Factures dues à la date sélectionnée
  const dueInvoices = selectedDate ? getDueInvoicesForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Calendrier des Échéances</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Calendrier</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              modifiers={calendarModifiers}
              modifiersStyles={modifiersStyles}
              showOutsideDays
              className="rounded-md border"
            />
            <div className="flex flex-wrap gap-2 items-center justify-center mt-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">En retard</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs">En attente</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Payée</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Échéances du {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'jour sélectionné'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dueInvoices.length > 0 ? (
              <div className="space-y-4">
                {dueInvoices.map(invoice => (
                  <div 
                    key={invoice.id} 
                    onClick={() => onSelectInvoice(invoice)}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-muted-foreground">{invoice.client}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-medium">{formatCurrency(invoice.amount, invoice.currency)}</div>
                      <Badge variant={getStatusVariant(invoice.status) as any}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">Aucune échéance pour cette date</p>
                {selectedDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Sélectionnez une autre date pour voir les échéances correspondantes
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceCalendar;
