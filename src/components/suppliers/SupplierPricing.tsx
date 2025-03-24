
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { SupplierPrice, mockPrices } from './types/supplierPricing';
import { filterPrices } from './utils/supplierPricingUtils';
import PriceFilters from './pricing/PriceFilters';
import PriceTable from './pricing/PriceTable';
import AddPriceDialog from './pricing/AddPriceDialog';
import EditPriceDialog from './pricing/EditPriceDialog';
import DeletePriceDialog from './pricing/DeletePriceDialog';
import PriceDetailDialog from './pricing/PriceDetailDialog';
import { PriceFormValues } from './pricing/PriceForm';

const SupplierPricing = () => {
  const [prices, setPrices] = useState<SupplierPrice[]>(mockPrices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<SupplierPrice | null>(null);
  const [priceToDelete, setPriceToDelete] = useState<SupplierPrice | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<SupplierPrice | null>(null);
  const { toast } = useToast();

  // Obtenir les origines et destinations uniques pour les filtres
  const uniqueOrigins = Array.from(new Set(prices.map(price => price.origin)));
  const uniqueDestinations = Array.from(new Set(prices.map(price => price.destination)));

  // Filtrer les tarifs
  const filteredPrices = filterPrices(
    prices,
    searchTerm,
    selectedOrigin,
    selectedDestination,
    selectedType
  );

  // Gestion de l'ajout d'un tarif
  const handleAddPrice = (values: PriceFormValues) => {
    const newPrice: SupplierPrice = {
      id: `price-${Date.now()}`, // Génère un ID unique basé sur le timestamp
      supplier: values.supplier,
      origin: values.origin,
      destination: values.destination,
      transportType: values.transportType,
      price: values.price,
      currency: values.currency,
      transitTime: values.transitTime,
      validUntil: values.validUntil,
      serviceLevel: values.serviceLevel,
      notes: values.notes,
      contractRef: values.contractRef
    };
    
    setPrices(prevPrices => [...prevPrices, newPrice]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Tarif ajouté",
      description: `Le tarif pour ${values.origin} → ${values.destination} a été ajouté.`
    });
  };

  // Gestion de la modification d'un tarif
  const handleEditPrice = (values: PriceFormValues) => {
    if (!editingPrice) return;
    
    const updatedPrices = prices.map(price => 
      price.id === editingPrice.id ? { 
        ...price, 
        supplier: values.supplier,
        origin: values.origin,
        destination: values.destination,
        transportType: values.transportType,
        price: values.price,
        currency: values.currency,
        transitTime: values.transitTime,
        validUntil: values.validUntil,
        serviceLevel: values.serviceLevel,
        notes: values.notes,
        contractRef: values.contractRef
      } : price
    );
    
    setPrices(updatedPrices);
    setEditingPrice(null);
    
    toast({
      title: "Tarif modifié",
      description: `Le tarif pour ${values.origin} → ${values.destination} a été modifié.`
    });
  };

  // Gestion de la suppression d'un tarif
  const handleDeletePrice = () => {
    if (!priceToDelete) return;
    
    setPrices(prevPrices => prevPrices.filter(price => price.id !== priceToDelete.id));
    setPriceToDelete(null);
    
    toast({
      title: "Tarif supprimé",
      description: `Le tarif pour ${priceToDelete.origin} → ${priceToDelete.destination} a été supprimé.`
    });
  };

  // Ouvrir le dialogue de détails
  const handleOpenDetailDialog = (price: SupplierPrice) => {
    setSelectedPrice(price);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <PriceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedOrigin={selectedOrigin}
          setSelectedOrigin={setSelectedOrigin}
          selectedDestination={selectedDestination}
          setSelectedDestination={setSelectedDestination}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          uniqueOrigins={uniqueOrigins}
          uniqueDestinations={uniqueDestinations}
        />
        
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Ajouter un tarif
        </Button>
      </div>
      
      <PriceTable
        prices={filteredPrices}
        onViewDetails={handleOpenDetailDialog}
        onEdit={setEditingPrice}
        onDelete={setPriceToDelete}
      />

      {/* Dialogue d'ajout */}
      <AddPriceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddPrice}
      />

      {/* Dialogue de modification */}
      <EditPriceDialog
        isOpen={!!editingPrice}
        onClose={() => setEditingPrice(null)}
        price={editingPrice}
        onSubmit={handleEditPrice}
      />

      {/* Dialogue de confirmation de suppression */}
      <DeletePriceDialog
        isOpen={!!priceToDelete}
        onClose={() => setPriceToDelete(null)}
        price={priceToDelete}
        onConfirm={handleDeletePrice}
      />

      {/* Dialogue de détails */}
      <PriceDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        price={selectedPrice}
        onEdit={setEditingPrice}
      />
    </div>
  );
};

export default SupplierPricing;
