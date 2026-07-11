"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

const TARGET_DATE = new Date("2026-07-12T00:00:00");

interface Day1_CompletionCountdownProps {
  onTimeUp: () => void;
  onReturnLater: () => void;
}

export default function Day1_CompletionCountdown({ onTimeUp, onReturnLater }: Day1_CompletionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimeLocked, setIsTimeLocked] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +TARGET_DATE - +new Date();
      const currentLock = difference > 0;
      setIsTimeLocked(currentLock);

      if (currentLock) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onTimeUp();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const handleResetProgress = () => {
    sfx.playClick();
    localStorage.removeItem("preEvent_day1_completed");
    localStorage.removeItem("preEvent_day2_completed");
    window.location.reload();
  };

  return (
    <div className="text-center z-10 flex flex-col items-center max-w-2xl mx-auto px-6 relative font-poppins">
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      <h1 className="text-4xl md:text-5xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-3 drop-shadow-[0_0_12px_rgba(212,175,55,0.35)] font-normal">
        Mission Day One Complete!
      </h1>
      <p className="text-white/60 text-sm md:text-base font-light mb-8">
        "You've successfully completed today's mission. The next phase unlocks tomorrow."
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
          🏆 First Fragment Discovered
        </span>
        <span className="text-4xl md:text-5xl font-mono text-white tracking-[0.3em] font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] my-3 select-none">
          H_PP_
        </span>
        <p className="text-white/60 text-xs md:text-sm leading-relaxed font-light">
          Great job! The next mission will unlock automatically on<br />
          <span className="text-[#D4AF37] font-semibold tracking-wider bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/20 inline-block mt-2 font-mono">12 July at 12:00 AM</span>.
        </p>
      </motion.div>

      {/* Countdown Clock with digits transition */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md w-full mb-10">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((unit, idx) => (
          <div
            key={unit.label}
            className="bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-2xl relative shadow-md group hover:border-[#D4AF37]/45 transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={unit.value}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl md:text-4xl font-mono font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            <span className="text-[9px] uppercase tracking-wider text-white/40 mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-white/50 text-xs tracking-wider italic font-light mb-8">
        "Come back when the countdown reaches zero."
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => {
            sfx.playClick();
            onReturnLater();
          }}
          className="px-8 py-3 bg-white/5 border border-white/15 text-white/80 font-medium rounded-full hover:bg-white/10 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer text-xs uppercase tracking-wider"
        >
          Return Later
        </button>
        <button
          onClick={handleResetProgress}
          className="px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-medium rounded-full hover:bg-red-500/20 transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
}
