"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

import { TEST_MODE } from "@/config";

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
    if (TEST_MODE) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setIsReady(true);
      return;
    }

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
    if (TEST_MODE) {
      onEnterPreEvent("day1");
      return;
    }
    onEnterPreEvent("day2");
  };

  const showPreEventButton = true; // For demo/preview access

  if (!isReady) return null;

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6 font-poppins bg-[#000000]">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col items-center gap-6 mb-8"
        >
          {/* Custom SVG Lock Icon */}
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.1)] backdrop-blur-xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-[#D4AF37]" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white tracking-wide font-normal">
            A Special Surprise Awaits
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-white/50 font-poppins font-light text-sm md:text-base leading-[1.8] mb-12 max-w-xl mx-auto text-center"
        >
          The grand birthday celebration is locked in time.
          <br />
          Every memory, wish, and little detail will automatically reveal itself on
          <div className="mt-8">
            <span className="text-[#D4AF37] font-medium tracking-[0.2em] uppercase text-xs border border-[#D4AF37]/20 rounded-full px-6 py-2.5 bg-gradient-to-b from-[#D4AF37]/10 to-transparent">
              13 July • 1:00 PM
            </span>
          </div>
        </motion.div>

        {/* Live Countdown Grid with Clean Glass Blocks */}
        <div className="grid grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl mx-auto mb-16">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINUTES", value: timeLeft.minutes },
            { label: "SECONDS", value: timeLeft.seconds },
          ].map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1, type: "spring", stiffness: 90 }}
              className="bg-white/[0.02] border border-white/5 rounded-3xl h-28 md:h-36 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Subtle top glare */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-mono font-medium text-white tracking-tight"
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              
              <span className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.25em] font-medium absolute bottom-4">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-white/40 italic mb-12 tracking-wide font-light text-center"
        >
          "Patience makes the sweetest surprises even more beautiful."
        </motion.p>

        {showPreEventButton && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,1)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePreEventClick}
            className="px-10 py-4 bg-white/90 text-black font-medium rounded-full shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center mx-auto cursor-pointer uppercase text-[10px] md:text-xs tracking-[0.2em] transition-all duration-300 w-full sm:w-auto"
          >
            Enter Pre-Event Missions
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
