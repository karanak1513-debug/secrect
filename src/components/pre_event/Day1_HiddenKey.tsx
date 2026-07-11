"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_KEYS = 5;

// We'll place some objects around the screen randomly
const ITEMS = [
  { id: 1, type: "key", top: "20%", left: "15%", delay: 0.2 },
  { id: 2, type: "fake", top: "70%", left: "25%", delay: 0.3 },
  { id: 3, type: "key", top: "50%", left: "80%", delay: 0.4 },
  { id: 4, type: "fake", top: "15%", left: "60%", delay: 0.5 },
  { id: 5, type: "key", top: "85%", left: "10%", delay: 0.6 },
  { id: 6, type: "fake", top: "40%", left: "30%", delay: 0.7 },
  { id: 7, type: "key", top: "30%", left: "90%", delay: 0.8 },
  { id: 8, type: "fake", top: "80%", left: "60%", delay: 0.9 },
  { id: 9, type: "key", top: "90%", left: "85%", delay: 1.0 },
  { id: 10, type: "fake", top: "60%", left: "45%", delay: 1.1 },
];

export default function Day1_HiddenKey({ onComplete }: { onComplete: () => void }) {
  const [keysFound, setKeysFound] = useState(0);
  const [clickedItems, setClickedItems] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleItemClick = (item: { id: number; type: string }) => {
    if (clickedItems.includes(item.id)) return;
    
    setClickedItems((prev) => [...prev, item.id]);

    if (item.type === "key") {
      setKeysFound((prev) => {
        const newVal = prev + 1;
        setFeedback(`Found Key ${newVal}/${TOTAL_KEYS}!`);
        if (newVal === TOTAL_KEYS) {
          setTimeout(onComplete, 1500);
        }
        return newVal;
      });
    } else {
      setFeedback("That's just a rock...");
    }

    // Hide feedback after 1.5s
    setTimeout(() => {
      setFeedback(null);
    }, 1500);
  };

  return (
    <div className="relative w-full h-[60vh] max-w-4xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#111] to-[#000] border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
      {/* Background styling to look like a messy room or abstract dark space */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />

      {/* Header UI */}
      <div className="absolute top-6 left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
        <h2 className="text-2xl md:text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
          Hidden Key Hunt
        </h2>
        <div className="flex gap-2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-[#D4AF37]/30">
          {[...Array(TOTAL_KEYS)].map((_, i) => (
            <span key={i} className={`text-xl transition-all duration-500 ${i < keysFound ? "text-[#D4AF37] drop-shadow-[0_0_5px_#D4AF37] scale-110" : "text-white/20 grayscale"}`}>
              🗝️
            </span>
          ))}
        </div>
      </div>

      {/* Play Area */}
      <div className="absolute inset-0 z-10">
        {ITEMS.map((item) => {
          const isClicked = clickedItems.includes(item.id);
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: isClicked ? 0 : 1, scale: isClicked ? 0 : 1 }}
              transition={{ delay: item.delay, duration: 0.5, ease: "easeOut" }}
              className="absolute text-3xl cursor-pointer hover:scale-125 transition-transform"
              style={{ top: item.top, left: item.left }}
              onClick={() => handleItemClick(item)}
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            >
              {item.type === "key" ? "🗝️" : "🪨"}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback text */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 px-6 py-2 bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 rounded-full text-[#FFF3B0] font-poppins text-sm whitespace-nowrap shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
