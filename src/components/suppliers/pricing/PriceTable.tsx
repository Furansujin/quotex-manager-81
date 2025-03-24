
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Edit, Eye, Info, Trash2 } from 'lucide-react';
import { SupplierPrice, transportTypeLabels } from '../types/supplierPricing';
import { 
  formatDate, 
  isPriceExpired, 
  getServiceLevelBadge, 
  getTransportTypeLabel 
} from '../utils/supplierPricingUtils';

interface PriceTableProps {
  prices: SupplierPrice[];
  onViewDetails: (price: SupplierPrice) => void;
  onEdit: (price: SupplierPrice) => void;
  onDelete: (price: SupplierPrice) => void;
}

const PriceTable: React.FC<PriceTableProps> = ({ 
  prices, 
  onViewDetails, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fournisseur</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead className="hidden md:table-cell">Transit</TableHead>
            <TableHead className="hidden md:table-cell">Service</TableHead>
            <TableHead>Validité</TableHead>
            <TableHead className="hidden md:table-cell">Référence</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prices.length > 0 ? (
            prices.map((price) => (
              <TableRow 
                key={price.id} 
                className={`hover:bg-muted/50 cursor-pointer ${isPriceExpired(price.validUntil) ? 'bg-red-50 dark:bg-red-950/10' : ''}`}
                onClick={() => onViewDetails(price)}
              >
                <TableCell className="font-medium">{price.supplier}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">De:</span>
                    <span>{price.origin}</span>
                    <span className="text-xs text-muted-foreground mt-1">À:</span>
                    <span>{price.destination}</span>
                  </div>
                </TableCell>
                <TableCell>{getTransportTypeLabel(price.transportType, transportTypeLabels)}</TableCell>
                <TableCell>{price.price.toFixed(2)} {price.currency}</TableCell>
                <TableCell className="hidden md:table-cell">{price.transitTime}</TableCell>
                <TableCell className="hidden md:table-cell">{getServiceLevelBadge(price.serviceLevel)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {formatDate(price.validUntil)}
                    {isPriceExpired(price.validUntil) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tarif expiré</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{price.contractRef || '-'}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetails(price);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Voir les détails</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(price);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Modifier</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(price);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                Aucun tarif trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PriceTable;
