"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_DATE = new Date("2026-07-13T00:00:00+05:30").getTime();

export default function LaunchTimer({ children }: { children: React.ReactNode }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isLaunched, setIsLaunched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        setIsLaunched(true);
        setTimeLeft(null);
        document.body.style.overflow = ""; // Re-enable scrolling
        return;
      }

      setIsLaunched(false);
      document.body.style.overflow = "hidden"; // Disable scrolling

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft(); // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_70%)]" />
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 0.5, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut"
                  }}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full blur-[1px]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center">
              
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                className="text-4xl md:text-6xl lg:text-7xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 mb-20 text-center"
                style={{ textShadow: '0 0 40px rgba(234, 179, 8, 0.3)' }}
              >
                Project Preview
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.2 }}
                className="flex items-center justify-center gap-6 md:gap-16 w-full mb-20"
              >
                {[
                  { label: "Days", value: timeLeft?.days },
                  { label: "Hours", value: timeLeft?.hours },
                  { label: "Minutes", value: timeLeft?.minutes },
                  { label: "Seconds", value: timeLeft?.seconds },
                ].map((item, index) => (
                  <React.Fragment key={item.label}>
                    <div className="flex flex-col items-center group">
                      <motion.span 
                        key={item.value}
                        initial={{ opacity: 0.5, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-playfair font-light text-white mb-4 tracking-tighter"
                        style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}
                      >
                        {item.value !== undefined ? String(item.value).padStart(2, '0') : "00"}
                      </motion.span>
                      <div className="w-8 md:w-12 h-[1px] bg-yellow-500/30 mb-4 transition-all duration-300 group-hover:w-full group-hover:bg-yellow-500/80" />
                      <span className="text-[10px] md:text-xs font-poppins text-yellow-500/70 uppercase tracking-[0.4em] font-medium">
                        {item.label}
                      </span>
                    </div>
                    {/* Add colons between numbers except for the last one */}
                    {index < 3 && (
                      <div className="text-3xl md:text-6xl font-playfair text-white/20 font-light -mt-12 hidden md:block animate-pulse">
                        :
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="flex flex-col items-center justify-center relative w-full"
              >
                <div className="absolute top-0 w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
                <p className="text-sm md:text-base font-poppins text-white/70 max-w-lg mx-auto leading-relaxed text-center font-light pt-8">
                  Countdown Module Test <br />
                  <span className="text-white/50 text-xs md:text-sm mt-1 block">Please verify that the countdown is displaying correctly.</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
