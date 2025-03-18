
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Filter, 
  Upload, 
  Download,
  FileCheck,
  FilePlus,
  FileX,
  Clock,
  Folder,
  FolderOpen,
  AlertCircle,
  Eye,
  PencilLine,
  Share2,
  SlidersHorizontal,
  ChevronDown,
  CalendarRange,
  Tag,
  X,
  Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DocumentViewer from '@/components/documents/DocumentViewer';
import { useToast } from '@/hooks/use-toast';

const Documents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [documentTags, setDocumentTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bill of lading':
        return <FileCheck className="h-5 w-5 text-blue-600" />;
      case 'certificat d\'origine':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'facture commerciale':
        return <FileText className="h-5 w-5 text-amber-600" />;
      case 'listing colisage':
        return <FileText className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'validé':
        return <Badge variant="success">{status}</Badge>;
      case 'en attente':
        return <Badge variant="warning">{status}</Badge>;
      case 'rejeté':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleOpenDocument = (id: string) => {
    setSelectedDocument(id);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !documentTags.includes(newTag.trim())) {
      setDocumentTags([...documentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setDocumentTags(documentTags.filter(t => t !== tag));
  };

  const documents = [
    { 
      id: "DOC-2023-0156", 
      name: "Bill of Lading - SHP-2023-0089", 
      type: "Bill of Lading", 
      date: "22/05/2023", 
      client: "Tech Supplies Inc",
      status: "Validé",
      size: "240 Ko",
      shipment: "SHP-2023-0089"
    },
    { 
      id: "DOC-2023-0155", 
      name: "Facture commerciale - SHP-2023-0088", 
      type: "Facture commerciale", 
      date: "21/05/2023", 
      client: "Pharma Solutions",
      status: "Validé",
      size: "125 Ko",
      shipment: "SHP-2023-0088"
    },
    { 
      id: "DOC-2023-0154", 
      name: "Certificat d'origine - SHP-2023-0087", 
      type: "Certificat d'origine", 
      date: "20/05/2023", 
      client: "Global Imports Ltd",
      status: "En attente",
      size: "320 Ko",
      shipment: "SHP-2023-0087"
    },
    { 
      id: "DOC-2023-0153", 
      name: "Listing colisage - SHP-2023-0086", 
      type: "Listing colisage", 
      date: "19/05/2023", 
      client: "Eurotech GmbH",
      status: "Rejeté",
      size: "180 Ko",
      shipment: "SHP-2023-0086"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 md:pl-64">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion Documentaire</h1>
              <p className="text-muted-foreground">Organisez et gérez vos documents d'expédition</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Importer
              </Button>
              <Button className="gap-2" onClick={() => toast({
                title: "Fonction en développement",
                description: "La création d'un nouveau document sera bientôt disponible.",
              })}>
                <FilePlus className="h-4 w-4" />
                Nouveau Document
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher par nom, type, expédition..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showAdvancedFilters ? "default" : "outline"} 
                className="gap-2"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Trier
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Trier par</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <CalendarRange className="mr-2 h-4 w-4" />
                      <span>Date (plus récent)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CalendarRange className="mr-2 h-4 w-4" />
                      <span>Date (plus ancien)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Nom (A-Z)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Tag className="mr-2 h-4 w-4" />
                      <span>Type de document</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {showAdvancedFilters && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Tous</Badge>
                      <Badge variant="success" className="cursor-pointer">Validés</Badge>
                      <Badge variant="warning" className="cursor-pointer">En attente</Badge>
                      <Badge variant="destructive" className="cursor-pointer">Rejetés</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type de document</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Tous</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-blue-500/10 text-blue-500">Bill of Lading</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-green-500/10 text-green-500">Certificats</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-amber-500/10 text-amber-500">Factures</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Période</label>
                    <div className="flex gap-2">
                      <Input type="date" className="w-full" placeholder="Date début" />
                      <Input type="date" className="w-full" placeholder="Date fin" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {documentTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => handleRemoveTag(tag)} />
                      </Badge>
                    ))}
                    {documentTags.length === 0 && (
                      <span className="text-sm text-muted-foreground">Aucun tag sélectionné</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Ajouter un tag" 
                      value={newTag} 
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button variant="outline" onClick={handleAddTag} disabled={!newTag.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="mr-2">Réinitialiser</Button>
                  <Button>Appliquer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Dossiers</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Folder className="h-4 w-4" />
                      Tous les documents
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <FolderOpen className="h-4 w-4 text-blue-500" />
                      Bill of Lading
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Folder className="h-4 w-4 text-green-500" />
                      Certificats
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Folder className="h-4 w-4 text-amber-500" />
                      Factures
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Folder className="h-4 w-4 text-purple-500" />
                      Listings colisage
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Folder className="h-4 w-4 text-red-500" />
                      Documents douaniers
                    </Button>
                  </div>
                  
                  <h3 className="font-medium mt-6 mb-3">Statut</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Documents urgents
                      <Badge variant="outline" className="ml-auto">7</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      En attente
                      <Badge variant="outline" className="ml-auto">12</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <FileCheck className="h-4 w-4 text-green-500" />
                      Validés
                      <Badge variant="outline" className="ml-auto">45</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <FileX className="h-4 w-4 text-red-500" />
                      Rejetés
                      <Badge variant="outline" className="ml-auto">3</Badge>
                    </Button>
                  </div>

                  <h3 className="font-medium mt-6 mb-3">Tags populaires</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Maritime</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Export</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Conteneur</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Douane</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Urgent</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Shanghai</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Aérien</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="recent">Récents</TabsTrigger>
                  <TabsTrigger value="pending">À valider</TabsTrigger>
                  <TabsTrigger value="urgent">Urgents</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {documents.map((document) => (
                    <Card 
                      key={document.id} 
                      className="hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleOpenDocument(document.id)}
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-primary/10">
                              {getDocumentIcon(document.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{document.name}</h3>
                                {getStatusBadge(document.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {document.id} • {document.client}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Type</p>
                              <p className="font-medium">{document.type}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium">{document.date}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Taille</p>
                              <p className="font-medium">{document.size}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDocument(document.id);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "Téléchargement en cours",
                                  description: `Le document ${document.id} est en cours de téléchargement.`,
                                });
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "Lien de partage créé",
                                  description: "Le lien de partage a été copié dans le presse-papier.",
                                });
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "Modification du document",
                                  description: "L'édition du document sera bientôt disponible.",
                                });
                              }}
                            >
                              <PencilLine className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                {/* Autres onglets */}
                <TabsContent value="recent">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">Documents récemment ajoutés</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="pending">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">Documents en attente de validation</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="urgent">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">Documents urgents à traiter</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      {selectedDocument && (
        <DocumentViewer
          documentId={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default Documents;
