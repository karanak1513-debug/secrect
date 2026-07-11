"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/utils/sfx";

const TARGET_PATTERN = [0, 1, 2, 4, 6, 7, 8]; // A 'Z' shape pattern

export default function Day1_PatternUnlock({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to get coordinates for SVG lines
  const getDotPos = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = (col * 33.33) + 16.66;
    const y = (row * 33.33) + 16.66;
    return { x, y };
  };

  const addDot = (index: number) => {
    if (error) return;
    setSelected((prev) => {
      if (prev.includes(index)) return prev;
      sfx.playClick();
      return [...prev, index];
    });
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (error) return;
    setIsDrawing(true);
    setSelected([index]);
    sfx.playClick();
    updatePointer(e);
  };

  const updatePointer = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = ((clientX - containerRect.left) / containerRect.width) * 100;
    const relativeY = ((clientY - containerRect.top) / containerRect.height) * 100;
    
    setPointerPos({ x: relativeX, y: relativeY });

    // Detect dots under pointer
    const element = document.elementFromPoint(clientX, clientY);
    const target = element?.closest("[data-dot-index]");
    if (target) {
      const idx = parseInt(target.getAttribute("data-dot-index")!, 10);
      addDot(idx);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || error) return;
    updatePointer(e);
  };

  const handleEnd = () => {
    if (!isDrawing || error) return;
    setIsDrawing(false);
    setPointerPos(null);

    if (selected.length < 2) {
      // Just single dot, reset silently
      setSelected([]);
      return;
    }

    // Validate pattern
    const isCorrect = 
      selected.length === TARGET_PATTERN.length &&
      selected.every((val, i) => val === TARGET_PATTERN[i]);

    if (isCorrect) {
      // Success, parent completes
      setTimeout(onComplete, 800);
    } else {
      // Failed, show red error shake
      sfx.playError();
      setError(true);
      setTimeout(() => {
        setSelected([]);
        setError(false);
      }, 900);
    }
  };

  // Add window listeners to safely terminate drawing even if cursor leaves grid
  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isDrawing) {
        handleEnd();
      }
    };

    window.addEventListener("mouseup", handleGlobalEnd);
    window.addEventListener("touchend", handleGlobalEnd);
    return () => {
      window.removeEventListener("mouseup", handleGlobalEnd);
      window.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [isDrawing, selected]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 relative z-10 font-poppins select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 pointer-events-none"
      >
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Pattern Unlock</h2>
        <p className="text-white/60 text-sm max-w-xs mx-auto">
          Draw the pattern to override the encryption wall (Swipe or Drag dots).
        </p>
      </motion.div>

      <motion.div 
        ref={containerRef}
        animate={error ? { x: [-10, 10, -10, 10, -5, 5, 0], borderColor: ["rgba(239,68,68,0.5)", "rgba(239,68,68,0.8)", "rgba(212,175,55,0.2)"] } : {}}
        transition={{ duration: 0.5 }}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        className={`relative w-full aspect-square bg-black/60 border rounded-[32px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl touch-none ${
          error ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.25)]" : "border-[#D4AF37]/20"
        }`}
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
                x1={`${prev.x}%`}
                y1={`${prev.y}%`}
                x2={`${curr.x}%`}
                y2={`${curr.y}%`}
                stroke={error ? "#ef4444" : "#D4AF37"}
                strokeWidth="4"
                strokeLinecap="round"
                className={error ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"}
              />
            );
          })}

          {/* Dynamic line under cursor while drawing */}
          {isDrawing && selected.length > 0 && pointerPos && (
            <line
              x1={`${getDotPos(selected[selected.length - 1]).x}%`}
              y1={`${getDotPos(selected[selected.length - 1]).y}%`}
              x2={`${pointerPos.x}%`}
              y2={`${pointerPos.y}%`}
              stroke="#D4AF37"
              strokeWidth="4"
              strokeLinecap="round"
              className="opacity-70 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
            />
          )}
        </svg>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-4 relative z-10">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
            const isSelected = selected.includes(index);
            return (
              <div key={index} className="flex items-center justify-center">
                <div
                  data-dot-index={index}
                  onMouseDown={(e) => handleStart(e, index)}
                  onTouchStart={(e) => handleStart(e, index)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer ${
                    isSelected 
                      ? error 
                        ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] border-2 border-white"
                        : "bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.8)] border-2 border-white" 
                      : error
                      ? "bg-red-500/20 border border-red-500"
                      : "bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5"
                  }`}
                >
                  {/* Center Dot */}
                  <div className={`w-3.5 h-3.5 rounded-full pointer-events-none transition-transform duration-300 ${
                    isSelected 
                      ? "bg-white scale-100" 
                      : "bg-white/20 scale-75"
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
