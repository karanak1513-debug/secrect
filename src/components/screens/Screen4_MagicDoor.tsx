"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";

export default function Screen4_MagicDoor() {
  const { setCurrentScreen } = useStore();
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    if (isUnlocked) return;
    setIsUnlocked(true);
    setTimeout(() => {
      setCurrentScreen(5);
    }, 2500); // Wait for the explosion animation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative z-10 overflow-hidden">
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -50, scale: 0.8, filter: "blur(20px)" }}
            transition={{ duration: 1, type: "spring" }}
            className="absolute top-[15%] text-center z-20 pointer-events-none"
          >
            <h2 className="font-playfair text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] via-[#FFB6C1] to-[#F3E5AB] drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              Mera Dil ❤️
            </h2>
            <p className="font-poppins text-gray-400 mt-4 tracking-widest uppercase text-sm">Tap the heart to unlock the surprise...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Heart Container */}
      <motion.div 
        className="relative mt-20 cursor-pointer group z-30"
        onClick={handleUnlock}
        animate={isUnlocked ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] } : { scale: [1, 1.05, 1] }}
        transition={isUnlocked ? { duration: 1.5, ease: "easeInOut" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glowing Aura Behind Heart */}
        <motion.div 
          className="absolute -inset-10 bg-gradient-to-r from-pink-500/30 to-[#D4AF37]/30 blur-[50px] rounded-full -z-10"
          animate={isUnlocked ? { scale: 3, opacity: 0 } : { opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* The 3D Heart Emoji */}
        <motion.div
          className="text-9xl md:text-[12rem] drop-shadow-[0_0_40px_rgba(255,105,180,0.6)]"
          animate={isUnlocked ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          💖
        </motion.div>

        {/* Floating Ring around heart */}
        <motion.div 
          className="absolute inset-0 border-2 border-[#D4AF37]/40 rounded-full"
          style={{ transform: "scale(1.5)" }}
          animate={isUnlocked ? { scale: 5, opacity: 0 } : { rotate: 360, scale: [1.4, 1.5, 1.4] }}
          transition={isUnlocked ? { duration: 1 } : { duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-0 border-2 border-pink-400/30 rounded-full"
          style={{ transform: "scale(1.8)" }}
          animate={isUnlocked ? { scale: 6, opacity: 0 } : { rotate: -360, scale: [1.8, 1.7, 1.8] }}
          transition={isUnlocked ? { duration: 1.2 } : { duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Screen Fill Light (Flash effect when unlocked) */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div 
            className="absolute inset-0 bg-white z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
