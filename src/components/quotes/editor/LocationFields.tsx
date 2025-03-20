
import React from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface LocationFieldsProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  originSuggestions: string[];
  destinationSuggestions: string[];
}

const LocationFields: React.FC<LocationFieldsProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  originSuggestions,
  destinationSuggestions
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Origine *</label>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input 
                placeholder="Port/Ville d'origine" 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)} 
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <div className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
              <div className="overflow-y-auto max-h-[300px]">
                {originSuggestions
                  .filter(sug => sug.toLowerCase().includes(origin.toLowerCase()) || origin === '')
                  .map((suggestion, i) => (
                    <div
                      key={i}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      onClick={() => {
                        setOrigin(suggestion);
                        document.body.click(); // Close the popover
                      }}
                    >
                      {suggestion}
                    </div>
                  ))
                }
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Destination *</label>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input 
                placeholder="Port/Ville de destination" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <div className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
              <div className="overflow-y-auto max-h-[300px]">
                {destinationSuggestions
                  .filter(sug => sug.toLowerCase().includes(destination.toLowerCase()) || destination === '')
                  .map((suggestion, i) => (
                    <div
                      key={i}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      onClick={() => {
                        setDestination(suggestion);
                        document.body.click(); // Close the popover
                      }}
                    >
                      {suggestion}
                    </div>
                  ))
                }
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LocationFields;
