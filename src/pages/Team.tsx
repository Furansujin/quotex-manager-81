
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  MessageSquare,
  User,
  Briefcase,
  MapPin
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const Team = () => {
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion d'Équipe</h1>
              <p className="text-muted-foreground">Organisation et performance de votre équipe</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Performance
              </Button>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Ajouter un membre
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un membre..." className="pl-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Départements</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Users className="h-4 w-4" />
                      Tous les membres
                      <Badge variant="outline" className="ml-auto">12</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/5">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      Commercial
                      <Badge variant="outline" className="ml-auto">4</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Briefcase className="h-4 w-4 text-green-500" />
                      Opérations
                      <Badge variant="outline" className="ml-auto">5</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Briefcase className="h-4 w-4 text-amber-500" />
                      Documentation
                      <Badge variant="outline" className="ml-auto">2</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Briefcase className="h-4 w-4 text-purple-500" />
                      Finance
                      <Badge variant="outline" className="ml-auto">1</Badge>
                    </Button>
                  </div>
                  
                  <h3 className="font-medium mt-6 mb-3">Bureaux</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      Paris
                      <Badge variant="outline" className="ml-auto">8</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      Marseille
                      <Badge variant="outline" className="ml-auto">3</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <MapPin className="h-4 w-4 text-green-500" />
                      Lyon
                      <Badge variant="outline" className="ml-auto">1</Badge>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue="members" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="members">Membres</TabsTrigger>
                  <TabsTrigger value="tasks">Tâches assignées</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="calendar">Calendrier</TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="space-y-4">
                  {[
                    { 
                      id: 1, 
                      name: "Sophie Martin", 
                      role: "Responsable Commercial", 
                      dept: "Commercial",
                      email: "sophie.martin@quotex.com",
                      phone: "+33 6 12 34 56 78",
                      location: "Paris",
                      tasks: { completed: 24, total: 30 },
                      avatar: "SM"
                    },
                    { 
                      id: 2, 
                      name: "Thomas Dubois", 
                      role: "Responsable Opérations", 
                      dept: "Opérations",
                      email: "thomas.dubois@quotex.com",
                      phone: "+33 6 23 45 67 89",
                      location: "Paris",
                      tasks: { completed: 18, total: 22 },
                      avatar: "TD"
                    },
                    { 
                      id: 3, 
                      name: "Julie Renard", 
                      role: "Gestionnaire Documentation", 
                      dept: "Documentation",
                      email: "julie.renard@quotex.com",
                      phone: "+33 6 34 56 78 90",
                      location: "Marseille",
                      tasks: { completed: 12, total: 15 },
                      avatar: "JR"
                    },
                    { 
                      id: 4, 
                      name: "Marc Lambert", 
                      role: "Chargé de clientèle", 
                      dept: "Commercial",
                      email: "marc.lambert@quotex.com",
                      phone: "+33 6 45 67 89 01",
                      location: "Lyon",
                      tasks: { completed: 8, total: 10 },
                      avatar: "ML"
                    },
                  ].map((member) => (
                    <Card key={member.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage alt={member.name} />
                              <AvatarFallback className="bg-primary text-primary-foreground">{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{member.name}</h3>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm flex-1">
                            <div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <p>Email</p>
                              </div>
                              <p className="font-medium">{member.email}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <p>Téléphone</p>
                              </div>
                              <p className="font-medium">{member.phone}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <p>Bureau</p>
                              </div>
                              <p className="font-medium">{member.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1 w-full md:w-32">
                            <div className="flex justify-between text-xs">
                              <span>Tâches</span>
                              <span>{member.tasks.completed}/{member.tasks.total}</span>
                            </div>
                            <Progress value={(member.tasks.completed / member.tasks.total) * 100} className="h-2" />
                            <div className="flex gap-2 mt-1 justify-end">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <User className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                {/* Autres onglets */}
                <TabsContent value="tasks">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Tâches assignées à l'équipe</h3>
                        <div className="space-y-2">
                          {[
                            { task: "Suivre l'expédition SHP-2023-0089", assignee: "Thomas Dubois", due: "15/06/2023", status: "En cours" },
                            { task: "Préparer devis pour client Techzone", assignee: "Sophie Martin", due: "12/06/2023", status: "En cours" },
                            { task: "Vérifier les documents de SHP-2023-0087", assignee: "Julie Renard", due: "11/06/2023", status: "En cours" },
                            { task: "Contacter Global Imports pour mise à jour", assignee: "Marc Lambert", due: "10/06/2023", status: "Terminé" },
                          ].map((task, index) => (
                            <div key={index} className="flex items-center gap-3 border rounded-md p-3">
                              {task.status === "Terminé" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                              ) : (
                                <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{task.task}</p>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <p>Assignée à: <span className="text-foreground">{task.assignee}</span></p>
                                  <p>Échéance: <span className="text-foreground">{task.due}</span></p>
                                </div>
                              </div>
                              <Badge variant={task.status === "Terminé" ? "success" : "outline"}>{task.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="performance">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">Graphiques et statistiques de performance</p>
                      <div className="h-64 border rounded-md mt-4 flex items-center justify-center bg-muted/30">
                        <p className="text-muted-foreground">Graphique de performance</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="calendar">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">Calendrier partagé de l'équipe</p>
                      <div className="mt-6 grid grid-cols-7 gap-1">
                        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                          <div key={day} className="text-center font-medium text-sm p-2">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: 31 }).map((_, i) => (
                          <div key={i} className="aspect-square border rounded-md p-2 text-center">
                            <div className="text-sm font-medium">{i + 1}</div>
                            {i === 2 && (
                              <div className="mt-1 text-xs bg-blue-100 rounded-sm p-1">
                                Réunion
                              </div>
                            )}
                            {i === 8 && (
                              <div className="mt-1 text-xs bg-green-100 rounded-sm p-1">
                                Formation
                              </div>
                            )}
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

export default Team;
