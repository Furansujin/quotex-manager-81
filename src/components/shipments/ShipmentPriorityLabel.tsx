
import React from 'react';

interface ShipmentPriorityLabelProps {
  priority?: 'haute' | 'moyenne' | 'basse';
}

const ShipmentPriorityLabel: React.FC<ShipmentPriorityLabelProps> = ({ priority }) => {
  if (!priority) return null;
  
  switch (priority) {
    case 'haute':
      return <span className="text-red-600 text-sm font-medium ml-2">• Prioritaire</span>;
    case 'moyenne':
      return <span className="text-amber-600 text-sm font-medium ml-2">• Moyenne</span>;
    case 'basse':
      return null;
    default:
      return null;
  }
};

export default ShipmentPriorityLabel;
