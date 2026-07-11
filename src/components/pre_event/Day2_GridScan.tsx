"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

const TOTAL_TARGETS = 10;
const REQUIRED_HITS = 7;
const TARGET_LIFESPAN = 1400; // ms each target stays visible
const SPAWN_INTERVAL = 900;   // ms between spawns

interface Target {
  id: number;
  x: number; // percent
  y: number; // percent
}

export default function Day2_ReactionRush({ onComplete }: { onComplete: () => void }) {
  const [started, setStarted] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [hits, setHits] = useState(0);
  const [missed, setMissed] = useState(0);
  const [spawned, setSpawned] = useState(0);
  const [done, setDone] = useState(false);
  const [won, setWon] = useState(false);
  const [hitFlash, setHitFlash] = useState<number | null>(null);
  const idRef = useRef(0);
  const spawnedRef = useRef(0);
  const hitsRef = useRef(0);
  const missedRef = useRef(0);

  const endGame = useCallback((h: number, m: number) => {
    setDone(true);
    const didWin = h >= REQUIRED_HITS;
    setWon(didWin);
    if (didWin) setTimeout(onComplete, 900);
  }, [onComplete]);

  const spawnTarget = useCallback(() => {
    if (spawnedRef.current >= TOTAL_TARGETS) return;
    const id = ++idRef.current;
    spawnedRef.current += 1;
    setSpawned(spawnedRef.current);

    // Keep away from edges
    const x = 10 + Math.random() * 75;
    const y = 12 + Math.random() * 65;
    setTargets(prev => [...prev, { id, x, y }]);

    // Auto-remove after lifespan
    setTimeout(() => {
      setTargets(prev => {
        const stillThere = prev.find(t => t.id === id);
        if (stillThere) {
          // Missed this one
          missedRef.current += 1;
          setMissed(missedRef.current);
          const newMissed = missedRef.current;
          const newHits = hitsRef.current;
          if (spawnedRef.current >= TOTAL_TARGETS) {
            setTimeout(() => endGame(newHits, newMissed), 300);
          }
        }
        return prev.filter(t => t.id !== id);
      });
    }, TARGET_LIFESPAN);
  }, [endGame]);

  useEffect(() => {
    if (!started || done) return;
    if (spawnedRef.current >= TOTAL_TARGETS) return;

    const interval = setInterval(() => {
      spawnTarget();
      if (spawnedRef.current >= TOTAL_TARGETS) clearInterval(interval);
    }, SPAWN_INTERVAL);

    spawnTarget(); // spawn first immediately
    return () => clearInterval(interval);
  }, [started, done, spawnTarget]);

  const handleHit = (id: number) => {
    if (done) return;
    sfx.playClick();
    setHitFlash(id);
    setTimeout(() => setHitFlash(null), 300);
    setTargets(prev => prev.filter(t => t.id !== id));
    hitsRef.current += 1;
    setHits(hitsRef.current);

    if (spawnedRef.current >= TOTAL_TARGETS && hitsRef.current + missedRef.current >= TOTAL_TARGETS) {
      setTimeout(() => endGame(hitsRef.current, missedRef.current), 300);
    }
  };

  const reset = () => {
    setTargets([]); setHits(0); setMissed(0); setSpawned(0); setDone(false); setWon(false);
    spawnedRef.current = 0; hitsRef.current = 0; missedRef.current = 0; idRef.current = 0;
    setStarted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-1 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Reaction Rush</h2>
        <p className="text-white/60 text-sm">Tap the golden targets before they vanish. Hit {REQUIRED_HITS}/{TOTAL_TARGETS} to pass.</p>
      </motion.div>

      {!started && !done ? (
        <div className="glass-card w-full p-8 border border-white/10 flex flex-col items-center gap-6">
          <span className="text-5xl animate-bounce">🎯</span>
          <p className="text-white/70 text-sm text-center leading-relaxed">
            Golden orbs will appear at random positions.<br />
            Tap them fast before they disappear.<br />
            Hit <span className="text-[#D4AF37] font-bold">{REQUIRED_HITS} out of {TOTAL_TARGETS}</span> to unlock the next stage.
          </p>
          <button onClick={() => setStarted(true)}
            className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full text-xs tracking-wider uppercase cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            Start Rush
          </button>
        </div>
      ) : done ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className={`glass-card w-full p-8 border flex flex-col items-center gap-5 ${won ? "border-green-400/30" : "border-red-500/30"}`}>
          <span className="text-5xl">{won ? "🏆" : "💥"}</span>
          <p className={`font-mono text-sm tracking-widest ${won ? "text-green-400" : "text-red-400"}`}>
            {won ? `MISSION PASSED — ${hits}/${TOTAL_TARGETS} HITS` : `FAILED — ${hits}/${TOTAL_TARGETS} HITS`}
          </p>
          {/* Score bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(hits / TOTAL_TARGETS) * 100}%` }} transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${won ? "bg-green-400" : "bg-red-400"}`} />
          </div>
          {!won && (
            <button onClick={reset}
              className="px-8 py-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-full text-xs tracking-widest uppercase cursor-pointer">
              Try Again
            </button>
          )}
        </motion.div>
      ) : (
        /* GAME ARENA */
        <div className="w-full flex flex-col items-center gap-4">
          {/* HUD */}
          <div className="flex justify-between w-full max-w-sm text-xs font-mono px-2">
            <span className="text-green-400">✓ {hits} hits</span>
            <span className="text-white/40">{spawned}/{TOTAL_TARGETS}</span>
            <span className="text-red-400">✗ {missed} missed</span>
          </div>

          {/* Hit progress */}
          <div className="flex gap-1.5 w-full max-w-sm justify-center">
            {Array.from({ length: TOTAL_TARGETS }).map((_, i) => (
              <div key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i < hits ? "bg-green-400 shadow-[0_0_6px_#4ade80]" : i < hits + missed ? "bg-red-500/60" : "bg-white/10"}`} />
            ))}
          </div>

          {/* Arena */}
          <div className="relative w-full rounded-3xl border border-[#D4AF37]/15 bg-black/60 backdrop-blur-xl overflow-hidden"
            style={{ height: "380px" }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />

            <AnimatePresence>
              {targets.map(t => (
                <motion.button
                  key={t.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => handleHit(t.id)}
                  className="absolute cursor-pointer"
                  style={{ left: `${t.x}%`, top: `${t.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  {/* Pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: TARGET_LIFESPAN / 1000, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 w-14 h-14 -m-1 rounded-full border-2 border-[#D4AF37]"
                  />
                  {/* Shrinking timer ring */}
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: 0 }}
                    transition={{ duration: TARGET_LIFESPAN / 1000, ease: "linear" }}
                    className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/40 absolute inset-0"
                  />
                  {/* Core */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.7 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFF3B0] shadow-[0_0_20px_rgba(212,175,55,0.8),0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center"
                  >
                    <span className="text-black text-lg font-bold">✦</span>
                  </motion.div>
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Idle hint */}
            {spawned === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/20 text-sm font-mono animate-pulse">Targets incoming...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
