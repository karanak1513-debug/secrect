"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/utils/sfx";

const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

export default function Day2_SlidingTile({ onComplete }: { onComplete: () => void }) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    // Generate solved array
    const solved = Array.from({ length: TOTAL_TILES - 1 }, (_, i) => i + 1);
    solved.push(0); // 0 is empty

    // Simple shuffle by making valid moves
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
      sfx.playClick();
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
        setTimeout(onComplete, 1200);
      }
    } else {
      sfx.playError();
    }
  };

  // Cheat code for testing (Double click header)
  const handleCheat = () => {
    const solved = Array.from({ length: TOTAL_TILES - 1 }, (_, i) => i + 1);
    solved.push(0);
    setTiles(solved);
    setIsSolved(true);
    setTimeout(onComplete, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 select-none" onDoubleClick={handleCheat}>
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Sliding Puzzle</h2>
        <p className="text-white/60 text-sm">
          Slide the luxury gold matrix tiles in sequential order (1-15).
        </p>
      </motion.div>

      {/* Outer Grid card */}
      <div className="glass-card p-6 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
        <div className="w-64 h-64 md:w-80 md:h-80 bg-black/80 border border-[#D4AF37]/25 rounded-2xl p-2.5 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          {tiles.map((tile, index) => {
            const row = Math.floor(index / GRID_SIZE);
            const col = index % GRID_SIZE;

            return (
              <motion.div
                key={tile === 0 ? "empty" : tile}
                onClick={() => handleTileClick(index)}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className={`absolute flex items-center justify-center font-playfair text-xl md:text-2xl cursor-pointer select-none ${
                  tile === 0
                    ? "opacity-0 pointer-events-none"
                    : "bg-gradient-to-br from-[#222] via-[#111] to-[#222] border border-[#D4AF37]/45 text-[#FFF3B0] hover:bg-[#D4AF37]/10 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
                }`}
                style={{
                  width: "22.5%",
                  height: "22.5%",
                  top: `${(row * 25) + 1.25}%`,
                  left: `${(col * 25) + 1.25}%`,
                  borderRadius: "12px",
                }}
              >
                {tile !== 0 && tile}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
