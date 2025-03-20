
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default QuoteEditorLayout;
