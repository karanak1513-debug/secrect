"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

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

    // Auto focus next
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !guess[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      submitGuess();
    }
  };

  const submitGuess = () => {
    const currentGuess = guess.join("");
    if (currentGuess.length < 5) {
      setErrorMsg("Please fill all letters.");
      return;
    }

    if (currentGuess === SECRET_WORD) {
      onComplete();
    } else {
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
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Password Decoder</h2>
        <p className="text-white/60 font-poppins text-sm mb-6">
          Decode the hidden word. You have 3 attempts.
        </p>
        <div className="bg-white/5 border border-[#D4AF37]/30 p-4 rounded-xl backdrop-blur-md mb-8">
          <p className="text-[#FFF3B0] font-poppins text-sm italic">
            Clue: "{CLUE}"
          </p>
        </div>
      </motion.div>

      <div className="flex gap-3 mb-8">
        {guess.map((letter, index) => (
          <input
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
            className="w-12 h-14 bg-black/50 border border-[#D4AF37]/50 text-center text-2xl font-playfair text-[#D4AF37] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all uppercase"
          />
        ))}
      </div>

      <button
        onClick={submitGuess}
        disabled={attempts >= MAX_ATTEMPTS}
        className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:hover:scale-100"
      >
        Submit
      </button>

      {errorMsg && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-6 font-poppins text-sm ${attempts >= MAX_ATTEMPTS ? "text-red-400" : "text-[#D4AF37]"}`}
        >
          {errorMsg}
        </motion.p>
      )}
    </div>
  );
}
