"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";
import confetti from "canvas-confetti";

const SYMBOLS = ["❤️", "🌹", "🎁", "🎂", "⭐", "💌", "🍫", "⌚"];
const JACKPOTS = [
  ["❤️", "❤️", "❤️"]
];

export default function Screen15_SlotMachine() {
  const { setCurrentScreen } = useStore();
  const [spinning, setSpinning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reels, setReels] = useState(["⭐", "🌹", "🎁"]);
  const [showPrize, setShowPrize] = useState(false);
  const [jackpot, setJackpot] = useState<string[]>([]);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize random jackpot target
  useEffect(() => {
    setJackpot(JACKPOTS[Math.floor(Math.random() * JACKPOTS.length)]);
  }, []);

  const playClickSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioCtx = audioCtxRef.current;
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800 + Math.random() * 200, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log("Audio play failed", e);
    }
  };

  const playWinSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioCtx = audioCtxRef.current;
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.log("Audio play failed", e);
    }
  };

  const handleSpin = () => {
    if (spinning || finished) return;
    setSpinning(true);

    const spinDuration = 3000;
    const intervalTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      
      setReels((prev) => [
        elapsed < spinDuration - 1000 ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : jackpot[0],
        elapsed < spinDuration - 500 ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : jackpot[1],
        elapsed < spinDuration ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : jackpot[2]
      ]);

      if (elapsed < spinDuration) {
        playClickSound();
      } else {
        clearInterval(interval);
        setReels(jackpot);
        setSpinning(false);
        setFinished(true);
        playWinSound();
        fireConfetti();
      }
    }, intervalTime);
  };

  const fireConfetti = () => {
    const duration = 4000;
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
        colors: ["#D4AF37", "#FFF3B0", "#FFD700", "#FF0000", "#FFC0CB"]
      });
    }, 250);
  };

  const particles = useMemo(() => {
    return [...Array(15)].map(() => ({
      width: Math.random() * 6 + 2 + "px",
      height: Math.random() * 6 + 2 + "px",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      duration: Math.random() * 10 + 10,
    }));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4 overflow-hidden"
    >
      {/* Background Particles & Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-[#D4AF37]/20 blur-sm"
            style={{ width: p.width, height: p.height, top: p.top, left: p.left }}
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="z-10 text-center mb-10">
        <h1 className="font-playfair text-4xl md:text-6xl text-[#D4AF37] mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
          Lucky Love Machine
        </h1>
        <p className="font-poppins text-white/70 text-sm md:text-base">
          Let&apos;s see what destiny has chosen...
        </p>
      </div>

      {/* Slot Machine UI */}
      <motion.div 
        className={`relative z-10 glass-card p-6 md:p-10 rounded-3xl flex flex-col items-center border ${finished ? 'border-[#D4AF37] shadow-[0_0_80px_rgba(212,175,55,0.4)]' : 'border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.1)]'} bg-black/60 backdrop-blur-xl mb-12 transition-all duration-1000`}
      >
        {/* Golden glow animation behind reels when finished */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-[#D4AF37]/10 rounded-3xl blur-2xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="flex gap-4 md:gap-8 mb-10">
          {reels.map((symbol, i) => (
            <div 
              key={i} 
              className="w-20 h-24 md:w-32 md:h-36 bg-gradient-to-b from-black/80 via-white/5 to-black/80 border-t-2 border-b-2 border-[#D4AF37] rounded-xl flex items-center justify-center shadow-inner overflow-hidden relative"
            >
              {/* Inner shadow overlay for depth */}
              <div className="absolute inset-0 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8),inset_0_-10px_20px_rgba(0,0,0,0.8)] pointer-events-none z-10" />
              
              <motion.div
                key={`${symbol}-${spinning}`}
                initial={spinning ? { y: -50, opacity: 0.5, scale: 0.8 } : { y: 0, opacity: 1, scale: 1 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={spinning ? { type: "spring", stiffness: 300, damping: 20 } : { type: "spring" }}
                className="text-6xl md:text-7xl lg:text-8xl flex items-center justify-center drop-shadow-[0_0_20px_rgba(255,50,50,0.6)]"
              >
                {symbol}
              </motion.div>
            </div>
          ))}
        </div>

        {!finished ? (
          <CinematicButton onClick={handleSpin}>
            {spinning ? "SPINNING..." : "SPIN"}
          </CinematicButton>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <p className="font-playfair text-xl md:text-2xl text-[#FFF3B0] mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
              &quot;The jackpot was never the prize...<br/>It was always YOU.&quot;
            </p>
            <CinematicButton onClick={() => setShowPrize(true)}>
              Claim Your Prize 🎁
            </CinematicButton>
          </motion.div>
        )}
      </motion.div>

      {/* Prize Modal */}
      <AnimatePresence>
        {showPrize && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card p-8 md:p-12 max-w-md w-full text-center border-[#D4AF37]/50 shadow-[0_0_60px_rgba(212,175,55,0.3)] bg-gradient-to-b from-black/90 to-[#1a1500]/90"
            >
              <div className="text-6xl mb-6">💌</div>
              <h3 className="font-playfair text-3xl text-[#D4AF37] mb-4">
                My Lucky Charm
              </h3>
              <p className="font-poppins text-white/80 text-sm md:text-base leading-relaxed mb-8">
                Winning you was the greatest jackpot of my life. I don&apos;t need anything else as long as I have you by my side.
              </p>
              <CinematicButton onClick={() => setCurrentScreen(16)}>
                Unlock Final Memory ✨
              </CinematicButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
