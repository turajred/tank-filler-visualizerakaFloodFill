import React from "react";

interface TankGridProps {
  grid: boolean[][];
}

const TankGrid = ({ grid }: TankGridProps) => {
  return (
    <div className="grid grid-cols-10 gap-[1px] bg-black p-[1px]">
      {grid.map((row, y) => (
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`aspect-square transition-colors duration-300 border border-black ${
              cell ? "bg-tank-water" : "bg-white"
            }`}
          />
        ))
      ))}
    </div>
  );
};

export default TankGrid;