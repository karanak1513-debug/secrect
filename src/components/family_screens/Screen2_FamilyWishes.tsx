"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";

const WISHES = [
  { icon: "🌸", text: "I wish you always stay healthy, happy, and keep smiling every single day." },
  { icon: "✨", text: "I wish every dream you have comes true, no matter how big it is." },
  { icon: "💛", text: "I wish you always find peace, confidence, and happiness wherever life takes you." },
  { icon: "🌎", text: "I wish every new year of your life becomes even more beautiful than the last one." },
  { icon: "⭐", text: "I wish you never stop believing in yourself because you're capable of amazing things." },
  { icon: "🌈", text: "I wish every difficult moment in your life is followed by something wonderful." },
  { icon: "🎂", text: "I wish this birthday becomes one of your happiest memories." },
  { icon: "💖", text: "And above all...\nI wish you always have countless reasons to smile, because your smile makes the world brighter.", isFinal: true }
];

const TypewriterText = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1500); // Wait a bit before moving to next
      }
    }, 50); // Speed of typing
    
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span className="whitespace-pre-line">{displayedText}</span>;
};

export default function Screen2_FamilyWishes() {
  const { setCurrentScreen } = useStore();
  const [currentWishIndex, setCurrentWishIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  const handleNextWish = () => {
    if (currentWishIndex < WISHES.length - 1) {
      setCurrentWishIndex(prev => prev + 1);
      setIsTyping(true);
    } else {
      setShowButton(true);
    }
  };

  const currentWish = WISHES[currentWishIndex];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-poppins">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 flex flex-col items-center w-full max-w-3xl"
      >
        <motion.h2 
          className="text-3xl md:text-5xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] mb-4 text-center drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          My Wishes For You ❤️
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white/70 italic font-playfair text-lg md:text-xl text-center mb-12 max-w-xl"
        >
          "If I could wish for anything, these would always be my wishes for you."
        </motion.p>

        <div className="relative w-full h-64 md:h-80 flex items-center justify-center mb-12 perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWishIndex}
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -30, rotateX: -20, filter: "blur(5px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`w-full max-w-xl p-8 md:p-12 bg-white/5 border border-[#D4AF37]/30 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(212,175,55,0.15)] flex flex-col items-center justify-center text-center ${currentWish.isFinal ? 'border-[#D4AF37]/60 shadow-[0_0_50px_rgba(212,175,55,0.3)]' : ''}`}
            >
              <div className="text-4xl md:text-5xl mb-6 drop-shadow-md">
                {currentWish.icon}
              </div>
              <div className={`font-poppins font-light text-lg md:text-2xl text-white/90 leading-relaxed ${currentWish.isFinal ? 'font-medium text-[#D4AF37]' : ''}`}>
                {isTyping ? (
                  <TypewriterText text={currentWish.text} onComplete={handleNextWish} />
                ) : (
                  <span className="whitespace-pre-line">{currentWish.text}</span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              onClick={() => setCurrentScreen(3)}
              className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(212,175,55,0.5)] text-lg"
            >
              Continue Our Journey →
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
