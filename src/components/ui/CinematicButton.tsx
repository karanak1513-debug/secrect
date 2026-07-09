"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function CinematicButton({ children, onClick, className, variant = "primary" }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={twMerge(
        clsx(
          "px-8 py-4 rounded-full font-poppins font-medium tracking-wide transition-all ripple relative overflow-hidden backdrop-blur-md cursor-pointer",
          variant === "primary" 
            ? "bg-white/20 text-white border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            : "bg-black/20 text-white/80 border border-white/10 hover:bg-black/40 hover:text-white"
        ),
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
