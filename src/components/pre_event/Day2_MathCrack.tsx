"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

type Question = { q: string; a: number };

function generateQ(): Question {
  const type = Math.floor(Math.random() * 4);
  if (type === 0) { const a = Math.floor(Math.random()*20)+5, b = Math.floor(Math.random()*20)+5; return { q: `${a} × ${b}`, a: a*b }; }
  if (type === 1) { const a = Math.floor(Math.random()*50)+50, b = Math.floor(Math.random()*30)+10; return { q: `${a} + ${b}`, a: a+b }; }
  if (type === 2) { const a = Math.floor(Math.random()*80)+20, b = Math.floor(Math.random()*20)+5; return { q: `${a} - ${b}`, a: a-b }; }
  const a = Math.floor(Math.random()*9)+2, b = Math.floor(Math.random()*9)+2; return { q: `${a*b} ÷ ${a}`, a: b };
}

function makeChoices(correct: number): number[] {
  const s = new Set([correct]);
  while (s.size < 4) s.add(correct + (Math.floor(Math.random()*20)-10 || (Math.random()>0.5?1:-1)));
  return [...s].sort(() => Math.random()-0.5);
}

export default function Day2_MathCrack({ onComplete }: { onComplete: () => void }) {
  const TOTAL = 5, TIME = 60;
  const [q, setQ] = useState<Question>(generateQ());
  const [choices, setChoices] = useState<number[]>([]);
  const [done, setDone] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [feedback, setFeedback] = useState<"correct"|"wrong"|null>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  const nextQ = useCallback(() => {
    const nq = generateQ(); setQ(nq); setChoices(makeChoices(nq.a));
  }, []);

  useEffect(() => { setChoices(makeChoices(q.a)); }, [q]);

  useEffect(() => {
    if (!started || failed) return;
    if (timeLeft <= 0) { setFailed(true); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft, failed]);

  const handleAnswer = (val: number) => {
    if (feedback) return;
    if (val === q.a) {
      sfx.playClick();
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(null);
        const nd = done + 1;
        setDone(nd);
        if (nd >= TOTAL) { setTimeout(onComplete, 600); }
        else nextQ();
      }, 500);
    } else {
      sfx.playError();
      setFeedback("wrong");
      setTimeout(() => { setFeedback(null); setDone(0); setTimeLeft(TIME); nextQ(); }, 800);
    }
  };

  const timerPct = (timeLeft / TIME) * 100;
  const timerColor = timeLeft > 30 ? "#D4AF37" : timeLeft > 15 ? "#f97316" : "#ef4444";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-1 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Math Cracker</h2>
        <p className="text-white/60 text-sm">Answer {TOTAL} rapid-fire math equations. One wrong resets progress.</p>
      </motion.div>

      {!started ? (
        <div className="glass-card w-full p-8 border border-white/10 flex flex-col items-center gap-6">
          <span className="text-5xl">🧮</span>
          <p className="text-white/70 text-sm text-center">5 correct in a row. Any wrong answer resets your progress. 60-second timer.</p>
          <button onClick={() => setStarted(true)} className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full text-xs tracking-wider uppercase cursor-pointer">
            Begin Challenge
          </button>
        </div>
      ) : failed ? (
        <div className="glass-card w-full p-8 border border-red-500/30 flex flex-col items-center gap-4">
          <span className="text-5xl">⏰</span>
          <p className="text-red-400 font-mono text-sm">TIME EXPIRED — SYSTEM LOCKED</p>
          <button onClick={() => { setFailed(false); setDone(0); setTimeLeft(TIME); nextQ(); }}
            className="px-8 py-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-full text-xs tracking-widest uppercase cursor-pointer">
            Retry
          </button>
        </div>
      ) : (
        <div className="glass-card w-full p-7 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center gap-6">
          {/* Timer bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" animate={{ width: `${timerPct}%` }} transition={{ duration: 0.5 }} style={{ backgroundColor: timerColor }} />
          </div>
          <div className="flex justify-between w-full text-xs font-mono">
            <span style={{ color: timerColor }}>{timeLeft}s</span>
            <span className="text-white/40">{done}/{TOTAL} correct</span>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < done ? "bg-green-400 shadow-[0_0_8px_#4ade80]" : "bg-white/15"}`} />
            ))}
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div key={q.q} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              className={`w-full rounded-2xl p-6 text-center border transition-all ${feedback === "correct" ? "border-green-400/60 bg-green-500/10" : feedback === "wrong" ? "border-red-400/60 bg-red-500/10" : "border-[#D4AF37]/20 bg-[#D4AF37]/5"}`}>
              <p className="text-4xl md:text-5xl font-playfair font-normal" style={{ color: feedback === "correct" ? "#4ade80" : feedback === "wrong" ? "#f87171" : "#FFF3B0" }}>
                {q.q} = ?
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Choices */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {choices.map(c => (
              <motion.button key={c} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleAnswer(c)} disabled={!!feedback}
                className="py-4 rounded-2xl border border-[#D4AF37]/25 bg-black/50 text-[#FFF3B0] text-xl font-playfair hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer disabled:opacity-50">
                {c}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
