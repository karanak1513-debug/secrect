"use client";

import { motion } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import confetti from "canvas-confetti";

export default function Screen4_FamilyBirthdayCard() {
  const { setCurrentScreen } = useStore();

  const handleCelebrate = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#FFF3B0', '#ffffff']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#FFF3B0', '#ffffff']
      });
    }, 250);
  };

  const handleLock = () => {
    localStorage.removeItem("appMode");
    window.location.reload();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-2xl w-full z-10"
      >
        <div className="bg-white/5 border border-[#D4AF37]/30 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(212,175,55,0.1)] relative overflow-hidden text-center">
          {/* Card Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#D4AF37]/50 rounded-tl-3xl m-4" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#D4AF37]/50 rounded-tr-3xl m-4" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#D4AF37]/50 rounded-bl-3xl m-4" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#D4AF37]/50 rounded-br-3xl m-4" />

          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-3xl md:text-5xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-8"
          >
            Happy Birthday, Anushka ❤️
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="space-y-6 text-white/90 font-poppins text-sm md:text-lg font-light leading-relaxed mb-12"
          >
            <p>
              May this new year of your life bring endless happiness,
              good health,
              success,
              beautiful memories,
              and lots of smiles.
            </p>
            <p>
              May all your dreams come true.
            </p>
            <p className="text-xl font-playfair text-[#D4AF37] italic mt-8">
              Have the most amazing birthday!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <button
              onClick={handleLock}
              className="w-full sm:w-auto px-8 py-3 bg-white/10 border border-[#D4AF37]/50 text-white font-medium rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              Lock Session 🔒
            </button>
            <button
              onClick={handleCelebrate}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              Celebrate 🎆
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
