
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Phone, Mail, MapPin, Trash2, Plus, Import, FileText, Edit, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SupplierImportPanel from './SupplierImportPanel';

interface SupplierDetailProps {
  supplierId: string;
  onClose: () => void;
}

// Prix fictifs pour la démonstration
const dummyPrices = [
  { id: 'p1', origin: 'Paris', destination: 'New York', mode: 'Maritime', price: 1250, currency: 'EUR', transit: '25-30 jours', validUntil: '31/12/2023' },
  { id: 'p2', origin: 'Marseille', destination: 'Shanghai', mode: 'Maritime', price: 1450, currency: 'EUR', transit: '35-40 jours', validUntil: '31/12/2023' },
  { id: 'p3', origin: 'Paris', destination: 'Tokyo', mode: 'Aérien', price: 2250, currency: 'EUR', transit: '2-3 jours', validUntil: '31/12/2023' },
  { id: 'p4', origin: 'Lyon', destination: 'Amsterdam', mode: 'Routier', price: 580, currency: 'EUR', transit: '2-3 jours', validUntil: '31/12/2023' },
];

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplierId, onClose }) => {
  const [activeTab, setActiveTab] = useState('infos');
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // États pour le formulaire d'édition
  const [supplierData, setSupplierData] = useState({
    name: 'CMA CGM',
    category: 'maritime',
    contact: 'Jean Dupont',
    email: 'jean.dupont@cmacgm.com',
    phone: '+33 1 23 45 67 89',
    address: '4 Quai d\'Arenc, 13002 Marseille',
    status: 'active',
    notes: 'Partenaire privilégié pour les routes maritimes Europe-Asie.',
    website: 'https://www.cmacgm-group.com'
  });

  const handleSave = () => {
    // Ici, vous implémenteriez la logique pour sauvegarder les modifications
    toast({
      title: "Fournisseur mis à jour",
      description: "Les informations du fournisseur ont été mises à jour avec succès."
    });
    setIsEditing(false);
  };

  const handleAddPrice = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout manuel de tarifs sera disponible prochainement."
    });
  };

  const handleDeletePrice = (priceId: string) => {
    toast({
      title: "Tarif supprimé",
      description: "Le tarif a été supprimé avec succès."
    });
  };

  const handleExportPrices = () => {
    toast({
      title: "Export réussi",
      description: "Les tarifs ont été exportés avec succès."
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? 'Modifier le fournisseur' : supplierData.name}
          </DialogTitle>
        </DialogHeader>

        {!showImportPanel ? (
          <>
            <Tabs defaultValue="infos" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="infos">Informations</TabsTrigger>
                <TabsTrigger value="pricing">Tarification</TabsTrigger>
              </TabsList>
              
              <TabsContent value="infos">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom</Label>
                        <Input 
                          id="name" 
                          value={supplierData.name} 
                          onChange={(e) => setSupplierData({...supplierData, name: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Catégorie</Label>
                        <Select 
                          value={supplierData.category} 
                          onValueChange={(value) => setSupplierData({...supplierData, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maritime">Maritime</SelectItem>
                            <SelectItem value="aerien">Aérien</SelectItem>
                            <SelectItem value="routier">Routier</SelectItem>
                            <SelectItem value="ferroviaire">Ferroviaire</SelectItem>
                            <SelectItem value="multimodal">Multimodal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="contact">Contact</Label>
                        <Input 
                          id="contact" 
                          value={supplierData.contact} 
                          onChange={(e) => setSupplierData({...supplierData, contact: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={supplierData.email} 
                          onChange={(e) => setSupplierData({...supplierData, email: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input 
                          id="phone" 
                          value={supplierData.phone} 
                          onChange={(e) => setSupplierData({...supplierData, phone: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="website">Site Web</Label>
                        <Input 
                          id="website" 
                          value={supplierData.website} 
                          onChange={(e) => setSupplierData({...supplierData, website: e.target.value})}
                        />
                      </div>
                      
                      <div className="col-span-full">
                        <Label htmlFor="address">Adresse</Label>
                        <Input 
                          id="address" 
                          value={supplierData.address} 
                          onChange={(e) => setSupplierData({...supplierData, address: e.target.value})}
                        />
                      </div>
                      
                      <div className="col-span-full">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea 
                          id="notes" 
                          value={supplierData.notes} 
                          onChange={(e) => setSupplierData({...supplierData, notes: e.target.value})}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="status" 
                          checked={supplierData.status === 'active'} 
                          onCheckedChange={(checked) => setSupplierData({...supplierData, status: checked ? 'active' : 'inactive'})}
                        />
                        <Label htmlFor="status">Actif</Label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-full space-y-4">
                      <div className="flex items-center">
                        <Badge variant={supplierData.status === 'active' ? 'default' : 'destructive'} className="mr-2">
                          {supplierData.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                        <Badge variant="outline">{supplierData.category === 'maritime' ? 'Maritime' : supplierData.category === 'aerien' ? 'Aérien' : supplierData.category === 'routier' ? 'Routier' : supplierData.category === 'ferroviaire' ? 'Ferroviaire' : 'Multimodal'}</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Nom:</span>
                          <span>{supplierData.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Contact:</span>
                          <span>{supplierData.contact} ({supplierData.phone})</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Email:</span>
                          <a href={`mailto:${supplierData.email}`} className="text-blue-600 hover:underline">{supplierData.email}</a>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Adresse:</span>
                          <span>{supplierData.address}</span>
                        </div>
                        
                        {supplierData.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Site Web:</span>
                            <a href={supplierData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{supplierData.website}</a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {supplierData.notes && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{supplierData.notes}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pricing">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Grilles tarifaires</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2" onClick={handleExportPrices}>
                        <Download className="h-4 w-4" />
                        Exporter
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={() => setShowImportPanel(true)}>
                        <Import className="h-4 w-4" />
                        Importer
                      </Button>
                      <Button className="gap-2" onClick={handleAddPrice}>
                        <Plus className="h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Origine</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Transit</TableHead>
                            <TableHead>Validité</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dummyPrices.map((price) => (
                            <TableRow key={price.id}>
                              <TableCell>{price.origin}</TableCell>
                              <TableCell>{price.destination}</TableCell>
                              <TableCell>{price.mode}</TableCell>
                              <TableCell>{price.price} {price.currency}</TableCell>
                              <TableCell>{price.transit}</TableCell>
                              <TableCell>{price.validUntil}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button size="icon" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleDeletePrice(price.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          
                          {dummyPrices.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                                Aucun tarif défini pour ce fournisseur.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                  <Button onClick={handleSave}>Enregistrer</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={onClose}>Fermer</Button>
                  {activeTab === 'infos' && (
                    <Button onClick={() => setIsEditing(true)}>Modifier</Button>
                  )}
                </>
              )}
            </DialogFooter>
          </>
        ) : (
          <SupplierImportPanel onClose={() => setShowImportPanel(false)} supplierId={supplierId} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SupplierDetail;
