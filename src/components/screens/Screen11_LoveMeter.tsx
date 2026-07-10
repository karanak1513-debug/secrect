"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";

const PROGRESS_STEPS = [0, 15, 38, 62, 87, 99, "∞"];

export default function Screen11_LoveMeter() {
  const { setCurrentScreen } = useStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Generate random particles and floating hearts
  const backgroundElements = useMemo(() => {
    return {
      particles: [...Array(20)].map(() => ({
        width: Math.random() * 4 + 2 + "px",
        height: Math.random() * 4 + 2 + "px",
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        duration: Math.random() * 10 + 10,
      })),
      hearts: [...Array(10)].map(() => ({
        left: Math.random() * 90 + 5 + "%",
        duration: Math.random() * 8 + 8,
        delay: Math.random() * 5,
        scale: Math.random() * 0.5 + 0.5,
      }))
    };
  }, []);

  const playTickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600 + stepIndex * 100, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(1000 + stepIndex * 100, audioCtx.currentTime + 0.1); 
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log("Audio play failed", e);
    }
  };

  useEffect(() => {
    if (stepIndex < PROGRESS_STEPS.length - 1) {
      const timeout = setTimeout(() => {
        setStepIndex(prev => prev + 1);
        playTickSound();
      }, stepIndex === 5 ? 2000 : 1200); // Wait longer before showing infinity

      return () => clearTimeout(timeout);
    } else {
      const finalTimeout = setTimeout(() => {
        setShowFinalMessage(true);
      }, 1000);
      return () => clearTimeout(finalTimeout);
    }
  }, [stepIndex]);

  const currentProgress = PROGRESS_STEPS[stepIndex];
  const isInfinity = currentProgress === "∞";
  const percentage = isInfinity ? 100 : (currentProgress as number);

  // SVG Circle calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4 overflow-hidden"
    >
      {/* Floating Glowing Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {backgroundElements.particles.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-[#D4AF37]/30 blur-sm"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating Golden Hearts */}
        {backgroundElements.hearts.map((h, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute bottom-[-10%] text-[#D4AF37] opacity-20 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            style={{
              left: h.left,
              scale: h.scale,
              fontSize: '2rem'
            }}
            animate={{
              y: ["0vh", "-120vh"],
              x: ["0px", "50px", "-50px", "0px"],
              opacity: [0, 0.4, 0],
              rotate: [0, 20, -20, 0]
            }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ❤
          </motion.div>
        ))}
      </div>

      <div className="z-10 text-center mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl text-[#D4AF37] mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
          Love Meter
        </h1>
        <p className="font-poppins text-white/70 text-sm md:text-base">
          Let&apos;s see how much love this heart can hold...
        </p>
      </div>

      {/* Circular Meter inside a glassmorphism card */}
      <motion.div 
        className="relative z-10 glass-card p-8 md:p-12 rounded-[3rem] flex items-center justify-center border border-[#D4AF37]/20 shadow-[0_30px_80px_rgba(0,0,0,0.9)] bg-[#050505]/80 backdrop-blur-3xl mb-12"
        animate={{
          scale: isInfinity ? [1, 1.02, 1] : 1,
          boxShadow: isInfinity 
            ? ["0 30px 80px rgba(0,0,0,0.9)", "0 0 120px rgba(212,175,55,0.3)", "0 30px 80px rgba(0,0,0,0.9)"]
            : "0 30px 80px rgba(0,0,0,0.9)"
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] flex items-center justify-center">
          {/* Outer Dashed Ring */}
          <motion.svg 
            className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="50%" cy="50%" r="48%" fill="transparent" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 12" />
          </motion.svg>
          
          {/* Inner Dashed Ring */}
          <motion.svg 
            className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="50%" cy="50%" r="43%" fill="transparent" stroke="#FFF3B0" strokeWidth="1" strokeDasharray="2 8" />
          </motion.svg>

          {/* Glowing Center Core */}
          <motion.div 
            className="absolute inset-1/4 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-full blur-[30px] z-0"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <svg className="absolute w-[280px] h-[280px] md:w-[300px] md:h-[300px] -rotate-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] z-10">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFDF73" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#AA7C11" />
              </linearGradient>
              <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(212,175,55,0.03)" />
                <stop offset="100%" stopColor="rgba(212,175,55,0.12)" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background Track with thickness */}
            <circle 
              cx="50%" 
              cy="50%" 
              r={radius} 
              fill="transparent" 
              stroke="url(#trackGradient)" 
              strokeWidth="16" 
            />
            {/* Inner track border */}
            <circle cx="50%" cy="50%" r={radius - 8} fill="transparent" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
            {/* Outer track border */}
            <circle cx="50%" cy="50%" r={radius + 8} fill="transparent" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />

            {/* Progress Indicator */}
            <motion.circle 
              cx="50%" 
              cy="50%" 
              r={radius} 
              fill="transparent" 
              stroke="url(#goldGradient)" 
              strokeWidth="16" 
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          
          {/* Number / Infinity Display */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProgress}
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.8 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                className={`font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3B0] via-[#D4AF37] to-[#AA7C11] drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] ${isInfinity ? 'text-[7rem] md:text-[8rem] mt-6' : 'text-7xl md:text-8xl tracking-tighter'}`}
              >
                {currentProgress}{!isInfinity && <span className="text-4xl md:text-5xl text-[#D4AF37]/80 ml-1 tracking-normal font-medium">%</span>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFinalMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center z-20 flex flex-col items-center"
          >
            <p className="font-playfair text-2xl md:text-3xl text-white/90 leading-relaxed max-w-xl mx-auto mb-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              &quot;Some things can&apos;t be measured...<br/>
              <span className="text-[#D4AF37]">My love for you is one of them.</span>&quot;
            </p>

            <CinematicButton onClick={() => setCurrentScreen(12)}>
              Continue ✨
            </CinematicButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
