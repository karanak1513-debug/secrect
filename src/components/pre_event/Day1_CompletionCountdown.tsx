"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

import { TEST_MODE } from "@/config";

const TARGET_DATE = new Date("2026-07-12T00:00:00");

interface Day1_CompletionCountdownProps {
  onTimeUp: () => void;
  onReturnLater: () => void;
}

export default function Day1_CompletionCountdown({ onTimeUp, onReturnLater }: Day1_CompletionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimeLocked, setIsTimeLocked] = useState(true);

  useEffect(() => {
    if (TEST_MODE) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setIsTimeLocked(false);
      return;
    }

    const calculateTimeLeft = () => {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setIsTimeLocked(false);
    };

    calculateTimeLeft();

  }, [onTimeUp]);

  const handleResetProgress = () => {
    sfx.playClick();
    localStorage.removeItem("preEvent_day1_completed");
    localStorage.removeItem("preEvent_day2_completed");
    localStorage.removeItem("grand_finale_completed");
    window.location.reload();
  };

  return (
    <div className="text-center z-10 flex flex-col items-center max-w-2xl mx-auto px-6 relative font-poppins">
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      <h1 className="text-4xl md:text-5xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-4 drop-shadow-[0_0_12px_rgba(212,175,55,0.35)] font-normal flex items-center justify-center gap-3">
        <span className="text-3xl md:text-4xl">🏆</span> Mission Day One Complete
      </h1>
      
      <p className="text-white/90 text-lg font-medium mb-2 font-playfair tracking-wide">
        Congratulations!
      </p>
      <p className="text-white/60 text-sm md:text-base font-light mb-8 max-w-md mx-auto leading-relaxed">
        You have successfully completed today's mission.<br />
        The next mission is now available.
      </p>

      {/* Premium Reward Card with Shine Effect */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        className="glass-card p-6 md:p-10 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] mb-10 w-full max-w-md flex flex-col items-center gap-3 relative overflow-hidden"
      >
        {/* Shimmer sweep animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFF3B0]/10 to-transparent pointer-events-none -translate-x-full animate-[shimmer_6s_infinite] duration-[3000ms]" />

        <span className="text-[#D4AF37] font-semibold text-lg md:text-xl flex items-center gap-2 tracking-wide font-playfair">
          ✨ First Fragment Discovered
        </span>
        <span className="text-4xl md:text-5xl font-mono text-white tracking-[0.3em] font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] my-3 select-none">
          H_PP_
        </span>
      </motion.div>

      <button
        onClick={() => {
          sfx.playClick();
          // Explicitly clear Day 2 progress to force a fresh run
          localStorage.removeItem("preEvent_day2_completed");
          localStorage.removeItem("grand_finale_completed");
          onTimeUp();
        }}
        className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer text-sm uppercase tracking-wider flex items-center gap-3 relative z-50"
      >
        <span className="text-xl">🚀</span> Enter Day 2 Mission →
      </button>
    </div>
  );
}
