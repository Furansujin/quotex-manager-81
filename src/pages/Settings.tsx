
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  CreditCard, 
  Users, 
  Mail,
  Database,
  HardDrive,
  KeyRound,
  LifeBuoy,
  Pencil,
  Check,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/5">
                      <User className="h-4 w-4" />
                      Mon Profil
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Lock className="h-4 w-4" />
                      Sécurité
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Globe className="h-4 w-4" />
                      Préférences régionales
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <CreditCard className="h-4 w-4" />
                      Facturation
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Users className="h-4 w-4" />
                      Équipe
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Mail className="h-4 w-4" />
                      Emails
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Database className="h-4 w-4" />
                      Intégrations
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <HardDrive className="h-4 w-4" />
                      Stockage
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <KeyRound className="h-4 w-4" />
                      API
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <LifeBuoy className="h-4 w-4" />
                      Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Utilisation du stockage</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>6.4 GB utilisés sur 10 GB</p>
                    <Button variant="link" className="p-0 text-primary h-auto" size="sm">
                      Augmenter l'espace
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="profile">Mon Profil</TabsTrigger>
                  <TabsTrigger value="security">Sécurité</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="billing">Facturation</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>Gérez vos informations personnelles et de contact</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <Avatar className="w-24 h-24">
                          <AvatarImage alt="John Doe" />
                          <AvatarFallback className="text-xl bg-primary text-primary-foreground">JD</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Button variant="outline" className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Changer la photo
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            JPG, GIF ou PNG. 1 MB max.
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input id="lastName" defaultValue="Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue="john.doe@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input id="phone" defaultValue="+33 6 12 34 56 78" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" defaultValue="Responsable commercial chez QuoteX avec 10 ans d'expérience dans le secteur du fret maritime et aérien." className="min-h-[100px]" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
                          <Save className="h-4 w-4" />
                          Enregistrer les modifications
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres de l'entreprise</CardTitle>
                      <CardDescription>Informations concernant votre entreprise</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Nom de l'entreprise</Label>
                          <Input id="companyName" defaultValue="QuoteX Logistics" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vatNumber">Numéro TVA</Label>
                          <Input id="vatNumber" defaultValue="FR12345678901" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Adresse</Label>
                          <Input id="address" defaultValue="123 Rue du Commerce" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville</Label>
                          <Input id="city" defaultValue="Paris" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Code postal</Label>
                          <Input id="zipCode" defaultValue="75001" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Pays</Label>
                          <Input id="country" defaultValue="France" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
                          <Save className="h-4 w-4" />
                          Enregistrer les modifications
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Mot de passe</CardTitle>
                      <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Mettre à jour le mot de passe</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Authentification à deux facteurs</CardTitle>
                      <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Authentification par SMS</div>
                          <div className="text-sm text-muted-foreground">
                            Recevez un code par SMS à chaque connexion
                          </div>
                        </div>
                        <Switch />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Application d'authentification</div>
                          <div className="text-sm text-muted-foreground">
                            Utilisez une application comme Google Authenticator
                          </div>
                        </div>
                        <Switch checked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Clé de sécurité physique</div>
                          <div className="text-sm text-muted-foreground">
                            Utilisez une clé de sécurité USB comme YubiKey
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Préférences de notifications</CardTitle>
                      <CardDescription>Gérez comment et quand vous recevez des notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Notifications Email</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="email-quotes" className="flex-1">Nouveaux devis</Label>
                                <Switch id="email-quotes" checked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="email-shipments" className="flex-1">Mises à jour d'expédition</Label>
                                <Switch id="email-shipments" checked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="email-documents" className="flex-1">Nouveaux documents</Label>
                                <Switch id="email-documents" checked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="email-team" className="flex-1">Activité d'équipe</Label>
                                <Switch id="email-team" />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="email-finance" className="flex-1">Alertes financières</Label>
                                <Switch id="email-finance" checked />
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Notifications dans l'application</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="app-quotes" className="flex-1">Nouveaux devis</Label>
                                <Switch id="app-quotes" checked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="app-shipments" className="flex-1">Mises à jour d'expédition</Label>
                                <Switch id="app-shipments" checked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="app-documents" className="flex-1">Nouveaux documents</Label>
                                <Switch id="app-documents" checked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="app-team" className="flex-1">Activité d'équipe</Label>
                                <Switch id="app-team" checked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="app-finance" className="flex-1">Alertes financières</Label>
                                <Switch id="app-finance" checked />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button className="gap-2">
                            <Save className="h-4 w-4" />
                            Enregistrer les préférences
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="billing">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Plan d'abonnement</CardTitle>
                      <CardDescription>Gérez votre plan d'abonnement et vos paiements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-md p-4 bg-primary/5">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Plan Business</h3>
                              <p className="text-sm text-muted-foreground">€99/mois, facturé annuellement</p>
                            </div>
                            <Badge variant="outline" className="bg-primary/10">Actif</Badge>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <p className="text-sm">Jusqu'à 10 utilisateurs</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <p className="text-sm">Stockage de 10 GB</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <p className="text-sm">Accès à toutes les fonctionnalités</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <p className="text-sm">Support prioritaire</p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline">Changer de plan</Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Prochain paiement</h3>
                            <p className="text-sm text-muted-foreground">15 juillet 2023 - €1,188.00</p>
                          </div>
                          <Button variant="outline">Gérer le paiement</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Historique de facturation</CardTitle>
                      <CardDescription>Consultez vos factures passées</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-4 gap-4 p-3 bg-muted/30 text-sm font-medium border-b">
                          <div>Facture</div>
                          <div>Date</div>
                          <div>Montant</div>
                          <div className="text-right">Télécharger</div>
                        </div>
                        {[
                          { id: "INV-2023-007", date: "15 juin 2023", amount: "€1,188.00" },
                          { id: "INV-2022-006", date: "15 mai 2023", amount: "€1,188.00" },
                          { id: "INV-2022-005", date: "15 avril 2023", amount: "€1,188.00" },
                          { id: "INV-2022-004", date: "15 mars 2023", amount: "€1,188.00" },
                          { id: "INV-2022-003", date: "15 février 2023", amount: "€1,188.00" },
                        ].map((invoice, index) => (
                          <div key={invoice.id} className={`grid grid-cols-4 gap-4 p-3 text-sm hover:bg-muted/30 ${index !== 4 ? 'border-b' : ''}`}>
                            <div className="font-medium">{invoice.id}</div>
                            <div>{invoice.date}</div>
                            <div>{invoice.amount}</div>
                            <div className="text-right">
                              <Button variant="link" className="h-auto p-0">
                                Télécharger
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
