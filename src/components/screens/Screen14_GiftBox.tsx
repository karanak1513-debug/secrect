"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

export default function Screen14_GiftBox() {
  const { setCurrentScreen } = useStore();
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    
    // Luxury golden sparks for unlocking
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF3B0', '#FFB6C1'],
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
      {/* Cinematic Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-gradient-to-tr from-[#D4AF37]/10 to-[#FFB6C1]/5 blur-[120px] rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute top-20 text-center z-20">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] to-[#F3E5AB] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          Unlock My Heart
        </h2>
        <AnimatePresence>
          {!opened && (
            <motion.p 
              exit={{ opacity: 0 }}
              className="font-poppins text-gray-400 mt-3 tracking-widest uppercase text-xs md:text-sm"
            >
              Tap the lock to open
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-20 flex flex-col items-center cursor-pointer group z-20" onClick={!opened ? handleOpen : undefined}>
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="lock"
              exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="relative flex items-center justify-center h-64 w-64"
            >
              <motion.div 
                animate={{ rotate: [0, -2, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Luxury SVG Lock */}
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-40 h-40 md:w-48 md:h-48 text-[#D4AF37] drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="heart"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
              className="text-center flex flex-col items-center"
            >
              {/* Luxury SVG Heart */}
              <div className="relative mb-6">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-32 h-32 md:w-40 md:h-40 text-[#ff0055] drop-shadow-[0_0_40px_rgba(255,0,85,0.8)]"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h3 className="font-playfair text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFB6C1] to-[#FFF3B0] leading-relaxed drop-shadow-[0_0_10px_rgba(255,182,193,0.5)]">
                  My Heart
                </h3>
                <p className="font-poppins text-white/60 mt-4 tracking-[0.2em] uppercase text-sm">
                  Always yours.
                </p>
                <div className="mt-12">
                  <CinematicButton onClick={() => setCurrentScreen(15)}>
                    Read My Letter ✨
                  </CinematicButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
