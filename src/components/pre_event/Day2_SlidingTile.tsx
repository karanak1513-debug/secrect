"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

export default function Day2_SlidingTile({ onComplete }: { onComplete: () => void }) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    // Generate solved array
    const solved = Array.from({ length: TOTAL_TILES - 1 }, (_, i) => i + 1);
    solved.push(0); // 0 is empty

    // Simple shuffle (not guaranteed solvable if purely random, so we shuffle by making valid moves)
    let shuffled = [...solved];
    let emptyIdx = TOTAL_TILES - 1;

    for (let i = 0; i < 100; i++) {
      const neighbors = [];
      const row = Math.floor(emptyIdx / GRID_SIZE);
      const col = emptyIdx % GRID_SIZE;

      if (row > 0) neighbors.push(emptyIdx - GRID_SIZE); // up
      if (row < GRID_SIZE - 1) neighbors.push(emptyIdx + GRID_SIZE); // down
      if (col > 0) neighbors.push(emptyIdx - 1); // left
      if (col < GRID_SIZE - 1) neighbors.push(emptyIdx + 1); // right

      const swapIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
      [shuffled[emptyIdx], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[emptyIdx]];
      emptyIdx = swapIdx;
    }

    setTiles(shuffled);
  }, []);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    const emptyIdx = tiles.indexOf(0);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIdx / GRID_SIZE);
    const emptyCol = emptyIdx % GRID_SIZE;

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
      setTiles(newTiles);

      // Check win
      let won = true;
      for (let i = 0; i < TOTAL_TILES - 1; i++) {
        if (newTiles[i] !== i + 1) {
          won = false;
          break;
        }
      }
      if (won) {
        setIsSolved(true);
        setTimeout(onComplete, 1500);
      }
    }
  };

  // Cheat code for testing (Double click header)
  const handleCheat = () => {
    const solved = Array.from({ length: TOTAL_TILES - 1 }, (_, i) => i + 1);
    solved.push(0);
    setTiles(solved);
    setIsSolved(true);
    setTimeout(onComplete, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8" onDoubleClick={handleCheat}>
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Sliding Puzzle</h2>
        <p className="text-white/60 font-poppins text-sm">
          Arrange the tiles in numerical order (1-15).
        </p>
      </motion.div>

      <div className="w-64 h-64 md:w-80 md:h-80 bg-[#111] border-2 border-[#D4AF37]/30 rounded-xl p-2 relative shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        {tiles.map((tile, index) => {
          const row = Math.floor(index / GRID_SIZE);
          const col = index % GRID_SIZE;

          return (
            <motion.div
              key={tile === 0 ? "empty" : tile}
              onClick={() => handleTileClick(index)}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute flex items-center justify-center font-playfair text-2xl md:text-3xl cursor-pointer ${
                tile === 0
                  ? "opacity-0"
                  : "bg-gradient-to-br from-[#222] to-[#111] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10"
              }`}
              style={{
                width: "23%",
                height: "23%",
                top: `${(row * 25) + 1}%`,
                left: `${(col * 25) + 1}%`,
                borderRadius: "8px",
              }}
            >
              {tile !== 0 && tile}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
