"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/utils/sfx";

interface MissionIntroProps {
  number: string;
  name: string;
  difficulty: number;
  objective: string;
  onStart: () => void;
}

export default function MissionIntro({ number, name, difficulty, objective, onStart }: MissionIntroProps) {
  useEffect(() => {
    // Play a cinematic intro swell
    sfx.playMissionStart();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-xl md:text-2xl transition-all duration-300 ${
          i < rating ? "text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" : "text-white/20"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card max-w-md w-full mx-auto p-8 text-center flex flex-col items-center justify-center relative z-10 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)]"
    >
      {/* Golden Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none rounded-[32px] overflow-hidden" />
      
      {/* Decorative Corner Ornaments */}
      <div className="absolute top-4 left-4 text-xs text-[#D4AF37]/40 font-mono">✦</div>
      <div className="absolute top-4 right-4 text-xs text-[#D4AF37]/40 font-mono">✦</div>
      <div className="absolute bottom-4 left-4 text-xs text-[#D4AF37]/40 font-mono">✦</div>
      <div className="absolute bottom-4 right-4 text-xs text-[#D4AF37]/40 font-mono">✦</div>

      <motion.span
        initial={{ letterSpacing: "0.1em", opacity: 0 }}
        animate={{ letterSpacing: "0.4em", opacity: 0.6 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="font-mono text-xs uppercase text-[#FFF3B0] tracking-[0.4em] mb-3 block"
      >
        MISSION {number}
      </motion.span>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-5xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
      >
        {name}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-1 mb-8"
      >
        <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Difficulty</span>
        <div className="flex gap-1">{renderStars(difficulty)}</div>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-8 w-full backdrop-blur-sm"
      >
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]/60 block mb-2">OBJECTIVE</span>
        <p className="text-white/80 font-poppins text-sm leading-relaxed font-light">
          {objective}
        </p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.6)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sfx.playClick();
          onStart();
        }}
        className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer text-sm tracking-wider uppercase transition-all duration-300"
      >
        Start Mission →
      </motion.button>
    </motion.div>
  );
}
