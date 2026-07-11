"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import Day1_Mission from "./pre_event/Day1_Mission";
import Day2_Mission from "./pre_event/Day2_Mission";
import CountdownLock from "./pre_event/CountdownLock";
import UnlockCeremony from "./pre_event/UnlockCeremony";

const TARGET_DATE = new Date("2026-07-13T13:00:00");

export default function LaunchTimer({ children }: { children: React.ReactNode }) {
  const [isLaunched, setIsLaunched] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setAppMode } = useStore();
  
  const [preEventType, setPreEventType] = useState<"day1" | "day2" | "none">("none");
  const [isTimeLocked, setIsTimeLocked] = useState(true);
  const [initialUnlocked, setInitialUnlocked] = useState(false);
  
  const wasLockedRef = useRef(true);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    // Initial check
    const initialLock = new Date() < TARGET_DATE;
    setIsTimeLocked(initialLock);
    setInitialUnlocked(!initialLock);
    wasLockedRef.current = initialLock;

    // Real-time security tick (updates every second)
    const interval = setInterval(() => {
      const now = new Date();
      const currentLock = now < TARGET_DATE;
      setIsTimeLocked(currentLock);

      if (wasLockedRef.current && !currentLock) {
        wasLockedRef.current = false;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLaunched && mounted) {
      document.body.style.overflow = "hidden";
    }
  }, [isLaunched, mounted]);

  const handlePreEventUnlock = () => {
    setAppMode("family");
    setIsLaunched(true);
    document.body.style.overflow = "";
  };

  const handleLaunch = (mode: "family" | "private") => {
    setAppMode(mode);
    setIsLaunched(true);
    document.body.style.overflow = "";
  };

  // Prevent hydration issues
  if (!mounted) return null;

  return (
    <>
      <div style={{ visibility: isLaunched ? 'visible' : 'hidden', opacity: isLaunched ? 1 : 0, transition: 'opacity 1.5s ease-in-out' }}>
        {children}
      </div>
      
      <AnimatePresence>
        {!isLaunched && preEventType === "day1" && (
          <Day1_Mission />
        )}
        
        {!isLaunched && preEventType === "day2" && (
          <Day2_Mission onUnlock={handlePreEventUnlock} />
        )}
        
        {!isLaunched && preEventType === "none" && (
          <div className="fixed inset-0 z-[9999] bg-[#020202]">
            <AnimatePresence mode="wait">
              {isTimeLocked ? (
                /* 1. COUNTDOWN LOCK SCREEN */
                <motion.div 
                  key="countdown" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <CountdownLock 
                    targetDate={TARGET_DATE} 
                    onUnlock={() => {}} 
                    onEnterPreEvent={(day) => setPreEventType(day)}
                  />
                </motion.div>
              ) : (
                /* 2. CELBRATION UNLOCK CEREMONY */
                <motion.div 
                  key="ceremony" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <UnlockCeremony 
                    startScene={initialUnlocked ? 5 : 1} 
                    onLaunch={handleLaunch} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
