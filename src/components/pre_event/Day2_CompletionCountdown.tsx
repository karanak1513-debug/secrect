"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

import { TEST_MODE } from "@/config";

const TARGET_DATE = new Date("2026-07-13T13:00:00");

export default function Day2_CompletionCountdown({ onUnlock }: { onUnlock: () => void }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimeLocked, setIsTimeLocked] = useState(true);
  const [showNotYet, setShowNotYet] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const wasLockedRef = useRef(true);

  useEffect(() => {
    if (TEST_MODE) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setIsTimeLocked(false);
      return;
    }

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
        
        if (wasLockedRef.current) {
          wasLockedRef.current = false;
          setJustUnlocked(true);
          sfx.playUnlock();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEnterClick = () => {
    if (isTimeLocked && !TEST_MODE) {
      sfx.playError();
      setShowNotYet(true);
      setTimeout(() => setShowNotYet(false), 3000);
    } else {
      sfx.playUnlock();
      onUnlock();
    }
  };

  return (
    <div className="text-center z-10 flex flex-col items-center max-w-2xl mx-auto px-6 relative font-poppins">
      {/* Background Glow */}
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating hearts (when unlocked) */}
      {(justUnlocked || !isTimeLocked) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {["❤️","🩷","💛","🤍","❤️","💕","🩷","💛","🤍","💕"].map((h, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl"
              initial={{ bottom: "-10%", left: `${8 + i * 9}%`, opacity: 0 }}
              animate={{ bottom: "110%", opacity: [0, 0.8, 0.8, 0] }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut"
              }}
            >
              {h}
            </motion.span>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isTimeLocked ? (
          /* UNLOCKED STATE */
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 text-center max-w-sm w-full relative z-20"
          >
            {/* Pulsing heart */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], filter: ["drop-shadow(0 0 8px #D4AF37)", "drop-shadow(0 0 20px #D4AF37)", "drop-shadow(0 0 8px #D4AF37)"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl"
            >
              🔐
            </motion.div>

            {/* Main title - gentle float */}
            <motion.h1
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-3xl md:text-4xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] leading-tight"
            >
              Acha socha darling... 😏
            </motion.h1>

            {/* Staggered roast lines */}
            {[
              { text: "Itna mehnat kiya... itni missions complete kiya...", delay: 0.3 },
              { text: "aur password? Abhi bhi nahi milega 😇", delay: 0.6 },
            ].map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: line.delay, duration: 0.6, ease: "easeOut" }}
                className="text-white/65 font-light text-sm font-poppins leading-relaxed"
              >
                {line.text}
              </motion.p>
            ))}

            {/* Lock card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 140, damping: 16 }}
              className="w-full bg-black/50 border border-[#D4AF37]/20 rounded-2xl px-5 py-5 flex flex-col gap-3"
            >
              <span className="text-[#D4AF37] font-playfair text-sm flex items-center gap-2 justify-center">
                🔒 Private Mode — Locked, Jaan.
              </span>

              <p className="text-white/55 text-xs font-light leading-relaxed">
                Password tab milega jab birthday aaye — 13 July ko. Tab tak patience rakho darling, tum itni cute ho yeh wait worth it hai. 🥰
              </p>

              <motion.div
                animate={{ boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 12px rgba(212,175,55,0.3)", "0 0 0px rgba(212,175,55,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="mt-1 px-4 py-3 bg-black/60 rounded-xl border border-[#D4AF37]/20"
              >
                <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1 font-mono">Unlocks on</p>
                <span className="text-[#FFF3B0] font-mono text-sm tracking-widest font-bold">
                  13 JULY · 1:00 PM ❤️
                </span>
              </motion.div>
            </motion.div>

            {/* Cute sign-off */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-white/30 text-[11px] italic font-light"
            >
              — Tumhara Karan 🙈
            </motion.p>
          </motion.div>
        ) : (
          /* LOCKED COUNTDOWN STATE */
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-5xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-3 drop-shadow-[0_0_12px_rgba(212,175,55,0.3)] font-normal">
              🎉 Congratulations!
            </h1>
            <p className="text-white/60 text-sm md:text-base font-light mb-8">
              "You've successfully resolved every timelines mission."
            </p>

            {/* Premium Reward Card */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="glass-card p-6 md:p-10 border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] mb-10 w-full max-w-md flex flex-col items-center gap-3 relative overflow-hidden"
            >
              {/* Shimmer sweep animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFF3B0]/10 to-transparent pointer-events-none -translate-x-full animate-[shimmer_6s_infinite] duration-[3000ms]" />

              <span className="text-[#D4AF37] font-semibold text-lg md:text-xl flex items-center gap-2 font-playfair">
                🎁 Final Password Revealed
              </span>
              <span className="text-sm md:text-base font-mono text-white tracking-[0.08em] font-bold drop-shadow-[0_0_14px_rgba(255,255,255,0.5)] my-3 select-none text-center break-words max-w-full">
                Sabar Rakh Beta 😂
              </span>
              <span className="text-xs font-light text-white/50 italic text-center">
                Nhi Bataunga Password... Haha 🙈
              </span>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed font-light">
                The full authentication sequence is complete.<br />
                Now, we count down to the grand birthday launch.
              </p>
            </motion.div>

            {/* Countdown Clock with rotating digits */}
            <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md w-full mb-10">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div
                  key={unit.label}
                  className="bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-2xl relative shadow-md group hover:border-[#D4AF37]/45 transition-all duration-300"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={unit.value}
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      exit={{ rotateX: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl md:text-4xl font-mono font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                    >
                      {String(unit.value).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[9px] uppercase tracking-wider text-white/40 mt-1">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-xs tracking-wider italic font-light mb-1.5">
              "Every second brings you closer to something unforgettable."
            </p>
            <p className="text-white/40 text-[10px] tracking-wider font-mono uppercase mb-8">
              Vault active on 13 July at exactly 1:00 PM
            </p>

            <button
              onClick={handleEnterClick}
              className="px-8 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/15 text-white/80 font-medium rounded-full hover:bg-white/10 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer text-xs uppercase tracking-wider"
            >
              Enter Celebration Mode →
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
            className="absolute bottom-4 bg-black/95 border border-[#D4AF37]/50 rounded-2xl p-5 shadow-[0_0_40px_rgba(212,175,55,0.3)] max-w-sm w-full z-50 backdrop-blur-lg"
          >
            <span className="text-xl block mb-2 font-playfair text-[#D4AF37]">🔒 Timeline Restricted</span>
            <span className="text-xs text-white/70 font-light leading-relaxed">
              The birthday surprise officially activates on<br />
              <span className="text-[#D4AF37] font-semibold">13 July at 1:00 PM</span>.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
