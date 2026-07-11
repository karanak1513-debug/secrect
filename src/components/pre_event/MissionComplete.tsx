"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/utils/sfx";

interface MissionCompleteProps {
  onContinue: () => void;
  xpAdded?: number;
}

export default function MissionComplete({ onContinue, xpAdded = 100 }: MissionCompleteProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Play success fanfare
    sfx.playSuccess();

    // Start progress bar animation after a short delay
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card max-w-md w-full mx-auto p-8 text-center flex flex-col items-center justify-center relative z-10 border border-green-500/20 shadow-[0_0_50px_rgba(74,222,128,0.1)]"
    >
      {/* Decorative Golden Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-green-500/5 to-transparent pointer-events-none rounded-[32px] overflow-hidden" />

      {/* Floating Sparkle Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-xl text-[#D4AF37] opacity-60"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.2, 0],
              rotate: 360,
              y: -50,
            }}
            transition={{
              duration: 2 + Math.random() * 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            ✦
          </motion.span>
        ))}
      </div>

      {/* Elegant Circular Seal/Stamp */}
      <motion.div
        initial={{ scale: 3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 150, 
          damping: 15,
          delay: 0.2 
        }}
        className="w-24 h-24 rounded-full border-4 border-[#D4AF37] flex items-center justify-center relative mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] bg-black/40"
      >
        <div className="absolute inset-1 rounded-full border border-[#D4AF37]/35 border-dashed" />
        <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">🏆</span>
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.4 }}
        className="font-mono text-xs uppercase text-[#D4AF37] tracking-[0.4em] mb-2 block"
      >
        MISSION COMPLETED
      </motion.span>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-3xl md:text-4xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-6"
      >
        SYSTEM OVERRIDE
      </motion.h2>

      {/* Progress & XP Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-8 w-full backdrop-blur-sm"
      >
        <div className="flex justify-between items-center mb-2 font-mono text-xs text-white/60">
          <span>DECRYPTING DATA...</span>
          <span className="text-[#D4AF37]">+{xpAdded} XP</span>
        </div>
        
        {/* Loading Bar */}
        <div className="w-full h-2.5 bg-white/5 border border-white/10 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37]"
            style={{ width: `${progress}%`, boxShadow: "0 0 10px #D4AF37" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.6)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sfx.playClick();
          onContinue();
        }}
        className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer text-sm tracking-wider uppercase transition-all duration-300"
      >
        Continue →
      </motion.button>
    </motion.div>
  );
}
