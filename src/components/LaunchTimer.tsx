"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import Day1_Mission from "./pre_event/Day1_Mission";
import Day2_Mission from "./pre_event/Day2_Mission";
import CountdownLock from "./pre_event/CountdownLock";
import UnlockCeremony from "./pre_event/UnlockCeremony";
import Day1_CompletionCountdown from "./pre_event/Day1_CompletionCountdown";
import Day2_CompletionCountdown from "./pre_event/Day2_CompletionCountdown";
import GoldenParticles from "./pre_event/GoldenParticles";

const TARGET_DATE = new Date("2026-07-13T13:00:00");

export default function LaunchTimer({ children }: { children: React.ReactNode }) {
  const [isLaunched, setIsLaunched] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setAppMode } = useStore();
  
  const [preEventActive, setPreEventActive] = useState(false);
  const [currentPreEventState, setCurrentPreEventState] = useState<"day1_playing" | "day1_countdown" | "day2_playing" | "day2_countdown">("day1_playing");
  const [bypassMode, setBypassMode] = useState<"day1" | "day2" | null>(null);
  
  const [isTimeLocked, setIsTimeLocked] = useState(true);
  const [initialUnlocked, setInitialUnlocked] = useState(false);
  
  const wasLockedRef = useRef(true);

  const updatePreEventRoute = () => {
    const day1Completed = localStorage.getItem("preEvent_day1_completed") === "true";
    const day2Completed = localStorage.getItem("preEvent_day2_completed") === "true";
    const now = new Date();
    const targetDay2Date = new Date("2026-07-12T00:00:00");

    if (!day1Completed) {
      setCurrentPreEventState("day1_playing");
    } else if (now < targetDay2Date) {
      setCurrentPreEventState("day1_countdown");
    } else if (!day2Completed) {
      setCurrentPreEventState("day2_playing");
    } else {
      setCurrentPreEventState("day2_countdown");
    }
  };

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    // Initial check
    const initialLock = new Date() < TARGET_DATE;
    setIsTimeLocked(initialLock);
    setInitialUnlocked(!initialLock);
    wasLockedRef.current = initialLock;
    
    updatePreEventRoute();

    // Real-time security tick (updates every second)
    const interval = setInterval(() => {
      const now = new Date();
      const currentLock = now < TARGET_DATE;
      setIsTimeLocked(currentLock);
      updatePreEventRoute();

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
        {!isLaunched && (bypassMode || preEventActive) && (
          <div className="fixed inset-0 z-[9999] bg-[#020202] flex items-center justify-center overflow-hidden">
            <GoldenParticles />
            {/* Developer Bypasses */}
            {bypassMode === "day1" && (
              <Day1_Mission onTimeUp={updatePreEventRoute} onReturnLater={() => setBypassMode(null)} />
            )}
            {bypassMode === "day2" && (
              <Day2_Mission onUnlock={handlePreEventUnlock} />
            )}

            {/* Standard Sequential Pre-Event Flow */}
            {!bypassMode && preEventActive && (
              <>
                {currentPreEventState === "day1_playing" && (
                  <Day1_Mission onTimeUp={updatePreEventRoute} onReturnLater={() => setPreEventActive(false)} />
                )}
                {currentPreEventState === "day1_countdown" && (
                  <Day1_CompletionCountdown onTimeUp={updatePreEventRoute} onReturnLater={() => setPreEventActive(false)} />
                )}
                {currentPreEventState === "day2_playing" && (
                  <Day2_Mission onUnlock={handlePreEventUnlock} />
                )}
                {currentPreEventState === "day2_countdown" && (
                  <Day2_CompletionCountdown onUnlock={handlePreEventUnlock} />
                )}
              </>
            )}
          </div>
        )}
        
        {!isLaunched && !bypassMode && !preEventActive && (
          <div className="fixed inset-0 z-[9999] bg-[#020202] overflow-hidden">
            <GoldenParticles />
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
                    onEnterPreEvent={() => setPreEventActive(true)}
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
