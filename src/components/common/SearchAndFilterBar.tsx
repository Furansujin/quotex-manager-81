
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface FilterItem {
  id: string;
  label: string;
  value: string;
}

export interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  activeFilters: Record<string, any> | null;
  onApplyFilters: (filters: Record<string, any>) => void;
  clearAllFilters: () => void;
  renderFilterContent: (props: {
    onApplyFilters: () => void;
  }) => React.ReactNode;
  renderFilterBadges?: () => React.ReactNode;
  title?: string;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFilters,
  onApplyFilters,
  clearAllFilters,
  renderFilterContent,
  renderFilterBadges,
  title
}) => {
  // Check if any filters are active
  const hasActiveFilters = () => {
    if (!activeFilters) return false;
    
    // Remove sortField and sortDirection from consideration
    const { sortField, sortDirection, ...otherFilters } = activeFilters;
    
    // Check if any remaining filter has a value
    return Object.values(otherFilters).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    });
  };
  
  // Count active filters (excluding sorting)
  const countActiveFilters = () => {
    if (!activeFilters) return 0;
    
    // Remove sortField and sortDirection from the count
    const { sortField, sortDirection, ...otherFilters } = activeFilters;
    
    let count = 0;
    Object.values(otherFilters).forEach(value => {
      if (Array.isArray(value) && value.length > 0) {
        count += value.length;
      } else if (value !== undefined && value !== null && value !== '') {
        count += 1;
      }
    });
    
    return count;
  };

  const handleApplyFilters = () => {
    onApplyFilters(activeFilters || {});
    setShowAdvancedFilters(false);
  };

  return (
    <div className="mb-6 space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Rechercher ${title ? title.toLowerCase() : ''}...`}
            className="pl-10 h-11 bg-white border-[#eee]" 
          />
        </div>
        <div className="flex gap-3">
          <Button 
            variant={showAdvancedFilters ? "default" : "outline"} 
            className={`gap-2 px-4 h-11 ${hasActiveFilters() ? 'bg-primary/10' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtres
            {hasActiveFilters() && (
              <Badge variant="outline" className="ml-1 bg-white">
                {countActiveFilters()}
              </Badge>
            )}
          </Button>
        </div>
      </div>
      
      {/* Display active filters */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {renderFilterBadges && renderFilterBadges()}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 gap-1"
            onClick={clearAllFilters}
          >
            <X className="h-3 w-3" />
            Effacer tout
          </Button>
        </div>
      )}
      
      {/* Filters panel */}
      {showAdvancedFilters && (
        <Card className="mb-8 bg-white border border-[#eee] shadow-sm animate-fade-in">
          <CardContent className="p-6">
            {renderFilterContent({ onApplyFilters: handleApplyFilters })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchAndFilterBar;
