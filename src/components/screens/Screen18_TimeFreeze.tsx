"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

const MESSAGES = [
  ["Ek Minute..."],
  ["Aage badhne se pehle..."],
  ["Main tumse kuch kehna chahta hoon."],
  ["13 January 2024 se lekar aaj tak...", "Tumne meri life ko itna khoobsurat bana diya hai", "jitna main kabhi soch bhi nahi sakta tha."],
  ["Haan... hum bahut lade.", "Main kai baar bina wajah gussa bhi hua.", "Kabhi zid ki...", "Kabhi tumhe pareshan bhi kiya."],
  ["Lekin ek cheez kabhi nahi badli...", "Tumne kabhi mera saath nahi chhoda."],
  ["Har baar tumne mujhe samjha.", "Mera khayal rakha.", "Aur hamesha mere saath khadi rahi."],
  ["Iske liye...", "Dil se...", "Thank You So Much. ❤️"],
  ["Main shayad har baar words mein express nahi kar pata...", "Lekin tum meri life ka sabse beautiful hissa ho."],
  ["Aur bas itna hi kehna tha...", "Happy Birthday Mere Anushka. ❤️"]
];

export default function Screen18_TimeFreeze() {
  const { setCurrentScreen, setAudioVolume } = useStore();
  const [phase, setPhase] = useState<"silence" | "messages" | "finished">("silence");
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Fade out music and start silence phase
  useEffect(() => {
    let vol = 0.5;
    const fadeOut = setInterval(() => {
      vol -= 0.05;
      if (vol <= 0) {
        vol = 0;
        clearInterval(fadeOut);
      }
      setAudioVolume(vol);
    }, 200);

    const silenceTimer = setTimeout(() => {
      setPhase("messages");
    }, 3000); // 1s for fade out + 2s pure silence

    return () => {
      clearInterval(fadeOut);
      clearTimeout(silenceTimer);
    };
  }, [setAudioVolume]);

  // Handle typing animation
  useEffect(() => {
    if (phase !== "messages") return;

    if (messageIndex >= MESSAGES.length) {
      setTimeout(() => setPhase("finished"), 2000);
      return;
    }

    const currentLines = MESSAGES[messageIndex];
    setDisplayedText([]);
    setIsTyping(true);

    let lineIdx = 0;
    let charIdx = 0;

    const typeChar = () => {
      if (lineIdx >= currentLines.length) {
        setIsTyping(false);
        // Pause before next stanza
        setTimeout(() => {
          setMessageIndex(prev => prev + 1);
        }, 3000);
        return;
      }

      const currentLine = currentLines[lineIdx];

      if (charIdx === 0) {
        setDisplayedText(prev => [...prev, currentLine[0]]);
        charIdx++;
        typingRef.current = setTimeout(typeChar, 50);
      } else if (charIdx < currentLine.length) {
        setDisplayedText(prev => {
          const newArr = [...prev];
          newArr[lineIdx] = currentLine.slice(0, charIdx + 1);
          return newArr;
        });
        charIdx++;
        typingRef.current = setTimeout(typeChar, 50);
      } else {
        // Line finished, go to next line after short pause
        lineIdx++;
        charIdx = 0;
        typingRef.current = setTimeout(typeChar, 800);
      }
    };

    typingRef.current = setTimeout(typeChar, 500);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [messageIndex, phase]);

  // Handle finished phase (fade music back in, confetti, glow)
  useEffect(() => {
    if (phase === "finished") {
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol += 0.05;
        if (vol >= 0.5) {
          vol = 0.5;
          clearInterval(fadeIn);
        }
        setAudioVolume(vol);
      }, 200);

      // Soft golden confetti
      const duration = 10000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 15, spread: 360, ticks: 60, zIndex: 0 };
  
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
        const particleCount = 20 * (timeLeft / duration);
        confetti({
          ...defaults, particleCount,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ["#D4AF37", "#FFF3B0", "#FFD700"],
          gravity: 0.3,
          scalar: 0.8
        });
      }, 300);

      return () => {
        clearInterval(fadeIn);
        clearInterval(interval);
      };
    }
  }, [phase, setAudioVolume]);

  return (
    <motion.div 
      initial={{ opacity: 0, backgroundColor: "#000000" }}
      animate={{ opacity: 1, backgroundColor: phase === "finished" ? "rgba(10,8,0,1)" : "#000000" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-6 overflow-hidden"
    >
      {/* Soft Golden Glow in finished phase */}
      <motion.div 
        className="absolute w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "finished" ? 1 : 0 }}
        transition={{ duration: 3 }}
      />

      {/* Floating particles in finished phase */}
      <AnimatePresence>
        {phase === "finished" && [...Array(20)].map((_, i) => (
          <motion.div
            key={`gold-dust-${i}`}
            className="absolute rounded-full bg-[#D4AF37]/30 blur-sm pointer-events-none"
            style={{ width: Math.random() * 4 + 2 + "px", height: Math.random() * 4 + 2 + "px", top: Math.random() * 100 + "%", left: Math.random() * 100 + "%" }}
            initial={{ opacity: 0 }}
            animate={{ y: [0, -50, 0], opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </AnimatePresence>

      <div className="z-10 text-center max-w-3xl w-full flex flex-col items-center justify-center min-h-[300px]">
        {phase === "messages" && (
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-6"
            >
              {displayedText.map((line, i) => (
                <motion.p 
                  key={i} 
                  className="font-playfair text-2xl md:text-4xl lg:text-5xl text-white/90 leading-relaxed font-light drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                >
                  {line}
                  {i === displayedText.length - 1 && isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block ml-1"
                    >
                      |
                    </motion.span>
                  )}
                </motion.p>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {phase === "finished" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#FFF3B0] via-white to-[#D4AF37] mb-12 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Happy Birthday Mere Anushka. ❤️
            </h2>
            <CinematicButton onClick={() => setCurrentScreen(19)}>
              Final Surprise Dekho ❤️
            </CinematicButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
