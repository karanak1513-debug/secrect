"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

const WORDS = ["ANUSHKA","BIRTHDAY","FOREVER","DIAMOND","PRINCESS","BELOVED","MIRACLE","DESTINY","ETERNAL","PRECIOUS","CHERISH","RADIANT","TWILIGHT","MYSTERY","QUANTUM"];
const GRID_SIZE = 7;

function makeWordGrid(word: string) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => letters[Math.floor(Math.random() * 26)])
  );

  // Randomly place word horizontally or vertically
  const horizontal = Math.random() > 0.5;
  if (horizontal) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * (GRID_SIZE - word.length));
    for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i];
  } else {
    const row = Math.floor(Math.random() * (GRID_SIZE - word.length));
    const col = Math.floor(Math.random() * GRID_SIZE);
    for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i];
  }
  return grid;
}

export default function Day2_WordHunt({ onComplete }: { onComplete: () => void }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [word] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [started, setStarted] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => { setGrid(makeWordGrid(word)); }, [word]);



  const getKey = (r: number, c: number) => `${r}-${c}`;

  const toggleCell = (r: number, c: number) => {
    if (!started) return;
    const k = getKey(r, c);
    setSelected(prev => {
      const n = new Set(prev);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });
  };

  const checkWord = () => {
    const selArr = [...selected].map(k => { const [r, c] = k.split("-").map(Number); return { r, c }; });
    if (selArr.length !== word.length) { sfx.playError(); setSelected(new Set()); return; }
    // Sort and check horizontal / vertical match
    selArr.sort((a, b) => a.r !== b.r ? a.r - b.r : a.c - b.c);
    const formed = selArr.map(({ r, c }) => grid[r][c]).join("");
    if (formed === word) {
      sfx.playClick();
      setConfirmed(new Set(selected));
      setTimeout(onComplete, 800);
    } else {
      sfx.playError();
      setSelected(new Set());
    }
  };



  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-5 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-1 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Word Hunt</h2>
        <p className="text-white/60 text-sm">Find the hidden word in the letter grid by tapping each letter in order.</p>
      </motion.div>

      {!started ? (
        <div className="glass-card w-full p-8 border border-white/10 flex flex-col items-center gap-6">
          <span className="text-5xl">🔤</span>
          <p className="text-white/70 text-sm text-center">A secret word is hidden in the grid — horizontally or vertically. Select each letter one by one and submit.</p>
          <button onClick={() => setStarted(true)} className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full text-xs tracking-wider uppercase cursor-pointer">
            Start Hunt
          </button>
        </div>
      ) : (
        <div className="glass-card w-full p-5 border border-white/10 flex flex-col items-center gap-4">
          <div className="flex justify-between w-full text-xs font-mono">
            <span className="text-white/50">Find: <span className="text-[#D4AF37] font-bold tracking-widest">{word}</span></span>
            <span className="text-white/40">{selected.size} selected</span>
          </div>

          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {grid.map((row, r) => row.map((letter, c) => {
              const k = getKey(r, c);
              const isSel = selected.has(k);
              const isDone = confirmed.has(k);
              return (
                <motion.button key={k} whileTap={{ scale: 0.85 }} onClick={() => toggleCell(r, c)}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-lg text-sm font-bold border transition-all cursor-pointer
                    ${isDone ? "bg-green-500/40 border-green-400/70 text-green-200" :
                      isSel ? "bg-[#D4AF37] border-white text-black shadow-[0_0_12px_#D4AF37]" :
                      "bg-black/50 border-white/10 text-white/80 hover:bg-white/10"}`}>
                  {letter}
                </motion.button>
              );
            }))}
          </div>

          <div className="flex gap-3 w-full">
            <button onClick={() => setSelected(new Set())}
              className="flex-1 py-2.5 rounded-full border border-white/15 text-white/50 text-xs tracking-widest uppercase cursor-pointer hover:border-white/30 transition-all">
              Clear
            </button>
            <button onClick={checkWord}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full text-xs tracking-widest uppercase cursor-pointer">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
