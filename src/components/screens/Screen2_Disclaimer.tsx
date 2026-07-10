"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CinematicButton from "@/components/ui/CinematicButton";
import { useStore } from "@/contexts/StoreContext";

export default function Screen2_Disclaimer() {
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setAudioPlaying, setCurrentScreen } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBegin = () => {
    if (!isChecked) return;
    setAudioPlaying(true); // Automatically start music because user interacted
    setCurrentScreen(3); // Proceed to Welcome screen
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="min-h-screen w-full relative px-4 text-center overflow-y-auto py-12 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl flex flex-col items-center p-8 md:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-[0_0_100px_rgba(212,175,55,0.15)] bg-gradient-to-b from-[#1a1500]/90 to-black/95 backdrop-blur-2xl"
      >
        {/* Animated Floating Heart */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-4xl md:text-5xl drop-shadow-[0_0_20px_rgba(255,50,50,0.5)] mb-6"
        >
          ❤️
        </motion.div>

        <h1 className="font-playfair text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] via-[#D4AF37] to-[#AA7700] mb-4 text-center">
          Before We Begin...
        </h1>
        <p className="font-poppins text-white/70 text-sm md:text-base text-center italic mb-10 font-light max-w-md mx-auto leading-relaxed">
          &quot;This isn&apos;t just a website... <br />
          It&apos;s a journey made with love, memories, and countless emotions.&quot;
        </p>

        <div className="w-full mb-10 text-left">
          <h3 className="font-playfair text-xl text-[#FFF3B0] mb-6 border-b border-[#D4AF37]/20 pb-3 flex items-center gap-2">
            Instructions <span className="text-white/40 text-xs font-poppins italic font-light tracking-wide">(Please read before continuing)</span>
          </h3>
          
          <motion.ul 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.6
                }
              }
            }}
            className="space-y-5 font-poppins text-white/85 text-sm md:text-base font-light"
          >
            {[
              "Wear your earphones or headphones for the best experience.",
              "Turn your volume up to at least 70%.",
              "Take your time and enjoy every chapter.",
              "Don't skip anything—the story is meant to be experienced in order.",
              "Tap the buttons slowly and enjoy every animation.",
              "Stay till the very end because the biggest surprise is waiting there."
            ].map((text, idx) => (
              <motion.li 
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex gap-4 items-start hover:text-[#FFF3B0] transition-colors duration-300"
              >
                <span className="text-[#D4AF37] shrink-0 mt-1 text-xs shadow-[#D4AF37]">✦</span>
                <span className="leading-relaxed">{text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Checkbox Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className={`w-full relative rounded-xl p-[1px] mb-10 cursor-pointer overflow-hidden transition-all duration-500 group ${isChecked ? 'shadow-[0_0_30px_rgba(212,175,55,0.3)]' : 'hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]'}`}
          onClick={() => setIsChecked(!isChecked)}
        >
          {/* Glowing border effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 via-[#FFF3B0]/50 to-[#D4AF37]/20 transition-opacity duration-500 ${isChecked ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`} />
          
          <div className="relative w-full h-full bg-black/80 backdrop-blur-md rounded-xl p-5 flex items-center gap-5">
            <div className={`w-7 h-7 rounded-md border-2 flex flex-col items-center justify-center transition-all duration-300 shrink-0 ${isChecked ? 'bg-gradient-to-br from-[#D4AF37] to-[#AA7700] border-transparent shadow-[0_0_10px_rgba(212,175,55,0.6)]' : 'border-[#D4AF37]/40 group-hover:border-[#D4AF37]/80'}`}>
              <AnimatePresence>
                {isChecked && (
                  <motion.svg 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                    viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
            <span className={`font-poppins text-sm md:text-base leading-tight transition-colors duration-300 ${isChecked ? 'text-[#FFF3B0]' : 'text-white/80 group-hover:text-white'}`}>
              I promise I will experience every chapter without skipping.
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className={`transition-all duration-500 ${!isChecked ? 'opacity-40 grayscale cursor-not-allowed scale-95' : 'opacity-100 scale-100 hover:scale-105'}`}
        >
          <CinematicButton onClick={handleBegin}>
            Begin the Journey →
          </CinematicButton>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
