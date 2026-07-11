"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import { sfx } from "@/utils/sfx";

interface TriviaQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  funFact: string;
}

const QUESTIONS: TriviaQuestion[] = [
  {
    question: "Who is most likely to clean up the kitchen after a late-night feast?",
    options: ["Anushka", "Mamma", "Papa", "Everyone together"],
    correctIdx: 1,
    funFact: "Mamma is the undisputed cleanup champion of the house! 👑"
  },
  {
    question: "What is Anushka's ultimate comfort zone?",
    options: ["Sunny Beach resort", "Chilly mountain cabins", "Home bed with Netflix", "Shopping malls"],
    correctIdx: 2,
    funFact: "Nothing beats snuggling in bed with a good show! 🍿"
  },
  {
    question: "What is Anushka's absolute go-to midnight snack request?",
    options: ["Pizza", "Momos", "Fries", "Maggi"],
    correctIdx: 1,
    funFact: "Momos with extra spicy red chutney is Anushka's ultimate late-night craving match! 🥟"
  }
];

export default function Screen5_FamilyTrivia() {
  const { setCurrentScreen } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    
    if (idx === QUESTIONS[currentIdx].correctIdx) {
      sfx.playSuccess();
    } else {
      sfx.playError();
    }
  };

  const handleNext = () => {
    sfx.playTransition();
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setAnswered(false);
    } else {
      setCurrentScreen(5); // Go to scrapbook next!
    }
  };

  const q = QUESTIONS[currentIdx];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-poppins text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 pointer-events-none"
      >
        <span className="font-mono text-xs text-[#D4AF37] tracking-[0.3em] uppercase block mb-1">CHAPTER IV</span>
        <h2 className="text-3xl md:text-4xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
          Family Trivia
        </h2>
      </motion.div>

      {/* Trivia Card */}
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, scale: 0.95, rotateY: 45 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotateY: -45 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card w-full max-w-lg p-8 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-black/60 backdrop-blur-2xl flex flex-col relative"
      >
        <span className="text-[10px] font-mono text-white/40 mb-4 block uppercase tracking-widest">
          Question {currentIdx + 1} of {QUESTIONS.length}
        </span>

        <h3 className="text-xl md:text-2xl font-playfair leading-relaxed text-white mb-8">
          {q.question}
        </h3>

        <div className="flex flex-col gap-3.5 mb-8">
          {q.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = q.correctIdx === idx;
            
            let btnStyle = "bg-black/40 border-[#D4AF37]/20 text-white/80 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5";
            if (answered) {
              if (isCorrect) {
                btnStyle = "bg-[#D4AF37]/15 border-[#D4AF37] text-[#FFF3B0] shadow-[0_0_20px_rgba(212,175,55,0.25)]";
              } else if (isSelected) {
                btnStyle = "bg-red-500/10 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.15)]";
              } else {
                btnStyle = "opacity-35 border-white/5 bg-black/20 text-white/40 cursor-not-allowed";
              }
            }

            return (
              <motion.button
                key={idx}
                disabled={answered}
                onClick={() => handleOptionClick(idx)}
                whileHover={!answered ? { scale: 1.015 } : {}}
                whileTap={!answered ? { scale: 0.985 } : {}}
                className={`px-5 py-3.5 rounded-xl border text-left font-poppins text-sm md:text-base font-light transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
                {answered && isCorrect && <span className="text-[#D4AF37]">✓</span>}
                {answered && isSelected && !isCorrect && <span className="text-red-400">✗</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Answer / Fact Panel */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-4 text-center mb-6 shadow-[0_0_15px_rgba(212,175,55,0.05)]"
            >
              <p className="text-xs text-[#FFF3B0] font-mono tracking-wider mb-1 uppercase font-semibold">FACT CONFIRMED</p>
              <p className="text-sm text-white/90 font-light font-poppins">
                {q.funFact}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {answered && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full shadow-md text-xs tracking-wider uppercase ml-auto cursor-pointer"
          >
            {currentIdx < QUESTIONS.length - 1 ? "Next Question" : "View Scrapbook"}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
