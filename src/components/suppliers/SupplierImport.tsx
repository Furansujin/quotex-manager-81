
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Database, AlertCircle, CheckCircle, HelpCircle, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SupplierImport = () => {
  const [activeTab, setActiveTab] = useState('file');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const [importType, setImportType] = useState('suppliers');
  const { toast } = useToast();

  // Gérer la sélection d'un fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner un fichier CSV",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setImportResult(null);
      
      // Lire le contenu du fichier pour prévisualisation
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCsvData(event.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  // Simuler l'importation
  const handleImport = () => {
    if (activeTab === 'file' && !file) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier CSV à importer",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'paste' && !csvData.trim()) {
      toast({
        title: "Aucune donnée",
        description: "Veuillez coller des données CSV",
        variant: "destructive"
      });
      return;
    }
    
    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);
    
    // Simuler une progression
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 10);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsImporting(false);
            
            // Simuler un résultat
            const success = Math.random() > 0.2; // 80% de chance de succès
            if (success) {
              setImportResult({
                success: true,
                message: "Importation réussie",
                details: `${Math.floor(Math.random() * 10) + 5} enregistrements ont été importés avec succès.`
              });
              toast({
                title: "Importation réussie",
                description: "Les données ont été importées avec succès.",
                variant: "default"
              });
            } else {
              setImportResult({
                success: false,
                message: "Erreur lors de l'importation",
                details: "Certaines lignes n'ont pas pu être importées en raison de données manquantes ou invalides. Veuillez vérifier votre fichier et réessayer."
              });
              toast({
                title: "Erreur d'importation",
                description: "Des erreurs sont survenues pendant l'importation.",
                variant: "destructive"
              });
            }
          }, 500);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  // Télécharger un modèle de fichier CSV
  const handleDownloadTemplate = () => {
    let templateContent = '';
    
    if (importType === 'suppliers') {
      templateContent = 'nom,categorie,contact,email,telephone,statut\nFournisseur A,maritime,Jean Durand,jean.durand@example.com,+33612345678,actif\nFournisseur B,aérien,Marie Dupont,marie.dupont@example.com,+33687654321,actif';
    } else if (importType === 'pricing') {
      templateContent = 'fournisseur,origine,destination,type_transport,prix,devise,temps_transit,validite,niveau_service,reference_contrat\nMaersk,Paris,New York,maritime,1500,EUR,25-30 jours,31/12/2023,standard,CTR-001\nAir France Cargo,Paris,New York,aérien,2500,EUR,2-3 jours,31/12/2023,express,CTR-002';
    }
    
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `modele_import_${importType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Modèle téléchargé",
      description: "Le modèle CSV a été téléchargé avec succès.",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Import de Données
          </CardTitle>
          <CardDescription>
            Importez des données de fournisseurs ou de tarifs à partir d'un fichier CSV ou en les collant directement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div>
                <Label htmlFor="importType">Type de données</Label>
                <Select value={importType} onValueChange={setImportType}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Sélectionner le type de données" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suppliers">Fournisseurs</SelectItem>
                    <SelectItem value="pricing">Tarification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex md:ml-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger le modèle
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Télécharger un fichier CSV modèle</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <Tabs 
              defaultValue="file" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file" className="flex gap-2">
                  <Upload className="h-4 w-4" /> Fichier CSV
                </TabsTrigger>
                <TabsTrigger value="paste" className="flex gap-2">
                  <FileText className="h-4 w-4" /> Coller des données
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="file" className="space-y-4">
                <div className="grid w-full max-w-lg gap-2">
                  <Label htmlFor="csvFile">Sélectionner un fichier CSV</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                  
                  {file && (
                    <div className="mt-2 text-sm">
                      <p>Fichier sélectionné: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)</p>
                    </div>
                  )}
                </div>
                
                {file && csvData && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Aperçu du contenu:</h3>
                    <div className="bg-muted p-3 rounded-md overflow-auto max-h-[200px]">
                      <pre className="text-xs">{csvData.slice(0, 500)}{csvData.length > 500 ? '...' : ''}</pre>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="paste" className="space-y-4">
                <div className="grid w-full gap-2">
                  <Label htmlFor="csvText">Coller des données CSV</Label>
                  <Textarea
                    id="csvText"
                    placeholder="Collez vos données au format CSV ici..."
                    className="min-h-[200px] font-mono text-sm"
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <p>Assurez-vous que vos données sont au format CSV, avec des virgules comme séparateurs et une ligne d'en-tête.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Progression de l'importation</Label>
                  <span className="text-xs text-muted-foreground">{importProgress}%</span>
                </div>
                <Progress value={importProgress} />
              </div>
            )}
            
            {importResult && (
              <Alert variant={importResult.success ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {importResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{importResult.message}</AlertTitle>
                </div>
                <AlertDescription>{importResult.details}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setFile(null);
              setCsvData('');
              setImportResult(null);
            }}
          >
            Réinitialiser
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={isImporting || (activeTab === 'file' && !file) || (activeTab === 'paste' && !csvData.trim())}
          >
            {isImporting ? 'Importation en cours...' : 'Importer les données'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" /> Instructions d'importation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium">Format de fichier</h3>
              <p className="text-sm text-muted-foreground">
                L'importation accepte uniquement les fichiers au format CSV (Comma-Separated Values).
                Assurez-vous que votre fichier utilise des virgules comme séparateurs et inclut une ligne d'en-tête.
              </p>
            </div>
            
            <div>
              <h3 className="text-base font-medium">Structure des données</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Selon le type de données que vous importez, votre fichier doit contenir les colonnes suivantes:
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <h4 className="text-sm font-medium mb-2">Fournisseurs</h4>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                    <li><span className="font-medium">nom</span> - Nom du fournisseur</li>
                    <li><span className="font-medium">categorie</span> - Catégorie (maritime, aérien, routier, ferroviaire, multimodal)</li>
                    <li><span className="font-medium">contact</span> - Nom du contact</li>
                    <li><span className="font-medium">email</span> - Email du contact</li>
                    <li><span className="font-medium">telephone</span> - Numéro de téléphone</li>
                    <li><span className="font-medium">statut</span> - Statut (actif, inactif)</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-3">
                  <h4 className="text-sm font-medium mb-2">Tarification</h4>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                    <li><span className="font-medium">fournisseur</span> - Nom du fournisseur</li>
                    <li><span className="font-medium">origine</span> - Lieu d'origine</li>
                    <li><span className="font-medium">destination</span> - Lieu de destination</li>
                    <li><span className="font-medium">type_transport</span> - Type de transport (maritime, aérien, etc.)</li>
                    <li><span className="font-medium">prix</span> - Prix (nombre)</li>
                    <li><span className="font-medium">devise</span> - Devise (EUR, USD, etc.)</li>
                    <li><span className="font-medium">temps_transit</span> - Temps de transit estimé</li>
                    <li><span className="font-medium">validite</span> - Date de validité (format JJ/MM/AAAA)</li>
                    <li><span className="font-medium">niveau_service</span> - Niveau de service (express, standard, economy)</li>
                    <li><span className="font-medium">reference_contrat</span> - Référence du contrat (optionnel)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierImport;
