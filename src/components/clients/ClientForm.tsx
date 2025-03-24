
import React, { useState, useEffect } from 'react';
import { X, Save, ChevronRight, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

  // Predefined tags for the client form
  const predefinedTags = [
    'VIP', 
    'International', 
    'PME', 
    'Entreprise', 
    'Import', 
    'Export', 
    'Customs', 
    'Tech', 
    'Healthcare', 
    'Perishable', 
    'Food', 
    'EU'
  ];

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

  const addPredefinedTag = (tag: string) => {
    if (!client.tags.includes(tag)) {
      setClient(prev => ({ ...prev, tags: [...prev.tags, tag] }));
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Add tag when pressing Enter in the tag input field
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{clientId ? 'Modifier le client' : 'Nouveau client'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Informations principales</h3>
              
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
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Détails additionnels</h3>
              
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
                    onKeyDown={handleKeyDown}
                    placeholder="Ajouter un tag..."
                    className="flex-1"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        type="button"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <div className="flex flex-wrap gap-1">
                        {predefinedTags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => addPredefinedTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button 
                    variant="outline" 
                    onClick={addTag}
                    type="button"
                  >
                    Ajouter
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
                  rows={5}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <span className="animate-spin">...</span>}
              {clientId ? 'Mettre à jour' : 'Créer le client'}
              {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
