"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import GoldenParticles from "./pre_event/GoldenParticles";
import { TEST_MODE } from "@/config";

interface MidnightBirthdayScreenProps {
  targetDate: Date; // The time of the full unlock (1:00 PM)
  onPlayUnlock?: () => void;
}

export default function MidnightBirthdayScreen({ targetDate, onPlayUnlock }: MidnightBirthdayScreenProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Countdown logic targeting 1:00 PM
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Confetti every 20 seconds
  useEffect(() => {
    const fireConfetti = () => {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#D4AF37", "#FFF3B0", "#FFFFFF"]
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#D4AF37", "#FFF3B0", "#FFFFFF"]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    };

    // Initial blast
    const initTimer = setTimeout(fireConfetti, 1500);
    
    // Repeat every 20 seconds
    const interval = setInterval(fireConfetti, 20000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, []);

  // Web Audio / HTML5 audio fallback trigger
  useEffect(() => {
    const playAudio = () => {
      const audio = document.getElementById("midnight-audio") as HTMLAudioElement;
      if (audio) {
        audio.play()
          .then(() => setIsAudioPlaying(true))
          .catch(() => {});
      }
    };
    window.addEventListener("click", playAudio);
    window.addEventListener("touchstart", playAudio);
    return () => {
      window.removeEventListener("click", playAudio);
      window.removeEventListener("touchstart", playAudio);
    };
  }, []);

  const typewriterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 3.2 + i * 0.25, // Stagger text to load after photo fades in
        duration: 0.8,
        ease: "easeOut" as const
      },
    }),
  };

  const messageLines = [
    "Happy Birthday, Anushka. ❤️",
    "Today is finally here.",
    "I hope this new year of your life brings endless happiness, success, peace, beautiful memories, and countless reasons to smile.",
    "May every dream you have come true.",
    "Thank you for being such a wonderful part of my life.",
    "This is only the beginning...",
    "Your biggest birthday surprise is still waiting for you."
  ];

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center py-12 px-4 md:px-8 relative font-poppins bg-[#020202] text-white overflow-y-auto select-none">
      
      {/* Background Ambience Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Moon glow simulation */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[40vh] bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.09)_0%,transparent_75%)] blur-3xl" />
        
        <GoldenParticles />
        
        {/* Soft Fireflies */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`firefly-${i}`}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
            animate={{
              y: ["0vh", "-100vh"],
              x: [0, Math.sin(i) * 40, 0],
              opacity: [0, 0.8, 0],
              scale: [0, Math.random() * 1.5 + 0.5, 0]
            }}
            transition={{
              duration: 12 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "-10px",
            }}
          />
        ))}

        {/* Soft Heart Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-sm select-none opacity-[0.06] pointer-events-none"
            animate={{
              y: ["0vh", "-100vh"],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0, 0.4, 0],
              scale: [0.6, 1.2, 0.6]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "-20px",
            }}
          >
            ❤️
          </motion.div>
        ))}

        {/* Slowly Drifting Gold Confetti */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            className="absolute w-1.5 h-1.5 bg-[#D4AF37]/20 rounded-sm pointer-events-none"
            animate={{
              y: ["-10vh", "110vh"],
              rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
              x: [0, Math.sin(i) * 60, 0]
            }}
            transition={{
              duration: 18 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}

        {/* Floating Balloons Silhouettes */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`balloon-${i}`}
            className="absolute text-4xl opacity-[0.04]"
            animate={{
              y: ["100vh", "-20vh"],
              rotate: [-8, 8, -8],
              x: [0, 25, -25, 0]
            }}
            transition={{
              duration: 18 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "linear"
            }}
            style={{ left: `${8 + Math.random() * 84}%` }}
          >
            🎈
          </motion.div>
        ))}
      </div>

      {/* Main Glassmorphism container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
        className="relative z-10 bg-gradient-to-b from-[#111111]/85 to-[#070707]/90 backdrop-blur-2xl w-[min(92vw,720px)] p-6 md:p-12 rounded-[32px] border shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col items-center text-center gap-6"
      >
        {/* Decorative inner gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFF3B0]/5 to-transparent rounded-[32px] pointer-events-none" />
        
        {/* Header Text Above Image */}
        <motion.div 
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2.5 relative z-10"
        >
          <div className="text-4xl md:text-5xl select-none mb-1">🎂</div>
          <h1 className="text-3xl md:text-5xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] leading-[1.25] flex flex-col items-center gap-1.5 relative z-10 text-center tracking-wide">
            <span>Happy Birthday</span>
            <span className="font-semibold text-white drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)]">Anushka ❤️</span>
          </h1>
        </motion.div>

        {/* Centers Photo Box Memory centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
          className="relative my-4 group z-10"
        >
          {/* Glowing background ring */}
          <div className="absolute inset-0 bg-[#D4AF37]/15 blur-3xl rounded-[28px] scale-110 pointer-events-none opacity-80" />
          
          {/* Dynamic rays simulation behind card */}
          <div className="absolute -inset-8 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)] pointer-events-none animate-pulse duration-[8000ms]" />

          {/* Floats and wiggles dynamically */}
          <motion.div
            animate={{
              y: [-4, 4, -4],
              scale: [1, 1.015, 1]
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ 
              border: "1px solid rgba(212, 175, 55, 0.4)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 175, 55, 0.25)"
            }}
            className="relative overflow-hidden rounded-[28px] w-[82vw] md:w-[390px] h-auto flex flex-col bg-[#050505]"
          >
            {/* Main photograph */}
            <img 
              src="/anushka.png" 
              alt="Anushka ❤️"
              className="w-full h-auto object-cover rounded-[28px] transition-all duration-700 brightness-[1.03] contrast-[1.02] saturate-[1.02] scale-100 group-hover:scale-[1.01]"
              style={{ display: "block" }}
            />

            {/* Specular glass reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none z-10" />

            {/* Slow golden sweep glare */}
            <motion.div
              initial={{ x: "-150%" }}
              animate={{ x: "150%" }}
              transition={{
                delay: 2.2,
                duration: 2.0,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 6
              }}
              className="absolute inset-y-0 w-[60%] bg-gradient-to-r from-transparent via-[#FFF3B0]/15 to-transparent skew-x-12 pointer-events-none z-20"
            />
          </motion.div>
        </motion.div>

        {/* Message Lines Below Image */}
        <div className="flex flex-col gap-3 text-white/80 font-poppins font-light text-sm md:text-base leading-[1.85] max-w-[580px] justify-center items-center text-center mt-4 relative z-10 px-2 select-text">
          {messageLines.map((line, idx) => (
            <motion.p
              key={idx}
              custom={idx}
              variants={typewriterVariants}
              initial="hidden"
              animate="visible"
              className={
                idx === 0 
                  ? "text-xl text-[#FFF3B0] font-semibold my-1 tracking-wide font-playfair" 
                  : idx === 5 
                  ? "text-sm text-[#D4AF37]/90 font-medium tracking-wide mt-2" 
                  : ""
              }
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Divider line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent my-4 z-10" />

        {/* Countdown Section */}
        <div className="flex flex-col items-center gap-5 w-full bg-black/35 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md max-w-md shadow-xl z-10 relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
          <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-[#FFF3B0] uppercase flex items-center gap-2 select-none">
            <span>🎁</span> Birthday Celebration Unlocks In
          </p>

          {TEST_MODE ? (
            <div className="bg-red-950/20 border border-red-500/35 rounded-2xl px-8 py-3.5 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.1)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold font-mono text-red-400 tracking-[0.2em] uppercase">
                TEST MODULE ACTIVE
              </span>
            </div>
          ) : (
            <div className="flex gap-4 md:gap-6 justify-center">
              {[
                { label: "Hours", value: timeLeft?.hours ?? 0 },
                { label: "Minutes", value: timeLeft?.minutes ?? 0 },
                { label: "Seconds", value: timeLeft?.seconds ?? 0 }
              ].map((block, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                    className="bg-black/60 border w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.05)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                    <span className="text-2xl md:text-3xl font-light font-playfair text-[#FFF3B0] select-none">
                      {block.value.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[9px] md:text-[10px] text-white/40 mt-3 font-medium uppercase tracking-[0.2em]">{block.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons / Actions */}
        <div className="mt-4 flex flex-col items-center gap-6 w-full relative z-10">
          <AnimatePresence mode="wait">
            {TEST_MODE ? (
              <motion.button
                key="btn-test"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPlayUnlock && onPlayUnlock()}
                className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer text-xs tracking-widest uppercase flex items-center gap-2"
              >
                <span className="text-lg animate-spin duration-[4000ms]">🎉</span> Play Unlock Ceremony
              </motion.button>
            ) : !showMessage ? (
              <motion.button
                key="btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(212,175,55,0.35)", borderColor: "rgba(212,175,55,0.5)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowMessage(true)}
                style={{ borderColor: "rgba(255, 255, 255, 0.12)" }}
                className="px-10 py-3.5 bg-transparent border text-white font-semibold rounded-full shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all cursor-pointer text-xs tracking-widest uppercase"
              >
                ✨ I'll Be Back at 1:00 PM
              </motion.button>
            ) : (
              <motion.div
                key="msg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-center backdrop-blur-md shadow-lg max-w-[400px]"
              >
                <p className="text-white/80 text-sm font-light leading-[1.85]">
                  See you at <span className="text-[#D4AF37] font-semibold">1:00 PM</span>. Your surprise will be waiting for you. 🎁
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Quote */}
        <p className="text-[#D4AF37]/90 text-xs tracking-widest italic font-light mt-6 relative z-10 select-none">
          "Every second brings us closer to something unforgettable." ❤️
        </p>
      </motion.div>
      
      {/* Floating sound toggle controls in bottom-left */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5">
        <div className="w-10 h-10 bg-black/60 border border-white/10 hover:border-[#D4AF37]/50 rounded-full flex items-center justify-center text-white/70 transition-all shadow-lg backdrop-blur-md">
          {isAudioPlaying ? "🔊" : "🔇"}
        </div>
      </div>

      {/* Background loop audio element */}
      <audio id="midnight-audio" loop src="/assets/audio/midnight_piano.mp3" style={{ display: "none" }} />
    </div>
  );
}
