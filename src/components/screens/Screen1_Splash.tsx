"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";

export default function Screen1_Splash() {
  const { setCurrentScreen } = useStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000;
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
      {/* Dynamic Background Glow */}
      <motion.div 
        className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/10 to-transparent blur-[100px] rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="z-10 flex flex-col items-center">
        {/* Animated Golden Orbit */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-12" style={{ perspective: 800 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute border border-[#D4AF37]/50 rounded-full"
              style={{
                width: 80 + i * 40,
                height: 80 + i * 40,
                borderTopColor: "#FFF3B0",
                boxShadow: "0 0 15px rgba(212,175,55,0.2)"
              }}
              animate={{ 
                rotateX: [0, 360],
                rotateY: [0, 360],
                rotateZ: [0, 360]
              }}
              transition={{ 
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Pulsing Core */}
          <motion.div
            className="absolute w-8 h-8 bg-gradient-to-tr from-[#D4AF37] to-[#FFF3B0] rounded-full blur-[2px] shadow-[0_0_30px_#D4AF37,0_0_60px_#FFF3B0]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Typing Text Reveal */}
        <div className="h-12 mb-6 flex items-center justify-center">
          <motion.h1 
            className="font-playfair text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] tracking-wider drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Tayyari ho rahi hai...
          </motion.h1>
        </div>

        {/* Progress Line with Comet Head */}
        <div className="w-64 md:w-96 h-1 bg-gray-800 rounded-full relative overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFF3B0] rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Glowing Comet Head */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_10px_#fff,0_0_20px_#D4AF37]"
            style={{ left: `calc(${progress}% - 8px)` }}
            animate={{ opacity: progress > 0 && progress < 100 ? 1 : 0 }}
          />
        </div>

        {/* Percentage text */}
        <motion.p 
          className="mt-6 font-poppins text-[#D4AF37]/80 text-sm tracking-widest font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {Math.round(progress)}%
        </motion.p>
      </div>
    </div>
  );
}
