import React, { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TankGrid from "./TankGrid";
import TankControls from "./TankControls";
import TankWarning from "./TankWarning";

const GRID_SIZE = 10;
const FILL_INCREMENT = 5;
const MAX_FILLS = 20;

const Tank = () => {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false))
  );
  const [fillCount, setFillCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const fillNextCell = useCallback((currentGrid: boolean[][]) => {
    const newGrid = currentGrid.map(row => [...row]);
    const totalCells = GRID_SIZE * GRID_SIZE;
    const cellsToFill = Math.floor((fillCount + 1) * FILL_INCREMENT);
    
    let filledCount = 0;
    for (let y = GRID_SIZE - 1; y >= 0; y--) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!newGrid[y][x]) {
          newGrid[y][x] = filledCount < cellsToFill;
          filledCount++;
        }
      }
    }
    
    return newGrid;
  }, [fillCount]);

  const handleFill = () => {
    if (fillCount >= MAX_FILLS) return;
    
    setGrid(prevGrid => fillNextCell(prevGrid));
    setFillCount(prev => prev + 1);
    
    if (fillCount + 1 === MAX_FILLS) {
      setShowWarning(true);
      toast({
        title: "Tank is Full!",
        description: "Click the warning sign for details",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setGrid(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false)));
    setFillCount(0);
    setShowWarning(false);
    setShowDialog(false);
    toast({
      title: "Tank Reset",
      description: "Tank has been emptied and ready to fill again",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Tank Simulator</h1>
          <p className="text-gray-500">Fill the tank cell by cell</p>
        </div>

        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden backdrop-blur-sm bg-tank-glass transition-all duration-300 aspect-square">
          <TankGrid grid={grid} />
          {showWarning && <TankWarning onClick={() => setShowDialog(true)} />}
        </div>

        <TankControls 
          fillPercentage={(fillCount / MAX_FILLS) * 100}
          onFill={handleFill}
          onReset={handleReset}
          disabled={fillCount >= MAX_FILLS}
        />
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tank Status</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <p className="text-lg font-medium">
              Tank is completely full!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              All cells have been filled.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tank;