
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  X, 
  FileText, 
  Eye, 
  Download, 
  Share2, 
  Pencil, 
  Save, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Clock, 
  UserCircle, 
  Calendar, 
  Upload,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentViewerProps {
  documentId: string;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId, onClose }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState('');
  const { toast } = useToast();
  
  // Simulated document data
  const document = {
    id: documentId,
    name: "Bill of Lading - SHP-2023-0089",
    type: "Bill of Lading",
    date: "22/05/2023",
    client: "Tech Supplies Inc",
    status: "Validé",
    size: "240 Ko",
    shipment: "SHP-2023-0089",
    lastModified: "23/05/2023 - 14:30",
    createdBy: "Jean Dupont",
    version: "1.2",
    tags: ["Maritime", "Export", "Conteneur"],
    history: [
      {
        action: "Document créé",
        date: "22/05/2023 - 10:15",
        user: "Jean Dupont"
      },
      {
        action: "Modifié - Correction des quantités",
        date: "22/05/2023 - 15:20",
        user: "Jean Dupont"
      },
      {
        action: "Validé",
        date: "23/05/2023 - 14:30",
        user: "Marie Martin"
      }
    ],
    comments: [
      {
        user: "Marie Martin",
        date: "23/05/2023 - 09:15",
        text: "Veuillez vérifier les informations de poids avant validation."
      },
      {
        user: "Jean Dupont",
        date: "23/05/2023 - 11:30",
        text: "Informations de poids corrigées selon les spécifications du client."
      }
    ],
    signatories: [
      {
        name: "Jean Dupont",
        role: "Transitaire",
        company: "QuoteX Logistics",
        status: "Signé",
        date: "22/05/2023"
      },
      {
        name: "Paul Johnson",
        role: "Représentant du transporteur",
        company: "Ocean Line Express",
        status: "Signé",
        date: "23/05/2023"
      }
    ]
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été ajouté avec succès.",
      });
      setComment('');
    }
  };

  const handleValidate = () => {
    toast({
      title: "Document validé",
      description: "Le document a été validé avec succès.",
    });
  };

  const handleReject = () => {
    toast({
      title: "Document rejeté",
      description: "Le document a été rejeté. Veuillez préciser les raisons dans un commentaire.",
      variant: "destructive"
    });
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast({
      title: "Modifications enregistrées",
      description: "Les informations du document ont été mises à jour.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Lien de partage créé",
      description: "Le lien de partage a été copié dans le presse-papier.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{document.name}</h2>
                <Badge variant={document.status === "Validé" ? "success" : document.status === "En attente" ? "warning" : "destructive"}>
                  {document.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{document.id} • {document.client}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
            {!isEditing && (
              <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
                Modifier
              </Button>
            )}
            {isEditing && (
              <Button className="gap-2" onClick={handleSaveChanges}>
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="preview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="comments">Commentaires</TabsTrigger>
              <TabsTrigger value="signatures">Signatures</TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              <div className="bg-white rounded-lg border p-6 min-h-[60vh] flex flex-col items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aperçu du document</h3>
                <p className="text-muted-foreground mb-6">L'aperçu du document sera affiché ici.</p>
                
                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Voir en plein écran
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </div>
              
              {document.status !== "Validé" && (
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive/10" onClick={handleReject}>
                    <XCircle className="h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button className="gap-2" onClick={handleValidate}>
                    <CheckCircle className="h-4 w-4" />
                    Valider
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details">
              <div className="bg-white rounded-lg border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nom du document</p>
                      {isEditing ? (
                        <Input defaultValue={document.name} />
                      ) : (
                        <p className="font-medium">{document.name}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Type de document</p>
                      {isEditing ? (
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          defaultValue={document.type}
                        >
                          <option value="Bill of Lading">Bill of Lading</option>
                          <option value="Facture commerciale">Facture commerciale</option>
                          <option value="Liste de colisage">Liste de colisage</option>
                          <option value="Certificat d'origine">Certificat d'origine</option>
                          <option value="Déclaration douanière">Déclaration douanière</option>
                        </select>
                      ) : (
                        <p className="font-medium">{document.type}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      {isEditing ? (
                        <Input defaultValue={document.client} />
                      ) : (
                        <p className="font-medium">{document.client}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Expédition associée</p>
                      {isEditing ? (
                        <Input defaultValue={document.shipment} />
                      ) : (
                        <p className="font-medium">{document.shipment}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Tags</p>
                      {isEditing ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {tag}
                              <X className="h-3 w-3 cursor-pointer" />
                            </Badge>
                          ))}
                          <Button variant="outline" size="sm" className="h-6">
                            <Plus className="h-3 w-3 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date de création</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{document.date}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Dernière modification</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{document.lastModified}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Créé par</p>
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{document.createdBy}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Version</p>
                      <p className="font-medium">{document.version}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Taille</p>
                      <p className="font-medium">{document.size}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <Badge variant={document.status === "Validé" ? "success" : document.status === "En attente" ? "warning" : "destructive"}>
                        {document.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-4">Remplacer le document</h3>
                    <div className="flex items-center gap-4">
                      <Input type="file" />
                      <Button className="gap-2">
                        <Upload className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-medium mb-4">Historique des modifications</h3>
                
                <div className="relative">
                  {/* Ligne de connexion entre les événements */}
                  <div className="absolute left-6 top-8 h-[calc(100%-64px)] w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-6">
                    {document.history.map((event, index) => (
                      <div key={index} className="flex items-start gap-4 relative">
                        <div className="mt-1 p-2 rounded-full bg-primary/10 z-10">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{event.action}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{event.date}</span>
                            <span>•</span>
                            <span>{event.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-4">Versions précédentes</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Version 1.2 (Actuelle)</p>
                          <p className="text-sm text-muted-foreground">23/05/2023 - 14:30</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Télécharger</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Version 1.1</p>
                          <p className="text-sm text-muted-foreground">22/05/2023 - 15:20</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Télécharger</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Version 1.0</p>
                          <p className="text-sm text-muted-foreground">22/05/2023 - 10:15</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Télécharger</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-medium mb-4">Commentaires</h3>
                
                <div className="space-y-4 mb-6">
                  {document.comments.map((comment, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{comment.user}</p>
                            <p className="text-sm text-muted-foreground">{comment.date}</p>
                          </div>
                          <p className="mt-2">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Ajouter un commentaire</h3>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Saisissez votre commentaire..." 
                      className="min-h-[100px]"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button className="gap-2" onClick={handleAddComment} disabled={!comment.trim()}>
                        <MessageSquare className="h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signatures">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-medium mb-4">Signatures</h3>
                
                <div className="space-y-4 mb-6">
                  {document.signatories.map((signatory, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-primary/10">
                            <UserCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{signatory.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {signatory.role} • {signatory.company}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={signatory.status === "Signé" ? "success" : "warning"}>
                            {signatory.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{signatory.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Ajouter un signataire</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input placeholder="Email du signataire" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rôle</label>
                      <Input placeholder="Rôle du signataire" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Inviter à signer
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
