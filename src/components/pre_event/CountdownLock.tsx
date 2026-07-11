"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

interface CountdownLockProps {
  targetDate: Date;
  onUnlock: () => void;
  onEnterPreEvent: (day: "day1" | "day2") => void;
}

export default function CountdownLock({ targetDate, onUnlock, onEnterPreEvent }: CountdownLockProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isReady, setIsReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!unlocked) {
          setUnlocked(true);
          onUnlock();
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
      setIsReady(true);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onUnlock, unlocked]);

  const handlePreEventClick = () => {
    sfx.playTransition();
    const now = new Date();
    const isJuly11 = now.getMonth() === 6 && now.getDate() === 11;
    const isJuly12 = now.getMonth() === 6 && now.getDate() === 12;

    if (isJuly11) {
      onEnterPreEvent("day1");
    } else if (isJuly12) {
      onEnterPreEvent("day2");
    } else {
      // Fallback fallback if user is playing out of days but has bypasses/needs to test
      onEnterPreEvent("day1");
    }
  };

  const getPreEventButtonStatus = () => {
    const now = new Date();
    const isJuly11 = now.getMonth() === 6 && now.getDate() === 11;
    const isJuly12 = now.getMonth() === 6 && now.getDate() === 12;
    // Always true for previewing/demo purposes so they can enter pre-event
    return true; 
  };

  const showPreEventButton = getPreEventButtonStatus();

  if (!isReady) return null;

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center font-poppins">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card p-8 md:p-16 border border-[#D4AF37]/20 shadow-[0_0_80px_rgba(212,175,55,0.08)] w-full max-w-3xl relative overflow-hidden"
      >
        {/* Glowing sweep across card */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFF3B0]/5 to-transparent pointer-events-none -translate-x-full animate-[shimmer_8s_infinite] duration-[4000ms]" />

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-5xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-6 flex items-center justify-center gap-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          <span className="text-3xl animate-bounce">🔒</span> A Special Surprise Awaits
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-white/70 font-poppins font-light text-sm md:text-base leading-relaxed mb-10 max-w-lg mx-auto"
        >
          The grand birthday celebration is locked in time.<br />
          Every memory, wish, and little detail will automatically reveal itself on<br />
          <span className="text-[#D4AF37] font-semibold tracking-wider bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/25 inline-block mt-2">13 July • 1:00 PM</span>.
        </motion.p>

        {/* Live Countdown Grid with Flip animations */}
        <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto mb-12">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1, type: "spring", stiffness: 100 }}
              className="bg-black/60 border border-[#D4AF37]/20 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center backdrop-blur-2xl relative shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden group hover:border-[#D4AF37]/50 transition-colors duration-300"
            >
              {/* Top half shine */}
              <div className="absolute top-0 left-0 w-full h-[50%] bg-white/[0.02] border-b border-white/5 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.span
                  key={unit.value}
                  initial={{ rotateX: -90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: 90, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-3xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3B0] to-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              
              <span className="text-[9px] md:text-[11px] text-white/40 mt-2 uppercase tracking-[0.2em] font-medium">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.9 }}
          className="text-xs text-white/50 italic mb-10 tracking-wider font-light"
        >
          "Patience makes the sweetest surprises even more beautiful."
        </motion.p>

        {showPreEventButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,175,55,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreEventClick}
            className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-3 mx-auto cursor-pointer uppercase text-xs tracking-[0.15em] font-poppins transition-all duration-300"
          >
            Enter Pre-Event Missions ✦
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
