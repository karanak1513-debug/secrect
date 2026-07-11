"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Day1_LaserMaze({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [lasers, setLasers] = useState<{ id: number; top: string; duration: number }[]>([]);
  const [fails, setFails] = useState(0);

  useEffect(() => {
    // Generate some lasers
    setLasers([
      { id: 1, top: "25%", duration: 2 },
      { id: 2, top: "50%", duration: 1.5 },
      { id: 3, top: "75%", duration: 2.5 },
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
          setFails((f) => f + 1);
          // Reset heart (framer-motion handles DOM position, but we force a re-render or CSS translation reset)
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
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-3xl font-playfair text-[#D4AF37] mb-2">Laser Maze</h2>
        <p className="text-white/60 font-poppins text-sm mb-4">
          Drag the heart to the safe zone at the top. Don't touch the lasers!
        </p>
        {fails > 0 && <p className="text-red-400 text-sm">Hits: {fails}</p>}
      </motion.div>

      <div 
        ref={containerRef}
        className="relative w-full h-[60vh] max-h-[500px] border-2 border-[#D4AF37]/30 rounded-2xl bg-black overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.15)] flex flex-col"
      >
        {/* Target Zone */}
        <div ref={targetRef} className="absolute top-0 left-0 w-full h-20 bg-green-500/10 border-b border-green-500/30 flex items-center justify-center">
          <span className="text-green-400 font-poppins text-sm tracking-widest">SAFE ZONE</span>
        </div>

        {/* Lasers */}
        {lasers.map((laser, index) => (
          <motion.div
            key={laser.id}
            className="laser-beam absolute left-0 w-32 h-2 bg-red-500 shadow-[0_0_15px_#ef4444] rounded-full"
            style={{ top: laser.top }}
            animate={{
              x: ["0%", "300%", "0%"],
            }}
            transition={{
              duration: laser.duration,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.5,
            }}
          />
        ))}

        {/* Draggable Heart */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <motion.div
            ref={heartRef}
            drag
            dragConstraints={containerRef}
            dragElastic={0}
            dragMomentum={false}
            className="w-12 h-12 flex items-center justify-center text-4xl cursor-grab active:cursor-grabbing drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] z-50 touch-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ❤️
          </motion.div>
        </div>
      </div>
    </div>
  );
}
