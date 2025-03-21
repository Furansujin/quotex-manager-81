
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Ship, 
  Truck, 
  PlaneTakeoff, 
  Train,
  Calendar,
  Package, 
  X, 
  Save,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface NewShipmentFormProps {
  onClose: () => void;
  onSuccess?: (shipmentId: string) => void;
}

// Schema for form validation
const shipmentSchema = z.object({
  client: z.string().min(1, "Le client est requis"),
  type: z.enum(["maritime", "aérien", "routier", "ferroviaire"]),
  origin: z.string().min(1, "L'origine est requise"),
  destination: z.string().min(1, "La destination est requise"),
  departureDate: z.date().optional(),
  arrivalDate: z.date().optional(),
  reference: z.string().optional(),
  containers: z.string().optional(),
  weight: z.string().optional(),
  volume: z.string().optional(),
  description: z.string().optional(),
  incoterm: z.string().optional(),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

const NewShipmentForm: React.FC<NewShipmentFormProps> = ({ onClose, onSuccess }) => {
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      client: "",
      type: "maritime",
      origin: "",
      destination: "",
      reference: "",
      containers: "",
      weight: "",
      volume: "",
      description: "",
      incoterm: "FOB",
    }
  });

  const onSubmit = (data: ShipmentFormValues) => {
    // Here would normally be an API call to create the shipment
    console.log("Form data:", data);
    
    // For demo purposes, generate a random shipment ID
    const newShipmentId = `SHP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    toast({
      title: "Expédition créée",
      description: `L'expédition ${newShipmentId} a été créée avec succès.`,
    });
    
    if (onSuccess) {
      onSuccess(newShipmentId);
    } else {
      onClose();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maritime':
        return <Ship className="h-5 w-5" />;
      case 'routier':
        return <Truck className="h-5 w-5" />;
      case 'aérien':
        return <PlaneTakeoff className="h-5 w-5" />;
      case 'ferroviaire':
        return <Train className="h-5 w-5" />;
      default:
        return <Ship className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Nouvelle Expédition</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <h3 className="font-medium text-lg">Informations générales</h3>
                
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du client" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Référence client</FormLabel>
                      <FormControl>
                        <Input placeholder="Référence" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de transport *</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maritime">
                              <div className="flex items-center gap-2">
                                <Ship className="h-4 w-4 text-blue-600" />
                                <span>Maritime</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="aérien">
                              <div className="flex items-center gap-2">
                                <PlaneTakeoff className="h-4 w-4 text-green-600" />
                                <span>Aérien</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="routier">
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-amber-600" />
                                <span>Routier</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="ferroviaire">
                              <div className="flex items-center gap-2">
                                <Train className="h-4 w-4 text-purple-600" />
                                <span>Ferroviaire</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de départ</FormLabel>
                        <FormControl>
                          <DatePicker 
                            date={departureDate} 
                            setDate={(date) => {
                              setDepartureDate(date);
                              field.onChange(date);
                            }} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="arrivalDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'arrivée estimée</FormLabel>
                        <FormControl>
                          <DatePicker 
                            date={arrivalDate} 
                            setDate={(date) => {
                              setArrivalDate(date);
                              field.onChange(date);
                            }} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="incoterm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incoterm</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner l'incoterm" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                            <SelectItem value="FCA">FCA - Free Carrier</SelectItem>
                            <SelectItem value="CPT">CPT - Carriage Paid To</SelectItem>
                            <SelectItem value="CIP">CIP - Carriage and Insurance Paid To</SelectItem>
                            <SelectItem value="DAP">DAP - Delivered At Place</SelectItem>
                            <SelectItem value="DPU">DPU - Delivered at Place Unloaded</SelectItem>
                            <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
                            <SelectItem value="FAS">FAS - Free Alongside Ship</SelectItem>
                            <SelectItem value="FOB">FOB - Free On Board</SelectItem>
                            <SelectItem value="CFR">CFR - Cost and Freight</SelectItem>
                            <SelectItem value="CIF">CIF - Cost, Insurance and Freight</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <h3 className="font-medium text-lg">Trajet et marchandise</h3>
                
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origine *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville, pays" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville, pays" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="containers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteneurs</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: 1 x 40HC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poids</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: 1250 kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="volume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 24 m³" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description de la marchandise</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Description détaillée..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 border-t flex justify-between">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Créer l'expédition
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewShipmentForm;
