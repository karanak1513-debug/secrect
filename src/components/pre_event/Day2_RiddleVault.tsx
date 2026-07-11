"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

const RIDDLES = [
  { q: "I have cities but no houses. I have mountains but no trees. I have water but no fish. I have roads but no cars. What am I?", a: "map" },
  { q: "The more you take, the more you leave behind. What am I?", a: "footsteps" },
  { q: "I can fly without wings. I can cry without eyes. Wherever I go, darkness follows me. What am I?", a: "cloud" },
  { q: "I have a head and a tail, but no body. What am I?", a: "coin" },
  { q: "I speak without a mouth and hear without ears. I come alive with wind. What am I?", a: "echo" },
  { q: "The more you have of me, the less you see. What am I?", a: "darkness" },
  { q: "I run but never walk, I have a mouth but never talk. What am I?", a: "river" },
];

export default function Day2_RiddleVault({ onComplete }: { onComplete: () => void }) {
  const [riddles] = useState(() => {
    const shuffled = [...RIDDLES].sort(() => Math.random() - 0.5).slice(0, 3);
    return shuffled;
  });
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = answer.trim().toLowerCase();
    const expected = riddles[current].a.toLowerCase();
    // Allow partial matches (e.g. "footstep" for "footsteps")
    if (clean === expected || expected.startsWith(clean) && clean.length >= expected.length - 1) {
      sfx.playClick();
      const nc = correct + 1;
      setCorrect(nc);
      setAnswer("");
      setError("");
      if (current + 1 >= riddles.length) {
        setDone(true);
        setTimeout(onComplete, 800);
      } else {
        setCurrent(c => c + 1);
      }
    } else {
      sfx.playError();
      setError("Not quite... think harder.");
      setTimeout(() => setError(""), 2500);
    }
  };

  const skip = () => {
    sfx.playError();
    setError("You must solve it — no skipping!");
    setTimeout(() => setError(""), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-1 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Riddle Vault</h2>
        <p className="text-white/60 text-sm">Solve 3 riddles to crack the ancient vault. No skipping allowed.</p>
      </motion.div>

      <div className="glass-card w-full p-8 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center gap-6">
        {/* Progress */}
        <div className="flex gap-3 w-full justify-center">
          {riddles.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i < correct ? "bg-green-400" : i === current ? "bg-[#D4AF37]" : "bg-white/15"}`} />
          ))}
        </div>

        <span className="text-xs font-mono text-white/40 tracking-widest">{done ? "VAULT UNLOCKED" : `RIDDLE ${current + 1} OF ${riddles.length}`}</span>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-7 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-2 left-3 text-[#D4AF37]/30 font-mono text-xs">✦</div>
            <div className="absolute top-2 right-3 text-[#D4AF37]/30 font-mono text-xs">✦</div>
            <p className="text-[#FFF3B0] font-playfair text-lg italic text-center leading-relaxed">
              "{riddles[current]?.q}"
            </p>
          </motion.div>
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Your answer..."
              className="w-full bg-transparent border-b border-white/20 text-center text-lg font-poppins text-white focus:outline-none py-2.5 placeholder-white/20"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isFocused ? 1 : 0 }}
              transition={{ duration: 0.35 }}
              className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] shadow-[0_2px_10px_rgba(212,175,55,0.8)] origin-center"
            />
          </div>

          <button type="submit" className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer text-xs tracking-wider uppercase">
            Submit Answer
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-red-400 font-mono text-xs uppercase tracking-wider">
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
