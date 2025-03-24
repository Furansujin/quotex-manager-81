
import React from 'react';

interface ShipmentPriorityLabelProps {
  priority?: 'haute' | 'moyenne' | 'basse';
}

const ShipmentPriorityLabel: React.FC<ShipmentPriorityLabelProps> = ({ priority }) => {
  // Ne plus afficher d'indicateur de priorité
  return null;
};

export default ShipmentPriorityLabel;
