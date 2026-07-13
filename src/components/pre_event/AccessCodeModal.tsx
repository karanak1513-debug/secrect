"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/utils/sfx";

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (codeType: "early" | "admin") => void;
}

export default function AccessCodeModal({ isOpen, onClose, onVerify }: AccessCodeModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setError(false);
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();

    if (cleanCode.toUpperCase() === "HLO") {
      sfx.playClick();
      onVerify("early");
      onClose();
    } else if (cleanCode === "143") {
      sfx.playClick();
      onVerify("admin");
      onClose();
    } else {
      // Play a fail/click sound or alert
      try {
        sfx.playClick();
      } catch (err) {}
      setError(true);
      setErrorMessage("❌ Invalid Access Code");
      // Reset shake animation state after 500ms
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-gradient-to-b from-[#111111]/95 to-[#070707]/95 border border-[#D4AF37]/35 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] overflow-hidden z-10"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-white/80 transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center relative z-10">
              {/* Gold Lock Icon */}
              <div className="w-14 h-14 rounded-full bg-black border border-[#D4AF37]/45 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5 text-[#D4AF37] drop-shadow-[0_0_3px_rgba(212,175,55,0.3)]"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-white mb-2 tracking-wide">
                Private Access
              </h2>
              <p className="text-white/40 text-xs font-light tracking-wide mb-8 font-poppins">
                Enter your access credentials below to unlock.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                <motion.div
                  animate={error ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="w-full relative"
                >
                  <input
                    type="password"
                    placeholder="Enter Access Code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className={`bg-white/5 border text-center focus:outline-none focus:bg-white/10 transition-all duration-300 rounded-full px-6 py-3.5 font-poppins text-sm w-full backdrop-blur-md tracking-wider placeholder:tracking-normal placeholder:text-white/30 ${
                      errorMessage
                        ? "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "border-[#D4AF37]/30 text-[#FFF3B0] focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                    }`}
                    autoFocus
                  />
                </motion.div>

                {/* Validation Error Message */}
                <div className="h-5 flex items-center justify-center">
                  {errorMessage && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-poppins text-red-400 font-medium"
                    >
                      {errorMessage}
                    </motion.span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#FFF3B0] hover:to-[#D4AF37] text-black font-semibold rounded-full transition-all duration-500 text-xs tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] cursor-pointer"
                  >
                    Unlock
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3.5 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium rounded-full transition-all duration-300 text-xs tracking-[0.2em] uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
