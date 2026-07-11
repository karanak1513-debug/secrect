"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

const TARGET_PHRASE = "I LOVE YOU";
const SCRAMBLED_INITIAL = ["O", "Y", "I", "U", "V", "L", "O", "E", "A", "K", "M", "R", "S", "H"];

export default function Day1_GuessWord({ onComplete }: { onComplete: () => void }) {
  const [bank, setBank] = useState<{ id: number; char: string }[]>([]);
  const [slots, setSlots] = useState<( { id: number; char: string } | null )[]>([
    null, // I
    null, // space
    null, // L
    null, // O
    null, // V
    null, // E
    null, // space
    null, // Y
    null, // O
    null  // U
  ]);
  const [error, setError] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize and shuffle bank
  useEffect(() => {
    const shuffled = [...SCRAMBLED_INITIAL].sort(() => Math.random() - 0.5);
    setBank(shuffled.map((char, index) => ({ id: index, char })));
  }, []);

  // Check if answer is correct
  useEffect(() => {
    const currentStr = slots
      .map((slot, idx) => {
        if (idx === 1 || idx === 6) return " ";
        return slot ? slot.char : "";
      })
      .join("");

    if (slots.filter((s, idx) => idx !== 1 && idx !== 6 && s !== null).length === 8) {
      if (currentStr === TARGET_PHRASE) {
        setIsCompleted(true);
        setTimeout(onComplete, 1000);
      } else {
        // All slots filled but incorrect
        sfx.playError();
        setError(true);
        setTimeout(() => {
          // Reset slots and put all letters back to bank
          setSlots([null, null, null, null, null, null, null, null, null, null]);
          const shuffled = [...SCRAMBLED_INITIAL].sort(() => Math.random() - 0.5);
          setBank(shuffled.map((char, index) => ({ id: index, char })));
          setError(false);
        }, 1200);
      }
    }
  }, [slots, onComplete]);

  const handleBankClick = (charObj: { id: number; char: string }) => {
    if (error || isCompleted) return;
    sfx.playClick();

    // Find next empty slot (excluding indexes 1 and 6 which are spaces)
    const nextEmptyIdx = slots.findIndex((val, idx) => idx !== 1 && idx !== 6 && val === null);

    if (nextEmptyIdx !== -1) {
      const newSlots = [...slots];
      newSlots[nextEmptyIdx] = charObj;
      setSlots(newSlots);
      setBank((prev) => prev.filter((item) => item.id !== charObj.id));
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    if (error || isCompleted) return;
    sfx.playClick();
    const charObj = slots[slotIndex];
    if (!charObj) return;

    // Put it back to bank
    setBank((prev) => [...prev, charObj]);
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 font-poppins relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Guess the Secret Phrase</h2>
        <p className="text-white/60 text-sm max-w-sm mx-auto">
          Tap the floating letters below to construct the secret code phrase.
        </p>
      </motion.div>

      {/* Main Glass game board */}
      <div className="glass-card w-full p-8 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center">
        {/* Answer Slots Display */}
        <motion.div 
          animate={error ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-center gap-1.5 md:gap-2 mb-10 flex-wrap"
        >
          {slots.map((slot, index) => {
            if (index === 1 || index === 6) {
              // Space separator
              return <div key={`space-${index}`} className="w-3 md:w-5" />;
            }

            return (
              <div
                key={`slot-${index}`}
                onClick={() => slot && handleSlotClick(index)}
                className={`w-9 h-11 md:w-11 md:h-13 border rounded-xl flex items-center justify-center text-base md:text-lg font-bold cursor-pointer transition-all duration-300 ${
                  slot 
                    ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#FFF3B0] shadow-[0_0_15px_rgba(212,175,55,0.25)]" 
                    : "bg-black/60 border-white/10 text-transparent"
                } ${error ? "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : ""}`}
              >
                <AnimatePresence mode="wait">
                  {slot && (
                    <motion.span
                      initial={{ scale: 0.2, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.2, opacity: 0, rotate: 45 }}
                      className="font-playfair"
                    >
                      {slot.char}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* Scrambled Letter Bank */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full bg-white/[0.01] border border-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-md">
          <AnimatePresence>
            {bank.map((item) => (
              <motion.button
                key={item.id}
                layout
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBankClick(item)}
                className="w-11 h-11 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 text-[#D4AF37] font-bold text-base shadow-md flex items-center justify-center cursor-pointer hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all"
              >
                {item.char}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Success Message */}
        {isCompleted && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#4ADE80] font-semibold text-base mt-6 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
          >
            Phrase Unlocked! ❤️
          </motion.p>
        )}
      </div>
    </div>
  );
}
