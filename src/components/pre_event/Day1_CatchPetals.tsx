"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_SCORE = 15;

export default function Day1_CatchPetals({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [petals, setPetals] = useState<{ id: number; left: string; duration: number }[]>([]);
  const nextId = useRef(0);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setPetals([]);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPetals((prev) => {
        // Keep max 5 petals on screen
        if (prev.length >= 5) return prev;
        
        const newPetal = {
          id: nextId.current++,
          left: `${Math.random() * 80 + 10}%`,
          duration: Math.random() * 2 + 3, // 3 to 5 seconds to fall
        };
        return [...prev, newPetal];
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleCatch = (id: number) => {
    if (!isPlaying) return;
    
    setPetals((prev) => prev.filter((p) => p.id !== id));
    
    const newScore = score + 1;
    setScore(newScore);

    if (newScore >= TARGET_SCORE) {
      setIsPlaying(false);
      setTimeout(onComplete, 1000);
    }
  };

  // Automatically remove petals that have fallen
  const handleAnimationComplete = (id: number) => {
    setPetals((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Catch the Petals</h2>
        <p className="text-white/60 font-poppins text-sm mb-4">
          Tap the falling golden petals to collect them. Collect {TARGET_SCORE} to advance.
        </p>
        <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[#FFF3B0]">
          Collected: {score} / {TARGET_SCORE}
        </div>
      </motion.div>

      <div className="relative w-full h-[60vh] max-h-[500px] border border-[#D4AF37]/30 rounded-3xl bg-black overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.15)]">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

        {!isPlaying && score === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              Start Collecting
            </button>
          </div>
        )}

        {/* Falling Petals */}
        <AnimatePresence>
          {petals.map((petal) => (
            <motion.button
              key={petal.id}
              initial={{ opacity: 0, y: -50, rotate: 0 }}
              animate={{ opacity: 1, y: 600, rotate: 360 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: petal.duration, ease: "linear" }}
              onAnimationComplete={() => handleAnimationComplete(petal.id)}
              onClick={() => handleCatch(petal.id)}
              className="absolute text-3xl drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] cursor-pointer z-10"
              style={{ left: petal.left }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              🌸
            </motion.button>
          ))}
        </AnimatePresence>

        {score >= TARGET_SCORE && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20"
          >
            <p className="text-3xl text-[#D4AF37] font-playfair drop-shadow-[0_0_15px_#D4AF37]">
              Beautiful! ✨
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
