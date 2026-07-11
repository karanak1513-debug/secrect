"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Day2_SecretCode({ onComplete }: { onComplete: () => void }) {
  const [answer, setAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAnswer = answer.trim().toLowerCase();
    
    // The riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? (Echo)
    if (cleanAnswer === "echo") {
      onComplete();
    } else {
      setErrorMsg("Incorrect. Think deeper...");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Secret Code</h2>
        <p className="text-white/60 font-poppins text-sm mb-6">
          Solve the final riddle to unlock the last password fragment.
        </p>
      </motion.div>

      <div className="w-full bg-white/5 border border-[#D4AF37]/30 p-8 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.1)] mb-8">
        <p className="text-[#FFF3B0] font-playfair text-xl italic text-center leading-relaxed">
          "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer..."
          className="w-full max-w-xs bg-black/50 border-b-2 border-[#D4AF37]/50 text-center text-xl font-poppins text-white focus:outline-none focus:border-[#D4AF37] transition-all py-2"
        />
        
        <button
          type="submit"
          className="px-10 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          Unlock
        </button>
      </form>

      {errorMsg && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-red-400 font-poppins text-sm"
        >
          {errorMsg}
        </motion.p>
      )}
    </div>
  );
}
