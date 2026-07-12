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
          colors: ['#D4AF37', '#FFF3B0', '#FFFFFF']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#D4AF37', '#FFF3B0', '#FFFFFF']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    };

    // Initial blast
    setTimeout(fireConfetti, 1000);
    
    // Repeat every 20 seconds
    const interval = setInterval(fireConfetti, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const playAudio = () => {
      const audio = document.getElementById("midnight-audio") as HTMLAudioElement;
      if (audio) {
        audio.play().catch(() => {});
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
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  const messageLines = [
    "Finally... your special day is here. 🥳",
    "I couldn't let this moment pass without wishing you first.",
    "Happy Birthday! ❤️",
    "May this new year of your life bring you endless happiness, beautiful memories, good health, success, and lots of reasons to smile.",
    "I've prepared something very special for you...",
    "But every great surprise deserves the perfect moment.",
    "Just wait a little longer...",
    "The celebration will begin at 1:00 PM. ✨"
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 relative font-poppins">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#030303] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08)_0%,transparent_50%)]" />
        <GoldenParticles />
        
        {/* Soft Fireflies */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
            animate={{
              y: ["0vh", "-100vh"],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0, 0.8, 0],
              scale: [0, Math.random() * 1.5 + 0.5, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
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

        {/* Floating Balloons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`balloon-${i}`}
            className="absolute text-4xl opacity-10"
            animate={{
              y: ["100vh", "-20vh"],
              rotate: [-10, 10, -10],
              x: [0, 30, -30, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{ left: `${10 + Math.random() * 80}%` }}
          >
            🎈
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 glass-card w-[min(90vw,800px)] max-w-[800px] p-8 md:p-12 rounded-[32px] border border-[#D4AF37]/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] flex flex-col items-center text-center gap-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFF3B0]/5 to-transparent rounded-[32px] pointer-events-none" />
        
        {/* Header */}
        <motion.div 
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3 relative z-10"
        >
          <div className="absolute -inset-8 bg-[#D4AF37]/10 blur-2xl rounded-full" />
          <div className="text-5xl md:text-6xl mb-2 relative z-10">🎂</div>
          <h1 className="text-3xl md:text-5xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] leading-[1.3] flex flex-col items-center gap-1 relative z-10">
            <span>Happy Birthday,</span>
            <span>Anushka! ❤️</span>
          </h1>
        </motion.div>

        {/* Message */}
        <div className="flex flex-col gap-4 text-white/80 font-poppins font-light text-sm md:text-base leading-[1.8] max-w-[650px] justify-center items-center text-center mt-6 relative z-10">
          {messageLines.map((line, idx) => (
            <motion.p
              key={idx}
              custom={idx * 15} // staggered delay
              variants={typewriterVariants}
              initial="hidden"
              animate="visible"
              className={idx === 2 ? "text-xl text-[#D4AF37] font-semibold my-2 tracking-wide font-playfair" : ""}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent my-6" />

        {/* Unlock Info & Countdown */}
        <div className="flex flex-col items-center gap-6 w-full bg-black/20 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          <p className="text-sm font-medium tracking-widest text-white/70 uppercase flex items-center gap-2">
            <span className="text-[#D4AF37]">🎁</span> Birthday Celebration Unlocks At 1:00 PM
          </p>

          {TEST_MODE ? (
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl px-8 py-4 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,0,0.2)]">
              <span className="text-xl md:text-3xl font-bold font-mono text-red-400 tracking-[0.2em] uppercase">
                TEST MODE
              </span>
            </div>
          ) : (
            <div className="flex gap-4 md:gap-8 justify-center">
              {[
                { label: 'Hours', value: timeLeft?.hours ?? 0 },
                { label: 'Minutes', value: timeLeft?.minutes ?? 0 },
                { label: 'Seconds', value: timeLeft?.seconds ?? 0 }
              ].map((block, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-black/50 border border-[#D4AF37]/20 w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                    <span className="text-2xl md:text-4xl font-light font-playfair text-[#FFF3B0]">
                      {block.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs text-white/40 mt-3 font-medium uppercase tracking-[0.2em]">{block.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Button Section */}
        <div className="mt-10 flex flex-col items-center gap-6 w-full relative">
          <AnimatePresence mode="wait">
            {TEST_MODE ? (
              <motion.button
                key="btn-test"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPlayUnlock && onPlayUnlock()}
                className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all cursor-pointer text-xs tracking-widest uppercase flex items-center gap-2"
              >
                <span className="text-lg">🎉</span> Play Unlock Ceremony
              </motion.button>
            ) : !showMessage ? (
              <motion.button
                key="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMessage(true)}
                className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all cursor-pointer text-xs tracking-widest uppercase"
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
                <p className="text-white/80 text-sm font-light leading-[1.8]">
                  See you at <span className="text-[#D4AF37] font-semibold">1:00 PM</span>. Your surprise will be waiting for you. 🎁
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[#D4AF37]/80 text-xs tracking-widest italic font-light mt-[50px] relative z-10">
          "The best surprise is worth waiting for. ❤️"
        </p>
      </motion.div>
      
      {/* Audio Element placeholder */}
      <audio id="midnight-audio" loop autoPlay src="/assets/audio/midnight_piano.mp3" style={{ display: 'none' }} />
    </div>
  );
}
