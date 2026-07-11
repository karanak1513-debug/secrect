"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/utils/sfx";

export default function Day1_LaserMaze({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [lasers, setLasers] = useState<{ id: number; top: string; duration: number }[]>([]);
  const [fails, setFails] = useState(0);

  useEffect(() => {
    // Generate lasers with varying speeds
    setLasers([
      { id: 1, top: "25%", duration: 2.2 },
      { id: 2, top: "50%", duration: 1.6 },
      { id: 3, top: "75%", duration: 2.8 },
    ]);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let isCompleted = false;

    const checkCollision = () => {
      if (isCompleted || !heartRef.current || !targetRef.current || !containerRef.current) {
        animationFrameId = requestAnimationFrame(checkCollision);
        return;
      }

      const heartRect = heartRef.current.getBoundingClientRect();
      const targetRect = targetRef.current.getBoundingClientRect();

      // Check win
      if (
        heartRect.top < targetRect.bottom &&
        heartRect.bottom > targetRect.top &&
        heartRect.left < targetRect.right &&
        heartRect.right > targetRect.left
      ) {
        isCompleted = true;
        onComplete();
        return;
      }

      // Check lasers
      const laserElements = containerRef.current.querySelectorAll(".laser-beam");
      for (const laser of laserElements) {
        const laserRect = laser.getBoundingClientRect();
        if (
          heartRect.left < laserRect.right &&
          heartRect.right > laserRect.left &&
          heartRect.top < laserRect.bottom &&
          heartRect.bottom > laserRect.top
        ) {
          // Collision!
          sfx.playError();
          setFails((f) => f + 1);
          // Reset heart
          heartRef.current.style.transform = "translate(0px, 0px)";
          break;
        }
      }

      animationFrameId = requestAnimationFrame(checkCollision);
    };

    animationFrameId = requestAnimationFrame(checkCollision);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 relative z-10 font-poppins">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Laser Maze</h2>
        <p className="text-white/60 text-sm mb-4">
          Drag the heart coordinate through the moving security laser sweep to the safe zone.
        </p>
        {fails > 0 && (
          <motion.p
            key={fails}
            initial={{ scale: 1.2, color: "#f87171" }}
            animate={{ scale: 1, color: "#f87171" }}
            className="text-red-400 text-xs uppercase tracking-widest font-mono"
          >
            Alert: security hits ({fails})
          </motion.p>
        )}
      </motion.div>

      {/* Main Glass Grid */}
      <div 
        ref={containerRef}
        className="relative w-full h-[55vh] max-h-[460px] border border-white/10 rounded-[32px] bg-black/60 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col"
      >
        {/* Target Zone */}
        <div ref={targetRef} className="absolute top-0 left-0 w-full h-20 bg-green-500/5 border-b border-green-500/10 flex items-center justify-center">
          <span className="text-green-400 font-mono text-xs tracking-[0.3em] font-semibold animate-pulse">SAFE ZONE</span>
        </div>

        {/* Lasers */}
        {lasers.map((laser, index) => (
          <motion.div
            key={laser.id}
            className="laser-beam absolute left-0 w-36 h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-[0_0_15px_#ef4444,0_0_30px_#ef4444] rounded-full"
            style={{ top: laser.top }}
            animate={{
              x: ["-20%", "280%", "-20%"],
            }}
            transition={{
              duration: laser.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
          />
        ))}

        {/* Draggable Heart */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            ref={heartRef}
            drag
            dragConstraints={containerRef}
            dragElastic={0}
            dragMomentum={false}
            className="w-14 h-14 flex items-center justify-center text-4xl cursor-grab active:cursor-grabbing z-50 touch-none relative select-none"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Halo pulse */}
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping pointer-events-none" />
            ❤️
          </motion.div>
        </div>
      </div>
    </div>
  );
}
