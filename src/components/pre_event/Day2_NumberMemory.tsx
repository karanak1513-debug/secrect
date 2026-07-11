"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

const TARGET_SEQUENCE_LENGTH = 5;

export default function Day2_NumberMemory({ onComplete }: { onComplete: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "waiting" | "success" | "fail">("idle");
  const [level, setLevel] = useState(1);

  const playSynthesizedTone = (num: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // Scale tone frequency with number (1 to 9 maps to C4 to D5 major pentatonic)
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
      const freq = scale[(num - 1) % scale.length];
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn("AudioContext tone failed", e);
    }
  };

  const startGame = () => {
    sfx.playClick();
    setStatus("playing");
    setLevel(1);
    const newSeq = [Math.floor(Math.random() * 9) + 1];
    setSequence(newSeq);
    setPlayerSequence([]);
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlayingSequence(true);
    setStatus("playing");
    
    await new Promise((r) => setTimeout(r, 1000));

    for (let i = 0; i < seq.length; i++) {
      const num = seq[i];
      setActiveNumber(num);
      playSynthesizedTone(num);
      await new Promise((r) => setTimeout(r, 550));
      setActiveNumber(null);
      await new Promise((r) => setTimeout(r, 200));
    }
    
    setIsPlayingSequence(false);
    setStatus("waiting");
  };

  const handleNumberClick = (num: number) => {
    if (isPlayingSequence || status !== "waiting") return;
    playSynthesizedTone(num);

    const newPlayerSeq = [...playerSequence, num];
    setPlayerSequence(newPlayerSeq);

    // Check if wrong
    const currentIndex = newPlayerSeq.length - 1;
    if (newPlayerSeq[currentIndex] !== sequence[currentIndex]) {
      sfx.playError();
      setStatus("fail");
      setTimeout(() => {
        setStatus("idle");
      }, 1800);
      return;
    }

    // Check if level complete
    if (newPlayerSeq.length === sequence.length) {
      if (sequence.length === TARGET_SEQUENCE_LENGTH) {
        setStatus("success");
        setTimeout(onComplete, 1200);
      } else {
        // Next level
        setTimeout(() => {
          setLevel((l) => l + 1);
          const nextSeq = [...sequence, Math.floor(Math.random() * 9) + 1];
          setSequence(nextSeq);
          setPlayerSequence([]);
          playSequence(nextSeq);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Number Memory</h2>
        <p className="text-white/60 text-sm mb-4">
          Remember and repeat the glowing sound coordinates sequence.
        </p>
        
        <div className="h-6 font-mono text-xs uppercase tracking-widest">
          <AnimatePresence mode="wait">
            {status === "fail" && (
              <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400">
                SYSTEM CORRUPTED. REBOOTING...
              </motion.span>
            )}
            {status === "success" && (
              <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-green-400">
                DECRYPTION MATCH CONFIRMED
              </motion.span>
            )}
            {status === "playing" && (
              <motion.span key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#D4AF37] animate-pulse">
                MONITORING PATTERN SYSTEM (Level {level}/{TARGET_SEQUENCE_LENGTH})
              </motion.span>
            )}
            {status === "waiting" && (
              <motion.span key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/70">
                INPUT RESPONSE PATTERN NOW
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Game Card */}
      <div className="glass-card w-full p-8 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center">
        {status === "idle" ? (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer text-xs tracking-wider uppercase"
          >
            Start Memory Sequence
          </motion.button>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={isPlayingSequence || status !== "waiting"}
                className={`w-18 h-18 md:w-22 md:h-22 rounded-2xl text-2xl md:text-3xl font-playfair flex items-center justify-center border transition-all cursor-pointer ${
                  activeNumber === num
                    ? "bg-[#D4AF37] border-white text-black scale-110 shadow-[0_0_30px_#D4AF37]"
                    : "bg-black/60 border-[#D4AF37]/25 text-[#D4AF37] hover:bg-white/5 hover:border-[#D4AF37]/50"
                }`}
                whileTap={(!isPlayingSequence && status === "waiting") ? { scale: 0.9, backgroundColor: "#D4AF37", color: "black", border: "2px solid #fff" } : {}}
              >
                {num}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
