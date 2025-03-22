
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

interface QuoteEditorLayoutProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

const QuoteEditorLayout: React.FC<QuoteEditorLayoutProps> = ({ 
  children, 
  title, 
  onClose 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 overflow-y-auto">
      <div 
        className={`bg-background rounded-lg shadow-lg w-full overflow-y-auto transition-all duration-200 ease-in-out ${
          isFullscreen 
            ? 'max-w-[95vw] h-[95vh]' 
            : 'max-w-7xl max-h-[90vh]'
        }`}
      >
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="hidden sm:flex">
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className={`${isFullscreen ? 'h-[calc(95vh-4rem)]' : ''} overflow-y-auto p-4`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default QuoteEditorLayout;
