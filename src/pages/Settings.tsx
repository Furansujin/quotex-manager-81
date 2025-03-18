
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings as SettingsIcon, 
  User, 
  CreditCard, 
  Bell, 
  Lock, 
  UserPlus, 
  Building, 
  Briefcase,
  Shield,
  Languages,
  Palette,
  AlertCircle,
  LogOut,
  Save,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Paramètres</h1>
              <p className="text-muted-foreground">Configurez votre compte et vos préférences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Button 
                      variant={activeTab === "profile" ? "default" : "ghost"} 
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="h-4 w-4" />
                      Profil
                    </Button>
                    <Button 
                      variant={activeTab === "company" ? "default" : "ghost"} 
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveTab("company")}
                    >
                      <Building className="h-4 w-4" />
                      Entreprise
                    </Button>
                    <Button 
                      variant={activeTab === "billing" ? "default" : "ghost"} 
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveTab("billing")}
                    >
                      <CreditCard className="h-4 w-4" />
                      Facturation
                    </Button>
                    <Button 
                      variant={activeTab === "team" ? "default" : "ghost"} 
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveTab("team")}
                    >
                      <UserPlus className="h-4 w-4" />
                      Équipe
                    </Button>
                    <Button 
                      variant={activeTab === "notifications" ? "default" : "ghost"} 
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="h-4 w-4" />
                      Notifications
                    </Button>
                    <Button 
                      variant={activeTab === "security" ? "default" : "ghost"} 
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveTab("security")}
                    >
                      <Lock className="h-4 w-4" />
                      Sécurité
                    </Button>
                    <Button 
                      variant={activeTab === "appearance" ? "default" : "ghost"} 
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveTab("appearance")}
                    >
                      <Palette className="h-4 w-4" />
                      Apparence
                    </Button>
                  </nav>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Informations du profil</CardTitle>
                    <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Prénom</label>
                          <Input defaultValue="Jean" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nom</label>
                          <Input defaultValue="Dupont" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input defaultValue="jean.dupont@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Téléphone</label>
                        <Input defaultValue="+33 6 12 34 56 78" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fonction</label>
                        <Input defaultValue="Responsable Logistique" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        <Textarea defaultValue="Responsable logistique avec 8 ans d'expérience dans le fret international." />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
                          <Save className="h-4 w-4" />
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "company" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de l'entreprise</CardTitle>
                    <CardDescription>Gérez les paramètres de votre entreprise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom de l'entreprise</label>
                        <Input defaultValue="QuoteX Logistics" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Numéro SIRET</label>
                          <Input defaultValue="12345678901234" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Numéro TVA</label>
                          <Input defaultValue="FR12345678901" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Adresse</label>
                        <Input defaultValue="123 Avenue des Logisticiens" />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Code postal</label>
                          <Input defaultValue="75001" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium">Ville</label>
                          <Input defaultValue="Paris" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pays</label>
                        <Input defaultValue="France" />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="font-medium mb-2">Logo de l'entreprise</h3>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <Briefcase className="h-8 w-8 text-gray-400" />
                          </div>
                          <Button variant="outline" size="sm">Changer le logo</Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
                          <Save className="h-4 w-4" />
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "billing" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Facturation</CardTitle>
                    <CardDescription>Gérez vos informations de paiement et abonnements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Abonnement actuel</h3>
                        <div className="flex items-center gap-2 p-4 rounded-md border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Plan Business</h4>
                              <Badge>Actif</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Facturation mensuelle - Prochain paiement le 15/07/2023</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">€89,00/mois</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Méthode de paiement</h3>
                        <div className="flex items-center gap-2 p-4 rounded-md border">
                          <div className="p-2 bg-blue-100 rounded-md">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Visa se terminant par 4242</p>
                            <p className="text-sm text-muted-foreground">Expire 06/2025</p>
                          </div>
                          <Button variant="outline" size="sm">Modifier</Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Historique des factures</h3>
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="py-3 px-4 text-left font-medium text-sm">Numéro</th>
                                <th className="py-3 px-4 text-left font-medium text-sm">Date</th>
                                <th className="py-3 px-4 text-left font-medium text-sm">Montant</th>
                                <th className="py-3 px-4 text-left font-medium text-sm">Statut</th>
                                <th className="py-3 px-4 text-left font-medium text-sm"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="py-3 px-4">FACT-2023-023</td>
                                <td className="py-3 px-4">15/06/2023</td>
                                <td className="py-3 px-4">€89,00</td>
                                <td className="py-3 px-4">
                                  <Badge variant="success">Payée</Badge>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Button variant="ghost" size="sm">Télécharger</Button>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3 px-4">FACT-2023-022</td>
                                <td className="py-3 px-4">15/05/2023</td>
                                <td className="py-3 px-4">€89,00</td>
                                <td className="py-3 px-4">
                                  <Badge variant="success">Payée</Badge>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Button variant="ghost" size="sm">Télécharger</Button>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3 px-4">FACT-2023-021</td>
                                <td className="py-3 px-4">15/04/2023</td>
                                <td className="py-3 px-4">€89,00</td>
                                <td className="py-3 px-4">
                                  <Badge variant="success">Payée</Badge>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Button variant="ghost" size="sm">Télécharger</Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de notifications</CardTitle>
                    <CardDescription>Configurez comment et quand vous recevez des alertes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Notifications par email</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Nouveaux devis</p>
                              <p className="text-sm text-muted-foreground">Recevoir un email lorsqu'un nouveau devis est créé</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Statut des expéditions</p>
                              <p className="text-sm text-muted-foreground">Recevoir un email lorsque le statut d'une expédition change</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Documents en attente</p>
                              <p className="text-sm text-muted-foreground">Recevoir un email pour les documents nécessitant votre validation</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Rapports hebdomadaires</p>
                              <p className="text-sm text-muted-foreground">Recevoir un récapitulatif hebdomadaire de l'activité</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-4">Notifications dans l'application</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Nouvelles tâches assignées</p>
                              <p className="text-sm text-muted-foreground">Recevoir une notification lorsqu'une tâche vous est assignée</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Commentaires</p>
                              <p className="text-sm text-muted-foreground">Recevoir une notification lorsqu'un commentaire est ajouté</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Mentions</p>
                              <p className="text-sm text-muted-foreground">Recevoir une notification lorsque vous êtes mentionné</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
                          <Save className="h-4 w-4" />
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "security" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Changer de mot de passe</CardTitle>
                      <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Mot de passe actuel</label>
                          <Input type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nouveau mot de passe</label>
                          <Input type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Confirmer le nouveau mot de passe</label>
                          <Input type="password" />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button className="gap-2">
                            <Save className="h-4 w-4" />
                            Mettre à jour
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Authentification à deux facteurs</CardTitle>
                      <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Authentification à deux facteurs</p>
                            <p className="text-sm text-muted-foreground">Protégez votre compte avec une vérification en deux étapes</p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="p-4 rounded-md border border-yellow-200 bg-yellow-50">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-yellow-800">Recommandation de sécurité</p>
                              <p className="text-sm text-yellow-700">Nous vous recommandons fortement d'activer l'authentification à deux facteurs pour protéger votre compte contre les accès non autorisés.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Sessions actives</CardTitle>
                      <CardDescription>Gérez les appareils connectés à votre compte</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Chrome sur Windows</p>
                              <p className="text-sm text-muted-foreground">Paris, France • Actif maintenant</p>
                            </div>
                            <Button variant="outline" size="sm">Cet appareil</Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Safari sur iPhone</p>
                              <p className="text-sm text-muted-foreground">Paris, France • Dernière activité il y a 2h</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">Déconnecter</Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Firefox sur Mac</p>
                              <p className="text-sm text-muted-foreground">Lyon, France • Dernière activité il y a 5j</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">Déconnecter</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === "appearance" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Apparence</CardTitle>
                    <CardDescription>Personnalisez l'interface de l'application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Thème</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="border rounded-md p-4 cursor-pointer ring-2 ring-primary">
                            <div className="space-y-2">
                              <div className="h-10 bg-white rounded"></div>
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                            <p className="text-sm font-medium mt-2 text-center">Clair</p>
                          </div>
                          <div className="border rounded-md p-4 cursor-pointer">
                            <div className="space-y-2">
                              <div className="h-10 bg-gray-900 rounded"></div>
                              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-700 rounded"></div>
                            </div>
                            <p className="text-sm font-medium mt-2 text-center">Sombre</p>
                          </div>
                          <div className="border rounded-md p-4 cursor-pointer">
                            <div className="space-y-2">
                              <div className="h-10 bg-gradient-to-r from-gray-100 to-gray-900 rounded"></div>
                              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-700 rounded w-3/4"></div>
                              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-700 rounded"></div>
                            </div>
                            <p className="text-sm font-medium mt-2 text-center">Système</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-4">Langue</h3>
                        <div className="space-y-2">
                          <div className="flex items-center p-3 border rounded-md cursor-pointer bg-muted/50">
                            <Languages className="h-5 w-5 mr-2" />
                            <span className="font-medium">Français</span>
                          </div>
                          <div className="flex items-center p-3 border rounded-md cursor-pointer">
                            <Languages className="h-5 w-5 mr-2" />
                            <span className="font-medium">English</span>
                          </div>
                          <div className="flex items-center p-3 border rounded-md cursor-pointer">
                            <Languages className="h-5 w-5 mr-2" />
                            <span className="font-medium">Español</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
                          <Save className="h-4 w-4" />
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "team" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Membres de l'équipe</CardTitle>
                      <CardDescription>Gérez les utilisateurs ayant accès à votre compte</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-end mb-2">
                          <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Inviter un membre
                          </Button>
                        </div>
                        
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="py-3 px-4 text-left font-medium text-sm">Utilisateur</th>
                                <th className="py-3 px-4 text-left font-medium text-sm">Rôle</th>
                                <th className="py-3 px-4 text-left font-medium text-sm">Statut</th>
                                <th className="py-3 px-4 text-left font-medium text-sm">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">Jean Dupont</p>
                                      <p className="text-sm text-muted-foreground">jean.dupont@example.com</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge>Administrateur</Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge variant="success">Actif</Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">Modifier</Button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">Marie Martin</p>
                                      <p className="text-sm text-muted-foreground">marie.martin@example.com</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge>Opérateur</Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge variant="success">Actif</Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">Modifier</Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">Supprimer</Button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">Pierre Durand</p>
                                      <p className="text-sm text-muted-foreground">pierre.durand@example.com</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge>Lecteur</Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge variant="warning">En attente</Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">Modifier</Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">Supprimer</Button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Rôles et permissions</CardTitle>
                      <CardDescription>Définissez les niveaux d'accès pour chaque rôle</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 border rounded-md">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-medium">Administrateur</h4>
                              <p className="text-sm text-muted-foreground">Accès complet à toutes les fonctionnalités</p>
                            </div>
                            <Button variant="outline" size="sm">Modifier</Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span>Gérer les utilisateurs</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span>Gérer les rôles</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span>Accès facturation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span>Éditer tous les documents</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-medium">Opérateur</h4>
                              <p className="text-sm text-muted-foreground">Peut créer et modifier du contenu</p>
                            </div>
                            <Button variant="outline" size="sm">Modifier</Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-red-600" />
                              <span>Gérer les utilisateurs</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-red-600" />
                              <span>Gérer les rôles</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-red-600" />
                              <span>Accès facturation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span>Éditer tous les documents</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-medium">Lecteur</h4>
                              <p className="text-sm text-muted-foreground">Accès en lecture seule</p>
                            </div>
                            <Button variant="outline" size="sm">Modifier</Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-red-600" />
                              <span>Gérer les utilisateurs</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-red-600" />
                              <span>Gérer les rôles</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-red-600" />
                              <span>Accès facturation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-red-600" />
                              <span>Éditer tous les documents</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
