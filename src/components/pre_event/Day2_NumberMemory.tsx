"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TARGET_SEQUENCE_LENGTH = 5;

export default function Day2_NumberMemory({ onComplete }: { onComplete: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "waiting" | "success" | "fail">("idle");
  const [level, setLevel] = useState(1);

  const startGame = () => {
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
    
    // Wait a bit before starting
    await new Promise((r) => setTimeout(r, 1000));

    for (let i = 0; i < seq.length; i++) {
      setActiveNumber(seq[i]);
      await new Promise((r) => setTimeout(r, 600));
      setActiveNumber(null);
      await new Promise((r) => setTimeout(r, 200));
    }
    
    setIsPlayingSequence(false);
    setStatus("waiting");
  };

  const handleNumberClick = (num: number) => {
    if (isPlayingSequence || status !== "waiting") return;

    const newPlayerSeq = [...playerSequence, num];
    setPlayerSequence(newPlayerSeq);

    // Check if wrong
    const currentIndex = newPlayerSeq.length - 1;
    if (newPlayerSeq[currentIndex] !== sequence[currentIndex]) {
      setStatus("fail");
      setTimeout(() => {
        // Restart from level 1
        setStatus("idle");
      }, 2000);
      return;
    }

    // Check if level complete
    if (newPlayerSeq.length === sequence.length) {
      if (sequence.length === TARGET_SEQUENCE_LENGTH) {
        setStatus("success");
        setTimeout(onComplete, 1500);
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
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Number Memory</h2>
        <p className="text-white/60 font-poppins text-sm mb-4">
          Remember and repeat the sequence. (Level {level}/{TARGET_SEQUENCE_LENGTH})
        </p>
        
        <div className="h-6">
          {status === "fail" && <span className="text-red-400 font-poppins">Incorrect! Restarting...</span>}
          {status === "success" && <span className="text-green-400 font-poppins">Perfect Memory!</span>}
          {status === "playing" && <span className="text-[#D4AF37] font-poppins">Watch carefully...</span>}
          {status === "waiting" && <span className="text-white/80 font-poppins">Your turn!</span>}
        </div>
      </motion.div>

      {status === "idle" ? (
        <button
          onClick={startGame}
          className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          Start Memory Test
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleNumberClick(num)}
              className={`w-20 h-20 rounded-xl text-3xl font-playfair flex items-center justify-center transition-all ${
                activeNumber === num
                  ? "bg-[#D4AF37] text-black scale-110 shadow-[0_0_25px_#D4AF37]"
                  : "bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-white/10"
              }`}
              whileTap={!isPlayingSequence ? { scale: 0.9, backgroundColor: "#D4AF37", color: "black" } : {}}
            >
              {num}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
