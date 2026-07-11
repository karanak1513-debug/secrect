"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import { sfx } from "@/utils/sfx";

interface Blessing {
  id: string;
  sender: string;
  relation: string;
  wish: string;
  emoji: string;
  freqs: number[]; // chord freqs
}

const BLESSINGS: Blessing[] = [
  {
    id: "mom",
    sender: "Mamma",
    relation: "Mother",
    wish: "May you always smile, be healthy, and find joy in every little path you walk. You are my absolute star! ❤️",
    emoji: "👩",
    freqs: [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5 (C Major)
  },
  {
    id: "dad",
    sender: "Papa",
    relation: "Father",
    wish: "Fly high, achieve every single one of your dreams, but always know your family stands behind you. Happy Birthday! 🌟",
    emoji: "👨",
    freqs: [293.66, 349.23, 440.00, 587.33] // D4, F4, A4, D5 (D Minor)
  },
  {
    id: "sibling",
    sender: "Chotu",
    relation: "Sibling",
    wish: "Stop stealing my chocolates! Just kidding, happy birthday to the best sibling who always stands up for me. HBD! 🤫",
    emoji: "🧒",
    freqs: [329.63, 392.00, 493.88, 659.25] // E4, G4, B4, E5 (E Minor)
  },
  {
    id: "friend",
    sender: "Gang",
    relation: "Friends",
    wish: "Another year of laughs, gossips, and late-night adventures. We love you! Party hard tonight! 🍕",
    emoji: "🎉",
    freqs: [349.23, 440.00, 523.25, 698.46] // F4, A4, C5, F5 (F Major)
  }
];

export default function Screen7_FamilySoundboard() {
  const { setCurrentScreen } = useStore();
  const [selectedBlessing, setSelectedBlessing] = useState<Blessing | null>(null);

  const playSynthesizedChord = (freqs: number[]) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1);
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleNodeClick = (blessing: Blessing) => {
    setSelectedBlessing(blessing);
    playSynthesizedChord(blessing.freqs);
  };

  const handleNext = () => {
    sfx.playTransition();
    setCurrentScreen(7); // Go to final Birthday Card!
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-poppins text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 pointer-events-none"
      >
        <span className="font-mono text-xs text-[#D4AF37] tracking-[0.3em] uppercase block mb-1 opacity-0 pointer-events-none select-none">·</span>
        <h2 className="text-3xl md:text-4xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
          Blessing Soundboard
        </h2>
      </motion.div>

      {/* Main Glass Dashboard Card */}
      <div className="glass-card w-full max-w-lg p-8 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-black/60 backdrop-blur-2xl flex flex-col items-center justify-center min-h-[380px] relative">
        <span className="text-[10px] font-mono text-white/40 mb-6 uppercase tracking-widest text-center">
          Tap nodes to hear chords & reveal family wishes
        </span>

        {/* Chords Nodes */}
        <div className="grid grid-cols-4 gap-4 mb-10 w-full justify-center">
          {BLESSINGS.map((blessing) => {
            const isSelected = selectedBlessing?.id === blessing.id;
            return (
              <motion.button
                key={blessing.id}
                onClick={() => handleNodeClick(blessing)}
                whileHover={{ scale: 1.1, borderColor: "rgba(212, 175, 55, 0.6)" }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center p-4 aspect-square rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-[0_0_20px_rgba(212,175,55,0.3)]" 
                    : "bg-black/60 border-[#D4AF37]/20 text-white/70 hover:bg-white/5"
                }`}
              >
                <span className="text-2xl mb-2">{blessing.emoji}</span>
                <span className="text-[10px] font-mono font-medium tracking-wide uppercase">{blessing.sender}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Central Speech Bubble Wish */}
        <div className="w-full flex items-center justify-center min-h-[120px] relative mb-6">
          <AnimatePresence mode="wait">
            {selectedBlessing ? (
              <motion.div
                key={selectedBlessing.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ type: "spring", stiffness: 140, damping: 15 }}
                className="bg-[#D4AF37]/5 border border-[#D4AF37]/35 rounded-2xl p-5 w-full text-center relative"
              >
                {/* Bubble Tip */}
                <div className="absolute top-[-8px] left-[15%] w-4 h-4 bg-[#0a0a0a] border-t border-l border-[#D4AF37]/35 rotate-45" />
                
                <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
                  WISH FROM {selectedBlessing.relation}
                </span>
                <p className="text-white font-playfair italic leading-relaxed text-sm">
                  "{selectedBlessing.wish}"
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white/60 italic text-center font-light font-poppins"
              >
                "Click a node to listen to its synthesized blessing chime..."
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {selectedBlessing && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black font-semibold rounded-full shadow-md text-xs tracking-wider uppercase ml-auto cursor-pointer"
          >
            Enter Grand Finale →
          </motion.button>
        )}
      </div>
    </div>
  );
}
