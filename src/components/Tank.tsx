import React, { useEffect, useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Cell {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const WARNING_THRESHOLD = 0.8; // 80% full
const FILL_SPEED = 100; // ms between fills

const Tank = () => {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [fillPercentage, setFillPercentage] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const { toast } = useToast();

  const floodFill = useCallback((startX: number, startY: number, newGrid: boolean[][]) => {
    const queue: Cell[] = [{ x: startX, y: startY }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { x, y } = queue.shift()!;
      const key = `${x},${y}`;

      if (
        x < 0 ||
        x >= GRID_SIZE ||
        y < 0 ||
        y >= GRID_SIZE ||
        visited.has(key) ||
        newGrid[y][x]
      ) {
        continue;
      }

      visited.add(key);
      newGrid[y][x] = true;

      // Add adjacent cells - fixed the syntax by calling push for each cell
      queue.push({ x: x + 1, y });
      queue.push({ x: x - 1, y });
      queue.push({ x, y: y + 1 });
      queue.push({ x, y: y - 1 });
    }

    return newGrid;
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map(row => [...row]);
        const bottomRow = GRID_SIZE - 1;
        
        // Find an empty cell in the bottom row
        for (let x = 0; x < GRID_SIZE; x++) {
          if (!newGrid[bottomRow][x]) {
            floodFill(x, bottomRow, newGrid);
            break;
          }
        }

        // Calculate fill percentage
        const filledCells = newGrid.flat().filter(cell => cell).length;
        const percentage = (filledCells / (GRID_SIZE * GRID_SIZE)) * 100;
        setFillPercentage(percentage);

        // Check warning threshold
        if (percentage >= WARNING_THRESHOLD * 100 && !showWarning) {
          setShowWarning(true);
          toast({
            title: "Tank Almost Full!",
            description: `${(100 - percentage).toFixed(1)}% capacity remaining`,
            variant: "destructive",
          });
        }

        // Stop if tank is full
        if (percentage >= 100) {
          setIsRunning(false);
          toast({
            title: "Tank is Full",
            description: "Please drain the tank",
          });
        }

        return newGrid;
      });
    }, FILL_SPEED);

    return () => clearInterval(interval);
  }, [isRunning, floodFill, showWarning, toast]);

  const resetTank = () => {
    setGrid(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false)));
    setFillPercentage(0);
    setShowWarning(false);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Tank Simulator</h1>
          <p className="text-gray-500">Watch the tank fill using flood fill algorithm</p>
        </div>

        <div className={`relative border-2 border-gray-200 rounded-lg overflow-hidden backdrop-blur-sm bg-tank-glass transition-all duration-300 aspect-square ${
          showWarning ? "animate-warning" : ""
        }`}>
          {grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`aspect-square transition-colors duration-300 ${
                    cell ? "bg-tank-water" : "bg-transparent"
                  }`}
                  style={{ width: `${100 / GRID_SIZE}%` }}
                />
              ))}
            </div>
          ))}

          {showWarning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <AlertCircle className="w-12 h-12 text-tank-warning animate-bounce" />
                <div className="absolute inset-0 bg-tank-warning rounded-full animate-ripple" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-900">
            Fill Level: {fillPercentage.toFixed(1)}%
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTank}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tank;
