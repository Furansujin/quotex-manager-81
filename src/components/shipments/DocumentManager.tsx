
import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash, 
  Edit, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  FileCheck,
  ClipboardCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Document {
  id: number;
  name: string;
  uploaded: boolean;
  date: string;
  mandatory: boolean;
  status?: 'valid' | 'pending' | 'rejected';
  type?: string;
  size?: string;
  validUntil?: string;
}

interface DocumentManagerProps {
  documents: Document[];
  shipmentType: 'maritime' | 'aérien' | 'routier';
  onUploadDocument?: (docId: number) => void;
  onDownloadDocument?: (docId: number) => void;
  onAddDocument?: (doc: Partial<Document>) => void;
}

const DocumentTypes = {
  'maritime': [
    { name: 'Connaissement maritime (B/L)', mandatory: true },
    { name: 'Facture commerciale', mandatory: true },
    { name: 'Liste de colisage', mandatory: true },
    { name: 'Certificat d\'origine', mandatory: false },
    { name: 'Certificat phytosanitaire', mandatory: false },
    { name: 'Déclaration d\'exportation', mandatory: true },
    { name: 'Certificat d\'assurance', mandatory: false },
  ],
  'aérien': [
    { name: 'Lettre de transport aérien (LTA)', mandatory: true },
    { name: 'Facture commerciale', mandatory: true },
    { name: 'Liste de colisage', mandatory: true },
    { name: 'Certificat d\'origine', mandatory: false },
    { name: 'Certificat de conformité', mandatory: false },
  ],
  'routier': [
    { name: 'Lettre de voiture CMR', mandatory: true },
    { name: 'Facture commerciale', mandatory: true },
    { name: 'Liste de colisage', mandatory: true },
    { name: 'Certificat d\'origine', mandatory: false },
  ],
};

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents = [],
  shipmentType,
  onUploadDocument,
  onDownloadDocument,
  onAddDocument
}) => {
  const { toast } = useToast();
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const [showAiAssistDialog, setShowAiAssistDialog] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [activeDocTab, setActiveDocTab] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [highlightMissing, setHighlightMissing] = useState(true);
  
  // Template documents for quick access
  const templateDocuments = [
    { name: "Connaissement vierge", type: "B/L", format: "PDF" },
    { name: "Facture commerciale", type: "Invoice", format: "DOCX" },
    { name: "Liste de colisage", type: "Packing", format: "XLSX" },
    { name: "Certificat d'origine", type: "Certificate", format: "PDF" },
    { name: "Lettre de transport routier", type: "CMR", format: "PDF" },
    { name: "Lettre de transport aérien", type: "AWB", format: "PDF" },
  ];
  
  const filteredDocuments = documents
    .filter(doc => {
      if (docSearchTerm) {
        return doc.name.toLowerCase().includes(docSearchTerm.toLowerCase());
      }
      if (activeDocTab === 'all') return true;
      if (activeDocTab === 'mandatory') return doc.mandatory;
      if (activeDocTab === 'missing') return doc.mandatory && !doc.uploaded;
      if (activeDocTab === 'uploaded') return doc.uploaded;
      return true;
    });
  
  const mandatoryDocCount = documents.filter(doc => doc.mandatory).length;
  const uploadedMandatoryDocCount = documents.filter(doc => doc.mandatory && doc.uploaded).length;
  
  const handleAddDocument = () => {
    if (!newDocumentType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de document.",
        variant: "destructive"
      });
      return;
    }
    
    const newDoc: Partial<Document> = {
      name: newDocumentType === 'other' ? documentDescription : newDocumentType,
      mandatory: isMandatory,
      uploaded: false,
      date: "",
    };
    
    if (onAddDocument) {
      onAddDocument(newDoc);
    }
    
    toast({
      title: "Document ajouté",
      description: "Le document a été ajouté à la liste."
    });
    
    // Reset form
    setNewDocumentType('');
    setDocumentDescription('');
    setIsMandatory(false);
    setShowAddDocumentDialog(false);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };
  
  const handleBulkUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un fichier.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25; // Faster progress
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setShowBulkUploadDialog(false);
        setSelectedFiles([]);
        setUploadProgress(0);
        
        toast({
          title: "Téléversement réussi",
          description: `${selectedFiles.length} document(s) téléversé(s) avec succès.`
        });
      }
    }, 300); // Faster upload simulation
  };
  
  const handleDownloadTemplate = (template: string) => {
    toast({
      title: "Téléchargement du modèle",
      description: `Le modèle "${template}" est en cours de téléchargement.`
    });
  };
  
  const handleAiAssist = () => {
    toast({
      title: "Extraction en cours",
      description: "Analyse des documents pour extraire les informations..."
    });
    
    // Simulate AI processing
    setTimeout(() => {
      setShowAiAssistDialog(false);
      
      toast({
        title: "Extraction réussie",
        description: "Les informations ont été extraites et appliquées aux documents."
      });
    }, 1500); // Faster processing
  };
  
  const getDocumentIcon = (doc: Document) => {
    if (!doc.uploaded) return <FileText className="h-5 w-5 text-muted-foreground" />;
    
    switch (doc.status) {
      case 'valid':
        return <FileCheck className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <FileText className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  // Simplifier l'interface d'ajout de document
  const quickAddDocument = (docType: string) => {
    const isStandardDoc = DocumentTypes[shipmentType].find(doc => doc.name === docType);
    
    const newDoc: Partial<Document> = {
      name: docType,
      mandatory: isStandardDoc?.mandatory || false,
      uploaded: false,
      date: "",
    };
    
    if (onAddDocument) {
      onAddDocument(newDoc);
    }
    
    toast({
      title: "Document ajouté",
      description: `"${docType}" a été ajouté à la liste.`
    });
  };
  
  // Fonction pour uploader rapidement un document
  const quickUploadDocument = (docId: number) => {
    if (onUploadDocument) {
      onUploadDocument(docId);
    }
    
    // Simuler une ouverture automatique du dialogue de téléversement
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      if (e.target.files?.length) {
        setSelectedFiles([e.target.files[0]]);
        toast({
          title: "Document sélectionné",
          description: "Téléversement en cours..."
        });
        
        // Simuler le téléversement automatique
        setTimeout(() => {
          toast({
            title: "Téléversement réussi",
            description: "Le document a été téléversé avec succès."
          });
        }, 800);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h3 className="text-lg font-semibold mb-1">Documents d'expédition</h3>
          <p className="text-sm text-muted-foreground">
            {uploadedMandatoryDocCount}/{mandatoryDocCount} documents obligatoires téléversés
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Boutons principaux simplifiés */}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setShowBulkUploadDialog(true)}
          >
            <Upload className="h-4 w-4" />
            Import multiple
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setShowAiAssistDialog(true)}
          >
            <ClipboardCheck className="h-4 w-4" />
            Assistant IA
          </Button>
          
          <Button 
            size="sm" 
            className="gap-1"
            onClick={() => setShowAddDocumentDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
      
      {/* Barre de recherche et filtres simplifiés */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un document..."
            value={docSearchTerm}
            onChange={(e) => setDocSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Tabs value={activeDocTab} onValueChange={setActiveDocTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="mandatory">Obligatoires</TabsTrigger>
            <TabsTrigger value="missing">Manquants</TabsTrigger>
            <TabsTrigger value="uploaded">Téléversés</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Liste de documents simplifiée */}
      <div className="space-y-2">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Aucun document trouvé</p>
            {activeDocTab === 'missing' && documents.length > 0 && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setActiveDocTab('all')}>
                Voir tous les documents
              </Button>
            )}
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className={`flex items-center justify-between p-3 border rounded-md transition-colors ${
                highlightMissing && doc.mandatory && !doc.uploaded 
                  ? 'border-amber-300 bg-amber-50' 
                  : doc.uploaded && doc.status === 'valid'
                  ? 'border-green-200 bg-green-50'
                  : doc.uploaded && doc.status === 'rejected'
                  ? 'border-red-200 bg-red-50'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {getDocumentIcon(doc)}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{doc.name}</p>
                    {doc.mandatory && (
                      <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800">
                        Obligatoire
                      </Badge>
                    )}
                    {doc.uploaded && doc.status === 'valid' && (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                        Validé
                      </Badge>
                    )}
                    {doc.uploaded && doc.status === 'pending' && (
                      <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700">
                        En attente
                      </Badge>
                    )}
                    {doc.uploaded && doc.status === 'rejected' && (
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-700">
                        Refusé
                      </Badge>
                    )}
                  </div>
                  {doc.uploaded ? (
                    <div className="text-xs text-muted-foreground">
                      <span>Téléversé le {doc.date}</span>
                      {doc.size && <span className="mx-2">•</span>}
                      {doc.size && <span>{doc.size}</span>}
                    </div>
                  ) : (
                    <p className="text-xs text-amber-600">Document non téléversé</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {doc.uploaded ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-blue-600" 
                    onClick={() => onDownloadDocument && onDownloadDocument(doc.id)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Télécharger</span>
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-green-600"
                    onClick={() => quickUploadDocument(doc.id)}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Téléverser</span>
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Section pour ajouter des documents manquants obligatoires en un clic */}
      {activeDocTab === 'missing' && filteredDocuments.length === 0 && documents.length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <h4 className="font-medium mb-2">Tous les documents obligatoires sont téléversés</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Vous avez fourni tous les documents obligatoires pour cette expédition.
          </p>
          <Button variant="outline" size="sm" onClick={() => setActiveDocTab('all')}>
            Voir tous les documents
          </Button>
        </div>
      )}
      
      {activeDocTab === 'missing' && filteredDocuments.length === 0 && documents.length === 0 && (
        <div className="mt-4 p-4 border rounded-md bg-blue-50 border-blue-200">
          <h4 className="font-medium mb-2 text-blue-800">Ajoutez les documents obligatoires</h4>
          <p className="text-sm text-blue-700 mb-3">
            Aucun document n'a encore été ajouté pour cette expédition. Voici les documents obligatoires pour le transport {shipmentType}:
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {DocumentTypes[shipmentType]
              .filter(doc => doc.mandatory)
              .map((doc, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="bg-white" 
                  onClick={() => quickAddDocument(doc.name)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {doc.name}
                </Button>
              ))}
          </div>
          <Button variant="ghost" size="sm" className="text-blue-700" onClick={() => setActiveDocTab('all')}>
            Voir tous les types de documents
          </Button>
        </div>
      )}
      
      {/* Ajout rapide pour documents manquants obligatoires */}
      {activeDocTab === 'missing' && filteredDocuments.length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-amber-50 border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">Téléverser rapidement les documents manquants</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white gap-1"
              onClick={() => {
                // Simuler le téléversement de tous les documents manquants
                filteredDocuments.forEach(doc => {
                  if (!doc.uploaded && doc.mandatory) {
                    quickUploadDocument(doc.id);
                  }
                });
              }}
            >
              <Upload className="h-4 w-4" />
              Téléverser tous les documents manquants
            </Button>
          </div>
        </div>
      )}
      
      {/* Dialogs */}
      <Dialog open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import multiple de documents</DialogTitle>
            <DialogDescription>
              Téléversez plusieurs documents à la fois - ils seront automatiquement associés aux types correspondants.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <Input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload">
                <Button variant="ghost" size="sm" className="cursor-pointer w-full">
                  Sélectionner des fichiers ou glisser-déposer ici
                </Button>
              </label>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">{selectedFiles.length} fichier(s) sélectionné(s)</p>
                <div className="max-h-[150px] overflow-y-auto space-y-1 text-sm">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Téléversement en cours...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch id="auto-detect" defaultChecked />
              <label htmlFor="auto-detect" className="text-sm">
                Association automatique des documents
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkUploadDialog(false)} disabled={isUploading}>
              Annuler
            </Button>
            <Button onClick={handleBulkUpload} disabled={selectedFiles.length === 0 || isUploading}>
              {isUploading ? "Téléversement..." : "Téléverser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAiAssistDialog} onOpenChange={setShowAiAssistDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assistant IA pour documents</DialogTitle>
            <DialogDescription>
              Notre IA peut analyser vos documents pour en extraire les informations et vérifier leur conformité.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex flex-col gap-2">
              <Checkbox id="extract-info" defaultChecked />
              <label htmlFor="extract-info" className="text-sm cursor-pointer">
                Extraire les informations importantes
              </label>
              
              <Checkbox id="validate-docs" defaultChecked />
              <label htmlFor="validate-docs" className="text-sm cursor-pointer">
                Valider la conformité des documents
              </label>
              
              <Checkbox id="suggest-missing" defaultChecked />
              <label htmlFor="suggest-missing" className="text-sm cursor-pointer">
                Identifier les documents manquants
              </label>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <AlertTriangle className="h-4 w-4 inline-block mr-2" />
                Les résultats de l'IA sont fournis à titre indicatif uniquement.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAiAssist}>
              Lancer l'analyse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAddDocumentDialog} onOpenChange={setShowAddDocumentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de document</label>
              <Select value={newDocumentType} onValueChange={setNewDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type de document" />
                </SelectTrigger>
                <SelectContent>
                  {DocumentTypes[shipmentType].map((doc, index) => (
                    <SelectItem key={index} value={doc.name}>
                      {doc.name} {doc.mandatory && "(Obligatoire)"}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Autre document...</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newDocumentType === 'other' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du document</label>
                <Input
                  placeholder="Entrez le nom du document"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mandatory-doc"
                checked={isMandatory}
                onCheckedChange={(checked) => setIsMandatory(checked === true)}
              />
              <label htmlFor="mandatory-doc" className="text-sm">
                Document obligatoire
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDocumentDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddDocument}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Footer simplifié */}
      <CardFooter className="flex justify-between px-0 pt-4">
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={() => {
            toast({
              title: "Téléchargement en cours",
              description: "Tous les documents sont en cours de téléchargement."
            });
          }}
        >
          <Download className="h-4 w-4" />
          Tout télécharger
        </Button>
        
        {documents.some(d => d.mandatory && !d.uploaded) ? (
          <Badge variant="outline" className="bg-amber-100 text-amber-700">
            Documents obligatoires manquants
          </Badge>
        ) : documents.length > 0 ? (
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Tous les documents obligatoires sont présents
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            Aucun document ajouté
          </Badge>
        )}
      </CardFooter>
    </div>
  );
};

export default DocumentManager;
