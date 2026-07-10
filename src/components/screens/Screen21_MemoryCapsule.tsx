"use client";

import { motion } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";

export default function Screen21_MemoryCapsule() {
  const { setCurrentScreen } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="glass-card p-8 md:p-12 max-w-md w-full text-center z-20 border-white/40"
        style={{ boxShadow: "0 0 50px rgba(255,255,255,0.2)" }}
      >
        <h2 className="font-playfair text-2xl md:text-3xl text-white mb-8">
          Memory Capsule
        </h2>
        
        <div className="space-y-6 font-poppins text-white/80">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span>Created On</span>
            <span className="font-medium text-white">July 2026</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span>Total Memories</span>
            <span className="font-medium text-white">Infinite</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span>Love Loaded</span>
            <span className="font-medium text-white">100%</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-4xl mb-4"
          >
            💖
          </motion.div>
          <p className="font-playfair text-lg text-pink-100 italic">
            Made with ❤️ just for Anushka.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 z-20 flex justify-center w-full"
      >
        <CinematicButton variant="secondary" onClick={() => setCurrentScreen(1)}>
          Replay Journey 🔄
        </CinematicButton>
      </motion.div>
    </motion.div>
  );
}
