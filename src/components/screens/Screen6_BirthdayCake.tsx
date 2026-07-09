"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

export default function Screen6_BirthdayCake() {
  const { setCurrentScreen } = useStore();
  const [wished, setWished] = useState(false);

  const handleMakeWish = () => {
    setWished(true);

    // Star burst confetti
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#D4AF37', '#FFF3B0', '#ffffff'],
        disableForReducedMotion: true,
        zIndex: 100
      });
    }, 800);

    // After 5 seconds, move to next screen
    setTimeout(() => {
      setCurrentScreen(7);
    }, 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4 overflow-hidden"
    >
      <div className="absolute top-20 text-center z-20">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] to-[#F3E5AB] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          Ek Dua Maango...
        </h2>
        <p className="font-poppins text-gray-400 mt-3 tracking-widest uppercase text-xs md:text-sm">Close your eyes and make a wish</p>
      </div>

      {/* The Night Sky / Starlight Background Layer */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent" />

      {/* The Shooting Star Animation */}
      <AnimatePresence>
        {wished && (
          <motion.div
            initial={{ x: "-50vw", y: "-50vh", scale: 0, opacity: 0 }}
            animate={{ x: "150vw", y: "150vh", scale: 1, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-64 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-white rounded-full z-10 blur-[1px]"
            style={{ rotate: "45deg", filter: "drop-shadow(0 0 20px #D4AF37)" }}
          >
            {/* The star head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_30px_#ffffff,0_0_50px_#D4AF37]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 flex flex-col items-center justify-center h-[50vh] mt-20">
        <AnimatePresence mode="wait">
          {!wished ? (
            <motion.div 
              key="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <CinematicButton onClick={handleMakeWish}>
                Toota Taara Bulao 🌠
              </CinematicButton>
            </motion.div>
          ) : (
            <motion.div 
              key="message"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, delay: 1 }}
              className="text-center"
            >
              <h3 className="font-playfair text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFB6C1] via-[#ffffff] to-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
                Tumhari Har Dua Qabool Ho ✨
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
