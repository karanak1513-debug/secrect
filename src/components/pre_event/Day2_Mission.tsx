"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Day2_NumberMemory from "./Day2_NumberMemory";
import Day2_CatchOrb from "./Day2_CatchOrb";
import Day2_SlidingTile from "./Day2_SlidingTile";
import Day2_LuckyWheel from "./Day2_LuckyWheel";
import Day2_SecretCode from "./Day2_SecretCode";
import Day2_MathCrack from "./Day2_MathCrack";
import Day2_GridScan from "./Day2_GridScan";
import Day2_WordHunt from "./Day2_WordHunt";
import Day2_ColorMemory from "./Day2_ColorMemory";
import Day2_RiddleVault from "./Day2_RiddleVault";
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
    name: "Number Memory",
    difficulty: 3,
    objective: "Watch the flashing sequence and repeat it accurately to pass the security grid."
  },
  2: {
    number: "02",
    name: "Golden Orb Capture",
    difficulty: 4,
    objective: "Locate and tap the fast-moving golden energy sphere 3 times to capture its matrix."
  },
  3: {
    number: "03",
    name: "Sliding Tile Grid",
    difficulty: 4,
    objective: "Reassemble the numbered tiles into numerical order (1-15) using the single empty grid slot."
  },
  4: {
    number: "04",
    name: "Roulette Decoder",
    difficulty: 3,
    objective: "Spin the luxury decryption wheel to land on the designated password segment."
  },
  5: {
    number: "05",
    name: "Ancient Riddle",
    difficulty: 5,
    objective: "Solve the wind-themed riddle to extract the final secret authorization key."
  },
  6: {
    number: "06",
    name: "Math Cracker",
    difficulty: 5,
    objective: "Answer 5 rapid-fire math equations correctly in a row. Any wrong answer resets your streak — 60 seconds on the clock."
  },
  7: {
    number: "07",
    name: "Reaction Rush",
    difficulty: 5,
    objective: "Golden targets appear at random positions and vanish in a flash. Tap 7 out of 10 before they disappear. Pure reflexes — no second chances."
  },
  8: {
    number: "08",
    name: "Word Hunt",
    difficulty: 4,
    objective: "A secret word is hidden inside a 7×7 letter grid. Find and select it horizontally or vertically within 45 seconds."
  },
  9: {
    number: "09",
    name: "Color Cipher",
    difficulty: 5,
    objective: "Watch a 6-step color sequence flash — then repeat it perfectly. 3 rounds of increasing pressure. One mistake resets all."
  },
  10: {
    number: "10",
    name: "Riddle Vault",
    difficulty: 5,
    objective: "Three cryptic riddles stand between you and the vault. Solve each one correctly — no skipping, no hints."
  },
};

const TOTAL_MISSIONS = 10;

interface Day2_MissionProps {
  onUnlock: () => void;
  onCompleteDay2?: () => void;
}

export default function Day2_Mission({ onUnlock, onCompleteDay2 }: Day2_MissionProps) {
  const [step, setStep] = useState(6);
  const [subStep, setSubStep] = useState<"intro" | "playing" | "success">("intro");

  const handleStartMission = () => setSubStep("playing");
  const handleChallengeComplete = () => setSubStep("success");

  const handleNext = () => {
    sfx.playTransition();
    setStep((s) => s + 1);
    setSubStep("intro");
  };

  const handleAllCompleted = () => {
    localStorage.setItem("preEvent_day2_completed", "true");
    if (onCompleteDay2) {
      onCompleteDay2();
    }
  };

  const wrapMotion = (key: string, child: React.ReactNode) => (
    <motion.div key={key} initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full pb-16">
      {child}
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020202] text-white overflow-hidden font-poppins flex flex-col items-center justify-center px-4">
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
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FFF3B0]/5 to-transparent pointer-events-none" />
          <span className="text-4xl mb-4">👑</span>
          <h1 className="text-3xl md:text-4xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-4 tracking-wide font-normal">
            Final Mission
          </h1>
          <p className="text-white/70 text-sm md:text-base font-light mb-3 leading-relaxed">
            "10 challenges stand between you and the final unlock. Prepare for the ultimate test."
          </p>
          <p className="text-[#D4AF37]/60 font-mono text-xs tracking-widest mb-8">10 CHALLENGES · HARD MODE</p>
          <button
            onClick={handleNext}
            className="px-10 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] cursor-pointer text-xs tracking-widest uppercase font-poppins"
          >
            Start Final Mission
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step >= 1 && step <= TOTAL_MISSIONS && subStep === "intro" && (
          <MissionIntro
            key={`intro-${step}`}
            number={MISSIONS[step].number}
            name={MISSIONS[step].name}
            difficulty={MISSIONS[step].difficulty}
            objective={MISSIONS[step].objective}
            onStart={handleStartMission}
          />
        )}

        {step >= 1 && step <= TOTAL_MISSIONS && subStep === "success" && (
          <MissionComplete
            key={`complete-${step}`}
            xpAdded={step * 150}
            onContinue={step === TOTAL_MISSIONS ? handleAllCompleted : handleNext}
          />
        )}

        {/* Original 5 challenges */}
        {step === 1 && subStep === "playing" && wrapMotion("c1", <Day2_NumberMemory onComplete={handleChallengeComplete} />)}
        {step === 2 && subStep === "playing" && wrapMotion("c2", <Day2_CatchOrb onComplete={handleChallengeComplete} />)}
        {step === 3 && subStep === "playing" && wrapMotion("c3", <Day2_SlidingTile onComplete={handleChallengeComplete} />)}
        {step === 4 && subStep === "playing" && wrapMotion("c4", <Day2_LuckyWheel onComplete={handleChallengeComplete} />)}
        {step === 5 && subStep === "playing" && wrapMotion("c5", <Day2_SecretCode onComplete={handleChallengeComplete} />)}

        {/* 5 New hard challenges */}
        {step === 6 && subStep === "playing" && wrapMotion("c6", <Day2_MathCrack onComplete={handleChallengeComplete} />)}
        {step === 7 && subStep === "playing" && wrapMotion("c7", <Day2_GridScan onComplete={handleChallengeComplete} />)}
        {step === 8 && subStep === "playing" && wrapMotion("c8", <Day2_WordHunt onComplete={handleChallengeComplete} />)}
        {step === 9 && subStep === "playing" && wrapMotion("c9", <Day2_ColorMemory onComplete={handleChallengeComplete} />)}
        {step === 10 && subStep === "playing" && wrapMotion("c10", <Day2_RiddleVault onComplete={handleChallengeComplete} />)}


      </AnimatePresence>

      {/* Progress dots */}
      {step > 0 && step <= TOTAL_MISSIONS && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50 bg-black/40 border border-white/5 rounded-full px-4 py-2 backdrop-blur-md">
          {Array.from({ length: TOTAL_MISSIONS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`transition-all duration-500 relative flex items-center justify-center rounded-full ${
                s === step
                  ? "w-4 h-4 bg-[#D4AF37] shadow-[0_0_12px_#D4AF37] scale-125"
                  : s < step
                  ? "w-3 h-3 bg-green-500"
                  : "w-2.5 h-2.5 bg-white/10"
              }`}
            >
              {s < step && <span className="text-[7px] text-black font-bold">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
