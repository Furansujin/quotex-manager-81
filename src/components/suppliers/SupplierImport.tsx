
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

const SupplierImport = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [importType, setImportType] = useState<string>('tarifs');
  const { toast } = useToast();

  // Fonction pour gérer le changement de fichier
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier (excel ou csv)
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'text/csv') {
        setSelectedFile(file);
        setImportStatus('idle');
        setStatusMessage('');
      } else {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV (.csv)",
          variant: "destructive"
        });
      }
    }
  };

  // Fonction pour simuler l'importation de fichier
  const handleImport = () => {
    if (!selectedFile) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez d'abord sélectionner un fichier à importer",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simuler une progression d'importation
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Simuler différents résultats d'importation
          const randomOutcome = Math.random();
          if (randomOutcome > 0.7) {
            setImportStatus('error');
            setStatusMessage("L'importation a échoué. Certaines données sont invalides ou ne respectent pas le format attendu.");
          } else if (randomOutcome > 0.4) {
            setImportStatus('warning');
            setStatusMessage("Importation réussie avec des avertissements. Certaines lignes n'ont pas pu être importées.");
          } else {
            setImportStatus('success');
            setStatusMessage("Importation réussie ! Toutes les données ont été correctement importées.");
            toast({
              title: "Importation réussie",
              description: `${selectedFile.name} a été importé avec succès.`
            });
          }
        }
        return newProgress;
      });
    }, 300);
  };

  // Télécharger un modèle de fichier
  const handleDownloadTemplate = () => {
    toast({
      title: "Téléchargement du modèle",
      description: "Le modèle de fichier a été téléchargé."
    });
    // Dans une application réelle, cela déclencherait le téléchargement d'un fichier modèle
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Importer des données</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type d'importation</label>
                <Select value={importType} onValueChange={setImportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type de données" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tarifs">Tarifs fournisseurs</SelectItem>
                    <SelectItem value="fournisseurs">Liste de fournisseurs</SelectItem>
                    <SelectItem value="routes">Routes et destinations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Fichier à importer</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    className="gap-2 w-full"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Sélectionner un fichier
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleDownloadTemplate}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Modèle
                  </Button>
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Fichier sélectionné: {selectedFile.name}
                  </p>
                )}
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Importation en cours...</p>
                  <Progress value={uploadProgress} />
                </div>
              )}
              
              {importStatus !== 'idle' && (
                <Alert variant={importStatus === 'error' ? 'destructive' : importStatus === 'warning' ? 'default' : 'success'}>
                  {importStatus === 'error' && <AlertCircle className="h-4 w-4" />}
                  {importStatus === 'warning' && <Info className="h-4 w-4" />}
                  {importStatus === 'success' && <CheckCircle2 className="h-4 w-4" />}
                  <AlertTitle>
                    {importStatus === 'error' && "Erreur d'importation"}
                    {importStatus === 'warning' && "Avertissement"}
                    {importStatus === 'success' && "Importation réussie"}
                  </AlertTitle>
                  <AlertDescription>
                    {statusMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={handleImport} 
                disabled={!selectedFile || isUploading}
                className="w-full gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Importer les données
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Instructions d'importation</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm">Format de fichier accepté</h4>
                <p className="text-sm text-muted-foreground">
                  Fichiers Excel (.xlsx, .xls) ou CSV (.csv)
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Structure du fichier pour les tarifs</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-1">
                  <li>Fournisseur (texte)</li>
                  <li>Origine (texte)</li>
                  <li>Destination (texte)</li>
                  <li>Type de transport (maritime, aérien, routier, ferroviaire, multimodal)</li>
                  <li>Prix (nombre)</li>
                  <li>Devise (EUR, USD, GBP, JPY, CNY)</li>
                  <li>Temps de transit (texte)</li>
                  <li>Date de validité (date)</li>
                  <li>Niveau de service (express, standard, economy)</li>
                  <li>Référence contrat (texte, optionnel)</li>
                  <li>Notes (texte, optionnel)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Conseils d'importation</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-1">
                  <li>Utilisez le modèle fourni pour éviter les erreurs de format</li>
                  <li>Assurez-vous que les en-têtes de colonnes correspondent exactement</li>
                  <li>Vérifiez que les fournisseurs existent déjà dans le système</li>
                  <li>Les dates doivent être au format JJ/MM/AAAA</li>
                  <li>Pour les valeurs décimales, utilisez un point (.) comme séparateur</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Besoin d'aide ?</h4>
                <p className="text-sm text-muted-foreground">
                  Consultez la documentation ou contactez le support pour obtenir de l'aide sur l'importation de données.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Historique des importations</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Date</th>
                  <th className="py-2 text-left font-medium">Fichier</th>
                  <th className="py-2 text-left font-medium">Type</th>
                  <th className="py-2 text-left font-medium">Utilisateur</th>
                  <th className="py-2 text-left font-medium">Statut</th>
                  <th className="py-2 text-left font-medium">Lignes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">20/03/2023 10:45</td>
                  <td className="py-2">tarifs_mars_2023.xlsx</td>
                  <td className="py-2">Tarifs fournisseurs</td>
                  <td className="py-2">Jean Dupont</td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Succès
                    </span>
                  </td>
                  <td className="py-2">124 lignes</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">15/03/2023 14:30</td>
                  <td className="py-2">nouveaux_fournisseurs.csv</td>
                  <td className="py-2">Liste de fournisseurs</td>
                  <td className="py-2">Marie Martin</td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Avertissement
                    </span>
                  </td>
                  <td className="py-2">18/20 lignes</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">10/03/2023 09:15</td>
                  <td className="py-2">routes_asie.xlsx</td>
                  <td className="py-2">Routes et destinations</td>
                  <td className="py-2">Pierre Lefebvre</td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      Échec
                    </span>
                  </td>
                  <td className="py-2">0/45 lignes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierImport;
