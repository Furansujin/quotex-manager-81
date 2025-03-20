
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FollowUp } from '@/components/quotes/followup/FollowUpHistory';

export const useQuoteFollowUps = (quoteId?: string) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowUpReminder, setShowFollowUpReminder] = useState(false);
  const [showFollowUpHistory, setShowFollowUpHistory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (quoteId) {
      loadFollowUps(quoteId);
    } else {
      setFollowUps([]);
    }
  }, [quoteId]);

  const loadFollowUps = async (id: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data from localStorage or create empty array
      const storedFollowUps = localStorage.getItem(`followUps_${id}`);
      if (storedFollowUps) {
        setFollowUps(JSON.parse(storedFollowUps));
      } else {
        setFollowUps([]);
      }
    } catch (error) {
      console.error('Error loading follow-ups:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des relances.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFollowUp = async (method: string, message: string) => {
    if (!quoteId) return;
    
    const newFollowUp: FollowUp = {
      id: `followup-${Date.now()}`,
      quoteId,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      method,
      message,
      status: 'sent'
    };

    const updatedFollowUps = [...followUps, newFollowUp];
    setFollowUps(updatedFollowUps);

    // Store in localStorage for demo purposes
    localStorage.setItem(`followUps_${quoteId}`, JSON.stringify(updatedFollowUps));

    return newFollowUp;
  };

  const updateFollowUpStatus = (followUpId: string, status: FollowUp['status']) => {
    if (!quoteId) return;

    const updatedFollowUps = followUps.map(followUp => 
      followUp.id === followUpId ? { ...followUp, status } : followUp
    );

    setFollowUps(updatedFollowUps);
    localStorage.setItem(`followUps_${quoteId}`, JSON.stringify(updatedFollowUps));
  };

  const toggleFollowUpReminder = () => {
    setShowFollowUpReminder(!showFollowUpReminder);
  };

  const toggleFollowUpHistory = () => {
    setShowFollowUpHistory(!showFollowUpHistory);
  };

  return {
    followUps,
    isLoading,
    showFollowUpReminder,
    showFollowUpHistory,
    setShowFollowUpReminder,
    setShowFollowUpHistory,
    toggleFollowUpReminder,
    toggleFollowUpHistory,
    addFollowUp,
    updateFollowUpStatus
  };
};
