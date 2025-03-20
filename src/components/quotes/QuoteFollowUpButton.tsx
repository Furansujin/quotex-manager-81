
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Bell } from 'lucide-react';
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
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium mb-1">Relancer par:</p>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowReminder(true);
            }}
            className="flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            <span className="text-xs">Email</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowReminder(true);
            }}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">SMS</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowReminder(true);
            }}
            className="flex items-center gap-1"
          >
            <Bell className="h-4 w-4" />
            <span className="text-xs">Notification</span>
          </Button>
        </div>
      </div>
      
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
