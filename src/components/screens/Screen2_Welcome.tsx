"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

export default function Screen2_Welcome() {
  const { setCurrentScreen } = useStore();
  
  // Runaway NO button
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isNoHovered, setIsNoHovered] = useState(false);

  const handleNoHover = () => {
    setIsNoHovered(true);
    const newX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 150 + 50); 
    const newY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100 + 50);
    setNoPosition({ x: newX, y: newY });
  };

  const handleYes = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FF69B4', '#FFB6C1', '#FFFFFF'],
      zIndex: 100
    });
    setTimeout(() => {
      setCurrentScreen(3);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative z-10 overflow-hidden px-4">
      {/* Dynamic Ambient Background */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] md:w-[800px] md:h-[800px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.4)_0%,transparent_70%)] rounded-full pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mt-[-5vh]">
        
        {/* Title Lines */}
        <div className="flex flex-col items-center text-center mb-10 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(15px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] via-[#FFB6C1] to-[#F3E5AB] drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] leading-tight"
          >
            Happy Birthday
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(15px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 2, delay: 1, ease: "easeOut" }}
            className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-[#F3E5AB] drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-4 flex-wrap"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] via-[#FFB6C1] to-[#F3E5AB]">
              Meri Pyaari Anushka
            </span>
            <span>❤️</span>
          </motion.h2>
        </div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 2.5, duration: 2, ease: "easeOut" }}
          className="font-poppins text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-16 text-center leading-relaxed font-light tracking-wide"
        >
          Ek chhota sa surprise hai... <br className="hidden md:block" /> 
          Jo dil se sirf <span className="font-medium text-[#FFB6C1]">tumhare</span> liye banaya hai. <br className="hidden md:block" /> 
          Ready ho dekhne ke liye? ✨
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 1.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 relative w-full h-32 md:h-16"
        >
          <div className="z-20">
            <CinematicButton onClick={handleYes}>
              ❤️ Haan, Jaldi Dikhao!
            </CinematicButton>
          </div>

          <motion.div
            animate={{ 
              x: noPosition.x, 
              y: noPosition.y,
              scale: isNoHovered ? 0.9 : 1
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onHoverStart={handleNoHover}
            className="z-10 relative"
          >
            <CinematicButton variant="secondary" onClick={handleNoHover}>
              😅 Nahi, Pehle Hint Do
            </CinematicButton>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
