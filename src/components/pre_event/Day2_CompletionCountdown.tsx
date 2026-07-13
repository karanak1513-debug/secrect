"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

const MIDNIGHT_DATE = new Date("2026-07-13T00:00:00");
const TARGET_DATE = new Date("2026-07-13T15:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Day2_CompletionCountdown({ onUnlock: _onUnlock }: { onUnlock: () => void }) {
  const [timeLeftMidnight, setTimeLeftMidnight] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timeLeftMain, setTimeLeftMain] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor follow
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  // Background gradient tracking the mouse
  const spotlightBg = useMotionTemplate`radial-gradient(circle 500px at ${spotlightX}px ${spotlightY}px, rgba(212, 175, 55, 0.08) 0%, transparent 80%)`;

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const renderCountdown = (time: TimeLeft) => (
    <div className="grid grid-cols-4 gap-3 md:gap-4 w-full mt-8 px-1">
      {[
        { label: "Days", value: time.days },
        { label: "Hours", value: time.hours },
        { label: "Minutes", value: time.minutes },
        { label: "Seconds", value: time.seconds },
      ].map((unit) => (
        <motion.div
          key={unit.label}
          whileHover={{
            y: -5,
            scale: 1.03,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.15)",
            borderColor: "rgba(212, 175, 55, 0.45)"
          }}
          style={{ perspective: 1000, borderColor: "rgba(255, 255, 255, 0.07)" }}
          className="bg-gradient-to-b from-[#111111]/95 to-[#070707]/95 border rounded-2xl h-24 md:h-28 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-500"
        >
          {/* Specular glass reflection diagonal overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none z-10" />

          {/* Card top glare highlight border line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none" />
          
          {/* Inner subtle gold glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0%,transparent_80%)] pointer-events-none" />

          {/* Horizontal physical split divider (split-flap visual styling) */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/95 border-b border-white/[0.03] z-20 pointer-events-none" />

          {/* Corner Accents */}
          <div className="absolute top-1.5 left-1.5 w-0.5 h-0.5 rounded-full bg-[#D4AF37]/25 pointer-events-none" />
          <div className="absolute top-1.5 right-1.5 w-0.5 h-0.5 rounded-full bg-[#D4AF37]/25 pointer-events-none" />
          <div className="absolute bottom-1.5 left-1.5 w-0.5 h-0.5 rounded-full bg-[#D4AF37]/25 pointer-events-none" />
          <div className="absolute bottom-1.5 right-1.5 w-0.5 h-0.5 rounded-full bg-[#D4AF37]/25 pointer-events-none" />

          {/* Pulsing LED status light at top center */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
            <span className="w-0.5 h-0.5 rounded-full bg-[#D4AF37]/75 shadow-[0_0_3px_#D4AF37] animate-pulse" />
          </div>

          <div className="flex items-center justify-center overflow-hidden h-10 md:h-12 w-full mb-1 z-10">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={{ opacity: 0, y: -15, rotateX: -75 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: 15, rotateX: 75 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl md:text-3xl lg:text-4xl font-playfair font-medium text-[#FFF3B0] tracking-tight select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
          
          <span className="text-[7px] md:text-[8px] text-[#D4AF37]/50 uppercase tracking-[0.25em] font-medium absolute bottom-2 z-10">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full min-h-screen flex flex-col items-center py-16 px-4 md:px-8 relative font-poppins text-white overflow-y-auto bg-[#030303] select-none"
    >
      {/* Dynamic Cursor spotlight */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-[0] transition-opacity duration-500"
        style={{ background: spotlightBg }}
      />
      
      {/* Subtle ambient center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none z-[0]" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-12 relative z-10"
      >
        <span className="text-xs tracking-[0.3em] uppercase text-[#D4AF37] mb-3 font-semibold flex items-center gap-3 select-none">
          <span className="w-6 h-[1px] bg-[#D4AF37]/50" />
          Day 2 Complete
          <span className="w-6 h-[1px] bg-[#D4AF37]/50" />
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-center tracking-wide pb-1 bg-gradient-to-b from-white via-[#FFF3B0] to-[#D4AF37] bg-clip-text text-transparent select-none">
          The Timeline is Locked.
        </h1>
        
        {/* Decorative Gold Separator Ornament */}
        <div className="flex items-center justify-center gap-4 mt-5 w-full max-w-xs">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
          <span className="text-[#D4AF37] text-[8px] tracking-[0.4em] font-light flex items-center gap-1 select-none">
            ✦ <span className="text-[6px]">❖</span> ✦
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
        </div>

        {/* Grand Finale Completed Status Indicators */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3.5 mt-8 max-w-lg w-full px-4"
        >
          {[
            { label: "Birthday Crystal", status: "Active & Charged", icon: "💎", color: "text-[#FFF3B0]", glow: "rgba(212,175,55,0.12)" },
            { label: "Celebration Portal", status: "Synced & Ready", icon: "🌌", color: "text-[#D4AF37]", glow: "rgba(212,175,55,0.12)" },
            { label: "Surprise Gift Box", status: "Secured", icon: "🎁", color: "text-[#FFF3B0]", glow: "rgba(212,175,55,0.12)" }
          ].map((item, idx) => (
            <div 
              key={idx}
              style={{ 
                borderColor: "rgba(255, 255, 255, 0.05)",
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 15px 0 ${item.glow}` 
              }}
              className="flex items-center gap-3 bg-black/60 border rounded-2xl px-4 py-2.5 backdrop-blur-md hover:border-[#D4AF37]/35 transition-all duration-300 select-none cursor-pointer"
            >
              <span className="text-base flex items-center justify-center animate-bounce duration-[3000ms]">{item.icon}</span>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/40 mb-1">{item.label}</span>
                <span className={`text-[9px] font-semibold tracking-wide ${item.color} flex items-center gap-1.5`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="relative w-full max-w-xl flex flex-col items-center pb-20 z-10">
        
        {/* Animated Glowing Vertical Line */}
        <div className="absolute top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent z-0 opacity-80" />
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
          style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
          className="relative z-10 bg-gradient-to-b from-[#111111]/90 to-[#070707]/95 border rounded-[2rem] p-8 md:p-12 w-full shadow-[0_25px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] mb-16 transition-all duration-500 hover:border-[#D4AF37]/25"
        >
          <div className="flex flex-col items-center text-center relative">
            <div className="absolute -top-14 bg-gradient-to-b from-[#D4AF37]/60 to-[#8C6D23]/60 p-[1px] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all duration-500 cursor-pointer">
              <div className="bg-black/90 backdrop-blur-md px-6 py-2 rounded-full border border-white/[0.03] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#FFF3B0] font-bold select-none">First Surprise</span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-playfair text-white mt-4 mb-3 tracking-wide select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Midnight Wish
            </h2>
            <div className="flex items-center gap-3 text-white/50 text-[10px] md:text-xs tracking-[0.2em] font-mono select-none">
              <span>13 JULY</span>
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
              <span>12:00 AM</span>
            </div>
            
            {renderCountdown(timeLeftMidnight)}
          </div>
        </motion.div>

        {/* Node indicator */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-[#030303] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5)]">
          <div className="w-1.5 h-1.5 bg-[#FFF3B0] rounded-full animate-pulse" />
        </div>

        {/* Card 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
          className="relative z-10 bg-gradient-to-b from-[#111111]/90 to-[#070707]/95 border rounded-[2rem] p-8 md:p-12 w-full shadow-[0_25px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-500 hover:border-[#D4AF37]/25"
        >
          <div className="flex flex-col items-center text-center relative">
            <div className="absolute -top-14 bg-gradient-to-b from-[#D4AF37]/60 to-[#8C6D23]/60 p-[1px] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all duration-500 cursor-pointer">
              <div className="bg-black/90 backdrop-blur-md px-6 py-2 rounded-full border border-white/[0.03] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#FFF3B0] font-bold select-none">Main Surprise</span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-playfair text-white mt-4 mb-3 tracking-wide select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Celebration
            </h2>
            <div className="flex items-center gap-3 text-white/50 text-[10px] md:text-xs tracking-[0.2em] font-mono select-none">
              <span>13 JULY</span>
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
              <span>3:00 PM</span>
            </div>
            
            {renderCountdown(timeLeftMain)}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
