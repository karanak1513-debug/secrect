"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/utils/sfx";

export default function Day2_SecretCode({ onComplete }: { onComplete: () => void }) {
  const [answer, setAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAnswer = answer.trim().toLowerCase();
    
    // The riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? (Echo)
    if (cleanAnswer === "echo") {
      onComplete();
    } else {
      sfx.playError();
      setErrorMsg("Incorrect. Think deeper...");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    sfx.playClick();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Secret Riddle</h2>
        <p className="text-white/60 text-sm mb-6">
          Decode the final riddle to authenticate the last database segment.
        </p>
      </motion.div>

      {/* Main Glass card */}
      <div className="glass-card w-full p-8 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center">
        {/* Riddle Scripture Frame */}
        <div className="w-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-8 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.05)] mb-8 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-[9px] text-[#D4AF37]/35 font-mono">✦</div>
          <div className="absolute top-2 right-2 text-[9px] text-[#D4AF37]/35 font-mono">✦</div>
          
          <p className="text-[#FFF3B0] font-playfair text-lg md:text-xl italic text-center leading-relaxed font-normal">
            "I speak without a mouth and hear without ears.<br />
            I have no body, but I come alive with wind.<br />
            What am I?"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-8">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={answer}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Your decryption answer..."
              className="w-full bg-transparent border-b border-white/20 text-center text-lg font-poppins text-white focus:outline-none transition-all py-2.5 placeholder-white/20"
            />
            {/* Animated focus bar stretching from center */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isFocused ? 1 : 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] shadow-[0_2px_10px_rgba(212,175,55,0.8)] origin-center"
            />
          </div>
          
          <button
            type="submit"
            className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer text-xs tracking-wider uppercase"
          >
            Submit Key
          </button>
        </form>

        {errorMsg && (
          <motion.p
            key={errorMsg}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-red-400 font-mono text-xs uppercase tracking-wider"
          >
            {errorMsg}
          </motion.p>
        )}
      </div>
    </div>
  );
}
