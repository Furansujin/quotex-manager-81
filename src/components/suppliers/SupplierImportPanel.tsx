
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, HelpCircle, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SupplierImportPanelProps {
  onClose?: () => void;
  supplierId?: string; // Optionnel, pour l'importation depuis une fiche fournisseur
}

const SupplierImportPanel: React.FC<SupplierImportPanelProps> = ({ onClose, supplierId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const [importType, setImportType] = useState(supplierId ? 'pricing' : 'suppliers');
  const { toast } = useToast();

  // Gérer la sélection d'un fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Vérifier si c'est un CSV ou un Excel
      const isCSV = selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv');
      const isExcel = selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                      selectedFile.type === 'application/vnd.ms-excel' ||
                      selectedFile.name.endsWith('.xlsx') ||
                      selectedFile.name.endsWith('.xls');
      
      if (!isCSV && !isExcel) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner un fichier CSV ou Excel",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setImportResult(null);
      
      // Lire le contenu du fichier pour prévisualisation (uniquement pour CSV)
      if (isCSV) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setCsvData(event.target.result as string);
          }
        };
        reader.readAsText(selectedFile);
      } else {
        setCsvData("Aperçu non disponible pour les fichiers Excel. L'importation sera traitée directement.");
      }
    }
  };

  // Simuler l'importation
  const handleImport = () => {
    if (!file) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier à importer",
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
              });
              
              // Fermer la modal après un certain délai en cas de succès
              if (onClose) {
                setTimeout(onClose, 2000);
              }
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

  // Télécharger un modèle de fichier
  const handleDownloadTemplate = () => {
    let templateContent = '';
    let fileName = '';
    
    if (importType === 'suppliers') {
      templateContent = 'nom,categorie,contact,email,telephone,statut\nFournisseur A,maritime,Jean Durand,jean.durand@example.com,+33612345678,actif\nFournisseur B,aérien,Marie Dupont,marie.dupont@example.com,+33687654321,actif';
      fileName = 'modele_import_fournisseurs.csv';
    } else if (importType === 'pricing') {
      templateContent = 'fournisseur,origine,destination,type_transport,prix,devise,temps_transit,validite,niveau_service,reference_contrat\nMaersk,Paris,New York,maritime,1500,EUR,25-30 jours,31/12/2023,standard,CTR-001\nAir France Cargo,Paris,New York,aérien,2500,EUR,2-3 jours,31/12/2023,express,CTR-002';
      fileName = 'modele_import_tarifs.csv';
    }
    
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
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
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        {!supplierId && (
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
        )}
        
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
                <p>Télécharger un fichier modèle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid w-full max-w-lg gap-2">
          <Label htmlFor="csvFile" className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Sélectionner un fichier CSV ou Excel
          </Label>
          <Input
            id="csvFile"
            type="file"
            accept=".csv,.xlsx,.xls"
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
      </div>
      
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

      <Card className="bg-muted/30 border border-muted">
        <CardContent className="pt-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Format attendu
          </h3>
          
          <div className="text-xs text-muted-foreground space-y-1">
            {importType === 'suppliers' ? (
              <ul className="list-disc list-inside space-y-1">
                <li><span className="font-medium">nom</span> - Nom du fournisseur</li>
                <li><span className="font-medium">categorie</span> - Catégorie (maritime, aérien, routier, etc.)</li>
                <li><span className="font-medium">contact</span> - Nom du contact</li>
                <li><span className="font-medium">email</span> - Email du contact</li>
                <li><span className="font-medium">telephone</span> - Numéro de téléphone</li>
                <li><span className="font-medium">statut</span> - Statut (actif, inactif)</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                <li><span className="font-medium">origine</span> - Lieu d'origine</li>
                <li><span className="font-medium">destination</span> - Lieu de destination</li>
                <li><span className="font-medium">type_transport</span> - Type de transport</li>
                <li><span className="font-medium">prix</span> - Prix (nombre)</li>
                <li><span className="font-medium">devise</span> - Devise (EUR, USD, etc.)</li>
                <li><span className="font-medium">temps_transit</span> - Temps de transit estimé</li>
                <li><span className="font-medium">validite</span> - Date de validité</li>
                <li><span className="font-medium">niveau_service</span> - Niveau de service</li>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={isImporting || !file}
        >
          {isImporting ? 'Importation en cours...' : 'Importer les données'}
        </Button>
      </div>
    </div>
  );
};

export default SupplierImportPanel;
