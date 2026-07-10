"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";

export default function LaunchTimer({ children }: { children: React.ReactNode }) {
  const [isLaunched, setIsLaunched] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { setAppMode } = useStore();

  useEffect(() => {
    setMounted(true);
    
    // Always require password on mount
    document.body.style.overflow = "hidden";
  }, [setAppMode]);

  useEffect(() => {
    if (!isLaunched && mounted) {
      document.body.style.overflow = "hidden";
    }
  }, [isLaunched, mounted]);

  const handleSubmit = () => {
    const val = password.trim();
    if (val === "HAPPY") {
      setAppMode("family");
      setIsLaunched(true);
      document.body.style.overflow = "";
    } else if (val === "1437") {
      setAppMode("private");
      setIsLaunched(true);
      document.body.style.overflow = "";
    } else {
      setErrorMsg("Incorrect Password. Please try again.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <>
      <div style={{ visibility: isLaunched ? 'visible' : 'hidden', opacity: isLaunched ? 1 : 0, transition: 'opacity 1.5s ease-in-out' }}>
        {children}
      </div>
      
      <AnimatePresence>
        {!isLaunched && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden font-poppins"
          >
            {/* Elegant Background: Starry/Dust Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
              {mounted && [...Array(20)].map((_, i) => {
                const duration = 5 + Math.random() * 5;
                const delay = Math.random() * 5;
                const left = `${Math.random() * 100}%`;
                const top = `${Math.random() * 100}%`;
                return (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -100, 0],
                      opacity: [0, 0.5, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      delay,
                      ease: "easeInOut"
                    }}
                    className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
                    style={{ left, top }}
                  />
                );
              })}
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center">
              
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                className="text-4xl md:text-6xl lg:text-7xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-6 text-center"
                style={{ textShadow: '0 0 40px rgba(212, 175, 55, 0.3)' }}
              >
                Welcome ❤️
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1.5 }}
                className="flex flex-col items-center justify-center relative w-full"
              >
                <p className="text-sm md:text-base font-poppins text-white/70 max-w-lg mx-auto leading-relaxed text-center font-light pt-4 mb-10">
                  This birthday website has two different experiences.<br />
                  Please enter the password to continue.
                </p>
                
                <div className="flex flex-col items-center gap-6">
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubmit();
                    }}
                    className="bg-white/5 border border-[#D4AF37]/30 text-white/90 text-center focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 transition-all rounded-full px-6 py-3 font-poppins text-sm w-64 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  />
                  
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            </div>
            
            {/* Error Popup */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-10 px-6 py-3 bg-red-500/20 border border-red-500/50 backdrop-blur-md rounded-full text-white text-sm font-poppins"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
