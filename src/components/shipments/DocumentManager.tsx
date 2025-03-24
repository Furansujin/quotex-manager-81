
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
  MoreHorizontal, 
  RefreshCw,
  Copy,
  ExternalLink,
  FileCheck,
  FilePlus,
  ClipboardCheck,
  Search
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
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
      progress += 10;
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
    }, 500);
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
    }, 2000);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Documents d'expédition</h3>
          <p className="text-sm text-muted-foreground">
            {uploadedMandatoryDocCount}/{mandatoryDocCount} documents obligatoires téléversés
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Modèles
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modèles de documents</DialogTitle>
                <DialogDescription>
                  Téléchargez des modèles de documents préformatés pour cette expédition.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du modèle</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templateDocuments.map((template, index) => (
                      <TableRow key={index}>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.type}</TableCell>
                        <TableCell>{template.format}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadTemplate(template.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTemplatesDialog(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Upload className="h-4 w-4" />
                Import multiple
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import multiple de documents</DialogTitle>
                <DialogDescription>
                  Téléversez plusieurs documents à la fois.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  </div>
                  <p className="mb-2 text-sm">
                    Glissez-déposez vos fichiers ici ou
                  </p>
                  <Input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                      Parcourir vos fichiers
                    </Button>
                  </label>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{selectedFiles.length} fichier(s) sélectionné(s):</p>
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Associer automatiquement les documents</label>
                  <p className="text-xs text-muted-foreground">
                    Le système tentera d'identifier automatiquement le type de chaque document.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-detect" defaultChecked />
                    <label htmlFor="auto-detect" className="text-sm">
                      Détection automatique
                    </label>
                  </div>
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
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <ClipboardCheck className="h-4 w-4" />
                Assistance IA
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assistance IA pour documents</DialogTitle>
                <DialogDescription>
                  Notre IA peut analyser vos documents pour extraire des informations clés et vérifier leur conformité.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Actions disponibles:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Checkbox id="extract-info" />
                      <div>
                        <label htmlFor="extract-info" className="text-sm font-medium">
                          Extraire les informations importantes
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Extraire les dates, numéros de référence, montants et informations clés des documents.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox id="validate-docs" defaultChecked />
                      <div>
                        <label htmlFor="validate-docs" className="text-sm font-medium">
                          Valider la conformité des documents
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Vérifier que les documents respectent les normes et exigences pour cette expédition.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox id="suggest-missing" defaultChecked />
                      <div>
                        <label htmlFor="suggest-missing" className="text-sm font-medium">
                          Suggérer les documents manquants
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Identifier les documents qui pourraient être nécessaires selon le type d'expédition.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <AlertTriangle className="h-4 w-4 inline-block mr-2" />
                    Les résultats de l'IA sont fournis à titre indicatif et ne remplacent pas une vérification humaine.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAiAssistDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAiAssist}>
                  Lancer l'analyse
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddDocumentDialog} onOpenChange={setShowAddDocumentDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un document</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau document à l'expédition.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
                    Document obligatoire pour cette expédition
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
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document..."
                value={docSearchTerm}
                onChange={(e) => setDocSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Tabs value={activeDocTab} onValueChange={setActiveDocTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="mandatory">Obligatoires</TabsTrigger>
                <TabsTrigger value="missing">Manquants</TabsTrigger>
                <TabsTrigger value="uploaded">Téléversés</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="highlight-missing"
                checked={highlightMissing}
                onCheckedChange={setHighlightMissing}
              />
              <label htmlFor="highlight-missing" className="text-sm text-muted-foreground whitespace-nowrap">
                Signaler les manquants
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Aucun document trouvé</p>
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
                      <div className="flex flex-wrap gap-1">
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
                    </div>
                    {doc.uploaded ? (
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4">
                        <span>Téléversé le {doc.date}</span>
                        {doc.size && <span>{doc.size}</span>}
                        {doc.validUntil && <span>Valide jusqu'au {doc.validUntil}</span>}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600">Document non téléversé</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {doc.uploaded ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1" 
                        onClick={() => onDownloadDocument && onDownloadDocument(doc.id)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Télécharger</span>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Modifier</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Dupliquer</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            toast({
                              title: "Validation demandée",
                              description: "Une demande de validation a été envoyée."
                            });
                          }}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Demander validation</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Ouvrir</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => onUploadDocument && onUploadDocument(doc.id)}
                      >
                        <Upload className="h-4 w-4" />
                        <span className="hidden sm:inline">Téléverser</span>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownloadTemplate(doc.name)}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Télécharger modèle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            <span>Signaler comme non requis</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
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
        
        <div className="flex items-center gap-2">
          {documents.some(d => d.mandatory && !d.uploaded) ? (
            <Badge variant="outline" className="bg-amber-100 text-amber-700">
              Documents obligatoires manquants
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-100 text-green-700">
              Tous les documents obligatoires sont présents
            </Badge>
          )}
        </div>
      </CardFooter>
    </div>
  );
};

export default DocumentManager;
