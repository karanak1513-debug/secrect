"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import confetti from "canvas-confetti";

export default function Screen4_BalloonGame() {
  const { setCurrentScreen } = useStore();
  const [lit, setLit] = useState(Array(6).fill(false));
  const words = ["AAJ", "KA", "DIN", "SIRF", "TUMHARE", "NAAM"];

  const handleLight = (index: number) => {
    if (lit[index]) return;

    // Small golden sparkle effect when lit
    confetti({
      particleCount: 15,
      spread: 30,
      origin: { 
        x: (index * 0.2) + 0.2, // roughly distribute across screen
        y: 0.45 
      },
      colors: ['#D4AF37', '#FFF3B0'],
      disableForReducedMotion: true,
      zIndex: 100
    });

    const newLit = [...lit];
    newLit[index] = true;
    setLit(newLit);
  };

  useEffect(() => {
    if (lit.every(Boolean)) {
      // All lit! Wait 3 seconds then go to next
      setTimeout(() => {
        setCurrentScreen(5);
      }, 4000);
    }
  }, [lit, setCurrentScreen]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full px-4 overflow-hidden relative"
    >
      <div className="absolute top-20 text-center z-20">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] to-[#F3E5AB] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          Roshan Karo ✨
        </h2>
        <p className="font-poppins text-gray-400 mt-3 tracking-widest uppercase text-xs md:text-sm">Tap the candles to light them</p>
      </div>

      <div className="flex justify-center items-center gap-4 md:gap-8 lg:gap-12 w-full max-w-5xl mt-10 flex-wrap">
        {words.map((word, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <motion.div
              className="cursor-pointer relative"
              onClick={() => handleLight(index)}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
            >
              {/* Candle Emoji */}
              <motion.div 
                className="text-6xl md:text-8xl transition-all duration-700"
                style={{ 
                  filter: lit[index] 
                    ? "drop-shadow(0 0 40px rgba(212,175,55,1)) drop-shadow(0 0 20px rgba(255,182,193,0.8))" 
                    : "grayscale(80%) brightness(50%)" 
                }}
                animate={lit[index] ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                🕯️
              </motion.div>

              {/* Glowing Flame Aura (only when lit) */}
              <AnimatePresence>
                {lit[index] && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-16 h-16 bg-[#D4AF37]/40 blur-xl rounded-full -z-10"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Revealed Word */}
            <div className="h-10 mt-6 relative w-full flex justify-center">
              <AnimatePresence>
                {lit[index] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute font-playfair text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#FFB6C1] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  >
                    {word}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Final Celebration */}
      <AnimatePresence>
        {lit.every(Boolean) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute bottom-24 text-center z-20 flex flex-col items-center"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-5xl drop-shadow-[0_0_20px_rgba(255,105,180,0.8)]"
            >
              ❤️
            </motion.div>
            <p className="font-poppins text-gray-300 mt-4 tracking-widest text-sm italic">You light up my life...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
