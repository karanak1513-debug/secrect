"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

export default function Screen13_FinalWish() {
  const { setCurrentScreen } = useStore();
  const [showFinal, setShowFinal] = useState(false);
  
  const text = "This website may end...\n\n...but my wishes for your happiness never will.";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Typewriter effect
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(index + 1);
      }, 70); // speed
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setShowFinal(true), 1500);
    }
  }, [index, text]);

  useEffect(() => {
    if (showFinal) {
      // Massive Fireworks
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: ReturnType<typeof setInterval> = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD1DC', '#D4AF37', '#ffffff']
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#E6E6FA', '#ff69b4', '#ffffff']
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [showFinal]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4 text-center"
    >
      <div className="z-20 mb-12 max-w-2xl h-40 flex items-center justify-center">
        <p className="font-playfair text-2xl md:text-4xl text-white/90 leading-relaxed whitespace-pre-wrap">
          {displayedText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            |
          </motion.span>
        </p>
      </div>

      <AnimatePresence>
        {showFinal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="z-20 flex flex-col items-center"
          >
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mb-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] text-white">
              ❤️ Happy Birthday ❤️<br/>
              <span className="text-pink-200">My Dear Anushka</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-4">
              <CinematicButton onClick={() => setCurrentScreen(14)}>
                Open Memory Capsule ⏳
              </CinematicButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
