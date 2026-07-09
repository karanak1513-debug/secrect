/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";

// Placeholders for gallery
const IMAGES = [
  "/photo1.jpg",
  "/photo2.jpg",
  "/photo3.jpg",
  "/photo4.jpg",
];

export default function Screen11_MemoryGallery() {
  const { setCurrentScreen } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4 py-20"
    >
      <div className="text-center z-20 mb-12">
        <h2 className="font-playfair text-3xl md:text-5xl text-white/90 drop-shadow-md">
          Our Beautiful Memories
        </h2>
        <p className="font-poppins text-white/60 mt-4 text-sm md:text-base">Tap a photo to enlarge</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-10 max-w-6xl z-20">
        {IMAGES.map((src, index) => (
          <motion.div 
            key={index} 
            layoutId={`card-${index}`}
            onClick={() => setSelectedId(`card-${index}`)}
            className="bg-white p-3 pb-12 rounded-sm shadow-xl cursor-pointer rotate-[-2deg] hover:rotate-[2deg] hover:scale-105 transition-transform duration-300 relative w-40 md:w-56"
            style={{ 
              transform: `rotate(${index % 2 === 0 ? -3 : 4}deg)` 
            }}
          >
            <div className="w-full aspect-square bg-gray-200 overflow-hidden">
              <img src={src} alt="Memory" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-4 left-0 w-full text-center">
              <span className="font-playfair text-black/70 font-medium">Memory #{index + 1}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div 
              layoutId={selectedId}
              className="bg-white p-4 pb-16 rounded-md w-full max-w-lg shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-black"
                onClick={() => setSelectedId(null)}
              >
                ✕
              </button>
              <div className="w-full aspect-square bg-gray-200 overflow-hidden">
                <img 
                  src={IMAGES[parseInt(selectedId.split("-")[1])]} 
                  alt="Memory Enlarge" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute bottom-6 left-0 w-full text-center">
                <span className="font-playfair text-black/80 text-xl font-medium">
                  Unforgettable moments.
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-16 z-20"
      >
        <CinematicButton onClick={() => setCurrentScreen(12)}>
          I have one more surprise 🎬
        </CinematicButton>
      </motion.div>
    </motion.div>
  );
}
