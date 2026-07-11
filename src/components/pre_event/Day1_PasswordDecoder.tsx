"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/utils/sfx";

const SECRET_WORD = "MAGIC";
const CLUE = "A mysterious force that makes the impossible, possible.";
const MAX_ATTEMPTS = 3;

export default function Day1_PasswordDecoder({ onComplete }: { onComplete: () => void }) {
  const [guess, setGuess] = useState(["", "", "", "", ""]);
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 5);
  }, []);

  const handleChange = (index: number, value: string) => {
    const newGuess = [...guess];
    newGuess[index] = value.toUpperCase();
    setGuess(newGuess);
    sfx.playClick();

    // Auto focus next
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !guess[index] && index > 0) {
      sfx.playClick();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      submitGuess();
    }
  };

  const submitGuess = () => {
    const currentGuess = guess.join("");
    if (currentGuess.length < 5) {
      sfx.playError();
      setErrorMsg("Please fill all letters.");
      return;
    }

    if (currentGuess === SECRET_WORD) {
      onComplete();
    } else {
      sfx.playError();
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setErrorMsg("System locked for 3 seconds...");
        setTimeout(() => {
          setAttempts(0);
          setGuess(["", "", "", "", ""]);
          setErrorMsg("");
          inputRefs.current[0]?.focus();
        }, 3000);
      } else {
        setErrorMsg(`Incorrect. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Password Decoder</h2>
        <p className="text-white/60 text-sm mb-6">
          Decode the hidden word. Complete within 3 access attempts.
        </p>
      </motion.div>

      {/* Main Glass Decrypter Box */}
      <div className="glass-card w-full p-8 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center">
        {/* Clue Banner */}
        <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-5 rounded-2xl backdrop-blur-md mb-8 w-full">
          <span className="text-[10px] font-mono text-[#D4AF37]/60 block tracking-widest mb-1.5 uppercase">DECRYPTION CLUE</span>
          <p className="text-[#FFF3B0] font-playfair text-base italic leading-relaxed">
            "{CLUE}"
          </p>
        </div>

        {/* Input letters row */}
        <div className="flex gap-2.5 md:gap-4 mb-8 justify-center">
          {guess.map((letter, index) => (
            <motion.input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={letter}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={attempts >= MAX_ATTEMPTS}
              whileFocus={{ scale: 1.08 }}
              className="w-11 h-13 md:w-13 md:h-15 bg-black/60 border border-[#D4AF37]/30 text-center text-xl md:text-2xl font-playfair text-[#FFF3B0] rounded-xl focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_18px_rgba(212,175,55,0.3)] transition-all uppercase"
            />
          ))}
        </div>

        <button
          onClick={submitGuess}
          disabled={attempts >= MAX_ATTEMPTS}
          className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer text-xs tracking-wider uppercase"
        >
          Submit Access Code
        </button>

        {errorMsg && (
          <motion.p
            key={errorMsg}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 font-mono text-xs uppercase tracking-wider ${attempts >= MAX_ATTEMPTS ? "text-red-400" : "text-[#D4AF37]"}`}
          >
            {errorMsg}
          </motion.p>
        )}
      </div>
    </div>
  );
}
