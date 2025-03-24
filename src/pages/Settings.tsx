
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos modifications ont été sauvegardées avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Gérez les paramètres de votre compte et de l'application</p>
          </div>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Compte</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="appearance">Apparence</TabsTrigger>
              <TabsTrigger value="about">À propos</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du compte</CardTitle>
                  <CardDescription>Modifiez vos informations personnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input type="text" id="name" defaultValue="John Doe" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input type="email" id="email" defaultValue="john.doe@example.com" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input type="text" id="bio" placeholder="Décrivez-vous en quelques mots" />
                  </div>
                  <Button onClick={handleSaveSettings}>Enregistrer</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres des notifications</CardTitle>
                  <CardDescription>Choisissez les notifications que vous souhaitez recevoir</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Notifications push</Label>
                    <Switch id="push-notifications" />
                  </div>
                  <Button onClick={handleSaveSettings}>Enregistrer</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de sécurité</CardTitle>
                  <CardDescription>Gérez vos paramètres de sécurité et votre mot de passe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <Input type="password" id="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                    <Input type="password" id="confirm-password" />
                  </div>
                  <Button onClick={handleSaveSettings}>Modifier le mot de passe</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                  <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Thème</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Système" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">Système</SelectItem>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSaveSettings}>Enregistrer</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>À propos</CardTitle>
                  <CardDescription>Informations sur l'application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Version: 1.0.0</p>
                  <p>Développé par: QuoteX Team</p>
                  <p>
                    <a href="#" className="text-blue-500 hover:underline">
                      Politique de confidentialité
                    </a>
                  </p>
                  <p>
                    <a href="#" className="text-blue-500 hover:underline">
                      Conditions d'utilisation
                    </a>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
