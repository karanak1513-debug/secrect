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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card w-full max-w-md p-8 text-center flex flex-col items-center relative z-10 border border-[#D4AF37]/20 shadow-[0_0_50px_rgba(212,175,55,0.05)]"
      >
        {/* Decorative corner points */}
        <div className="absolute top-4 left-4 text-[9px] text-[#D4AF37]/30 font-mono">✦</div>
        <div className="absolute top-4 right-4 text-[9px] text-[#D4AF37]/30 font-mono">✦</div>
        
        {/* Animated Lock Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-5xl md:text-6xl mb-6 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] cursor-pointer"
          onClick={() => sfx.playClick()}
        >
          🔐
        </motion.div>

        <h3 className="text-xl md:text-2xl font-playfair text-[#D4AF37] mb-2 tracking-[0.1em] font-light">
          ACCESSING SURPRISE CORES
        </h3>
        <p className="text-white/40 text-xs mb-8 font-light tracking-widest font-mono">
          PRE-BIRTHDAY TIMELINES
        </p>

        {/* Progress Bar Container */}
        <div className="w-full h-[4px] bg-white/5 border border-white/10 rounded-full overflow-hidden mb-6 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37]"
            style={{ width: `${progress}%`, boxShadow: "0 0 10px #D4AF37" }}
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
              className="text-[#FFF3B0]/80 font-mono text-xs md:text-sm tracking-wider"
            >
              {STEPS[currentStepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="text-white/20 font-mono text-[9px] mt-10 tracking-widest uppercase">
          Decrypter Engine v2.0
        </div>
      </motion.div>
    </div>
  );
}
