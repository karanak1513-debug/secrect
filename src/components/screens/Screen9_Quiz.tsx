"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

const questions: Question[] = [
  {
    question: "When did we first meet?",
    options: ["13 January 2024", "15 February 2024", "1 January 2024", "20 December 2023"],
    correctIndex: 0,
  },
  {
    question: "Who gets angry first?",
    options: ["Me (Karan)", "You", "Both", "No one"],
    correctIndex: 0,
  },
  {
    question: "Who says sorry first after a fight?",
    options: ["Me", "You", "Both of us", "Nobody"],
    correctIndex: 2,
  },
  {
    question: "What is my favourite thing about you?",
    options: ["Your Smile", "Your Eyes", "Your Hair", "Your Kindness"],
    correctIndex: 1,
  },
  {
    question: "Who never leaves my side no matter what?",
    options: ["You ❤️", "Friends", "Family", "Nobody"],
    correctIndex: 0,
  },
];

export default function Screen9_Quiz() {
  const { setCurrentScreen } = useStore();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const particles = useMemo(() => {
    return [...Array(15)].map(() => ({
      width: Math.random() * 6 + 2 + "px",
      height: Math.random() * 6 + 2 + "px",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      duration: Math.random() * 10 + 10,
    }));
  }, []);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === questions[currentQIndex].correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      fireConfetti();
      playSuccessSound();
    } else {
      playErrorSound();
    }

    const delay = isCorrect ? 1500 : 2000;
    
    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowResults(true);
        if (score + (isCorrect ? 1 : 0) === 5) {
          fireMassiveConfetti();
        }
      }
    }, delay);
  };

  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // A6
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log("Audio play failed", e);
    }
  };

  const playErrorSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log("Audio play failed", e);
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#FFF3B0", "#FFD700"]
    });
  };

  const fireMassiveConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ["#D4AF37", "#FFF3B0", "#FFD700", "#FFFFFF"]
      });
    }, 250);
  };

  const currentQ = questions[currentQIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4"
    >
      {/* Floating particles background effect specific to Quiz */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-[#D4AF37]/20 blur-sm"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key={`question-${currentQIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg z-10"
          >
            <div className="text-center mb-8">
              <h1 className="font-playfair text-3xl md:text-5xl text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                How Well Do You Know Us?
              </h1>
              <p className="font-poppins text-white/70 text-sm md:text-base">
                Let&apos;s see how many memories you remember.
              </p>
              
              <div className="mt-6 font-playfair tracking-widest text-xs uppercase text-[#D4AF37]/60">
                Question {currentQIndex + 1} of {questions.length}
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.1)] bg-black/40 backdrop-blur-xl">
              <h2 className="font-poppins text-xl md:text-2xl text-white text-center mb-8 leading-relaxed">
                {currentQ.question}
              </h2>

              <div className="flex flex-col gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = idx === currentQ.correctIndex;
                  
                  let buttonStateClass = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/50";
                  
                  if (isAnswered) {
                    if (isCorrectOption) {
                      buttonStateClass = "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.5)]";
                    } else if (isSelected) {
                      buttonStateClass = "bg-red-500/20 border-red-500/50 text-red-200";
                    } else {
                      buttonStateClass = "bg-white/5 border-white/5 opacity-50";
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!isAnswered ? { scale: 1.02 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                      onClick={() => handleOptionClick(idx)}
                      disabled={isAnswered}
                      className={`relative w-full py-4 px-6 rounded-xl font-poppins text-left transition-all duration-300 border ${buttonStateClass}`}
                    >
                      {/* Subtly shake if this was selected and wrong */}
                      {isAnswered && isSelected && !isCorrectOption && (
                        <motion.div
                          initial={{ x: 0 }}
                          animate={{ x: [-5, 5, -5, 5, 0] }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 rounded-xl"
                        />
                      )}
                      <span className="relative z-10">{option}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg z-10 text-center glass-card p-10 rounded-2xl border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.2)] bg-black/50 backdrop-blur-xl"
          >
            <div className="text-[#D4AF37] text-6xl mb-6">
              {score === 5 ? "🏆" : score >= 3 ? "✨" : "💭"}
            </div>
            <h2 className="font-playfair text-4xl text-white mb-4">
              {score === 5 && "Perfect Score!"}
              {score >= 3 && score < 5 && "Almost Perfect!"}
              {score < 3 && "More Memories Await!"}
            </h2>
            <p className="font-poppins text-white/80 leading-relaxed mb-8">
              {score === 5 && "You know our story better than anyone. Thank you for every beautiful memory we've created together."}
              {score >= 3 && score < 5 && "We've made so many wonderful memories, and many more are waiting for us."}
              {score < 3 && "Looks like we need to create even more unforgettable moments together."}
            </p>
            
            <div className="font-playfair text-2xl text-[#D4AF37] mb-10">
              Score: {score} / 5
            </div>

            <CinematicButton onClick={() => setCurrentScreen(10)}>
              Continue Our Journey ✨
            </CinematicButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
