"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(TIME_LIMIT);
    setFailed(false);
    moveStar();
  };

  const moveStar = () => {
    setStarPos({
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`
    });
  };

  const handleStarClick = () => {
    if (!isPlaying) return;
    
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
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            setFailed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Reaction Challenge</h2>
        <p className="text-white/60 font-poppins text-sm mb-4">
          Tap {TARGET_SCORE} golden stars before time runs out!
        </p>
        
        <div className="flex items-center justify-center gap-6 font-poppins text-[#FFF3B0]">
          <div className="bg-white/5 border border-[#D4AF37]/30 px-4 py-2 rounded-full">
            Time: {timeLeft}s
          </div>
          <div className="bg-white/5 border border-[#D4AF37]/30 px-4 py-2 rounded-full">
            Score: {score}/{TARGET_SCORE}
          </div>
        </div>
      </motion.div>

      <div className="relative w-full h-[60vh] max-h-[500px] border border-[#D4AF37]/30 rounded-3xl bg-black overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.15)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

        {!isPlaying && !failed && score === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              Start Challenge
            </button>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20">
            <p className="text-red-400 font-poppins text-xl mb-4">Time's up!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-white/10 border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-full hover:bg-[#D4AF37]/10 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        <AnimatePresence>
          {isPlaying && (
            <motion.button
              key={score} // Forces re-render/animation on each new star
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={handleStarClick}
              className="absolute text-5xl drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] z-10"
              style={{ top: starPos.top, left: starPos.left, transform: 'translate(-50%, -50%)' }}
              whileHover={{ scale: 1.2 }}
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
