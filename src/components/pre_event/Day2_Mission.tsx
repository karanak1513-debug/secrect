"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Day2_NumberMemory from "./Day2_NumberMemory";
import Day2_CatchOrb from "./Day2_CatchOrb";
import Day2_SlidingTile from "./Day2_SlidingTile";
import Day2_LuckyWheel from "./Day2_LuckyWheel";
import Day2_SecretCode from "./Day2_SecretCode";
import { useStore } from "@/contexts/StoreContext";
import Day2_CompletionCountdown from "./Day2_CompletionCountdown";

export default function Day2_Mission({ onUnlock }: { onUnlock: () => void }) {
  const [step, setStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  // Disabled completion skip on mount so refresh starts the challenges fresh

  const handleNext = () => {
    setStep((s) => s + 1);
  };

  const handleAllCompleted = () => {
    localStorage.setItem("preEvent_day2_completed", "true");
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
            Final Mission
          </h1>
          <p className="text-[#D4AF37]/80 text-lg md:text-xl font-light mb-12">
            "The final password fragment is hidden behind today's challenges."
          </p>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            Start Final Mission
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="c1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day2_NumberMemory onComplete={handleNext} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="c2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day2_CatchOrb onComplete={handleNext} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="c3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day2_SlidingTile onComplete={handleNext} />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div key="c4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day2_LuckyWheel onComplete={handleNext} />
          </motion.div>
        )}
        {step === 5 && (
          <motion.div key="c5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full pb-16">
            <Day2_SecretCode onComplete={handleAllCompleted} />
          </motion.div>
        )}

        {showCompletion && step === 6 && (
          <Day2_CompletionCountdown onUnlock={onUnlock} />
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
