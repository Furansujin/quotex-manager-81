
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RecentQuotes from '@/components/dashboard/RecentQuotes';
import { BarChart, LineChart, PieChart } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Tableau de Bord</h1>
            <p className="text-muted-foreground">Bienvenue sur votre espace de gestion QuoteX</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardCard 
              title="Nouveaux Devis" 
              description="Cette semaine"
              animation="fade-in"
              delay={100}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">24</span>
                <div className="p-2 bg-blue-100 rounded-full">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-sm text-green-600 mt-2 flex items-center">
                <span>↑ 12% vs période précédente</span>
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Expéditions en Cours" 
              description="Actives"
              animation="fade-in"
              delay={200}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">18</span>
                <div className="p-2 bg-amber-100 rounded-full">
                  <LineChart className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-2 flex items-center">
                <span>3 en attente de documents</span>
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Taux de Conversion" 
              description="Devis → Commandes"
              animation="fade-in"
              delay={300}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">68%</span>
                <div className="p-2 bg-green-100 rounded-full">
                  <PieChart className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-sm text-green-600 mt-2 flex items-center">
                <span>↑ 5% vs période précédente</span>
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Documents en Attente" 
              description="Requièrent validation"
              animation="fade-in"
              delay={400}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">7</span>
                <div className="p-2 bg-red-100 rounded-full">
                  <BarChart className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="text-sm text-red-600 mt-2 flex items-center">
                <span>2 urgents (< 24h)</span>
              </div>
            </DashboardCard>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <DashboardCard 
                title="Activité Récente" 
                description="Vue d'ensemble de l'activité"
                className="h-full"
              >
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-md">
                  <p className="text-muted-foreground">Graphique d'activité</p>
                </div>
              </DashboardCard>
            </div>
            <div className="lg:col-span-1">
              <DashboardCard 
                title="Statut des Tâches" 
                description="Progression de l'équipe"
                className="h-full"
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Devis à traiter</span>
                      <span className="text-sm text-muted-foreground">8/15</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '53%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Documents à vérifier</span>
                      <span className="text-sm text-muted-foreground">12/20</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Expéditions à suivre</span>
                      <span className="text-sm text-muted-foreground">5/18</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardCard 
                title="Devis Récents" 
                description="Derniers devis créés"
              >
                <RecentQuotes />
              </DashboardCard>
            </div>
            <div className="lg:col-span-1">
              <DashboardCard 
                title="Calendrier des Expéditions" 
                description="Prochains départs/arrivées"
              >
                <div className="space-y-3">
                  <div className="p-3 border rounded-md bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Départ - Shanghai</span>
                      <span className="text-sm text-blue-600">Maritime</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Client: Tech Supplies Inc</p>
                    <p className="text-sm font-medium mt-1">Demain, 08:00</p>
                  </div>
                  <div className="p-3 border rounded-md bg-green-50 border-green-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Arrivée - JFK</span>
                      <span className="text-sm text-green-600">Aérien</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Client: Pharma Solutions</p>
                    <p className="text-sm font-medium mt-1">Aujourd'hui, 14:30</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Départ - Rotterdam</span>
                      <span className="text-sm text-amber-600">Maritime</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Client: Global Imports Ltd</p>
                    <p className="text-sm font-medium mt-1">26 Juin, 10:00</p>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
