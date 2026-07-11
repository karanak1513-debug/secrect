"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Day1_PatternUnlock from "./Day1_PatternUnlock";
import Day1_HiddenKey from "./Day1_HiddenKey";
import Day1_LaserMaze from "./Day1_LaserMaze";
import Day1_PasswordDecoder from "./Day1_PasswordDecoder";
import Day1_ReactionChallenge from "./Day1_ReactionChallenge";
import Day1_CompletionCountdown from "./Day1_CompletionCountdown";

export default function Day1_Mission() {
  const [step, setStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  // Disabled completion skip on mount so refresh starts the challenges fresh

  const handleNext = () => {
    setStep((s) => s + 1);
  };

  const handleAllCompleted = () => {
    localStorage.setItem("preEvent_day1_completed", "true");
    setStep(6);
    setShowCompletion(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020202] text-white overflow-hidden font-poppins flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      {step === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center z-10 p-6"
        >
          <h1 className="text-4xl md:text-6xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-4">
            Mission Day One
          </h1>
          <p className="text-[#D4AF37]/80 text-lg md:text-xl font-light mb-12">
            "Today's mission is to unlock the first part of the Birthday Password."
          </p>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            Start Mission
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="c1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day1_PatternUnlock onComplete={handleNext} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="c2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day1_HiddenKey onComplete={handleNext} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="c3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day1_LaserMaze onComplete={handleNext} />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div key="c4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day1_PasswordDecoder onComplete={handleNext} />
          </motion.div>
        )}
        {step === 5 && (
          <motion.div key="c5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day1_ReactionChallenge onComplete={handleAllCompleted} />
          </motion.div>
        )}

        {showCompletion && step === 6 && (
          <Day1_CompletionCountdown />
        )}
      </AnimatePresence>

      {/* Progress Indicator for Challenges */}
      {step > 0 && step < 6 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                s === step
                  ? "bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] scale-125"
                  : s < step
                  ? "bg-[#D4AF37]/40"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
