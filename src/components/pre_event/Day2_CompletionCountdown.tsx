"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MIDNIGHT_DATE = new Date("2026-07-13T00:00:00");
const TARGET_DATE = new Date("2026-07-13T13:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Day2_CompletionCountdown({ onUnlock }: { onUnlock: () => void }) {
  const [timeLeftMidnight, setTimeLeftMidnight] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timeLeftMain, setTimeLeftMain] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = +new Date();
      
      const diffMidnight = +MIDNIGHT_DATE - now;
      if (diffMidnight > 0) {
        setTimeLeftMidnight({
          days: Math.floor(diffMidnight / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diffMidnight / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diffMidnight / 1000 / 60) % 60),
          seconds: Math.floor((diffMidnight / 1000) % 60),
        });
      } else {
        setTimeLeftMidnight({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }

      const diffMain = +TARGET_DATE - now;
      if (diffMain > 0) {
        setTimeLeftMain({
          days: Math.floor(diffMain / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diffMain / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diffMain / 1000 / 60) % 60),
          seconds: Math.floor((diffMain / 1000) % 60),
        });
      } else {
        setTimeLeftMain({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderCountdown = (time: TimeLeft) => (
    <div className="grid grid-cols-4 gap-3 md:gap-5 w-full mt-8">
      {[
        { label: "Days", value: time.days },
        { label: "Hours", value: time.hours },
        { label: "Minutes", value: time.minutes },
        { label: "Seconds", value: time.seconds },
      ].map((unit) => (
        <div
          key={unit.label}
          className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Subtle top glare */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
          
          <AnimatePresence mode="popLayout">
            <motion.span
              key={unit.value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-2xl md:text-4xl font-mono font-medium text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFF3B0] to-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
            >
              {String(unit.value).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/50 mt-2 font-medium">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center py-16 px-4 md:px-8 relative font-poppins text-white overflow-y-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#050505] -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15)_0%,transparent_70%)] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-16 relative z-10"
      >
        <span className="text-sm tracking-[0.3em] uppercase text-[#D4AF37] mb-4 font-semibold flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[#D4AF37]/50" />
          Day 2 Complete
          <span className="w-8 h-[1px] bg-[#D4AF37]/50" />
        </span>
        <h1 className="text-3xl md:text-5xl font-playfair text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] text-center tracking-wide">
          The Timeline is Locked.
        </h1>
      </motion.div>

      <div className="relative w-full max-w-xl flex flex-col items-center pb-20">
        
        {/* Animated Glowing Vertical Line */}
        <div className="absolute top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent z-0 opacity-80" />
        {/* Glowing dot moving along the line */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
          className="absolute left-1/2 -translate-x-1/2 w-[3px] h-16 bg-gradient-to-b from-transparent via-[#FFF3B0] to-transparent shadow-[0_0_10px_#D4AF37] z-0"
        />

        {/* Card 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 w-full shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] mb-16"
        >
          <div className="flex flex-col items-center text-center relative">
            <div className="absolute -top-12 bg-gradient-to-b from-[#D4AF37] to-[#8C6D23] p-[1px] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <div className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#FFF3B0] font-bold">First Surprise</span>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-playfair text-white mt-4 mb-3 tracking-wide">
              Midnight Wish
            </h2>
            <div className="flex items-center gap-3 text-white/50 text-xs md:text-sm tracking-widest font-mono">
              <span>13 JULY</span>
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
              <span>12:00 AM</span>
            </div>
            
            {renderCountdown(timeLeftMidnight)}
          </div>
        </motion.div>

        {/* Node indicator */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-[#050505] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5)]">
          <div className="w-1.5 h-1.5 bg-[#FFF3B0] rounded-full animate-pulse" />
        </div>

        {/* Card 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 w-full shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          <div className="flex flex-col items-center text-center relative">
            <div className="absolute -top-12 bg-gradient-to-b from-[#D4AF37] to-[#8C6D23] p-[1px] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <div className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#FFF3B0] font-bold">Main Surprise</span>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-playfair text-white mt-4 mb-3 tracking-wide">
              Celebration
            </h2>
            <div className="flex items-center gap-3 text-white/50 text-xs md:text-sm tracking-widest font-mono">
              <span>13 JULY</span>
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
              <span>1:00 PM</span>
            </div>
            
            {renderCountdown(timeLeftMain)}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
