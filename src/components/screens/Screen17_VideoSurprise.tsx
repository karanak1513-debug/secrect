"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

const PRIZES = [
  "Movie Date",
  "Open Your Special Wish",
  "Chocolate Treat",
  "A Beautiful Watch",
  "Secret Gift"
];

// Alternate 2 subtle colors. The golden lines will separate the odd touch at the end.
const COLORS = ["#1a1a1a", "#0a0a0a"];

export default function Screen17_VideoSurprise() {
  const { setCurrentScreen } = useStore();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWonPrize(null);

    const winIndex = Math.floor(Math.random() * PRIZES.length);
    const segmentAngle = 360 / PRIZES.length; 
    
    const randomOffset = Math.floor(Math.random() * (segmentAngle - 20)) - (segmentAngle / 2 - 10); 
    
    const centerOfWinningSegment = winIndex * segmentAngle + (segmentAngle / 2);
    const targetAngle = 360 - centerOfWinningSegment + randomOffset;
    
    const totalRotation = rotation + 1800 + targetAngle - (rotation % 360);

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(PRIZES[winIndex]);
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF3B0', '#FFB6C1'],
        disableForReducedMotion: true,
        zIndex: 100
      });
    }, 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4 overflow-hidden bg-[#02040A]"
    >
      <div className="absolute top-12 md:top-16 text-center z-30">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] to-[#F3E5AB] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          Spin The Wheel
        </h2>
        <p className="font-poppins text-gray-400 mt-4 tracking-widest uppercase text-xs md:text-sm">
          Let's see what you win today
        </p>
      </div>

      {/* Wheel Container */}
      <div className="relative mt-24 md:mt-32 mb-12 flex items-center justify-center z-20">
        {/* Pointer Triangle */}
        <div className="absolute -top-6 z-40 w-10 h-10 drop-shadow-[0_0_15px_rgba(212,175,55,1)] flex justify-center">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#FFF3B0]" />
        </div>

        {/* The Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-80 h-80 md:w-[450px] md:h-[450px] rounded-full border-[6px] border-[#D4AF37] relative overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.25)] bg-[#111]"
          style={{
            background: `conic-gradient(
              ${COLORS[0]} 0deg 72deg,
              ${COLORS[1]} 72deg 144deg,
              ${COLORS[0]} 144deg 216deg,
              ${COLORS[1]} 216deg 288deg,
              ${COLORS[0]} 288deg 360deg
            )`
          }}
        >
          {/* Golden Separator Lines */}
          {PRIZES.map((_, index) => {
            const angle = index * (360 / PRIZES.length);
            return (
              <div 
                key={`line-${index}`}
                className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] origin-left shadow-[0_0_5px_rgba(212,175,55,0.8)]"
                style={{ transform: `rotate(${angle - 90}deg)` }}
              />
            );
          })}

          {/* Text Labels */}
          {PRIZES.map((prize, index) => {
            const angle = index * (360 / PRIZES.length);
            const textAngle = angle + (360 / PRIZES.length) / 2;
            
            return (
              <div
                key={`text-${index}`}
                className="absolute top-1/2 left-1/2 w-1/2 h-12 -mt-6 origin-left flex items-center justify-start pl-16 md:pl-20 pr-4 pointer-events-none"
                style={{ transform: `rotate(${textAngle - 90}deg)` }}
              >
                <span className="font-poppins text-[#F3E5AB] text-[10px] md:text-sm font-semibold tracking-wider drop-shadow-md text-left leading-tight line-clamp-2">
                  {prize}
                </span>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center Hub & Button */}
        <div className="absolute z-30 flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#02040A] border-[4px] border-[#D4AF37] shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          <button 
            onClick={handleSpin}
            disabled={spinning}
            className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8a7322] hover:brightness-110 transition-all active:scale-95 disabled:opacity-80 disabled:scale-100"
          >
            <span className="font-playfair font-bold text-[#02040A] text-base md:text-xl tracking-widest drop-shadow-sm">
              SPIN
            </span>
          </button>
        </div>
      </div>

      {/* Prize Reveal */}
      <div className="h-24 flex flex-col items-center justify-center w-full z-20">
        <AnimatePresence mode="wait">
          {wonPrize && (
            <motion.div
              key="prize"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-center"
            >
              <p className="font-poppins text-gray-400 text-xs tracking-widest uppercase mb-2">
                You won:
              </p>
              <h3 className="font-playfair text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] to-[#D4AF37] font-bold drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] px-4">
                {wonPrize}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {wonPrize && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-6 md:bottom-8 z-30"
          >
            <CinematicButton onClick={() => setCurrentScreen(18)}>
              To the final wish ✨
            </CinematicButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
