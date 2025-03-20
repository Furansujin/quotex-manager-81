
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import SuppliersList from '@/components/suppliers/SuppliersList';
import SupplierPricing from '@/components/suppliers/SupplierPricing';
import SupplierImport from '@/components/suppliers/SupplierImport';

const Suppliers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('suppliers');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestion des Fournisseurs</h1>
            <p className="text-muted-foreground">Gérez vos fournisseurs et leurs tarifs</p>
          </div>

          <Tabs defaultValue="suppliers" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
              <TabsTrigger value="pricing">Tarification</TabsTrigger>
              <TabsTrigger value="import">Import Données</TabsTrigger>
            </TabsList>

            <TabsContent value="suppliers">
              <SuppliersList />
            </TabsContent>

            <TabsContent value="pricing">
              <SupplierPricing />
            </TabsContent>

            <TabsContent value="import">
              <SupplierImport />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Suppliers;
