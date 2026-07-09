"use client";

import { useStore } from "@/contexts/StoreContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackgroundEngine() {
  const { currentScreen } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 aurora-bg opacity-70" />

      {/* Dynamic Particles based on screen */}
      <AnimatePresence>
        {currentScreen >= 2 && currentScreen <= 4 && (
          <motion.div
            key="romantic-mix"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <FloatingParticles type="heart-outline" count={10} />
            <FloatingParticles type="petal" count={15} />
            <FloatingParticles type="sparkle" count={25} />
          </motion.div>
        )}
        
        {currentScreen >= 7 && currentScreen <= 10 && (
          <motion.div
            key="petals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <FloatingParticles type="petal" count={20} />
          </motion.div>
        )}
        
        {currentScreen >= 13 && (
          <motion.div
            key="sparkles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <FloatingParticles type="sparkle" count={30} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingParticles({ type, count }: { type: "heart" | "heart-outline" | "petal" | "sparkle"; count: number }) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: count }).map(() => ({
      size: Math.random() * 20 + 10,
      startX: Math.random() * 100,
      startY: Math.random() * 100 + 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      endXOffset: Math.random() * 20 - 10
    })));
  }, [count]);
  
  const getIcon = () => {
    switch(type) {
      case "heart": return "💖";
      case "heart-outline": return "🤍";
      case "petal": return "🌸";
      case "sparkle": return "✨";
      default: return "✨";
    }
  };

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute text-2xl ${type === 'sparkle' ? 'text-[#D4AF37]' : type === 'petal' ? 'text-pink-200/80' : 'text-pink-300'}`}
          style={{
            left: `${p.startX}vw`,
            fontSize: `${p.size}px`,
            filter: type === "heart" ? "drop-shadow(0 0 15px rgba(255,182,193,0.8))" : "drop-shadow(0 0 5px rgba(255,192,203,0.4))"
          }}
          initial={{ y: `${p.startY}vh`, opacity: 0, rotate: 0 }}
          animate={{ 
            y: "-20vh", 
            opacity: [0, 0.8, 0.8, 0],
            rotate: 360,
            x: `${p.startX + p.endXOffset}vw` 
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        >
          {getIcon()}
        </motion.div>
      ))}
    </>
  );
}
