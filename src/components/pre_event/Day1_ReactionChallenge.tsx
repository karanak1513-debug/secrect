"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

const TARGET_SCORE = 10;
const TIME_LIMIT = 15;

export default function Day1_ReactionChallenge({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [starPos, setStarPos] = useState({ top: "50%", left: "50%" });
  const [failed, setFailed] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    sfx.playClick();
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(TIME_LIMIT);
    setFailed(false);
    moveStar();
  };

  const moveStar = () => {
    setStarPos({
      top: `${Math.random() * 70 + 15}%`,
      left: `${Math.random() * 70 + 15}%`
    });
  };

  const handleStarClick = () => {
    if (!isPlaying) return;
    sfx.playClick();
    
    const newScore = score + 1;
    setScore(newScore);
    
    if (newScore >= TARGET_SCORE) {
      // Win
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete();
    } else {
      moveStar();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            sfx.playError();
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            setFailed(true);
            return 0;
          }
          sfx.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Reaction Array</h2>
        <p className="text-white/60 text-sm mb-4">
          Tap {TARGET_SCORE} golden stars before the security timer counts down to zero.
        </p>
        
        <div className="flex items-center justify-center gap-4 font-mono text-xs text-[#FFF3B0]">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            TIMER: {timeLeft}s
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            STARS: {score}/{TARGET_SCORE}
          </div>
        </div>
      </motion.div>

      {/* Main Glass Challenge Box */}
      <div className="relative w-full h-[55vh] max-h-[460px] border border-white/10 rounded-[32px] bg-black/60 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

        {!isPlaying && !failed && score === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
            <button
              onClick={startGame}
              className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer text-xs tracking-wider uppercase"
            >
              Start Challenge
            </button>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20">
            <p className="text-red-400 font-mono text-base tracking-widest uppercase mb-4">SECURITY FIREWALL TRIGGERED</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-white/5 border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-full hover:bg-[#D4AF37]/10 transition-all cursor-pointer text-xs tracking-wider uppercase"
            >
              Try Again
            </button>
          </div>
        )}

        <AnimatePresence>
          {isPlaying && (
            <motion.button
              key={score} // Forces re-render/animation on each new star
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 45 }}
              onClick={handleStarClick}
              className="absolute text-5xl drop-shadow-[0_0_20px_rgba(212,175,55,0.85)] z-10 select-none cursor-pointer focus:outline-none"
              style={{ top: starPos.top, left: starPos.left, transform: 'translate(-50%, -50%)' }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.8 }}
            >
              ⭐
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
