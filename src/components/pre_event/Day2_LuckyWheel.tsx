"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/utils/sfx";

export default function Day2_LuckyWheel({ onComplete }: { onComplete: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const SLICES = [
    { label: "Try Again", color: "#111" },
    { label: "Empty Box", color: "#222" },
    { label: "HAPPY", color: "#D4AF37" }, // The target
    { label: "Nope", color: "#111" },
    { label: "So Close", color: "#222" },
    { label: "Missed", color: "#111" },
  ];

  const playDeceleratingTicks = () => {
    let interval = 50; // starts fast
    const tick = () => {
      sfx.playTick();
      interval = interval * 1.11; // slow down exponentially
      if (interval < 550) {
        setTimeout(tick, interval);
      }
    };
    tick();
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    sfx.playClick();

    // Trigger mechanical clicking sounds slowing down
    setTimeout(playDeceleratingTicks, 100);

    const targetSliceIndex = 2;
    const sliceAngle = 360 / SLICES.length;
    
    // Land on C2 ("HAPPY"). Random offset inside the slice for natural look
    const randomOffset = Math.floor(Math.random() * 20) - 10; // -10 to +10
    
    const targetRotation = rotation + (360 * 5) + (360 - (targetSliceIndex * sliceAngle)) + randomOffset;
    setRotation(targetRotation);

    setTimeout(() => {
      onComplete();
    }, 5000); // 5s spin duration
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Decryption Wheel</h2>
        <p className="text-white/60 text-sm">
          Spin the luxury decoder array to isolate the next password chunk coordinate.
        </p>
      </motion.div>

      {/* Luxury frame card */}
      <div className="glass-card p-8 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 md:w-72 md:h-72 select-none">
          {/* Pointer with pulse indicator */}
          <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-[#FFF3B0] z-20 drop-shadow-[0_0_12px_#D4AF37] animate-pulse" />

          {/* Wheel */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4.8, type: "tween", ease: [0.08, 0.85, 0.15, 1] }}
            className="w-full h-full rounded-full border-4 border-[#D4AF37] relative overflow-hidden shadow-[0_0_35px_rgba(212,175,55,0.45)]"
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
                  <div 
                    className="absolute top-[12%] left-1/2 -translate-x-1/2 origin-bottom font-playfair font-bold text-[10px] md:text-[12px] tracking-[0.1em] uppercase"
                    style={{ 
                      color: slice.color === "#D4AF37" ? "#000" : "#D4AF37", 
                      textShadow: slice.color === "#D4AF37" ? "none" : "0 0 5px rgba(212,175,55,0.5)" 
                    }}
                  >
                    {slice.label}
                  </div>
                </div>
              );
            })}
          </motion.div>
          
          {/* Center Luxury Gem/Knob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-black rounded-full border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5)] z-10">
            <div className="w-4 h-4 bg-gradient-to-tr from-[#FFF3B0] to-[#D4AF37] rounded-full animate-pulse" />
          </div>
        </div>

        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="mt-10 px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer text-xs tracking-wider uppercase"
        >
          {isSpinning ? "Decoding Grid..." : "SPIN DECODER"}
        </button>
      </div>
    </div>
  );
}
