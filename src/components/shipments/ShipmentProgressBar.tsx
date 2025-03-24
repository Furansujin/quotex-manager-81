
import React from 'react';

interface ShipmentProgressBarProps {
  status: string;
  progress: number;
}

const ShipmentProgressBar: React.FC<ShipmentProgressBarProps> = ({ status, progress }) => {
  return (
    <div className="w-full h-1.5 rounded-full bg-gray-100 mt-2">
      <div 
        className={`h-full rounded-full ${
          status === 'en cours' ? 'bg-amber-500' :
          status === 'terminée' ? 'bg-green-500' :
          status === 'planifiée' ? 'bg-blue-500' :
          'bg-red-500'
        }`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ShipmentProgressBar;
