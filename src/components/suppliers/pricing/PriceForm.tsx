
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { DialogFooter } from '@/components/ui/dialog';
import { SupplierPrice, suppliers, currencies } from '../types/supplierPricing';

// Schéma de validation pour le formulaire
export const priceFormSchema = z.object({
  supplier: z.string().min(1, { message: "Veuillez sélectionner un fournisseur" }),
  origin: z.string().min(2, { message: "L'origine doit contenir au moins 2 caractères" }),
  destination: z.string().min(2, { message: "La destination doit contenir au moins 2 caractères" }),
  transportType: z.enum(['maritime', 'aérien', 'routier', 'ferroviaire', 'multimodal']),
  price: z.coerce.number().min(0, { message: "Le prix doit être positif" }),
  currency: z.string().min(1, { message: "Veuillez sélectionner une devise" }),
  transitTime: z.string().min(1, { message: "Veuillez indiquer le temps de transit" }),
  validUntil: z.date(),
  serviceLevel: z.enum(['express', 'standard', 'economy']),
  notes: z.string().optional(),
  contractRef: z.string().optional()
});

export type PriceFormValues = z.infer<typeof priceFormSchema>;

interface PriceFormProps {
  defaultValues?: Partial<PriceFormValues>;
  onSubmit: (values: PriceFormValues) => void;
  submitLabel: string;
}

const PriceForm: React.FC<PriceFormProps> = ({ defaultValues, onSubmit, submitLabel }) => {
  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: defaultValues || {
      supplier: '',
      origin: '',
      destination: '',
      transportType: 'maritime',
      price: 0,
      currency: 'EUR',
      transitTime: '',
      validUntil: new Date(),
      serviceLevel: 'standard',
      notes: '',
      contractRef: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fournisseur</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="transportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de transport</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="maritime">Maritime</SelectItem>
                    <SelectItem value="aérien">Aérien</SelectItem>
                    <SelectItem value="routier">Routier</SelectItem>
                    <SelectItem value="ferroviaire">Ferroviaire</SelectItem>
                    <SelectItem value="multimodal">Multimodal</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origine</FormLabel>
                <FormControl>
                  <Input placeholder="Ville, Pays" {...field} />
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
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="Ville, Pays" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Devise</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="transitTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temps de transit</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 5-7 jours" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valide jusqu'au</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="serviceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau de service</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="economy">Économique</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contractRef"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Référence contrat</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: CTR-2023-001" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Notes additionnelles" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit">{submitLabel}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default PriceForm;
