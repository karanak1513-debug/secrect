"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

interface PreEventTransitionProps {
  onComplete: () => void;
}

const STEPS = [
  "Establishing Secure Connection...",
  "Verifying Timeline Bounds...",
  "Loading Mission Parameters...",
  "Decrypting Challenge Modules...",
  "Access Granted. Launching..."
];

export default function PreEventTransition({ onComplete }: PreEventTransitionProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Play transition sound on mount
    sfx.playTransition();

    // Step text switcher
    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < STEPS.length - 1) {
          sfx.playTick();
          return prev + 1;
        }
        return prev;
      });
    }, 650);

    // Progress bar mock loader
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          const next = prev + Math.floor(Math.random() * 12) + 6;
          return next > 100 ? 100 : next;
        }
        return 100;
      });
    }, 120);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100 && currentStepIdx === STEPS.length - 1) {
      const timeout = setTimeout(() => {
        sfx.playUnlock();
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, currentStepIdx, onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#020202] flex flex-col items-center justify-center font-poppins px-6">
      {/* Background glow */}
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* Outer Card wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl p-10 md:p-14 text-center flex flex-col items-center relative z-10 bg-[#050505] border border-[#D4AF37]/15 rounded-[32px] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Subtle top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

        {/* Decorative corner points */}
        <div className="absolute top-6 left-6 text-xs text-[#D4AF37]/40 font-mono">✦</div>
        <div className="absolute top-6 right-6 text-xs text-[#D4AF37]/40 font-mono">✦</div>
        
        {/* Animated Laser / Flare instead of emoji */}
        <div className="relative h-20 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent mx-auto mb-10 overflow-hidden">
          <motion.div
            animate={{ 
              y: ["-100%", "200%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 -translate-x-1/2 w-[2px] h-1/2 bg-gradient-to-b from-transparent via-[#FFF3B0] to-transparent shadow-[0_0_10px_#D4AF37]"
          />
        </div>

        <h3 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-[#D4AF37] mb-3 tracking-[0.1em] font-light leading-tight">
          ACCESSING SURPRISE CORES
        </h3>
        <p className="text-white/40 text-[10px] md:text-xs mb-12 font-medium tracking-[0.2em] font-mono">
          PRE-BIRTHDAY TIMELINES
        </p>

        {/* Progress Bar Container */}
        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden mb-8 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37]"
            style={{ width: `${progress}%`, boxShadow: "0 0 15px rgba(212,175,55,0.8)" }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        {/* Live Step Logger */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStepIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-[#FFF3B0]/90 font-mono text-xs md:text-sm tracking-[0.15em]"
            >
              {STEPS[currentStepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="text-white/20 font-mono text-[9px] mt-16 tracking-[0.2em] uppercase">
          DECRYPTER ENGINE V2.0
        </div>
      </motion.div>
    </div>
  );
}
