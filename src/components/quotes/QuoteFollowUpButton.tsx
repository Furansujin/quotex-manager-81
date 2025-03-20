
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useQuoteFollowUps } from '@/hooks/useQuoteFollowUps';
import FollowUpReminder from './followup/FollowUpReminder';
import { Quote } from '@/hooks/useQuotesData';

interface QuoteFollowUpButtonProps {
  quote: Quote;
}

const QuoteFollowUpButton: React.FC<QuoteFollowUpButtonProps> = ({ quote }) => {
  const [showReminder, setShowReminder] = useState(false);
  const { addFollowUp } = useQuoteFollowUps(quote.id);

  const handleFollowUpSent = (method: string, message: string) => {
    addFollowUp(method, message);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setShowReminder(true)}
        className="h-8 px-2"
      >
        <ArrowRight className="h-4 w-4 mr-1" />
        <span className="sr-only md:not-sr-only md:inline-block">Relancer</span>
      </Button>
      
      {showReminder && (
        <FollowUpReminder 
          quoteId={quote.id}
          clientName={quote.client}
          isOpen={showReminder}
          onClose={() => setShowReminder(false)}
          lastContact={quote.date}
          onFollowUpSent={handleFollowUpSent}
        />
      )}
    </>
  );
};

export default QuoteFollowUpButton;
