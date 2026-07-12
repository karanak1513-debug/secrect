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
import GrandFinaleSequence from "./pre_event/GrandFinaleSequence";
import MidnightBirthdayScreen from "./MidnightBirthdayScreen";
import { TEST_MODE } from "@/config";
import { sfx } from "@/utils/sfx";

const MIDNIGHT_DATE = new Date("2026-07-13T00:00:00");
const TARGET_DATE = new Date("2026-07-13T13:00:00");

export default function LaunchTimer({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { setAppMode } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return TEST_MODE ? (
    <TestModeContainer setAppMode={setAppMode}>{children}</TestModeContainer>
  ) : (
    <ProductionModeContainer setAppMode={setAppMode}>{children}</ProductionModeContainer>
  );
}

/* ==========================================
   1. TEST MODE CONTAINER (UNIFIED SCREEN MACHINE)
   ========================================== */
function TestModeContainer({
  children,
  setAppMode,
}: {
  children: React.ReactNode;
  setAppMode: (mode: "family" | "private" | null) => void;
}) {
  const [testScreen, setTestScreen] = useState<
    "landing" | "day1" | "day1_countdown" | "day2" | "grandFinale" | "timeline" | "midnight" | "unlock" | "family" | "private"
  >("landing");

  // Keep appMode in store synced for child layouts
  useEffect(() => {
    if (testScreen === "family") {
      setAppMode("family");
    } else if (testScreen === "private") {
      setAppMode("private");
    } else {
      setAppMode(null);
    }
  }, [testScreen, setAppMode]);

  // Back button history lock (prevents backing out of test states)
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [testScreen]);

  const showContent = testScreen === "family" || testScreen === "private";

  return (
    <>
      {/* App content layer (visible only when family or private is selected) */}
      <div
        style={{
          visibility: showContent ? "visible" : "hidden",
          opacity: showContent ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }}
      >
        {children}
      </div>

      {/* Screen Layer (strictly mounts only ONE screen at a time based on testScreen) */}
      {!showContent && (
        <div className="fixed inset-0 z-[9999] bg-[#020202] overflow-hidden flex items-center justify-center">
          <GoldenParticles />
          <AnimatePresence mode="wait">
            {testScreen === "landing" && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <CountdownLock
                  targetDate={MIDNIGHT_DATE}
                  onUnlock={() => {}}
                  onEnterPreEvent={() => {
                    sfx.playTransition();
                    setTestScreen("day1");
                  }}
                />
              </motion.div>
            )}

            {testScreen === "day1" && (
              <motion.div
                key="day1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <Day1_Mission
                  onTimeUp={() => setTestScreen("day1_countdown")}
                  onReturnLater={() => setTestScreen("landing")}
                />
              </motion.div>
            )}

            {testScreen === "day1_countdown" && (
              <motion.div
                key="day1_countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <Day1_CompletionCountdown
                  onTimeUp={() => setTestScreen("day2")}
                  onReturnLater={() => setTestScreen("landing")}
                />
              </motion.div>
            )}

            {testScreen === "day2" && (
              <motion.div
                key="day2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <Day2_Mission
                  onUnlock={() => setTestScreen("midnight")}
                  onCompleteDay2={() => setTestScreen("grandFinale")}
                />
              </motion.div>
            )}

            {testScreen === "grandFinale" && (
              <motion.div
                key="grandFinale"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <GrandFinaleSequence onComplete={() => setTestScreen("timeline")} />
              </motion.div>
            )}

            {testScreen === "timeline" && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <Day2_CompletionCountdown onUnlock={() => setTestScreen("midnight")} />
              </motion.div>
            )}

            {testScreen === "midnight" && (
              <motion.div
                key="midnight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <MidnightBirthdayScreen
                  targetDate={TARGET_DATE}
                  onPlayUnlock={() => setTestScreen("unlock")}
                />
              </motion.div>
            )}

            {testScreen === "unlock" && (
              <motion.div
                key="unlock"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <UnlockCeremony startScene={1} onLaunch={(mode) => setTestScreen(mode)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Test Panel (Updates only the current screen state) */}
      <DevTestPanelForTestMode currentScreen={testScreen} setCurrentScreen={setTestScreen} />
    </>
  );
}

function DevTestPanelForTestMode({
  currentScreen,
  setCurrentScreen,
}: {
  currentScreen: string;
  setCurrentScreen: (s: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectFlow = (flow: string) => {
    sfx.playClick();
    if (flow === "restart") {
      localStorage.clear();
      window.location.reload();
    } else if (flow === "reset_localstorage") {
      localStorage.clear();
      alert("localStorage cleared successfully!");
    } else {
      // Sync localStorage with matching debug shortcut target
      if (flow === "day1") {
        localStorage.removeItem("preEvent_day1_completed");
        localStorage.removeItem("preEvent_day2_completed");
        localStorage.removeItem("grand_finale_completed");
      } else if (flow === "day1_countdown") {
        localStorage.setItem("preEvent_day1_completed", "true");
        localStorage.removeItem("preEvent_day2_completed");
        localStorage.removeItem("grand_finale_completed");
      } else if (flow === "day2") {
        localStorage.setItem("preEvent_day1_completed", "true");
        localStorage.removeItem("preEvent_day2_completed");
        localStorage.removeItem("grand_finale_completed");
      } else if (flow === "grandFinale") {
        localStorage.setItem("preEvent_day1_completed", "true");
        localStorage.setItem("preEvent_day2_completed", "true");
        localStorage.removeItem("grand_finale_completed");
      } else if (flow === "timeline") {
        localStorage.setItem("preEvent_day1_completed", "true");
        localStorage.setItem("preEvent_day2_completed", "true");
        localStorage.setItem("grand_finale_completed", "true");
      }
      setCurrentScreen(flow);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col items-end gap-3 font-mono text-[11px] text-white">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-black/90 backdrop-blur-xl p-5 rounded-2xl border border-[#D4AF37]/35 shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-60 flex flex-col gap-3.5 text-left select-none"
          >
            <div className="text-[#D4AF37] font-bold border-b border-[#D4AF37]/25 pb-1 flex justify-between items-center">
              <span>🛠️ DEV TEST PANEL</span>
              <span className="text-[9px] text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">ACTIVE</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-white/40 tracking-wider font-semibold uppercase">TIMELINES</span>
              {[
                { id: "landing", label: "Landing Page" },
                { id: "day1", label: "Start Day 1" },
                { id: "day1_countdown", label: "Complete Day 1" },
                { id: "day2", label: "Start Day 2" },
                { id: "grandFinale", label: "Open Grand Finale" },
                { id: "timeline", label: "Open Birthday Timeline" },
                { id: "midnight", label: "Open Midnight Birthday Wish" },
                { id: "unlock", label: "Play Unlock Ceremony" },
              ].map((btn, idx) => (
                <button
                  key={`${btn.id}-${idx}`}
                  onClick={() => selectFlow(btn.id)}
                  className={`px-2.5 py-1 rounded border text-left cursor-pointer transition-all ${
                    currentScreen === btn.id
                      ? "bg-[#D4AF37]/25 border-[#D4AF37] text-white font-bold"
                      : "bg-white/5 border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 text-white/80"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-white/40 tracking-wider font-semibold uppercase">LAUNCH APPS</span>
              {[
                { id: "family", label: "Open Family Mode" },
                { id: "private", label: "Open Private Mode" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => selectFlow(btn.id)}
                  className={`px-2.5 py-1 rounded border text-left cursor-pointer transition-all ${
                    currentScreen === btn.id
                      ? "bg-[#D4AF37]/35 border-[#D4AF37] text-[#FFF3B0] font-bold"
                      : "bg-[#D4AF37]/10 border-[#D4AF37]/20 hover:border-[#D4AF37]/55 hover:bg-[#D4AF37]/15 text-[#FFF3B0]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 mt-1 border-t border-white/10 pt-2.5">
              <button
                onClick={() => selectFlow("restart")}
                className="px-2.5 py-1.5 rounded bg-red-950/40 border border-red-500/20 hover:border-red-500/50 hover:bg-red-950/60 text-red-400 transition-all text-center cursor-pointer font-bold uppercase text-[9px]"
              >
                Restart Journey
              </button>

              <button
                onClick={() => selectFlow("reset_localstorage")}
                className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition-all text-center cursor-pointer uppercase text-[9px]"
              >
                Reset localStorage
              </button>
            </div>
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

/* ==========================================
   2. PRODUCTION MODE CONTAINER (TIME-SECURE FLOW)
   ========================================== */
function ProductionModeContainer({
  children,
  setAppMode,
}: {
  children: React.ReactNode;
  setAppMode: (mode: "family" | "private" | null) => void;
}) {
  const [isLaunched, setIsLaunched] = useState(false);
  const [preEventActive, setPreEventActive] = useState(false);
  const [showPreEventTransition, setShowPreEventTransition] = useState(false);
  const [currentPreEventState, setCurrentPreEventState] = useState<
    "day1_playing" | "day1_countdown" | "day2_playing" | "day2_countdown" | "grand_finale"
  >("day1_playing");
  const [bypassMode, setBypassMode] = useState<"day1" | "day2" | null>(null);
  const [lockPhase, setLockPhase] = useState<"pre_event" | "midnight" | "unlocked">("pre_event");
  const [initialUnlocked, setInitialUnlocked] = useState(false);

  const wasLockedRef = useRef(true);

  const updatePreEventRoute = () => {
    const day1Completed = localStorage.getItem("preEvent_day1_completed") === "true";
    const day2Completed = localStorage.getItem("preEvent_day2_completed") === "true";
    const finaleCompleted = localStorage.getItem("grand_finale_completed") === "true";

    if (!day1Completed) {
      setCurrentPreEventState("day1_playing");
    } else if (!day2Completed) {
      setCurrentPreEventState("day2_playing");
    } else if (!finaleCompleted) {
      setCurrentPreEventState("grand_finale");
    } else {
      setCurrentPreEventState("day2_countdown");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const getPhase = (date: Date) => {
      if (date < MIDNIGHT_DATE) return "pre_event";
      if (date < TARGET_DATE) return "midnight";
      return "unlocked";
    };

    const now = new Date();
    const initialPhase = getPhase(now);
    setLockPhase(initialPhase);
    setInitialUnlocked(initialPhase === "unlocked");
    wasLockedRef.current = initialPhase !== "unlocked";

    updatePreEventRoute();

    // Real-time tick checking date transitions
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentPhase = getPhase(currentTime);

      setLockPhase((prev) => {
        if (prev !== currentPhase) {
          if (currentPhase === "unlocked") {
            setInitialUnlocked(false);
          }
          return currentPhase;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLaunched) {
      document.body.style.overflow = "hidden";
    }
  }, [isLaunched]);

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

  return (
    <>
      <div
        style={{
          visibility: isLaunched ? "visible" : "hidden",
          opacity: isLaunched ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }}
      >
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
              <Day2_Mission
                onUnlock={handlePreEventUnlock}
                onCompleteDay2={() => {
                  localStorage.setItem("preEvent_day2_completed", "true");
                  updatePreEventRoute();
                }}
              />
            )}

            {!bypassMode && preEventActive && (
              <>
                {currentPreEventState === "day1_playing" && (
                  <Day1_Mission
                    onTimeUp={updatePreEventRoute}
                    onReturnLater={() => setPreEventActive(false)}
                  />
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
                  <Day2_Mission
                    onUnlock={handlePreEventUnlock}
                    onCompleteDay2={() => {
                      localStorage.setItem("preEvent_day2_completed", "true");
                      updatePreEventRoute();
                    }}
                  />
                )}
                {currentPreEventState === "grand_finale" && (
                  <GrandFinaleSequence
                    onComplete={() => {
                      localStorage.setItem("grand_finale_completed", "true");
                      updatePreEventRoute();
                    }}
                  />
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
                <motion.div
                  key="ceremony"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <UnlockCeremony startScene={initialUnlocked ? 5 : 1} onLaunch={handleLaunch} />
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
    </>
  );
}
