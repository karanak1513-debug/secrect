"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Day1_PatternUnlock from "./Day1_PatternUnlock";
import Day1_GuessWord from "./Day1_GuessWord";
import Day1_LaserMaze from "./Day1_LaserMaze";
import Day1_PasswordDecoder from "./Day1_PasswordDecoder";
import Day1_ReactionChallenge from "./Day1_ReactionChallenge";
import Day1_CompletionCountdown from "./Day1_CompletionCountdown";
import MissionIntro from "./MissionIntro";
import MissionComplete from "./MissionComplete";
import { sfx } from "@/utils/sfx";

interface MissionConfig {
  number: string;
  name: string;
  difficulty: number;
  objective: string;
}

const MISSIONS: Record<number, MissionConfig> = {
  1: {
    number: "01",
    name: "Pattern Lock",
    difficulty: 2,
    objective: "Connect the dots in the correct secret geometric shape to unlock the device core."
  },
  2: {
    number: "02",
    name: "Guess the Secret",
    difficulty: 3,
    objective: "Rearrange the scrambled characters in the grid bank to form the secret phrase."
  },
  3: {
    number: "03",
    name: "Laser Maze Grid",
    difficulty: 4,
    objective: "Navigate the heart to the top safe zone while avoiding the sweeping laser beams."
  },
  4: {
    number: "04",
    name: "Keyword Decoder",
    difficulty: 3,
    objective: "Use the decryption clue to deduce the five-letter authorization keyword."
  },
  5: {
    number: "05",
    name: "Star Reaction",
    difficulty: 4,
    objective: "Tap 10 pulsing star coordinates rapidly before the firewall countdown hits zero."
  }
};

export default function Day1_Mission({ onTimeUp, onReturnLater }: { onTimeUp: () => void; onReturnLater: () => void }) {
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState<"intro" | "playing" | "success">("intro");
  const [showCompletion, setShowCompletion] = useState(false);

  const handleStartMission = () => {
    setSubStep("playing");
  };

  const handleChallengeComplete = () => {
    setSubStep("success");
  };

  const handleNext = () => {
    sfx.playTransition();
    setStep((s) => s + 1);
    setSubStep("intro");
  };

  const handleAllCompleted = () => {
    localStorage.setItem("preEvent_day1_completed", "true");
    setStep(6);
    setShowCompletion(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020202] text-white overflow-hidden font-poppins flex flex-col items-center justify-center px-4">
      {/* Dynamic Animated background with glowing mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8),rgba(3,3,3,1))] pointer-events-none" />

      {step === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center z-10 p-8 glass-card max-w-md border border-[#D4AF37]/20 shadow-[0_0_60px_rgba(212,175,55,0.08)] flex flex-col items-center justify-center relative"
        >
          {/* Subtle shine line */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FFF3B0]/5 to-transparent pointer-events-none" />
          
          <span className="text-4xl mb-4">🏆</span>
          <h1 className="text-3xl md:text-4xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-4 tracking-wide font-normal">
            Mission Day One
          </h1>
          <p className="text-white/70 text-sm md:text-base font-light mb-10 leading-relaxed">
            "Today's mission is to unlock the first part of the Birthday Password. Ready your focus."
          </p>
          <button
            onClick={handleNext}
            className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] cursor-pointer text-xs tracking-widest uppercase font-poppins"
          >
            Start Mission
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step >= 1 && step <= 5 && subStep === "intro" && (
          <MissionIntro
            key={`intro-${step}`}
            number={MISSIONS[step].number}
            name={MISSIONS[step].name}
            difficulty={MISSIONS[step].difficulty}
            objective={MISSIONS[step].objective}
            onStart={handleStartMission}
          />
        )}

        {step >= 1 && step <= 5 && subStep === "success" && (
          <MissionComplete
            key={`complete-${step}`}
            xpAdded={step * 100}
            onContinue={step === 5 ? handleAllCompleted : handleNext}
          />
        )}

        {/* Challenge Screens */}
        {step === 1 && subStep === "playing" && (
          <motion.div key="c1" initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full pb-16">
            <Day1_PatternUnlock onComplete={handleChallengeComplete} />
          </motion.div>
        )}
        {step === 2 && subStep === "playing" && (
          <motion.div key="c2" initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full pb-16">
            <Day1_GuessWord onComplete={handleChallengeComplete} />
          </motion.div>
        )}
        {step === 3 && subStep === "playing" && (
          <motion.div key="c3" initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full pb-16">
            <Day1_LaserMaze onComplete={handleChallengeComplete} />
          </motion.div>
        )}
        {step === 4 && subStep === "playing" && (
          <motion.div key="c4" initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full pb-16">
            <Day1_PasswordDecoder onComplete={handleChallengeComplete} />
          </motion.div>
        )}
        {step === 5 && subStep === "playing" && (
          <motion.div key="c5" initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full pb-16">
            <Day1_ReactionChallenge onComplete={handleChallengeComplete} />
          </motion.div>
        )}

        {showCompletion && step === 6 && (
          <motion.div key="c6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <Day1_CompletionCountdown onTimeUp={onTimeUp} onReturnLater={onReturnLater} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator for Challenges */}
      {step > 0 && step < 6 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50 bg-black/40 border border-white/5 rounded-full px-4 py-2 backdrop-blur-md">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-500 relative flex items-center justify-center ${
                s === step
                  ? "bg-[#D4AF37] shadow-[0_0_12px_#D4AF37] scale-125"
                  : s < step
                  ? "bg-green-500"
                  : "bg-white/10"
              }`}
            >
              {s < step && <span className="text-[8px] text-black font-bold">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
