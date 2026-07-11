"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Day2_LockRotation({ onComplete }: { onComplete: () => void }) {
  // Store rotations in degrees. Target is multiple of 360.
  const [rotations, setRotations] = useState([
    Math.floor(Math.random() * 3 + 1) * 90, // outer
    Math.floor(Math.random() * 3 + 1) * 90, // middle
    Math.floor(Math.random() * 3 + 1) * 90, // inner
  ]);
  
  const [isUnlocked, setIsUnlocked] = useState(false);

  const rotateRing = (index: number) => {
    if (isUnlocked) return;

    const newRotations = [...rotations];
    newRotations[index] += 90;
    setRotations(newRotations);
  };

  useEffect(() => {
    if (isUnlocked) return;

    // Check if all rings are aligned (rotation % 360 === 0)
    const isAligned = rotations.every((r) => r % 360 === 0);
    
    if (isAligned) {
      setIsUnlocked(true);
      setTimeout(onComplete, 1500);
    }
  }, [rotations, isUnlocked, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Lock Rotation Puzzle</h2>
        <p className="text-white/60 font-poppins text-sm">
          Tap the rings to rotate them. Align the golden markers at the top to unlock.
        </p>
      </motion.div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: rotations[0] }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          onClick={() => rotateRing(0)}
          className="absolute w-72 h-72 border-4 border-[#D4AF37]/40 rounded-full cursor-pointer flex justify-center hover:border-[#D4AF37]/80 transition-colors"
        >
          {/* Marker */}
          <div className="w-4 h-4 bg-[#D4AF37] rounded-full -mt-2 shadow-[0_0_10px_#D4AF37]" />
        </motion.div>

        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: rotations[1] }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          onClick={() => rotateRing(1)}
          className="absolute w-52 h-52 border-4 border-[#D4AF37]/60 rounded-full cursor-pointer flex justify-center hover:border-[#D4AF37] transition-colors"
        >
          {/* Marker */}
          <div className="w-4 h-4 bg-[#FFF3B0] rounded-full -mt-2 shadow-[0_0_10px_#FFF3B0]" />
        </motion.div>

        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: rotations[2] }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          onClick={() => rotateRing(2)}
          className="absolute w-32 h-32 border-4 border-[#D4AF37] rounded-full cursor-pointer flex justify-center hover:border-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          {/* Marker */}
          <div className="w-4 h-4 bg-white rounded-full -mt-2 shadow-[0_0_10px_white]" />
        </motion.div>

        {/* Center Keyhole */}
        <div className="absolute w-12 h-12 bg-black rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_10px_rgba(212,175,55,0.5)]">
          <div className="w-4 h-4 rounded-full bg-[#D4AF37]" />
          <div className="w-3 h-5 bg-[#D4AF37] -mt-1 rounded-sm" />
          
          {isUnlocked && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 5, opacity: [0, 1, 0] }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-[#D4AF37] rounded-full blur-md"
            />
          )}
        </div>
      </div>
    </div>
  );
}
