"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

export default function Screen20_OneLastSurprise() {
  const { setCurrentScreen } = useStore();

  useEffect(() => {
    // Massive confetti explosion
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#ff0000', '#ff69b4', '#D4AF37'] }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ff0000', '#ff69b4', '#D4AF37'] }));
    }, 250);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[32px] overflow-hidden p-8 md:p-12 max-w-lg w-full text-center relative"
        style={{ boxShadow: "0 0 60px rgba(212,175,55,0.15)" }}
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 text-[#D4AF37]/30 text-2xl">✧</div>
        <div className="absolute top-4 right-4 text-[#D4AF37]/30 text-2xl">✧</div>
        <div className="absolute bottom-4 left-4 text-[#D4AF37]/30 text-2xl">✧</div>
        <div className="absolute bottom-4 right-4 text-[#D4AF37]/30 text-2xl">✧</div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-5xl mb-6 inline-block drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
        >
          💌
        </motion.div>
        
        <h3 className="font-playfair text-3xl text-[#D4AF37] mb-6">
          My Promise
        </h3>
        
        <div className="font-poppins text-white/80 text-sm md:text-base mb-8 leading-relaxed space-y-4">
          <p>
            Yeh website khatam ho sakti hai, par humari kahani nahi. Har beetate din ke saath, I want to make more memories, share more laughs, and love you even more.
          </p>
          <p>
            No downloads, no PDFs needed... because you are already downloaded right into my heart, permanently! 
          </p>
          <p className="font-playfair text-xl text-[#D4AF37] italic mt-4">
            I love you, Anushka. Always & Forever.
          </p>
        </div>
        
        <CinematicButton variant="primary" onClick={() => setCurrentScreen(21)}>
          Open Memory Capsule 🎁
        </CinematicButton>
      </motion.div>
    </motion.div>
  );
}
