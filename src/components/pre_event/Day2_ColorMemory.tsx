"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

const SEQUENCE_LENGTH = 6;
const COLORS = [
  { id: 0, color: "#D4AF37", label: "Gold" },
  { id: 1, color: "#60A5FA", label: "Blue" },
  { id: 2, color: "#F87171", label: "Red" },
  { id: 3, color: "#4ADE80", label: "Green" },
];

function genSeq() {
  return Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * 4));
}

export default function Day2_ColorMemory({ onComplete }: { onComplete: () => void }) {
  const [seq, setSeq] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "show" | "input" | "success" | "fail">("idle");
  const [round, setRound] = useState(1);
  const TOTAL_ROUNDS = 3;

  const playSeq = async (s: number[]) => {
    setPhase("show");
    setPlayerSeq([]);
    await new Promise(r => setTimeout(r, 800));
    for (const id of s) {
      setActiveIdx(id);
      sfx.playClick();
      await new Promise(r => setTimeout(r, 650));
      setActiveIdx(null);
      await new Promise(r => setTimeout(r, 250));
    }
    setPhase("input");
  };

  const startRound = (r: number) => {
    const s = genSeq();
    setSeq(s);
    playSeq(s);
  };

  const handleColor = (id: number) => {
    if (phase !== "input") return;
    sfx.playClick();
    const np = [...playerSeq, id];
    const idx = np.length - 1;
    if (np[idx] !== seq[idx]) {
      sfx.playError();
      setPhase("fail");
      return;
    }
    setPlayerSeq(np);
    if (np.length === seq.length) {
      if (round >= TOTAL_ROUNDS) {
        setPhase("success");
        setTimeout(onComplete, 800);
      } else {
        setPhase("idle");
        setTimeout(() => { setRound(r => r + 1); startRound(round + 1); }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-1 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Color Cipher</h2>
        <p className="text-white/60 text-sm">Watch the 6-color flash sequence. Repeat it perfectly — 3 rounds to win.</p>
      </motion.div>

      <div className="glass-card w-full p-8 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center gap-7">
        {/* Status */}
        <div className="h-6 font-mono text-xs uppercase tracking-widest text-center">
          <AnimatePresence mode="wait">
            {phase === "idle" && <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/50">Get ready...</motion.span>}
            {phase === "show" && <motion.span key="show" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#D4AF37] animate-pulse">Memorize the sequence...</motion.span>}
            {phase === "input" && <motion.span key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/80">Your turn! {playerSeq.length}/{seq.length}</motion.span>}
            {phase === "fail" && <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400">Wrong sequence!</motion.span>}
            {phase === "success" && <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400">All rounds complete!</motion.span>}
          </AnimatePresence>
        </div>

        {/* Round indicator */}
        <div className="flex gap-3">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < round - 1 ? "bg-green-400" : i === round - 1 ? "bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" : "bg-white/15"}`} />
          ))}
        </div>

        {/* Progress of current input */}
        <div className="flex gap-2">
          {Array.from({ length: SEQUENCE_LENGTH }).map((_, i) => (
            <div key={i} className={`w-5 h-2 rounded-full transition-all duration-200 ${i < playerSeq.length ? "bg-[#D4AF37]" : "bg-white/15"}`} />
          ))}
        </div>

        {/* Color buttons */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {COLORS.map(({ id, color }) => (
            <motion.button key={id}
              onClick={() => handleColor(id)}
              whileTap={phase === "input" ? { scale: 0.9 } : {}}
              disabled={phase !== "input"}
              className="h-20 rounded-2xl border-2 transition-all cursor-pointer disabled:opacity-40"
              animate={{ scale: activeIdx === id ? 1.15 : 1, opacity: activeIdx === id ? 1 : activeIdx !== null && phase === "show" ? 0.35 : 1 }}
              style={{
                backgroundColor: activeIdx === id ? color : `${color}22`,
                borderColor: activeIdx === id ? "#ffffff" : `${color}55`,
                boxShadow: activeIdx === id ? `0 0 30px ${color}, 0 0 60px ${color}80` : undefined,
              }}
            />
          ))}
        </div>

        {phase === "idle" && round === 1 && (
          <button onClick={() => startRound(1)} className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full text-xs tracking-wider uppercase cursor-pointer">
            Start Challenge
          </button>
        )}

        {phase === "fail" && (
          <button onClick={() => { setRound(1); setPlayerSeq([]); startRound(1); }}
            className="px-8 py-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-full text-xs tracking-widest uppercase cursor-pointer">
            Retry from Round 1
          </button>
        )}
      </div>
    </div>
  );
}
