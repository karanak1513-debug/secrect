"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";

export default function Screen1_Splash() {
  const { setCurrentScreen } = useStore();
  const [progress, setProgress] = useState(0);
  const [stars, setStars] = useState<{width: string, height: string, top: string, left: string, duration: number, delay: number, opacityMax: number}[]>([]);

  useEffect(() => {
    setStars(
      [...Array(30)].map(() => ({
        width: Math.random() * 2 + 1 + "px",
        height: Math.random() * 2 + 1 + "px",
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 5,
        opacityMax: Math.random() * 0.8 + 0.2
      }))
    );
  }, []);

  useEffect(() => {
    const duration = 8000; // 8 seconds
    const intervalTime = 40;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min((currentStep / steps) * 100, 100));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setCurrentScreen(2);
        }, 800);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [setCurrentScreen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#050505] relative overflow-hidden">
      {/* Deep Space Background Glow */}
      <motion.div 
        className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#FFF3B0]/5 to-transparent blur-[120px] rounded-full"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating Stardust */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white shadow-[0_0_10px_#FFF3B0]"
            style={{ 
              width: star.width, 
              height: star.height, 
              top: star.top, 
              left: star.left 
            }}
            animate={{ 
              y: [0, -40, 0], 
              opacity: [0, star.opacityMax, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ 
              duration: star.duration, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: star.delay
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md px-6">
        
        {/* Animated Magical Core */}
        <div className="relative flex items-center justify-center w-64 h-64 mb-12">
          {/* Pulsing Aura */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/30 via-[#FFF3B0]/10 to-transparent rounded-full blur-[40px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Sacred Geometry / Outer Rings */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute border rounded-full"
              style={{
                width: 100 + i * 40,
                height: 100 + i * 40,
                borderColor: i % 2 === 0 ? "rgba(212,175,55,0.3)" : "rgba(255,243,176,0.1)",
                borderTopColor: i % 2 === 0 ? "#FFF3B0" : "transparent",
                borderBottomColor: i % 2 !== 0 ? "#D4AF37" : "transparent",
              }}
              animate={{ 
                rotate: i % 2 === 0 ? 360 : -360,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 15 + i * 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ))}

          {/* Center Glowing Heart */}
          <motion.div
            className="absolute text-5xl md:text-6xl text-[#D4AF37] drop-shadow-[0_0_40px_rgba(255,243,176,0.8)]"
            animate={{ 
              scale: [1, 1.25, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ❤️
          </motion.div>
        </div>

        {/* Dynamic Typing Text Reveal */}
        <div className="h-16 mb-8 flex items-center justify-center text-center w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={Math.min(Math.floor((progress / 100) * 4), 3)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-playfair text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] tracking-wider italic font-medium drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]"
            >
              {[
                "Gathering our beautiful memories...",
                "Sprinkling some magic dust...",
                "Tuning the heartstrings...",
                "Almost ready for you, Mere Anushka..."
              ][Math.min(Math.floor((progress / 100) * 4), 3)]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Expanding Light Beam Progress */}
        <div className="w-full h-[2px] bg-white/5 relative overflow-hidden rounded-full mb-6 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
          <motion.div
            className="absolute top-0 h-full bg-gradient-to-r from-transparent via-[#FFF3B0] to-transparent shadow-[0_0_15px_#D4AF37]"
            style={{ 
              left: `${50 - progress/2}%`,
              width: `${progress}%` 
            }}
          />
          {/* Glowing Center Point */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-white blur-[2px] shadow-[0_0_20px_#FFF3B0]"
            animate={{ opacity: progress > 0 && progress < 100 ? 1 : 0 }}
          />
        </div>

        {/* Percentage text */}
        <motion.div 
          className="font-poppins text-[#D4AF37]/80 text-sm tracking-[0.2em] font-medium flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-8 h-px bg-[#D4AF37]/30" />
          {Math.round(progress)}%
          <div className="w-8 h-px bg-[#D4AF37]/30" />
        </motion.div>
      </div>
    </div>
  );
}
