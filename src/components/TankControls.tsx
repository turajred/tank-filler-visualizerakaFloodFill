import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TankControlsProps {
  fillPercentage: number;
  onFill: () => void;
  onReset: () => void;
  disabled: boolean;
}

const TankControls = ({ fillPercentage, onFill, onReset, disabled }: TankControlsProps) => {
  return (
    <div className="space-y-4">
      <Progress value={fillPercentage} className="w-full" />
      <div className="flex gap-4 justify-center">
        <Button onClick={onFill} disabled={disabled}>
          Fill ({Math.round(fillPercentage)}%)
        </Button>
        <Button onClick={onReset} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TankControls;