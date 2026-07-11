"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    // Step text switcher
    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    // Progress bar mock loader
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          const next = prev + Math.floor(Math.random() * 15) + 5;
          return next > 100 ? 100 : next;
        }
        return 100;
      });
    }, 150);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100 && currentStepIdx === STEPS.length - 1) {
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, currentStepIdx, onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#020202] flex flex-col items-center justify-center font-poppins px-6">
      {/* Background glow */}
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md text-center flex flex-col items-center relative z-10">
        {/* Animated Lock Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-5xl md:text-6xl mb-6 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          🔐
        </motion.div>

        <h3 className="text-xl md:text-2xl font-playfair text-[#D4AF37] mb-2 tracking-wide font-light">
          ACCESSING SURPRISE CORES
        </h3>
        <p className="text-white/40 text-xs md:text-sm mb-8 font-light">
          Connecting to pre-birthday timelines...
        </p>

        {/* Progress Bar Container */}
        <div className="w-full h-[3px] bg-white/5 border border-white/10 rounded-full overflow-hidden mb-6 relative">
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
              className="text-[#FFF3B0]/75 font-mono text-xs md:text-sm tracking-wider"
            >
              {STEPS[currentStepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="text-white/20 font-mono text-[10px] mt-10 tracking-widest uppercase">
          Pre-event decrypter v1.0.4
        </div>
      </div>
    </div>
  );
}
