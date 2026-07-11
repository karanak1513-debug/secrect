"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TARGET_PATTERN = [0, 1, 2, 4, 6, 7, 8]; // A 'Z' shape pattern

export default function Day1_PatternUnlock({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDotClick = (index: number) => {
    if (error) return; // wait for error to clear
    if (selected.includes(index)) return; // already selected

    const nextExpected = TARGET_PATTERN[selected.length];
    
    if (index === nextExpected) {
      const newSelected = [...selected, index];
      setSelected(newSelected);
      
      if (newSelected.length === TARGET_PATTERN.length) {
        setTimeout(onComplete, 1000);
      }
    } else {
      // Wrong dot
      setError(true);
      setTimeout(() => {
        setSelected([]);
        setError(false);
      }, 500);
    }
  };

  // Helper to get coordinates for SVG lines
  const getDotPos = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    // 3 columns, 3 rows, percentage based (16.6%, 50%, 83.3%)
    const x = (col * 33.33) + 16.66;
    const y = (row * 33.33) + 16.66;
    return { x, y };
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Pattern Unlock</h2>
        <p className="text-white/60 font-poppins text-sm mb-4">
          Connect the dots in the correct pattern (Hint: Think of the letter 'Z').
        </p>
      </motion.div>

      <motion.div 
        ref={containerRef}
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-full aspect-square bg-black/40 border border-[#D4AF37]/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
      >
        {/* SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {selected.map((dotIndex, i) => {
            if (i === 0) return null;
            const prev = getDotPos(selected[i - 1]);
            const curr = getDotPos(dotIndex);
            return (
              <motion.line
                key={`line-${i}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1={`${prev.x}%`}
                y1={`${prev.y}%`}
                x2={`${curr.x}%`}
                y2={`${curr.y}%`}
                stroke="#D4AF37"
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              />
            );
          })}
        </svg>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-4 relative z-10">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
            const isSelected = selected.includes(index);
            return (
              <div key={index} className="flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDotClick(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isSelected 
                      ? "bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.8)] border-2 border-white" 
                      : error
                      ? "bg-red-500/50 border border-red-500"
                      : "bg-white/5 border border-white/20 hover:border-[#D4AF37]/50"
                  }`}
                >
                  {isSelected && <div className="w-4 h-4 bg-white rounded-full" />}
                </motion.button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
