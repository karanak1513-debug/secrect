"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  size: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  endXOffset: number;
  glowColor: string;
}

export default function GoldenParticles({ count = 35 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const glows = [
      "rgba(212, 175, 55, 0.4)", // classic gold
      "rgba(255, 243, 176, 0.5)", // bright gold
      "rgba(170, 124, 17, 0.3)",  // dark gold
    ];

    setParticles(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        size: Math.random() * 5 + 3, // 3px to 8px
        startX: Math.random() * 100,
        startY: Math.random() * 100 + 100, // start below viewport
        duration: Math.random() * 12 + 12, // 12 to 24 seconds to float up
        delay: Math.random() * -20, // negative delay so particles start scattered on screen immediately!
        endXOffset: Math.random() * 30 - 15,
        glowColor: glows[Math.floor(Math.random() * glows.length)],
      }))
    );
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#AA7C11]"
          style={{
            left: `${p.startX}vw`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: `0 0 10px ${p.glowColor}, 0 0 20px ${p.glowColor}`,
            willChange: "transform",
            transform: "translateZ(0)",
          }}
          initial={{ y: `${p.startY}vh`, opacity: 0 }}
          animate={{
            y: "-15vh",
            opacity: [0, 0.8, 0.8, 0],
            x: `${p.startX + p.endXOffset}vw`,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
