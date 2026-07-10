"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

export default function Screen12_RoseBouquet() {
  const { setCurrentScreen } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    // Golden sparks when opening
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF3B0'],
      disableForReducedMotion: true,
      zIndex: 100
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4 overflow-hidden bg-[#050505]"
    >
      {/* Subtle Background Glow */}
      <motion.div 
        className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-[#D4AF37]/5 to-transparent blur-[120px] rounded-full -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute top-20 text-center z-20">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] to-[#F3E5AB] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          Ek Paigham...
        </h2>
        <AnimatePresence>
          {!isOpen && (
            <motion.p 
              exit={{ opacity: 0 }}
              className="font-poppins text-gray-400 mt-3 tracking-widest uppercase text-xs md:text-sm"
            >
              Tap the envelope to open
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* The Golden Envelope SVG */}
      <div className="relative mt-16 cursor-pointer z-20 flex flex-col items-center justify-center h-64 w-full" onClick={handleOpen}>
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute"
            >
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-48 h-48 md:w-56 md:h-56 text-[#D4AF37] drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
                <rect x="3" y="5" width="18" height="14" rx="2" />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed Message inside Envelope */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              className="text-center z-20 px-6 max-w-3xl"
            >
              <div className="relative">
                {/* Decorative Quotes */}
                <span className="absolute -top-12 -left-8 text-8xl text-[#D4AF37]/20 font-playfair select-none">&quot;</span>
                
                <h3 className="font-playfair text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] via-white to-[#D4AF37] leading-relaxed drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  Meri zindagi ko itna khoobsurat banane ke liye shukriya.
                </h3>
                
                <span className="absolute -bottom-24 -right-8 text-8xl text-[#D4AF37]/20 font-playfair select-none">&quot;</span>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="mt-8 font-poppins text-white/60 tracking-widest uppercase text-sm md:text-base"
              >
                You are my greatest blessing.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="absolute bottom-12 z-20"
          >
            <CinematicButton onClick={() => setCurrentScreen(13)}>
              Continue ✨
            </CinematicButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
