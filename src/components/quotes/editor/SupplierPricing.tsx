
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { RefreshCw, ChevronDown, Check, Calendar, Tag, ArrowUpDown } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface SupplierPrice {
  id: string;
  supplier: string;
  price: number;
  transitTime: string;
  valid_until: string;
  service_level: 'express' | 'standard' | 'economy';
  currency: string;
}

interface SupplierPricingProps {
  origin: string;
  destination: string;
  type: string;
  currency: string;
  onPriceSelect: (item: {description: string, unitPrice: number}) => void;
}

const SupplierPricing: React.FC<SupplierPricingProps> = ({
  origin,
  destination,
  type,
  currency,
  onPriceSelect
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dynamic');
  const [availablePrices, setAvailablePrices] = useState<SupplierPrice[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<SupplierPrice | null>(null);
  const [marginPercentage, setMarginPercentage] = useState<number>(15);
  const [additionalFees, setAdditionalFees] = useState<number>(0);
  const [fixedPrices, setFixedPrices] = useState<SupplierPrice[]>([
    {
      id: 'fixed-1',
      supplier: 'Maersk',
      price: 1200,
      transitTime: '25-30 jours',
      valid_until: '31/12/2023',
      service_level: 'standard',
      currency: 'EUR'
    },
    {
      id: 'fixed-2',
      supplier: 'CMA CGM',
      price: 1150,
      transitTime: '28-32 jours',
      valid_until: '31/12/2023',
      service_level: 'standard',
      currency: 'EUR'
    },
    {
      id: 'fixed-3',
      supplier: 'MSC',
      price: 1100,
      transitTime: '30-35 jours',
      valid_until: '31/12/2023',
      service_level: 'economy',
      currency: 'EUR'
    }
  ]);

  // Calculate the final price with margin and additional fees
  const calculateFinalPrice = (basePrice: number) => {
    const withMargin = basePrice * (1 + marginPercentage / 100);
    return withMargin + additionalFees;
  };

  // Simulate fetching prices from API
  const fetchPrices = async () => {
    if (!origin || !destination) {
      return;
    }

    setIsLoading(true);

    try {
      // In a real application, this would be an API call
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data based on the transport type
      let mockPrices: SupplierPrice[] = [];
      
      if (type === 'Maritime') {
        mockPrices = [
          {
            id: 'price-1',
            supplier: 'Maersk Line',
            price: 1250,
            transitTime: '25-30 jours',
            valid_until: '15/12/2023',
            service_level: 'standard',
            currency: 'EUR'
          },
          {
            id: 'price-2',
            supplier: 'CMA CGM',
            price: 1180,
            transitTime: '28-32 jours',
            valid_until: '20/12/2023',
            service_level: 'standard',
            currency: 'EUR'
          },
          {
            id: 'price-3',
            supplier: 'MSC',
            price: 1050,
            transitTime: '30-35 jours',
            valid_until: '10/12/2023',
            service_level: 'economy',
            currency: 'EUR'
          },
          {
            id: 'price-4',
            supplier: 'Hapag-Lloyd Express',
            price: 1550,
            transitTime: '18-22 jours',
            valid_until: '05/12/2023',
            service_level: 'express',
            currency: 'EUR'
          }
        ];
      } else if (type === 'Aérien') {
        mockPrices = [
          {
            id: 'price-5',
            supplier: 'Air France Cargo',
            price: 2250,
            transitTime: '3-5 jours',
            valid_until: '15/12/2023',
            service_level: 'standard',
            currency: 'EUR'
          },
          {
            id: 'price-6',
            supplier: 'Lufthansa Cargo',
            price: 2100,
            transitTime: '4-6 jours',
            valid_until: '20/12/2023',
            service_level: 'standard',
            currency: 'EUR'
          },
          {
            id: 'price-7',
            supplier: 'Emirates SkyCargo',
            price: 2500,
            transitTime: '2-3 jours',
            valid_until: '10/12/2023',
            service_level: 'express',
            currency: 'EUR'
          }
        ];
      } else {
        mockPrices = [
          {
            id: 'price-8',
            supplier: 'DB Schenker',
            price: 850,
            transitTime: '5-7 jours',
            valid_until: '15/12/2023',
            service_level: 'standard',
            currency: 'EUR'
          },
          {
            id: 'price-9',
            supplier: 'DSV',
            price: 780,
            transitTime: '6-8 jours',
            valid_until: '20/12/2023',
            service_level: 'standard',
            currency: 'EUR'
          },
          {
            id: 'price-10',
            supplier: 'Kuehne + Nagel',
            price: 920,
            transitTime: '4-5 jours',
            valid_until: '10/12/2023',
            service_level: 'express',
            currency: 'EUR'
          }
        ];
      }

      setAvailablePrices(mockPrices);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch prices when origin, destination or type changes
  useEffect(() => {
    if (origin && destination && type) {
      fetchPrices();
    }
  }, [origin, destination, type]);

  // Handle selecting a price
  const handleSelectPrice = (price: SupplierPrice) => {
    setSelectedPrice(price);
  };

  // Handle adding the selected price to the quote
  const handleAddToQuote = () => {
    if (selectedPrice) {
      const finalPrice = calculateFinalPrice(selectedPrice.price);
      const description = `${type} - ${selectedPrice.supplier} (${selectedPrice.service_level})`;
      
      onPriceSelect({
        description,
        unitPrice: finalPrice
      });
      
      // Reset selection
      setSelectedPrice(null);
    }
  };

  // Get service level badge
  const getServiceLevelBadge = (level: string) => {
    switch (level) {
      case 'express':
        return <Badge variant="destructive">Express</Badge>;
      case 'standard':
        return <Badge variant="default">Standard</Badge>;
      case 'economy':
        return <Badge variant="outline">Économique</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Tarifs Fournisseurs
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPrices} 
            disabled={isLoading || !origin || !destination}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {isLoading ? 'Chargement...' : 'Actualiser'}
          </Button>
        </CardTitle>
        <CardDescription>
          {origin && destination 
            ? `Tarifs pour ${origin} → ${destination} (${type})`
            : "Veuillez spécifier l'origine et la destination"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dynamic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dynamic">Tarifs dynamiques</TabsTrigger>
            <TabsTrigger value="fixed">Tarifs fixes (contrats)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dynamic">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Récupération des tarifs en cours...</p>
              </div>
            ) : (
              <>
                {availablePrices.length > 0 ? (
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Transitaire</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Transit</TableHead>
                            <TableHead>Niveau de service</TableHead>
                            <TableHead>Validité</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availablePrices.map((price) => (
                            <TableRow 
                              key={price.id}
                              className={`cursor-pointer transition-colors ${selectedPrice?.id === price.id ? "bg-muted/50" : "hover:bg-muted/30"}`}
                              onClick={() => handleSelectPrice(price)}
                            >
                              <TableCell>
                                <div className="flex items-center">
                                  {selectedPrice?.id === price.id && (
                                    <Check className="h-4 w-4 mr-2 text-primary" />
                                  )}
                                  {price.supplier}
                                </div>
                              </TableCell>
                              <TableCell>{price.price.toFixed(2)} {price.currency}</TableCell>
                              <TableCell>{price.transitTime}</TableCell>
                              <TableCell>{getServiceLevelBadge(price.service_level)}</TableCell>
                              <TableCell>{price.valid_until}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {selectedPrice && (
                      <Card className="border border-primary/20 bg-primary/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Personnalisation du tarif</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <Label>Marge (%)</Label>
                                <div className="flex items-center gap-4">
                                  <Slider
                                    value={[marginPercentage]}
                                    onValueChange={(value) => setMarginPercentage(value[0])}
                                    min={0}
                                    max={50}
                                    step={1}
                                    className="flex-1"
                                  />
                                  <div className="w-12 text-right">{marginPercentage}%</div>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Frais additionnels</Label>
                                <Input
                                  type="number"
                                  value={additionalFees}
                                  onChange={(e) => setAdditionalFees(Number(e.target.value))}
                                  min={0}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            
                            <div className="flex flex-col justify-center p-4 bg-muted rounded-md">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Prix fournisseur:</span>
                                  <span>{selectedPrice.price.toFixed(2)} {currency}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Marge ({marginPercentage}%):</span>
                                  <span>{(selectedPrice.price * marginPercentage / 100).toFixed(2)} {currency}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Frais additionnels:</span>
                                  <span>{additionalFees.toFixed(2)} {currency}</span>
                                </div>
                                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                  <span>Prix final:</span>
                                  <span>{calculateFinalPrice(selectedPrice.price).toFixed(2)} {currency}</span>
                                </div>
                              </div>
                              
                              <Button 
                                className="mt-4 w-full"
                                onClick={handleAddToQuote}
                              >
                                Ajouter au devis
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      {origin && destination 
                        ? "Aucun tarif disponible pour cette route. Veuillez actualiser ou essayer avec d'autres paramètres."
                        : "Veuillez saisir une origine et une destination pour voir les tarifs disponibles."
                      }
                    </p>
                    <Button
                      variant="outline"
                      onClick={fetchPrices}
                      disabled={!origin || !destination}
                    >
                      Actualiser les tarifs
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="fixed">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Tarifs contractuels</h3>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transitaire</TableHead>
                      <TableHead>Prix contractuel</TableHead>
                      <TableHead>Transit</TableHead>
                      <TableHead>Validité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fixedPrices.map((price) => (
                      <TableRow 
                        key={price.id}
                        className={`cursor-pointer transition-colors ${selectedPrice?.id === price.id ? "bg-muted/50" : "hover:bg-muted/30"}`}
                        onClick={() => handleSelectPrice(price)}
                      >
                        <TableCell>
                          <div className="flex items-center">
                            {selectedPrice?.id === price.id && (
                              <Check className="h-4 w-4 mr-2 text-primary" />
                            )}
                            {price.supplier}
                          </div>
                        </TableCell>
                        <TableCell>{price.price.toFixed(2)} {price.currency}</TableCell>
                        <TableCell>{price.transitTime}</TableCell>
                        <TableCell>{price.valid_until}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {selectedPrice && activeTab === 'fixed' && (
                <Card className="border border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Personnalisation du tarif contractuel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label>Marge (%)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[marginPercentage]}
                              onValueChange={(value) => setMarginPercentage(value[0])}
                              min={0}
                              max={50}
                              step={1}
                              className="flex-1"
                            />
                            <div className="w-12 text-right">{marginPercentage}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Frais additionnels</Label>
                          <Input
                            type="number"
                            value={additionalFees}
                            onChange={(e) => setAdditionalFees(Number(e.target.value))}
                            min={0}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center p-4 bg-muted rounded-md">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Prix contractuel:</span>
                            <span>{selectedPrice.price.toFixed(2)} {currency}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Marge ({marginPercentage}%):</span>
                            <span>{(selectedPrice.price * marginPercentage / 100).toFixed(2)} {currency}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Frais additionnels:</span>
                            <span>{additionalFees.toFixed(2)} {currency}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2 mt-2">
                            <span>Prix final:</span>
                            <span>{calculateFinalPrice(selectedPrice.price).toFixed(2)} {currency}</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="mt-4 w-full"
                          onClick={handleAddToQuote}
                        >
                          Ajouter au devis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SupplierPricing;
