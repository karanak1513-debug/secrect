"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Day2_DigitalLock({ onComplete }: { onComplete: () => void }) {
  const [pinsUnlocked, setPinsUnlocked] = useState(0);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState(false);
  const requestRef = useRef<number | undefined>(undefined);
  
  // Game parameters based on difficulty (pinsUnlocked)
  const speed = 2 + (pinsUnlocked * 1.5); 
  const targetStart = 40 + (pinsUnlocked * 5); // 40, 45, 50
  const targetWidth = 20 - (pinsUnlocked * 5); // 20, 15, 10
  const targetEnd = targetStart + targetWidth;

  useEffect(() => {
    if (pinsUnlocked >= 3) {
      setTimeout(onComplete, 1000);
      return;
    }

    const animate = () => {
      setPosition((prev) => {
        let nextPos = prev + (speed * direction);
        let nextDir = direction;

        if (nextPos >= 100) {
          nextPos = 100;
          nextDir = -1;
          setDirection(-1);
        } else if (nextPos <= 0) {
          nextPos = 0;
          nextDir = 1;
          setDirection(1);
        }
        return nextPos;
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [pinsUnlocked, direction, speed, onComplete]);

  const handleTap = () => {
    if (pinsUnlocked >= 3 || error) return;

    if (position >= targetStart && position <= targetEnd) {
      // Success
      setPinsUnlocked(p => p + 1);
    } else {
      // Failed
      setError(true);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      
      setTimeout(() => {
        setPinsUnlocked(0);
        setError(false);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Digital Override</h2>
        <p className="text-white/60 font-poppins text-sm mb-4">
          Tap when the moving scanner is inside the golden safe zone. Unlock 3 security pins.
        </p>
      </motion.div>

      <motion.div 
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col items-center gap-8"
      >
        {/* Security Pins UI */}
        <div className="flex gap-4 mb-4">
          {[0, 1, 2].map((pin) => (
            <div 
              key={pin}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                pin < pinsUnlocked 
                  ? "bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_15px_#D4AF37]" 
                  : "bg-transparent border-white/20"
              }`}
            />
          ))}
        </div>

        {/* The Track */}
        <div className="relative w-full h-12 bg-white/5 border border-white/10 rounded-full overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          {/* Target Area */}
          <div 
            className="absolute h-full bg-[#D4AF37]/20 border-x border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            style={{ 
              left: `${targetStart}%`, 
              width: `${targetWidth}%`,
              transition: 'left 0.5s ease, width 0.5s ease'
            }}
          />
          
          {/* Moving Scanner */}
          <div 
            className={`absolute top-0 bottom-0 w-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] ${
              error ? "bg-red-500 shadow-red-500" : "bg-white"
            }`}
            style={{ 
              left: `calc(${position}% - 4px)` 
            }}
          />
        </div>

        <button
          onClick={handleTap}
          className={`mt-4 w-32 h-32 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] ${
            error 
              ? "bg-red-500/20 text-red-500 border-2 border-red-500" 
              : "bg-black text-[#D4AF37] border-2 border-[#D4AF37] hover:bg-[#D4AF37]/10 active:scale-95"
          }`}
        >
          {error ? "ACCESS DENIED" : "HACK"}
        </button>
      </motion.div>
    </div>
  );
}
