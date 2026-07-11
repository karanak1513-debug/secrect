"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Day2_LuckyWheel({ onComplete }: { onComplete: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const SLICES = [
    { label: "Try Again", color: "#111" },
    { label: "Empty Box", color: "#222" },
    { label: "1____", color: "#D4AF37" }, // The target
    { label: "Nope", color: "#111" },
    { label: "So Close", color: "#222" },
    { label: "Missed", color: "#111" },
  ];

  // We want it to land on index 2 ("1____").
  // Each slice is 60 degrees. 
  // Index 2 center is at 360 - (2 * 60 + 30) = 360 - 150 = 210 degrees if pointer is at top.
  // Actually, to make it simple: we just rotate by (360 * 5) + (360 - (2 * 60) - 30)

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // 5 full rotations + angle to land on index 2
    const targetSliceIndex = 2;
    const sliceAngle = 360 / SLICES.length;
    
    // We want the slice to be at the top (0 degrees).
    // If slice 0 is at 0 degrees, slice 2 is at 120 degrees.
    // To bring slice 2 to the top, we need to rotate backwards by 120, or forwards by 240.
    // Let's add some randomness within the slice.
    const randomOffset = Math.floor(Math.random() * 20) - 10; // -10 to +10
    
    const targetRotation = rotation + (360 * 5) + (360 - (targetSliceIndex * sliceAngle)) + randomOffset;

    setRotation(targetRotation);

    setTimeout(() => {
      onComplete();
    }, 5000); // 5s spin duration
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Lucky Wheel</h2>
        <p className="text-white/60 font-poppins text-sm">
          Spin the wheel. May the odds be in your favor.
        </p>
      </motion.div>

      <div className="relative w-72 h-72">
        {/* Pointer */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#FFF3B0] z-20 drop-shadow-[0_0_10px_#D4AF37]" />

        {/* Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4.5, type: "tween", ease: [0.1, 0.9, 0.2, 1] }}
          className="w-full h-full rounded-full border-4 border-[#D4AF37] relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          style={{
            background: "conic-gradient(#111 0deg 60deg, #222 60deg 120deg, #D4AF37 120deg 180deg, #111 180deg 240deg, #222 240deg 300deg, #111 300deg 360deg)"
          }}
        >
          {SLICES.map((slice, index) => {
            const angle = index * (360 / SLICES.length);
            return (
              <div
                key={index}
                className="absolute w-full h-full"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 origin-bottom font-playfair font-bold text-sm tracking-wider"
                     style={{ color: slice.color === "#D4AF37" ? "#000" : "#D4AF37", textShadow: slice.color === "#D4AF37" ? "none" : "0 0 5px rgba(212,175,55,0.5)" }}
                >
                  {slice.label}
                </div>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center Knob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black rounded-full border-2 border-[#D4AF37] flex items-center justify-center shadow-lg z-10" />
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="mt-12 px-10 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSpinning ? "Spinning..." : "SPIN"}
      </button>
    </div>
  );
}
