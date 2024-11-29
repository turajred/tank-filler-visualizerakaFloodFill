import React from "react";
import { AlertCircle } from "lucide-react";

interface TankWarningProps {
  onClick: () => void;
}

const TankWarning = ({ onClick }: TankWarningProps) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <AlertCircle className="w-12 h-12 text-tank-warning animate-bounce" />
        <div className="absolute inset-0 bg-tank-warning rounded-full animate-ripple" />
      </div>
    </div>
  );
};

export default TankWarning;