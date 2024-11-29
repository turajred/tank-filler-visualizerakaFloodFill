import React from "react";
import { Button } from "@/components/ui/button";

interface TankControlsProps {
  fillPercentage: number;
  onFill: () => void;
  disabled: boolean;
}

const TankControls = ({ fillPercentage, onFill, disabled }: TankControlsProps) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-4">
        <div 
          className="bg-tank-water h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
      <div className="text-sm font-medium text-gray-900 mr-4">
        {fillPercentage.toFixed(1)}%
      </div>
      <Button
        onClick={onFill}
        disabled={disabled}
        className="px-4 py-2 text-sm font-medium"
      >
        Fill
      </Button>
    </div>
  );
};

export default TankControls;