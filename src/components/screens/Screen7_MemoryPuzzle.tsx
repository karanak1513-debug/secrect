"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import confetti from "canvas-confetti";

export default function Screen7_MemoryPuzzle() {
  const { setCurrentScreen } = useStore();
  const [hasBloomed, setHasBloomed] = useState(false);

  const handleBloom = () => {
    if (hasBloomed) return;
    setHasBloomed(true);
    
    // Golden and Pink Sparks
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFB6C1', '#ff0055'],
      disableForReducedMotion: true,
      zIndex: 100
    });

    setTimeout(() => {
      setCurrentScreen(8);
    }, 4500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="flex flex-col items-center justify-center min-h-screen w-full px-4 overflow-hidden relative"
    >
      <div className="absolute top-20 text-center z-20">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] to-[#F3E5AB] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          Tumhare Aane Se...
        </h2>
        <p className="font-poppins text-gray-400 mt-3 tracking-widest uppercase text-xs md:text-sm">Tap the heart to see it bloom</p>
      </div>

      <div className="relative mt-24 cursor-pointer group" onClick={handleBloom}>
        
        {/* Glowing Aura behind Rose */}
        <AnimatePresence>
          {hasBloomed && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 2.5, 2], opacity: [0, 0.8, 0.5] }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-r from-pink-600/40 via-red-500/40 to-[#D4AF37]/40 blur-[60px] rounded-full -z-10"
            />
          )}
        </AnimatePresence>

        {/* The Heart / Rose Emoji */}
        <motion.div
          animate={hasBloomed ? { scale: [1, 1.4, 1.2], rotate: [0, -5, 5, 0] } : { scale: [1, 1.1, 1] }}
          transition={hasBloomed ? { duration: 2, ease: "easeInOut" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl md:text-[10rem] transition-all duration-1000 flex items-center justify-center"
          style={{ 
            filter: hasBloomed 
              ? "drop-shadow(0 0 50px rgba(255,0,85,0.8)) drop-shadow(0 0 20px rgba(212,175,55,0.6))" 
              : "drop-shadow(0 0 20px rgba(255,255,255,0.5))"
          }}
        >
          {hasBloomed ? "🌹" : "🤍"}
        </motion.div>
      </div>

      {/* Revealed Message */}
      <AnimatePresence>
        {hasBloomed && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 1 }}
            className="mt-16 text-center z-20"
          >
            <h3 className="font-playfair font-bold text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#FFB6C1] via-[#ff0055] to-[#D4AF37] drop-shadow-[0_0_15px_rgba(255,0,85,0.6)]">
              Zindagi Khil Uthi Hai! ❤️
            </h3>
          </motion.div>
        )}
      </AnimatePresence>
      
    </motion.div>
  );
}
