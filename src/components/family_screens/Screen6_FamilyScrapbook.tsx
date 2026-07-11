"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import { sfx } from "@/utils/sfx";
import confetti from "canvas-confetti";

interface MemoryCard {
  title: string;
  desc: string;
  tag: string;
  emoji: string;
  color: string;
}

const MEMORIES: MemoryCard[] = [
  {
    title: "Midnight Cake Disappears",
    desc: "Every birthday starts with the midnight countdown — and everyone racing to steal the first slice before Anushka makes her wish!",
    tag: "TRADITION",
    emoji: "🎂",
    color: "#D4AF37"
  },
  {
    title: "The 2 AM Chef",
    desc: "Inventing gourmet versions of instant Maggi at 2 AM. A legendary culinary talent recognized by the whole family.",
    tag: "LEGEND",
    emoji: "🍳",
    color: "#E8A0BF"
  },
  {
    title: "Holiday Mode: ON",
    desc: "Packing 3 weeks in advance, taking 1000 photos on day one, and refusing to come back home. Family trips wouldn't be the same.",
    tag: "VACATION",
    emoji: "✈️",
    color: "#93C5FD"
  },
  {
    title: "Sibling Solidarity",
    desc: "Fighting over remotes, borrowing clothes uninvited — but instantly united when parents ask who broke the living room cup.",
    tag: "FAMILY",
    emoji: "🤝",
    color: "#86EFAC"
  }
];

export default function Screen6_FamilyMemories() {
  const { setCurrentScreen } = useStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const handleLike = (e: React.MouseEvent) => {
    sfx.playClick();
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(activeIdx)) { next.delete(activeIdx); } else { next.add(activeIdx); }
      return next;
    });
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    confetti({ particleCount: 40, spread: 60, origin: { x, y }, colors: ["#D4AF37", "#FFF3B0", "#EFA4A4", "#ffffff"] });
  };

  const handleNext = () => {
    sfx.playTransition();
    if (activeIdx < MEMORIES.length - 1) {
      setActiveIdx(activeIdx + 1);
    } else {
      setCurrentScreen(6);
    }
  };

  const handlePrev = () => {
    sfx.playClick();
    if (activeIdx > 0) setActiveIdx(activeIdx - 1);
  };

  const mem = MEMORIES[activeIdx];
  const isLiked = liked.has(activeIdx);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-5 relative overflow-hidden font-poppins text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.07)_0%,transparent_60%)] pointer-events-none" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-7 pointer-events-none">
        <span className="font-mono text-[10px] text-[#D4AF37] tracking-[0.3em] uppercase block mb-1">CHAPTER V</span>
        <h2 className="text-3xl md:text-4xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37]">
          Family Memories
        </h2>
      </motion.div>

      {/* Progress Dots */}
      <div className="flex gap-2 mb-7">
        {MEMORIES.map((_, i) => (
          <button key={i} onClick={() => { sfx.playClick(); setActiveIdx(i); }}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === activeIdx ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>

      {/* Memory Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="w-full max-w-md"
        >
          {/* Color Tag bar */}
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: mem.color }} />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold" style={{ color: mem.color }}>
              {mem.tag}
            </span>
            <span className="text-[10px] font-mono text-white/30 ml-auto">
              {activeIdx + 1} / {MEMORIES.length}
            </span>
          </div>

          {/* Main card */}
          <div
            className="rounded-3xl p-7 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(20,16,10,0.95) 100%)",
              border: `1px solid ${mem.color}30`,
              boxShadow: `0 0 40px ${mem.color}18, 0 20px 50px rgba(0,0,0,0.7)`
            }}
          >
            {/* Subtle glow blob */}
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: mem.color }}
            />

            {/* Emoji Badge */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 relative z-10"
              style={{
                background: `${mem.color}18`,
                border: `1px solid ${mem.color}35`,
                boxShadow: `0 4px 20px ${mem.color}20`
              }}
            >
              <motion.span
                animate={{ rotate: [0, -4, 4, -2, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {mem.emoji}
              </motion.span>
            </div>

            <h3 className="text-2xl font-playfair text-white font-normal mb-3 leading-tight relative z-10">
              {mem.title}
            </h3>
            <p className="text-white/65 text-sm font-light leading-relaxed mb-7 font-poppins relative z-10">
              {mem.desc}
            </p>

            {/* Action Row */}
            <div className="flex items-center justify-between border-t relative z-10" style={{ borderColor: `${mem.color}20`, paddingTop: "1.25rem" }}>
              <div className="flex items-center gap-3">
                {/* Like */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handleLike}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base cursor-pointer transition-all"
                  style={{
                    background: isLiked ? "#D4AF3725" : "rgba(255,255,255,0.04)",
                    border: isLiked ? "1px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)"
                  }}
                >
                  {isLiked ? "❤️" : "🤍"}
                </motion.button>

                {/* Prev */}
                {activeIdx > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrev}
                    className="px-4 py-2 rounded-full text-[10px] tracking-widest uppercase font-medium cursor-pointer transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                  >
                    ← Back
                  </motion.button>
                )}
              </div>

              {/* Next */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full text-[10px] tracking-widest uppercase font-bold cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${mem.color} 0%, #FFF3B0 100%)`,
                  color: "#000",
                  boxShadow: `0 4px 20px ${mem.color}40`
                }}
              >
                {activeIdx < MEMORIES.length - 1 ? "Next Memory →" : "Blessing Board →"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
