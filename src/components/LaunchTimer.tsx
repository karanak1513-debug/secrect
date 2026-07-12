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
import PreEventTransition from "./pre_event/PreEventTransition";
import MidnightBirthdayScreen from "./MidnightBirthdayScreen";
import { TEST_MODE } from "@/config";
import { sfx } from "@/utils/sfx";

const MIDNIGHT_DATE = new Date("2026-07-13T00:00:00");
const TARGET_DATE = new Date("2026-07-13T13:00:00");

export default function LaunchTimer({ children }: { children: React.ReactNode }) {
  const [isLaunched, setIsLaunched] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setAppMode } = useStore();
  
  const [preEventActive, setPreEventActive] = useState(false);
  const [showPreEventTransition, setShowPreEventTransition] = useState(false);
  const [currentPreEventState, setCurrentPreEventState] = useState<"day1_playing" | "day1_countdown" | "day2_playing" | "day2_countdown">("day1_playing");
  const [bypassMode, setBypassMode] = useState<"day1" | "day2" | null>(null);
  
  const [lockPhase, setLockPhase] = useState<"pre_event" | "midnight" | "unlocked">("pre_event");
  const [initialUnlocked, setInitialUnlocked] = useState(false);
  
  const wasLockedRef = useRef(true);

  const updatePreEventRoute = () => {
    const day1Completed = localStorage.getItem("preEvent_day1_completed") === "true";
    const day2Completed = localStorage.getItem("preEvent_day2_completed") === "true";

    if (!day1Completed) {
      setCurrentPreEventState("day1_playing");
    } else if (!day2Completed) {
      setCurrentPreEventState("day2_playing");
    } else {
      setCurrentPreEventState("day2_countdown");
    }
  };

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    // TEMPORARY BYPASS: Auto-complete Day 1 and Day 2 so you can see the countdown screen
    localStorage.setItem("preEvent_day1_completed", "true");
    localStorage.setItem("preEvent_day2_completed", "true");

    if (TEST_MODE) {
      // In TEST_MODE, start with unlocked ceremony bypassed, and ignore checks
      setLockPhase("unlocked");
      setInitialUnlocked(true);
      updatePreEventRoute();
      return;
    }

    const getPhase = (date: Date) => {
      if (date < MIDNIGHT_DATE) return "pre_event";
      if (date < TARGET_DATE) return "midnight";
      return "unlocked";
    };

    // Initial check
    const now = new Date();
    const initialPhase = getPhase(now);
    setLockPhase(initialPhase);
    setInitialUnlocked(initialPhase === "unlocked");
    wasLockedRef.current = initialPhase !== "unlocked";
    
    updatePreEventRoute();

    // Real-time security tick (updates every second)
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentPhase = getPhase(currentTime);
      
      setLockPhase(prev => {
        // Automatically hide the pre-event mission UI when we hit midnight or later
        if (prev === "pre_event" && (currentPhase === "midnight" || currentPhase === "unlocked")) {
          setPreEventActive(false);
          setBypassMode(null);
        }
        return currentPhase;
      });
      
      updatePreEventRoute();

      if (wasLockedRef.current && currentPhase === "unlocked") {
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
    if (TEST_MODE) {
      setPreEventActive(false);
      setBypassMode(null);
      setLockPhase("midnight");
    } else {
      setAppMode("family");
      setIsLaunched(true);
      document.body.style.overflow = "";
    }
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
          <motion.div 
            key="pre-event-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#020202] flex items-center justify-center overflow-hidden"
          >
            <GoldenParticles />
            {bypassMode === "day1" && (
              <Day1_Mission 
                onTimeUp={() => { 
                  setBypassMode(null); 
                  updatePreEventRoute(); 
                }} 
                onReturnLater={() => setBypassMode(null)} 
              />
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
                  <Day1_CompletionCountdown 
                    onTimeUp={() => { 
                      setBypassMode(null); 
                      updatePreEventRoute(); 
                    }} 
                    onReturnLater={() => setPreEventActive(false)} 
                  />
                )}
                {currentPreEventState === "day2_playing" && (
                  <Day2_Mission onUnlock={handlePreEventUnlock} />
                )}
                {currentPreEventState === "day2_countdown" && (
                  <Day2_CompletionCountdown onUnlock={handlePreEventUnlock} />
                )}
              </>
            )}
          </motion.div>
        )}
        
        {!isLaunched && !bypassMode && !preEventActive && (
          <motion.div 
            key="lock-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#020202] overflow-hidden"
          >
            <GoldenParticles />
            <AnimatePresence mode="wait">
              {lockPhase === "pre_event" && (
                /* 1. COUNTDOWN LOCK SCREEN */
                <motion.div 
                  key="countdown" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <CountdownLock 
                    targetDate={MIDNIGHT_DATE} 
                    onUnlock={() => {}} 
                    onEnterPreEvent={() => setShowPreEventTransition(true)}
                  />
                </motion.div>
              )}
              {lockPhase === "midnight" && (
                /* 2. MIDNIGHT BIRTHDAY WISH SCREEN */
                <motion.div 
                  key="midnight" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <MidnightBirthdayScreen 
                    targetDate={TARGET_DATE} 
                    onPlayUnlock={() => {
                      sfx.playUnlock();
                      setLockPhase("unlocked");
                    }}
                  />
                </motion.div>
              )}
              {lockPhase === "unlocked" && (
                /* 3. CELBRATION UNLOCK CEREMONY */
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
          </motion.div>
        )}
        {showPreEventTransition && (
          <PreEventTransition
            key="pre-event-transition"
            onComplete={() => {
              setShowPreEventTransition(false);
              setPreEventActive(true);
            }}
          />
        )}
      </AnimatePresence>

      {TEST_MODE && (
        <DevTestPanel
          isLaunched={isLaunched}
          setIsLaunched={setIsLaunched}
          preEventActive={preEventActive}
          setPreEventActive={setPreEventActive}
          bypassMode={bypassMode}
          setBypassMode={setBypassMode}
          currentPreEventState={currentPreEventState}
          setCurrentPreEventState={setCurrentPreEventState}
          lockPhase={lockPhase}
          setLockPhase={setLockPhase}
        />
      )}
    </>
  );
}

function DevTestPanel({
  isLaunched,
  setIsLaunched,
  preEventActive,
  setPreEventActive,
  bypassMode,
  setBypassMode,
  currentPreEventState,
  setCurrentPreEventState,
  lockPhase,
  setLockPhase,
}: {
  isLaunched: boolean;
  setIsLaunched: (v: boolean) => void;
  preEventActive: boolean;
  setPreEventActive: (v: boolean) => void;
  bypassMode: "day1" | "day2" | null;
  setBypassMode: (v: "day1" | "day2" | null) => void;
  currentPreEventState: "day1_playing" | "day1_countdown" | "day2_playing" | "day2_countdown";
  setCurrentPreEventState: (v: "day1_playing" | "day1_countdown" | "day2_playing" | "day2_countdown") => void;
  lockPhase: "pre_event" | "midnight" | "unlocked";
  setLockPhase: (v: "pre_event" | "midnight" | "unlocked") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { setAppMode } = useStore();

  const selectFlow = (flow: string) => {
    sfx.playClick();
    if (flow === "lock_screen") {
      setIsLaunched(false);
      setPreEventActive(false);
      setBypassMode(null);
      setLockPhase("pre_event");
    } else if (flow === "midnight_screen") {
      setIsLaunched(false);
      setPreEventActive(false);
      setBypassMode(null);
      setLockPhase("midnight");
    } else if (flow === "day1_mission") {
      setIsLaunched(false);
      setPreEventActive(true);
      setBypassMode("day1");
      setCurrentPreEventState("day1_playing");
      setLockPhase("pre_event");
    } else if (flow === "day1_completed") {
      setIsLaunched(false);
      setPreEventActive(true);
      setBypassMode(null);
      setCurrentPreEventState("day1_countdown");
      setLockPhase("pre_event");
    } else if (flow === "day2_mission") {
      setIsLaunched(false);
      setPreEventActive(true);
      setBypassMode("day2");
      setCurrentPreEventState("day2_playing");
      setLockPhase("pre_event");
    } else if (flow === "day2_completed") {
      setIsLaunched(false);
      setPreEventActive(true);
      setBypassMode(null);
      setCurrentPreEventState("day2_countdown");
      setLockPhase("pre_event");
    } else if (flow === "ceremony") {
      setIsLaunched(false);
      setPreEventActive(false);
      setBypassMode(null);
      setLockPhase("unlocked");
    } else if (flow === "app_private") {
      setAppMode("private");
      setIsLaunched(true);
      setPreEventActive(false);
    } else if (flow === "app_family") {
      setAppMode("family");
      setIsLaunched(true);
      setPreEventActive(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col items-end gap-3 font-mono text-[11px]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-black/90 backdrop-blur-xl p-5 rounded-2xl border border-[#D4AF37]/35 shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-60 flex flex-col gap-3.5 text-left"
          >
            <div className="text-[#D4AF37] font-bold border-b border-[#D4AF37]/25 pb-1 flex justify-between items-center">
              <span>🛠️ DEV TEST PANEL</span>
              <span className="text-[9px] text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">ACTIVE</span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-white/40 tracking-wider font-semibold uppercase">TIMELINES</span>
              {[
                { id: "lock_screen", label: "Countdown Lock Screen" },
                { id: "day1_mission", label: "Start Day 1" },
                { id: "day1_completed", label: "Complete Day 1" },
                { id: "day2_mission", label: "Start Day 2" },
                { id: "day2_completed", label: "Complete Day 2" },
                { id: "midnight_screen", label: "Open Midnight Birthday Screen" },
                { id: "ceremony", label: "Play Birthday Unlock Ceremony" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => selectFlow(btn.id)}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 text-white/80 hover:text-white transition-all text-left cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-white/40 tracking-wider font-semibold uppercase">LAUNCH APPS</span>
              {[
                { id: "app_private", label: "Open Private Mode" },
                { id: "app_family", label: "Open Family Mode" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => selectFlow(btn.id)}
                  className="px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:border-[#D4AF37]/55 hover:bg-[#D4AF37]/15 text-[#FFF3B0] transition-all text-left cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                sfx.playClick();
                localStorage.clear();
                window.location.reload();
              }}
              className="px-2.5 py-1 rounded bg-red-950/40 border border-red-500/20 hover:border-red-500/50 hover:bg-red-950/60 text-red-400 transition-all text-center cursor-pointer font-bold uppercase text-[9px]"
            >
              Restart Entire Journey
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          sfx.playClick();
          setIsOpen(!isOpen);
        }}
        className="w-12 h-12 bg-black/80 border border-[#D4AF37]/35 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer text-xl select-none"
      >
        ⚙️
      </motion.button>
    </div>
  );
}
