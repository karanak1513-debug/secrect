"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Day2_CatchOrb({ onComplete }: { onComplete: () => void }) {
  const [catches, setCatches] = useState(0);
  const [orbPos, setOrbPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(true);

  // Move the orb randomly every 800ms
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setOrbPos({
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 80 + 10,
      });
    }, 800 - catches * 150); // Gets faster with each catch
    return () => clearInterval(interval);
  }, [active, catches]);

  const handleCatch = () => {
    if (!active) return;
    const newCatches = catches + 1;
    setCatches(newCatches);

    if (newCatches >= 3) {
      setActive(false);
      setTimeout(onComplete, 1000);
    } else {
      // Immediately jump to a new position on catch
      setOrbPos({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Catch the Orb</h2>
        <p className="text-white/60 font-poppins text-sm mb-4">
          The golden orb is evasive. Tap it 3 times to capture it.
        </p>
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border border-[#D4AF37] ${
                i < catches ? "bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </motion.div>

      <div className="relative w-full aspect-square md:aspect-video bg-black/40 border border-[#D4AF37]/20 rounded-3xl overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

        {/* The Orb */}
        <motion.button
          animate={{
            left: `${orbPos.x}%`,
            top: `${orbPos.y}%`,
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 100,
          }}
          onClick={handleCatch}
          className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-gradient-to-tr from-[#FFF3B0] to-[#D4AF37] cursor-pointer"
          style={{
            boxShadow: "0 0 20px 5px rgba(212,175,55,0.6), inset 0 0 10px rgba(255,255,255,0.8)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />

        {/* Success overlay */}
        {!active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20"
          >
            <p className="text-3xl text-[#D4AF37] font-playfair drop-shadow-[0_0_15px_#D4AF37]">
              Orb Captured!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
