
import React, { useState, useEffect } from 'react';
import { X, Save, ChevronRight, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface ClientFormProps {
  clientId?: string;
  onClose: () => void;
}

const ClientForm = ({ clientId, onClose }: ClientFormProps) => {
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    tags: [] as string[],
    status: 'active',
    notes: ''
  });
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Si clientId est fourni, charger les données du client pour l'édition
    if (clientId) {
      // Simulation de chargement des données
      setLoading(true);
      setTimeout(() => {
        // Remplacer par un appel API réel
        if (clientId === 'CL-001') {
          setClient({
            name: 'Tech Supplies Inc',
            contactName: 'John Smith',
            email: 'john@techsupplies.com',
            phone: '+33 1 23 45 67 89',
            address: '123 Tech Blvd, Paris, FR',
            tags: ['VIP', 'International'],
            status: 'active',
            notes: 'Client prioritaire, tarifs négociés'
          });
        }
        setLoading(false);
      }, 500);
    }
  }, [clientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setClient(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }));
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !client.tags.includes(newTag.trim())) {
      setClient(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setClient(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler l'enregistrement
    setTimeout(() => {
      setLoading(false);
      toast({
        title: clientId ? "Client mis à jour" : "Client créé",
        description: `${client.name} a été ${clientId ? 'mis à jour' : 'créé'} avec succès.`,
      });
      onClose();
    }, 1000);
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle>{clientId ? 'Modifier le client' : 'Nouveau client'}</SheetTitle>
          <SheetDescription>
            {clientId ? "Modifiez les informations du client" : "Ajoutez un nouveau client à votre base de données"}
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du client</Label>
              <Input 
                id="name" 
                name="name" 
                value={client.name} 
                onChange={handleChange} 
                placeholder="Ex: Tech Supplies Inc" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactName">Nom du contact principal</Label>
              <Input 
                id="contactName" 
                name="contactName" 
                value={client.contactName} 
                onChange={handleChange} 
                placeholder="Ex: John Smith" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={client.email} 
                  onChange={handleChange} 
                  placeholder="Ex: contact@example.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={client.phone} 
                  onChange={handleChange} 
                  placeholder="Ex: +33 1 23 45 67 89" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input 
                id="address" 
                name="address" 
                value={client.address} 
                onChange={handleChange} 
                placeholder="Ex: 123 Business St, Paris, FR" 
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="status">Statut du client</Label>
                <Switch 
                  id="status" 
                  checked={client.status === 'active'} 
                  onCheckedChange={handleSwitchChange} 
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {client.status === 'active' ? 'Client actif' : 'Client inactif'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {client.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1" 
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag..."
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={addTag}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={client.notes} 
                onChange={handleChange} 
                placeholder="Notes supplémentaires sur le client..." 
                rows={3}
              />
            </div>
          </div>
          
          <SheetFooter className="mt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : clientId ? 'Mettre à jour' : 'Créer le client'}
              {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ClientForm;
