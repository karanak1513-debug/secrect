"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CARD_SYMBOLS = ["💎", "👑", "🌟", "🌙", "🎵", "🌸"];

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function Day1_MemoryMatch({ onComplete }: { onComplete: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(100);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Initialize cards
    const initialCards: Card[] = [...CARD_SYMBOLS, ...CARD_SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, id) => ({
        id,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(initialCards);
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = newFlippedIndices;

      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setIsLocked(false);

          if (matchedCards.every((c) => c.isMatched)) {
            setTimeout(onComplete, 1000);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setScore((s) => Math.max(0, s - 10));
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Memory Match</h2>
        <p className="text-white/60 font-poppins text-sm mb-4">Find all matching pairs. Incorrect matches reduce your score.</p>
        <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[#FFF3B0]">
          Score: {score}
        </div>
      </motion.div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="aspect-square relative perspective-1000"
            onClick={() => handleCardClick(index)}
          >
            <motion.div
              className="w-full h-full absolute transform-style-preserve-3d transition-transform duration-500 cursor-pointer"
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
            >
              {/* Front (Hidden) */}
              <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#D4AF37]/20 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
                <div className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#D4AF37]/20" />
                </div>
              </div>

              {/* Back (Revealed) */}
              <div 
                className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-[#2A2A2A] to-[#151515] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                style={{ transform: "rotateY(180deg)" }}
              >
                <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{card.symbol}</span>
                {card.isMatched && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[#D4AF37]/20 rounded-xl"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
