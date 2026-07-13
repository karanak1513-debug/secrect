"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import GoldenParticles from "./GoldenParticles";
import { sfx } from "@/utils/sfx";

interface GrandFinaleSequenceProps {
  onComplete: () => void;
}

export default function GrandFinaleSequence({ onComplete }: GrandFinaleSequenceProps) {
  const [screen, setScreen] = useState(1);
  const [stars, setStars] = useState([false, false, false, false, false]);
  const [progress, setProgress] = useState(0);
  const [portalProgress, setPortalProgress] = useState(0);
  const [giftState, setGiftState] = useState<"idle" | "shaking" | "locked">("idle");
  const [giftAttempts, setGiftAttempts] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Spotlight Cursor Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 28, stiffness: 180, mass: 0.6 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);
  const spotlightBg = useMotionTemplate`radial-gradient(circle 500px at ${spotlightX}px ${spotlightY}px, rgba(212, 175, 55, 0.09) 0%, transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const advanceToNextScreen = () => {
    sfx.playTransition();
    setScreen((s) => s + 1);
  };

  // Sound Synth Helpers
  const playSparkleSound = (idx: number) => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25 * (1 + idx * 0.15), now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  };

  const playTickSound = () => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  };

  const playLockErrorSound = () => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.linearRampToValueAtTime(80, now + 0.3);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(118, now);
      osc2.frequency.linearRampToValueAtTime(78, now + 0.3);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch {}
  };

  // Screen 1: Victory Ceremony timelines
  useEffect(() => {
    if (screen !== 1) return;
    sfx.playSuccess();

    // Progress Bar loader
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    // Stars sequencing
    const starTimers = [1200, 2000, 2800, 3600, 4400].map((delay, index) =>
      setTimeout(() => {
        setStars((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
        playSparkleSound(index);
      }, delay)
    );

    // Auto-advance
    const autoAdvance = setTimeout(() => {
      advanceToNextScreen();
    }, 12000);

    return () => {
      clearInterval(progressInterval);
      starTimers.forEach(clearTimeout);
      clearTimeout(autoAdvance);
    };
  }, [screen]);

  // Screen 2: Birthday Crystal timelines
  useEffect(() => {
    if (screen !== 2) return;

    // Auto-advance
    const autoAdvance = setTimeout(() => {
      advanceToNextScreen();
    }, 10000);

    return () => clearTimeout(autoAdvance);
  }, [screen]);

  // Screen 3: Portal Charging timelines
  useEffect(() => {
    if (screen !== 3) return;

    const chargeInterval = setInterval(() => {
      setPortalProgress((prev) => {
        if (prev >= 100) {
          clearInterval(chargeInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 70);

    // Auto-advance
    const autoAdvance = setTimeout(() => {
      advanceToNextScreen();
    }, 12000);

    return () => {
      clearInterval(chargeInterval);
      clearTimeout(autoAdvance);
    };
  }, [screen]);

  // Screen 5: Destiny Clock Ticking sound
  useEffect(() => {
    if (screen !== 5) return;

    const tickInterval = setInterval(() => {
      playTickSound();
    }, 1000);

    const autoAdvance = setTimeout(() => {
      advanceToNextScreen();
    }, 10000);

    return () => {
      clearInterval(tickInterval);
      clearTimeout(autoAdvance);
    };
  }, [screen]);



  const handleGiftClick = () => {
    if (giftState === "shaking") return;
    playLockErrorSound();
    setGiftState("shaking");
    setGiftAttempts((a) => a + 1);
    setTimeout(() => {
      setGiftState("locked");
    }, 1000);
  };

  // Camera zoom motions
  const screenZoomVariants = {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { opacity: 0, scale: 1.04, filter: "blur(10px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[99999] bg-[#020202] text-white flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto select-none font-poppins"
    >
      {/* Background ambient lighting */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[0]"
        style={{ background: spotlightBg }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_75%)] pointer-events-none z-[0]" />
      <GoldenParticles count={50} />

      {/* Screen container */}
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center my-auto px-4">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: VICTORY CEREMONY */}
          {screen === 1 && (
            <motion.div
              key="ceremony"
              variants={screenZoomVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center w-full"
            >
              {/* Rotating Trophy Icon */}
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mb-6 text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M12 2a7.7 7.7 0 0 1 7.54 8H4.46A7.7 7.7 0 0 1 12 2z" />
                </svg>
              </motion.div>

              <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-2 font-bold select-none">
                ✦ Victory Ceremony ✦
              </span>
              <h1 className="text-3xl md:text-5xl font-playfair bg-gradient-to-b from-white via-[#FFF3B0] to-[#D4AF37] bg-clip-text text-transparent mb-4 tracking-wide font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                FINAL MISSION COMPLETED
              </h1>
              
              <p className="text-white/60 text-sm md:text-base font-light mb-8 max-w-md leading-relaxed select-none">
                Congratulations! You completed all 10 missions successfully.
              </p>

              {/* Progress Sweep */}
              <div className="w-full max-w-sm bg-white/[0.04] border border-white/[0.08] h-3.5 rounded-full overflow-hidden mb-8 p-[2px] relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#AA7C11]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold font-mono tracking-wider text-[#FFF3B0] drop-shadow-[0_1px_2px_black]">
                  {progress}% ACHIEVED
                </span>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-3 mb-10">
                {stars.map((active, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={active ? { scale: 1, opacity: 1, rotate: [0, 15, -15, 0] } : {}}
                    transition={{
                      scale: { type: "spring", stiffness: 150, damping: 10 },
                      opacity: { duration: 0.3 },
                      rotate: { type: "keyframes", duration: 0.5, ease: "easeInOut" }
                    }}
                    className="text-3xl select-none"
                  >
                    {active ? "★" : "☆"}
                  </motion.span>
                ))}
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.25)", borderColor: "rgba(212,175,55,0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={advanceToNextScreen}
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
                className="px-8 py-3 bg-transparent border text-white font-medium rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                Activate Crystal →
              </motion.button>
            </motion.div>
          )}

          {/* SCREEN 2: BIRTHDAY CRYSTAL */}
          {screen === 2 && (
            <motion.div
              key="crystal"
              variants={screenZoomVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center w-full"
            >
              {/* Rotating Diamond Crystal */}
              <motion.div
                animate={{ 
                  y: [-6, 6, -6],
                  rotateY: [0, 180, 360]
                }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: 8, repeat: Infinity, ease: "linear" }
                }}
                className="w-28 h-28 mb-8 text-[#FFF3B0] relative flex items-center justify-center pointer-events-none"
              >
                {/* Outer Crystal Halo */}
                <div className="absolute inset-0 bg-[#D4AF37]/10 blur-xl rounded-full scale-125" />
                
                {/* Crystal SVG */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]">
                  <path d="M12 2L2 9l10 13 10-13-10-13z" />
                  <path d="M12 2v20" />
                  <path d="M2 9h20" />
                  <path d="M12 2L6.5 9l5.5 13" />
                  <path d="M12 2l5.5 9-5.5 13" />
                </svg>
              </motion.div>

              <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-2 font-bold select-none">
                ✦ Surprise Matrix ✦
              </span>
              <h1 className="text-3xl md:text-5xl font-playfair bg-gradient-to-b from-white via-[#FFF3B0] to-[#D4AF37] bg-clip-text text-transparent mb-4 tracking-wide font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Birthday Crystal
              </h1>
              
              <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-6 w-full max-w-sm mb-8 shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Status</span>
                  <span className="text-green-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)] animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    FULLY CHARGED
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Energy Level</span>
                  <span className="text-[#FFF3B0] font-mono font-bold text-sm tracking-wider">
                    100% CAP
                  </span>
                </div>
              </div>

              <p className="text-xs text-white/40 italic mb-10 max-w-xs font-light leading-relaxed">
                "The crystal is ready... Only time can activate it."
              </p>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.25)", borderColor: "rgba(212,175,55,0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={advanceToNextScreen}
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
                className="px-8 py-3 bg-transparent border text-white font-medium rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                Ignite Portal →
              </motion.button>
            </motion.div>
          )}

          {/* SCREEN 3: CELEBRATION PORTAL */}
          {screen === 3 && (
            <motion.div
              key="portal"
              variants={screenZoomVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center w-full"
            >
              {/* Rotating Portal rings */}
              <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
                {/* Glowing portal background */}
                <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)] blur-md scale-125" />

                {/* Ring 1 - CW */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/35"
                />

                {/* Ring 2 - CCW */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[8px] rounded-full border border-[#D4AF37]/20 border-t-transparent border-b-transparent"
                />

                {/* Portal Core */}
                <div className="absolute inset-[24px] rounded-full bg-black border border-white/[0.08] shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center">
                  <span className="text-3xl drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">🌌</span>
                </div>
              </div>

              <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-2 font-bold select-none">
                ✦ Space-Time Conduit ✦
              </span>
              <h1 className="text-3xl md:text-5xl font-playfair bg-gradient-to-b from-white via-[#FFF3B0] to-[#D4AF37] bg-clip-text text-transparent mb-4 tracking-wide font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Celebration Portal
              </h1>
              
              <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-6 w-full max-w-sm mb-8 shadow-[0_15px_30px_rgba(0,0,0,0.6)] font-light">
                {portalProgress < 100 ? (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-2">Syncing Conduit...</span>
                    <span className="text-2xl font-mono text-[#FFF3B0] font-medium tracking-widest">{portalProgress}%</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-[#FFF3B0] uppercase tracking-widest font-bold mb-1">CONDUIT SYNCED</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-3">CONDUIT STATUS: CLOSED</span>
                    <div className="px-5 py-2.5 bg-black/50 border border-[#D4AF37]/35 rounded-full flex flex-col items-center">
                      <span className="text-[9px] text-[#FFF3B0] font-medium tracking-[0.25em] uppercase">Waiting For</span>
                      <span className="text-sm font-semibold font-playfair text-white mt-1">13 July • 3:00 PM</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button (only reveals when done syncing portal) */}
              <motion.div animate={portalProgress >= 100 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}>
                <button
                  disabled={portalProgress < 100}
                  onClick={advanceToNextScreen}
                  style={{ borderColor: "rgba(255,255,255,0.15)" }}
                  className="px-8 py-3 bg-transparent border text-white font-medium rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  Inspect Surprise →
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* SCREEN 4: GIANT BIRTHDAY GIFT */}
          {screen === 4 && (
            <motion.div
              key="gift"
              variants={screenZoomVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center w-full"
            >
              {/* Giant Shakey Gift Box */}
              <motion.div
                onClick={handleGiftClick}
                animate={
                  giftState === "shaking"
                    ? {
                        x: [-4, 4, -4, 4, -2, 2, 0],
                        rotate: [-2, 2, -2, 2, -1, 1, 0]
                      }
                    : {
                        y: [-4, 4, -4],
                        scale: [1, 1.02, 1]
                      }
                }
                transition={
                  giftState === "shaking"
                    ? { duration: 0.6, ease: "easeInOut" }
                    : { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }
                className="w-32 h-32 mb-8 text-[#D4AF37] relative flex items-center justify-center cursor-pointer group select-none"
              >
                {/* Gift halo */}
                <div className="absolute inset-0 bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/15 blur-xl rounded-full scale-125 transition-colors duration-500 pointer-events-none" />

                {/* Gift Box SVG */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] pointer-events-none">
                  <path d="M20 12v10H4V12" />
                  <path d="M2 7h20v5H2z" />
                  <path d="M12 22V7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              </motion.div>

              <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-2 font-bold select-none">
                ✦ Locked Treasure ✦
              </span>
              <h1 className="text-3xl md:text-5xl font-playfair bg-gradient-to-b from-white via-[#FFF3B0] to-[#D4AF37] bg-clip-text text-transparent mb-4 tracking-wide font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Your Birthday Surprise
              </h1>
              
              <p className="text-white/60 text-sm md:text-base font-light mb-8 max-w-xs leading-relaxed select-none">
                is waiting inside... Click the gift box to unlock it.
              </p>

              <AnimatePresence mode="wait">
                {giftState === "locked" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-950/40 border border-red-500/20 backdrop-blur-md rounded-2xl p-5 w-full max-w-sm mb-10 flex flex-col items-center"
                  >
                    <span className="text-red-400 font-bold text-xs uppercase tracking-[0.25em] flex items-center gap-1.5 mb-1.5 drop-shadow-[0_0_6px_#ef4444]">
                      🔒 GIFT MODULE LOCKED
                    </span>
                    <span className="text-[10px] text-white/50 font-light text-center leading-relaxed">
                      "This gift can only be opened at the perfect moment."
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button (Reveals once they try to open) */}
              <motion.div animate={giftAttempts > 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}>
                <button
                  onClick={advanceToNextScreen}
                  style={{ borderColor: "rgba(255,255,255,0.15)" }}
                  className="px-8 py-3 bg-transparent border text-white font-medium rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Consult Destiny →
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* SCREEN 5: DESTINY CLOCK */}
          {screen === 5 && (
            <motion.div
              key="clock"
              variants={screenZoomVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center w-full"
            >
              {/* Grand Antique Clock face with Pendulum and Cogs */}
              <div className="relative w-40 h-40 mb-8 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/[0.08] rounded-full bg-black/90">
                {/* Clock layout backing */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_75%)] pointer-events-none" />

                {/* Clock Ticks markings */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-2 bg-white/20"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-68px)`
                    }}
                  />
                ))}

                {/* Rotating cog gear 1 (visible mechanism) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute top-10 left-10 w-12 h-12 text-[#D4AF37]/20 border border-dashed border-[#D4AF37]/20 rounded-full flex items-center justify-center"
                >
                  <span className="text-[8px] font-mono">⚙️</span>
                </motion.div>

                {/* Rotating cog gear 2 */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-10 right-10 w-16 h-16 text-[#D4AF37]/15 border border-dashed border-[#D4AF37]/15 rounded-full flex items-center justify-center"
                >
                  <span className="text-[10px] font-mono">⚙️</span>
                </motion.div>

                {/* Pendulum (Swinging underneath/inside clock visuals) */}
                <motion.div
                  animate={{ rotate: [-20, 20, -20] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ originX: 0.5, originY: 0 }}
                  className="absolute bottom-[-16px] left-[calc(50%-1px)] w-[2px] h-20 bg-gradient-to-b from-[#D4AF37] to-transparent z-[-1] flex flex-col items-center justify-end"
                >
                  {/* Pendulum Weight */}
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37] border border-[#FFF3B0] shadow-[0_0_10px_#D4AF37] translate-y-2" />
                </motion.div>

                {/* Clock hands */}
                {/* Hour Hand */}
                <motion.div
                  animate={{ rotate: 180 }}
                  className="absolute top-1/2 left-1/2 w-1 h-10 bg-white/90"
                  style={{ originX: 0.5, originY: 1, translate: "-50% -100%" }}
                />

                {/* Minute Hand */}
                <motion.div
                  animate={{ rotate: 90 }}
                  className="absolute top-1/2 left-1/2 w-[2px] h-14 bg-[#D4AF37]"
                  style={{ originX: 0.5, originY: 1, translate: "-50% -100%" }}
                />

                {/* Second Hand */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 w-[1px] h-16 bg-red-500/70"
                  style={{ originX: 0.5, originY: 1, translate: "-50% -100%" }}
                />

                {/* Clock Center pin */}
                <div className="absolute w-2 h-2 rounded-full bg-[#FFF3B0] border border-[#D4AF37] z-20" />
              </div>

              <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-2 font-bold select-none">
                ✦ Destiny Indicator ✦
              </span>
              <h1 className="text-3xl md:text-5xl font-playfair bg-gradient-to-b from-white via-[#FFF3B0] to-[#D4AF37] bg-clip-text text-transparent mb-4 tracking-wide font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Time Decides Everything
              </h1>
              
              <p className="text-white/60 text-sm md:text-base font-light mb-10 max-w-sm leading-relaxed select-none">
                The celebration begins when destiny reaches its moment.
              </p>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.25)", borderColor: "rgba(212,175,55,0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={advanceToNextScreen}
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
                className="px-8 py-3 bg-transparent border text-white font-medium rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer animate-pulse"
              >
                Continue →
              </motion.button>
            </motion.div>
          )}

          {/* SCREEN 6: FINAL EMOTIONAL MESSAGE */}
          {screen === 6 && (
            <motion.div
              key="message"
              variants={screenZoomVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center w-full max-w-lg"
            >
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-2 font-bold select-none">
                ✦ Destiny Awaits ✦
              </span>
              <h1 className="text-3xl md:text-5xl font-playfair bg-gradient-to-b from-white via-[#FFF3B0] to-[#D4AF37] bg-clip-text text-transparent mb-6 tracking-wide font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                A Message of Destiny
              </h1>
              
              <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-6 md:p-8 w-full mb-8 shadow-[0_15px_30px_rgba(0,0,0,0.6)] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                <p className="text-white/80 text-sm md:text-base font-light leading-relaxed mb-6 select-none font-poppins">
                  "Dear Anushka,<br/><br/>
                  Every puzzle you solved, every step you took in this journey, is a reflection of the wonderful, patient, and magical person you are.<br/><br/>
                  I created these challenges to celebrate the countdown to your special day, to show you that the best surprises are those we build anticipation for.<br/><br/>
                  Now, the threshold is open, and time is ticking closer to the magic moment."
                </p>
                <p className="text-[#FFF3B0] text-xs font-medium tracking-wider uppercase">
                  Are you ready for what comes next?
                </p>
              </div>

              {/* Premium Birthday Timeline Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.45)", borderColor: "rgba(212,175,55,0.8)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] border-0 text-black font-semibold rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                ✨ Enter Birthday Timeline →
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Floating sound toggle controls in bottom-left */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 bg-black/60 border border-white/10 hover:border-[#D4AF37]/50 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}
