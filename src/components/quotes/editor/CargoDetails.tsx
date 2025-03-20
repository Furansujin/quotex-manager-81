
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface CargoDetailsProps {
  description: string;
  setDescription: (value: string) => void;
  cargoType: string;
  setCargoType: (value: string) => void;
  cargoNature: string;
  setCargoNature: (value: string) => void;
  length: string;
  setLength: (value: string) => void;
  width: string;
  setWidth: (value: string) => void;
  height: string;
  setHeight: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  volume: string;
  setVolume: (value: string) => void;
  packaging: string;
  setPackaging: (value: string) => void;
  packageCount: string;
  setPackageCount: (value: string) => void;
}

const CargoDetails: React.FC<CargoDetailsProps> = ({
  description,
  setDescription,
  cargoType,
  setCargoType,
  cargoNature,
  setCargoNature,
  length,
  setLength,
  width,
  setWidth,
  height,
  setHeight,
  weight,
  setWeight,
  volume,
  setVolume,
  packaging,
  setPackaging,
  packageCount,
  setPackageCount
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de la marchandise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cargo-description">Description détaillée</Label>
          <Textarea 
            id="cargo-description" 
            placeholder="Description de la marchandise transportée..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cargo-type">Type de marchandise</Label>
            <Select value={cargoType} onValueChange={setCargoType}>
              <SelectTrigger id="cargo-type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goods">Marchandises générales</SelectItem>
                <SelectItem value="electronics">Électronique</SelectItem>
                <SelectItem value="textiles">Textile</SelectItem>
                <SelectItem value="food">Produits alimentaires</SelectItem>
                <SelectItem value="chemicals">Produits chimiques</SelectItem>
                <SelectItem value="machinery">Machines/Équipements</SelectItem>
                <SelectItem value="vehicles">Véhicules/Pièces détachées</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cargo-nature">Nature</Label>
            <Select value={cargoNature} onValueChange={setCargoNature}>
              <SelectTrigger id="cargo-nature">
                <SelectValue placeholder="Sélectionner une nature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="fragile">Fragile</SelectItem>
                <SelectItem value="dangerous">Dangereux</SelectItem>
                <SelectItem value="perishable">Périssable</SelectItem>
                <SelectItem value="highvalue">Haute valeur</SelectItem>
                <SelectItem value="oversized">Hors gabarit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Dimensions et poids</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Input 
                  id="cargo-length" 
                  placeholder="Longueur" 
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">cm</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Input 
                  id="cargo-width" 
                  placeholder="Largeur" 
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">cm</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Input 
                  id="cargo-height" 
                  placeholder="Hauteur" 
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">cm</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Input 
                  id="cargo-weight" 
                  placeholder="Poids total" 
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">kg</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cargo-volume">Volume total</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="cargo-volume" 
                placeholder="Volume"
                type="number" 
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
              <span className="text-sm text-muted-foreground">m³</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cargo-packaging">Conditionnement</Label>
            <Select value={packaging} onValueChange={setPackaging}>
              <SelectTrigger id="cargo-packaging">
                <SelectValue placeholder="Type de conditionnement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="packages">Colis</SelectItem>
                <SelectItem value="pallets">Palettes</SelectItem>
                <SelectItem value="container20">Container 20'</SelectItem>
                <SelectItem value="container40">Container 40'</SelectItem>
                <SelectItem value="container40hc">Container 40' HC</SelectItem>
                <SelectItem value="bulk">Vrac</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cargo-count">Nombre</Label>
            <Input 
              id="cargo-count" 
              placeholder="Nombre de colis/palettes/etc."
              type="number"
              value={packageCount}
              onChange={(e) => setPackageCount(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CargoDetails;
