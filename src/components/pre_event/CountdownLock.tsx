"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { sfx } from "@/utils/sfx";
import { TEST_MODE } from "@/config";
import AccessCodeModal from "./AccessCodeModal";

interface CountdownLockProps {
  targetDate: Date;
  onUnlock: () => void;
  onEnterPreEvent: (day: "day1" | "day2") => void;
  onAccessCodeUnlock?: (codeType: "early" | "admin") => void;
  countdownOverriddenToZero?: boolean;
}

export default function CountdownLock({
  targetDate,
  onUnlock,
  onEnterPreEvent,
  onAccessCodeUnlock,
  countdownOverriddenToZero,
}: CountdownLockProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isReady, setIsReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor follow
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  // Background gradient tracking the mouse (warmer, richer gold highlight)
  const spotlightBg = useMotionTemplate`radial-gradient(circle 500px at ${spotlightX}px ${spotlightY}px, rgba(212, 175, 55, 0.08) 0%, transparent 80%)`;

  useEffect(() => {
    if (countdownOverriddenToZero) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setIsReady(true);
      return;
    }

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
  }, [targetDate, onUnlock, unlocked, countdownOverriddenToZero]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const // easeOutExpo
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6 font-poppins bg-[#030303] overflow-y-auto select-none py-12 md:py-16"
    >
      {/* Custom Styles for Button Shimmer Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer-sweep {
          0% { left: -150%; }
          50% { left: 150%; }
          100% { left: 150%; }
        }
        .animate-shimmer-sweep {
          animation: shimmer-sweep 3.5s infinite linear;
        }
      `}} />

      {/* Dynamic Cursor spotlight */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-[0] transition-opacity duration-500"
        style={{ background: spotlightBg }}
      />

      {/* Subtle ambient center glow as backup/ambient base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none z-[0]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl relative z-10 flex flex-col items-center my-auto"
      >
        {/* Animated Glowing Lock Section */}
        <motion.div
          variants={itemVariants}
          className="relative flex items-center justify-center w-20 h-20 mb-4 cursor-pointer group"
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Radial outer glow */}
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/5 blur-xl group-hover:bg-[#D4AF37]/15 transition-all duration-700 pointer-events-none" />

          {/* Pulsing concentric rings */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1.8], opacity: [0.4, 0.15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-[#D4AF37]/25 pointer-events-none"
          />
          
          {/* Thin rotating outer dashed circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-5px] rounded-full border border-dashed border-[#D4AF37]/20 pointer-events-none"
          />

          {/* Core Shield / Lock Button */}
          <div className="w-12 h-12 rounded-full bg-black/95 border border-[#D4AF37]/35 group-hover:border-[#D4AF37]/60 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] backdrop-blur-xl relative z-10 transition-all duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-[#D4AF37] drop-shadow-[0_0_4px_rgba(212,175,55,0.5)] transition-transform duration-300 group-hover:scale-105" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </motion.div>

        {/* Title Header (Animated as a Single Unit to prevent overlapping spans) */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-playfair tracking-wide font-normal text-center select-none pb-2 mb-4 bg-gradient-to-b from-white via-[#FFF3B0] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        >
          A Special Surprise Awaits
        </motion.h1>

        {/* Decorative Gold Separator Ornament */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center gap-4 my-5 w-full max-w-sm"
        >
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          <span className="text-[#D4AF37] text-[10px] tracking-[0.4em] font-light flex items-center gap-1 select-none">
            ✦ <span className="text-[7px]">❖</span> ✦
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        </motion.div>

        {/* Styled subtitle and target date badge */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center text-center max-w-xl px-4"
        >
          <p className="text-white/40 font-poppins font-light text-sm md:text-base leading-[1.8] select-none">
            The grand birthday celebration is locked in time.
            <br />
            Every memory, wish, and little detail will automatically reveal itself on
          </p>

          {/* Luxury date tag badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative inline-block mt-6 group cursor-pointer"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/5 blur-md rounded-full pointer-events-none group-hover:bg-[#D4AF37]/15 transition-all duration-500" />
            <div className="relative px-6 py-2.5 bg-black/60 border border-white/[0.08] group-hover:border-[#D4AF37]/35 rounded-full backdrop-blur-md flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-500">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[#FFF3B0] font-poppins font-medium tracking-[0.25em] uppercase text-[10px] md:text-xs">
                13 July • 3:00 PM
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Live Countdown Grid with High-End Glass Bezeled Cards */}
        <div className="grid grid-cols-4 gap-3 md:gap-5 w-full max-w-2xl mx-auto mt-10 mb-10 px-2">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINUTES", value: timeLeft.minutes },
            { label: "SECONDS", value: timeLeft.seconds },
          ].map((unit) => (
            <motion.div
              key={unit.label}
              variants={itemVariants}
              whileHover={{
                y: -6,
                scale: 1.03,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.2)",
                borderColor: "rgba(212, 175, 55, 0.5)"
              }}
              style={{ perspective: 1000, borderColor: "rgba(255, 255, 255, 0.07)" }}
              className="bg-gradient-to-b from-[#111111]/95 to-[#070707]/95 border rounded-2xl h-28 md:h-36 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-500"
            >
              {/* Specular glass reflection diagonal overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none z-10" />

              {/* Card top glare highlight border line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
              
              {/* Inner subtle gold glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0%,transparent_80%)] pointer-events-none" />

              {/* Horizontal physical split divider (split-flap visual styling) */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/90 border-b border-white/[0.04] z-20 pointer-events-none" />

              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-[#D4AF37]/25 pointer-events-none" />
              <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#D4AF37]/25 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-[#D4AF37]/25 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-[#D4AF37]/25 pointer-events-none" />

              {/* Pulsing LED status light at top center */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-[#D4AF37]/75 shadow-[0_0_4px_#D4AF37] animate-pulse" />
              </div>

              <div className="flex items-center justify-center overflow-hidden h-14 md:h-18 w-full mb-1 z-10">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={unit.value}
                    initial={{ opacity: 0, y: -20, rotateX: -75 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: 20, rotateX: 75 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl md:text-5xl lg:text-6xl font-playfair font-medium text-[#FFF3B0] tracking-tight select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                  >
                    {String(unit.value).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              <span className="text-[8px] md:text-[9px] text-[#D4AF37]/60 uppercase tracking-[0.3em] font-medium absolute bottom-3 z-10">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Elegant Quote */}
        <motion.p
          variants={itemVariants}
          className="text-xs md:text-sm text-white/35 italic mb-10 tracking-widest font-light text-center max-w-md px-4 font-poppins select-none"
        >
          "Patience makes the sweetest surprises even more beautiful."
        </motion.p>

        {/* Access Code Trigger Button */}
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <button
            onClick={() => setIsAccessModalOpen(true)}
            className="px-5 py-2.5 bg-black/60 border border-[#D4AF37]/25 hover:border-[#D4AF37]/55 hover:bg-black/80 rounded-full text-[#FFF3B0]/80 hover:text-[#FFF3B0] transition-all duration-300 font-poppins text-xs tracking-wider flex items-center gap-2 cursor-pointer backdrop-blur-md shadow-lg"
          >
            <span>🔒</span> Have an Access Code?
          </button>
        </motion.div>

        {/* Redesigned Shimmer Button */}
        {showPreEventButton && (
          <motion.div variants={itemVariants} className="w-full sm:w-auto">
            <motion.button
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 0 35px rgba(212, 175, 55, 0.22)",
                borderColor: "rgba(212, 175, 55, 0.7)",
              }}
              style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePreEventClick}
              className="relative group overflow-hidden px-10 py-4 bg-transparent border text-white font-medium rounded-full flex items-center justify-center gap-3.5 mx-auto cursor-pointer uppercase text-[10px] md:text-xs tracking-[0.22em] transition-all duration-500 w-full sm:w-auto"
            >
              {/* Sliding gold gradient hover fill */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#AA7C11] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              
              <span className="relative z-10 group-hover:text-black font-semibold transition-colors duration-500 flex items-center gap-2 select-none">
                Enter Pre-Event Missions
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-500 text-white/70 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>

              {/* Shimmer sweep effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none animate-shimmer-sweep" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Access Code Modal */}
      <AccessCodeModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        onVerify={(codeType) => {
          if (onAccessCodeUnlock) {
            onAccessCodeUnlock(codeType);
          }
        }}
      />
    </div>
  );
}
