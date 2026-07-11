"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_DATE = new Date("2026-07-13T13:00:00");

export default function Day2_CompletionCountdown({ onUnlock }: { onUnlock: () => void }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimeLocked, setIsTimeLocked] = useState(true);
  const [showNotYet, setShowNotYet] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const wasLockedRef = useRef(true);

  // Play a premium Web Audio success chime
  const playUnlockSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      playNote(523.25, now, 0.2); // C5
      playNote(659.25, now + 0.1, 0.2); // E5
      playNote(783.99, now + 0.2, 0.2); // G5
      playNote(1046.50, now + 0.3, 0.5); // C6
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +TARGET_DATE - +new Date();
      const currentLock = difference > 0;
      setIsTimeLocked(currentLock);

      if (currentLock) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        
        // Handle transitioning into unlocked state automatically if we cross threshold
        if (wasLockedRef.current) {
          wasLockedRef.current = false;
          setJustUnlocked(true);
          playUnlockSound();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEnterClick = () => {
    if (isTimeLocked) {
      setShowNotYet(true);
      setTimeout(() => setShowNotYet(false), 3000);
    } else {
      onUnlock();
    }
  };

  return (
    <div className="text-center z-10 flex flex-col items-center max-w-2xl mx-auto px-6 relative">
      {/* Background Glow */}
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Confetti Explosion (when unlocked) */}
      {(justUnlocked || !isTimeLocked) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-4 bg-[#D4AF37] rounded-sm"
              initial={{ top: "-10%", left: `${Math.random() * 100}%`, rotate: 0 }}
              animate={{ 
                top: "110%", 
                left: `${Math.random() * 100}%`,
                rotate: 360,
                opacity: [1, 1, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundColor: i % 2 === 0 ? "#D4AF37" : "#FFF3B0" }}
            />
          ))}
        </div>
      )}

      {/* Simulated Fireworks (when unlocked) */}
      {(justUnlocked || !isTimeLocked) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`fw-${i}`}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{ scale: 0, opacity: 1, left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 40}%` }}
              animate={{
                scale: [0, 15, 0],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
              style={{
                boxShadow: "0 0 20px 4px #D4AF37, 0 0 40px 8px #FFF3B0",
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isTimeLocked ? (
          /* UNLOCKED STATE */
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl"
            >
              🎂
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              Happy Birthday!
            </h1>
            <p className="text-white/80 font-light text-lg tracking-wide max-w-md">
              The celebration is now officially open.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUnlock}
              className="mt-6 px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold rounded-full shadow-[0_0_30px_rgba(212,175,55,0.6)] text-lg"
            >
              Enter Family Mode →
            </motion.button>
          </motion.div>
        ) : (
          /* LOCKED COUNTDOWN STATE */
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-5xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-2">
              🎉 Congratulations!
            </h1>
            <p className="text-white/60 text-sm md:text-base font-light mb-8">
              "You've completed every mission successfully."
            </p>

            {/* Premium Reward Card */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.02] border border-[#D4AF37]/30 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(212,175,55,0.15)] mb-10 w-full max-w-md flex flex-col items-center gap-3"
            >
              <span className="text-[#D4AF37] font-semibold text-lg md:text-xl flex items-center gap-2">
                🏆 Family Password Unlocked
              </span>
              <span className="text-3xl md:text-4xl font-mono text-white tracking-[0.3em] font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] my-2">
                HAPPY
              </span>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed font-light">
                You've unlocked the Birthday Celebration.<br />
                Now all that's left is to wait for the special moment.
              </p>
            </motion.div>

            {/* Countdown Clock */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-md w-full mb-10">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div
                  key={unit.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center backdrop-blur-lg"
                >
                  <span className="text-xl md:text-3xl font-mono font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 mt-1">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-sm italic font-light mb-1">
              "Every second brings you closer to something unforgettable."
            </p>
            <p className="text-white/40 text-xs font-light mb-8">
              See you on 13 July at exactly 1:00 PM.
            </p>

            <button
              onClick={handleEnterClick}
              className="px-8 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white/80 font-medium rounded-full hover:bg-white/10 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
              Enter Family Mode →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lock Popup Alert */}
      <AnimatePresence>
        {showNotYet && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-4 bg-[#0a0a0a]/95 border border-[#D4AF37]/50 rounded-2xl p-4 shadow-[0_0_40px_rgba(212,175,55,0.3)] max-w-sm w-full z-50 backdrop-blur-lg"
          >
            <span className="text-xl block mb-1">🔒 Not Yet...</span>
            <span className="text-xs text-white/70 font-light leading-relaxed">
              The birthday celebration officially begins on<br />
              <span className="text-[#D4AF37] font-semibold">13 July at 1:00 PM</span>.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
