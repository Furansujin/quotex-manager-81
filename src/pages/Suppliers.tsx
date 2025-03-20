
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SuppliersList from '@/components/suppliers/SuppliersList';
import SupplierPricing from '@/components/suppliers/SupplierPricing';
import SupplierImport from '@/components/suppliers/SupplierImport';

const Suppliers = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
      </div>
      
      <Tabs defaultValue="suppliers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suppliers">Liste des fournisseurs</TabsTrigger>
          <TabsTrigger value="pricing">Tarifs</TabsTrigger>
          <TabsTrigger value="import">Importer des tarifs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fournisseurs et transitaires</CardTitle>
              <CardDescription>
                Gérez vos partenaires logistiques et leurs informations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SuppliersList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des tarifs</CardTitle>
              <CardDescription>
                Consultez et modifiez les tarifs négociés avec vos fournisseurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplierPricing />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import de tarifs</CardTitle>
              <CardDescription>
                Importez des tarifs depuis des fichiers Excel ou CSV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplierImport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Suppliers;
