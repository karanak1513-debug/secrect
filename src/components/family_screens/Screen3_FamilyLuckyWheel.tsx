"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import confetti from "canvas-confetti";

const REWARDS = [
  "⌚ A Beautiful Watch",
  "🍫 Chocolate Treat",
  "🎬 Family Movie Night",
  "🎁 Surprise Gift",
  "🍕 Special Dinner",
  "📸 Family Selfie",
  "🌟 Make a Birthday Wish",
  "🎂 Birthday Cake",
];

export default function Screen3_FamilyLuckyWheel() {
  const { setCurrentScreen } = useStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [rotation, setRotation] = useState(0);

  const targetIndex = 0; // "⌚ A Beautiful Watch" is at index 0

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;
    
    setIsSpinning(true);
    
    // We want it to spin multiple times (e.g., 5 full rotations) + stop at the target.
    // Each segment is 360 / 8 = 45 degrees.
    // To stop at index 0, the top arrow should point to index 0.
    // Actually, if we rotate the wheel, we need to land on 360 - (targetIndex * 45) to point to the top.
    const segmentAngle = 360 / REWARDS.length;
    const targetAngle = 360 - (targetIndex * segmentAngle);
    
    // Add random slight offset so it doesn't look completely hardcoded, but stays within the segment
    const offset = Math.floor(Math.random() * 20) - 10; 
    const finalRotation = 360 * 5 + targetAngle + offset;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      
      // Fire confetti
      const end = Date.now() + 3 * 1000;
      const colors = ['#D4AF37', '#FFF3B0'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      setTimeout(() => {
        setShowButton(true);
      }, 3000);
    }, 5000); // 5 seconds spin duration
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-poppins">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
      
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 flex flex-col items-center w-full max-w-4xl"
      >
        <motion.h2 
          className="text-3xl md:text-5xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-4 text-center"
        >
          Birthday Lucky Wheel 🎡
        </motion.h2>
        <p className="text-white/70 mb-12 text-center text-sm md:text-base font-light">
          Wheel ko spin karein aur apna special birthday surprise jeetein!
        </p>

        <div className="relative w-72 h-72 md:w-96 md:h-96 mb-12">
          {/* Arrow */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-[#D4AF37] z-20 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
          
          <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] p-2 backdrop-blur-sm bg-white/5">
            <motion.div 
              className="relative w-full h-full rounded-full overflow-hidden border border-[#D4AF37]/50"
              animate={{ rotate: rotation }}
              transition={{ duration: 5, ease: [0.15, 0.85, 0.25, 1] }}
            >
              {/* Slice Background Sectors */}
              {REWARDS.map((reward, index) => {
                const angle = (360 / REWARDS.length) * index;
                return (
                  <div
                    key={`slice-${index}`}
                    className="absolute w-full h-full flex justify-center origin-center"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div 
                      className="absolute top-0 w-1/2 h-[50%] origin-bottom flex justify-center pt-4"
                      style={{
                        transform: `rotate(${360 / REWARDS.length / 2}deg) skewY(${90 - (360 / REWARDS.length)}deg)`,
                        backgroundColor: index % 2 === 0 ? '#0c0c0c' : '#141414',
                        borderRight: '1px solid rgba(212,175,55,0.15)',
                        left: '50%',
                      }}
                    />
                  </div>
                );
              })}
              
              {/* Slices Labels (Only emojis, clean minimalist look) */}
              {REWARDS.map((reward, index) => {
                const segmentAngle = 360 / REWARDS.length;
                const angle = (segmentAngle * index) + (segmentAngle / 2);
                const emoji = reward.split(' ')[0];

                return (
                  <div
                    key={`label-${index}`}
                    className="absolute top-0 left-0 w-full h-full flex justify-center items-start origin-center pointer-events-none"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className="mt-10 md:mt-14 flex flex-col items-center text-center">
                      <span className="text-3xl md:text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] select-none">
                        {emoji}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] rounded-full z-30 shadow-[0_0_15px_rgba(212,175,55,0.8)] border-2 border-white/20" />
            </motion.div>
          </div>
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning || hasSpun}
          className={`px-10 py-4 font-semibold rounded-full transition-all duration-300 ${
            isSpinning || hasSpun 
              ? 'opacity-50 cursor-not-allowed bg-white/10 text-white/50 border border-white/20' 
              : 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105'
          }`}
        >
          {isSpinning ? 'Spinning...' : hasSpun ? 'Spun!' : 'SPIN THE WHEEL'}
        </button>
      </motion.div>

      {/* Result Popup */}
      <AnimatePresence>
        {hasSpun && !isSpinning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-[#0a0a0a]/90 border border-[#D4AF37]/50 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.2)] max-w-lg w-full text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_100%)]" />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-4xl md:text-5xl mb-6 relative z-10"
              >
                🎉
              </motion.div>

              <h3 className="text-2xl font-playfair text-white mb-2 relative z-10">Congratulations!</h3>
              <p className="text-[#D4AF37] font-medium text-lg mb-6 relative z-10">You've Won</p>
              
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl py-6 px-4 mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)] relative z-10">
                <p className="text-2xl md:text-3xl font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  ⌚ A Beautiful Watch
                </p>
              </div>

              <p className="text-white/70 italic font-playfair mb-10 relative z-10 text-lg">
                "A special birthday gift, chosen with love. ❤️"
              </p>

              <AnimatePresence>
                {showButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setCurrentScreen(4)}
                    className="relative z-10 px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  >
                    Claim Your Gift →
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
