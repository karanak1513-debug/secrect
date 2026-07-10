"use client";

import { motion } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";

export default function Screen1_FamilyWelcome() {
  const { setCurrentScreen } = useStore();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl text-center z-10"
      >
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-3xl md:text-5xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-8"
        >
          Welcome to Anushka's Birthday Celebration 🎉
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="space-y-6 text-white/80 font-poppins text-sm md:text-base font-light leading-relaxed mb-12"
        >
          <p>
            Thank you for visiting this special birthday website.
          </p>
          <p>
            This little celebration has been created with lots of love to make Anushka's birthday even more memorable.
          </p>
          <p>
            We hope this journey brings a smile to your face and reminds you of all the wonderful memories she has created over the years.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          onClick={() => setCurrentScreen(2)}
          className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          Begin Celebration →
        </motion.button>
      </motion.div>
    </div>
  );
}
