"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

export default function Day2_CatchOrb({ onComplete }: { onComplete: () => void }) {
  const [catches, setCatches] = useState(0);
  const [orbPos, setOrbPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(true);

  // Move the orb randomly every 800ms
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setOrbPos({
        x: Math.random() * 75 + 12, // 12% to 87%
        y: Math.random() * 75 + 12,
      });
    }, 850 - catches * 150); // Gets faster with each catch
    return () => clearInterval(interval);
  }, [active, catches]);

  const handleCatch = () => {
    if (!active) return;
    sfx.playClick();
    const newCatches = catches + 1;
    setCatches(newCatches);

    if (newCatches >= 3) {
      setActive(false);
      setTimeout(onComplete, 1000);
    } else {
      // Immediately jump to a new position on catch
      setOrbPos({
        x: Math.random() * 75 + 12,
        y: Math.random() * 75 + 12,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Capture the Orb</h2>
        <p className="text-white/60 text-sm mb-4">
          The golden anomaly core is highly volatile. Locate and secure it 3 times.
        </p>
        
        {/* Glowing star capture indicators */}
        <div className="flex justify-center gap-3.5 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={`text-xl transition-all duration-300 ${
                i < catches 
                  ? "text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.85)] scale-125" 
                  : "text-white/15"
              }`}
              animate={i < catches ? { scale: [1, 1.4, 1] } : {}}
            >
              ★
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Grid Canvas */}
      <div className="relative w-full aspect-square bg-black/60 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />

        {/* The 3D Orb */}
        <AnimatePresence>
          {active && (
            <motion.button
              key="orb"
              animate={{
                left: `${orbPos.x}%`,
                top: `${orbPos.y}%`,
                scale: [1, 1.08, 1],
              }}
              transition={{
                left: { type: "spring", damping: 14, stiffness: 90 },
                top: { type: "spring", damping: 14, stiffness: 90 },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              onClick={handleCatch}
              className="absolute w-14 h-14 -ml-7 -mt-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF3B0] to-[#AA7C11] cursor-pointer shadow-[0_0_25px_6px_rgba(212,175,55,0.65),inset_0_4px_12px_rgba(255,255,255,0.9)] border border-white/20 select-none outline-none"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.85 }}
            >
              {/* Outer lens flare corona */}
              <div className="absolute inset-[-10px] border border-[#FFF3B0]/20 rounded-full animate-ping pointer-events-none" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Success overlay */}
        {!active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm z-20"
          >
            <p className="text-3xl text-[#D4AF37] font-playfair drop-shadow-[0_0_15px_#D4AF37] animate-pulse uppercase tracking-widest text-center">
              CORE CAPTURED
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
