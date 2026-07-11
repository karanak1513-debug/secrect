"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    const now = new Date();
    const isJuly11 = now.getMonth() === 6 && now.getDate() === 11;
    const isJuly12 = now.getMonth() === 6 && now.getDate() === 12;

    if (isJuly11) {
      onEnterPreEvent("day1");
    } else if (isJuly12) {
      onEnterPreEvent("day2");
    }
  };

  const getPreEventButtonStatus = () => {
    const now = new Date();
    const isJuly11 = now.getMonth() === 6 && now.getDate() === 11;
    const isJuly12 = now.getMonth() === 6 && now.getDate() === 12;
    return isJuly11 || isJuly12;
  };

  const showPreEventButton = getPreEventButtonStatus();

  if (!isReady) return null;

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center font-poppins">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="backdrop-blur-md bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.05)] w-full max-w-3xl"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-4 flex items-center justify-center gap-3"
        >
          <span>🔒</span> A Special Surprise Awaits
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 font-light text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto"
        >
          The grand birthday celebration is locked in time.<br />
          Every memory, wish, and little detail will automatically reveal itself on<br />
          <span className="text-[#D4AF37] font-semibold">13 July • 1:00 PM</span>.
        </motion.p>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto mb-10">
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
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center backdrop-blur-lg"
            >
              <span className="text-2xl md:text-4xl font-mono font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] md:text-xs text-white/50 mt-1 uppercase tracking-wider">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xs text-white/40 italic mb-8"
        >
          "Patience makes the sweetest surprises even more beautiful."
        </motion.p>

        {showPreEventButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={handlePreEventClick}
            className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2 mx-auto"
          >
            Enter Pre-Event Missions →
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
