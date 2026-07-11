"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UnlockCeremonyProps {
  startScene: number | string;
  onLaunch: (mode: "family" | "private") => void;
}

export default function UnlockCeremony({ startScene, onLaunch }: UnlockCeremonyProps) {
  const [scene, setScene] = useState<number | string>(startScene);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  // Play synthesized sounds
  const playSound = (type: "creak" | "click" | "explode") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      if (type === "creak") {
        // Synthesize a low frequency creaking sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(120, now + 1.5);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
      } else if (type === "click") {
        // High frequency click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "explode") {
        // Low boom + high sparkle arpeggio
        const playBoom = () => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.8);
        };
        const playChime = (freq: number, start: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.15, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.3);
        };
        playBoom();
        playChime(523.25, now);
        playChime(659.25, now + 0.1);
        playChime(783.99, now + 0.2);
        playChime(1046.50, now + 0.3);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Scene transition timers
  useEffect(() => {
    if (scene === 1) {
      const timer = setTimeout(() => {
        setScene(2);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  // Scene 2 lock animation timing
  useEffect(() => {
    if (scene === 2) {
      // Shaking and creaking sounds
      setTimeout(() => playSound("creak"), 500);
      setTimeout(() => playSound("click"), 1800);
      setTimeout(() => {
        playSound("explode");
        setScene(3);
      }, 3500);
    }
  }, [scene]);

  // Loading text cycler
  useEffect(() => {
    if (scene === "family_loading" || scene === "private_loading") {
      const texts = scene === "family_loading"
        ? ["Preparing Celebration...", "Loading Memories...", "Almost Ready..."]
        : ["Preparing Your Journey...", "Loading Memories...", "Unlocking Every Surprise...", "Almost Ready..."];
      
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => {
          if (prev < texts.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              onLaunch(scene === "family_loading" ? "family" : "private");
            }, 1000);
            return prev;
          }
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [scene, onLaunch]);

  const handlePasswordSubmit = () => {
    const val = password.trim().toUpperCase();
    if (scene === "family_pass") {
      if (val === "HAPPY" || val === "HAPPYBIRTHDAY") {
        setLoadingTextIndex(0);
        setScene("family_loading");
      } else {
        setErrorMsg("Incorrect Password. Please try again.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } else if (scene === "private_pass") {
      if (val === "1437") {
        setLoadingTextIndex(0);
        setScene("private_loading");
      } else {
        setErrorMsg("Incorrect Password. Please try again.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020202] text-white flex flex-col items-center justify-center overflow-hidden font-poppins">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* SCENE 1: Typewriter Wait message */}
        {scene === 1 && (
          <motion.div
            key="scene-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center px-6"
          >
            <motion.p
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="text-xl md:text-3xl font-light font-playfair tracking-widest text-[#D4AF37] whitespace-nowrap overflow-hidden border-r-2 border-[#D4AF37] pr-2 mx-auto max-w-fit"
            >
              The wait is finally over...
            </motion.p>
          </motion.div>
        )}

        {/* SCENE 2: Golden Lock Animation */}
        {scene === 2 && (
          <motion.div
            key="scene-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center relative"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1.15, 1.25, 1.4],
                rotate: [0, -2, 2, -3, 3, -5, 5, 0]
              }}
              transition={{ 
                duration: 3.5,
                ease: "easeInOut"
              }}
              className="relative w-48 h-48 flex items-center justify-center"
            >
              {/* Outer Golden Aura */}
              <motion.div 
                animate={{ opacity: [0.1, 0.4, 0.8, 1] }}
                transition={{ duration: 3 }}
                className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_60%)] blur-xl"
              />
              
              {/* Lock Shape */}
              <div className="relative text-8xl md:text-9xl drop-shadow-[0_0_35px_rgba(212,175,55,0.8)] filter">
                🔒
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 3: Happy Birthday Header */}
        {scene === 3 && (
          <motion.div
            key="scene-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 1 }}
            className="text-center px-6 max-w-2xl flex flex-col items-center gap-6"
          >
            {/* Confetti overlay for Scene 3 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-4 bg-[#D4AF37] rounded-sm"
                  initial={{ top: "-10%", left: `${Math.random() * 100}%`, rotate: 0 }}
                  animate={{ 
                    top: "110%", 
                    left: `${Math.random() * 100}%`,
                    rotate: 360,
                    opacity: [1, 1, 0]
                  }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundColor: i % 2 === 0 ? "#D4AF37" : "#FFF3B0" }}
                />
              ))}
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-playfair font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]"
            >
              🎉 Happy Birthday! 🎉
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/80 font-light text-lg md:text-xl"
            >
              "The celebration you've been waiting for has finally begun."
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-white/50 text-sm leading-relaxed mt-4 flex flex-col gap-1 font-light"
            >
              <span>Every surprise,</span>
              <span>every memory,</span>
              <span>every chapter,</span>
              <span>and every little detail...</span>
              <span className="text-[#D4AF37] font-medium mt-2">was waiting for this exact moment.</span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              onClick={() => setScene(4)}
              className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)] mt-6 text-sm"
            >
              Enter Celebration
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 4: Glass Unlock Status Card */}
        {scene === 4 && (
          <motion.div
            key="scene-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-6 max-w-md w-full flex flex-col items-center"
          >
            <div className="bg-white/[0.02] border border-[#D4AF37]/30 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(212,175,55,0.15)] w-full mb-8">
              <h2 className="text-2xl font-playfair text-[#D4AF37] mb-6 tracking-wide">Birthday Celebration</h2>
              
              <div className="flex flex-col gap-4 text-left font-light border-y border-white/10 py-6 my-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Status</span>
                  <span className="text-[#4ADE80] font-bold tracking-wider flex items-center gap-1.5 drop-shadow-[0_0_8px_#4ade80]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-pulse" />
                    UNLOCKED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Date</span>
                  <span className="text-white/95 font-medium">13 July</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Time</span>
                  <span className="text-white/95 font-medium">1:00 PM</span>
                </div>
              </div>

              <p className="text-xs text-white/50 italic mt-6">
                "The Birthday Website is now officially open."
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScene(5)}
              className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] text-sm"
            >
              Continue to Modes →
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 5: Mode Cards Select Screen */}
        {scene === 5 && (
          <motion.div
            key="scene-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col md:flex-row gap-6 p-6 max-w-4xl w-full justify-center items-stretch"
          >
            {/* Family Card */}
            <motion.div
              whileHover={{ y: -8, borderColor: "rgba(212,175,55,0.5)" }}
              className="flex-1 bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between items-center text-center transition-all duration-300 min-h-[300px]"
            >
              <div className="flex flex-col items-center gap-4">
                <span className="text-5xl">👨👩👧</span>
                <h3 className="text-2xl font-playfair text-[#D4AF37] font-semibold">Family Mode</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Unlock the full family celebration, memories, wishes, and surprise elements.
                </p>
              </div>
              <button
                onClick={() => setScene("family_pass")}
                className="w-full mt-8 py-3 bg-[#D4AF37] hover:bg-[#AA7C11] text-black font-semibold rounded-full transition-colors text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                Continue →
              </button>
            </motion.div>

            {/* Private Card */}
            <motion.div
              whileHover={{ y: -8, borderColor: "rgba(212,175,55,0.5)" }}
              className="flex-1 bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between items-center text-center transition-all duration-300 min-h-[300px]"
            >
              <div className="flex flex-col items-center gap-4">
                <span className="text-5xl">❤️</span>
                <h3 className="text-2xl font-playfair text-[#D4AF37] font-semibold">Private Mode</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Enter the private journey made exclusively for you.
                </p>
              </div>
              <button
                onClick={() => setScene("private_pass")}
                className="w-full mt-8 py-3 bg-[#D4AF37] hover:bg-[#AA7C11] text-black font-semibold rounded-full transition-colors text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                Continue →
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* FAMILY PASSWORD INPUT SCREEN */}
        {scene === "family_pass" && (
          <motion.div
            key="family-pass"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center max-w-sm w-full px-6"
          >
            <button 
              onClick={() => setScene(5)} 
              className="text-white/40 hover:text-white/80 transition-colors text-xs mb-8 flex items-center gap-1.5 self-start"
            >
              ← Back
            </button>
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] w-full flex flex-col items-center">
              <h2 className="text-2xl font-playfair text-[#D4AF37] mb-2 font-semibold">Family Access</h2>
              <p className="text-white/50 text-xs font-light mb-6 text-center">
                Please enter the Family Password to proceed.
              </p>

              <motion.div 
                animate={errorMsg ? { x: [-8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col gap-4"
              >
                <input
                  type="password"
                  placeholder="Enter Family Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  className={`bg-white/5 border text-center focus:outline-none focus:bg-white/10 transition-all rounded-full px-6 py-3 font-poppins text-sm w-full backdrop-blur-md ${
                    errorMsg 
                      ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] text-red-500" 
                      : "border-[#D4AF37]/30 text-white/90 focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  }`}
                />
                
                <button
                  onClick={handlePasswordSubmit}
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#AA7C11] text-black font-semibold rounded-full transition-colors text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  Verify Access
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* PRIVATE PASSWORD INPUT SCREEN */}
        {scene === "private_pass" && (
          <motion.div
            key="private-pass"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center max-w-sm w-full px-6"
          >
            <button 
              onClick={() => setScene(5)} 
              className="text-white/40 hover:text-white/80 transition-colors text-xs mb-8 flex items-center gap-1.5 self-start"
            >
              ← Back
            </button>
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] w-full flex flex-col items-center">
              <h2 className="text-2xl font-playfair text-[#D4AF37] mb-2 font-semibold">Private Access</h2>
              <p className="text-white/50 text-xs font-light mb-6 text-center">
                Please enter your private password.
              </p>

              <motion.div 
                animate={errorMsg ? { x: [-8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col gap-4"
              >
                <input
                  type="password"
                  placeholder="Enter Private Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  className={`bg-white/5 border text-center focus:outline-none focus:bg-white/10 transition-all rounded-full px-6 py-3 font-poppins text-sm w-full backdrop-blur-md ${
                    errorMsg 
                      ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] text-red-500" 
                      : "border-[#D4AF37]/30 text-white/90 focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  }`}
                />
                
                <button
                  onClick={handlePasswordSubmit}
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#AA7C11] text-black font-semibold rounded-full transition-colors text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  Verify Access
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* LOADING SCREEN (FAMILY & PRIVATE) */}
        {(scene === "family_loading" || scene === "private_loading") && (
          <motion.div
            key="loading-ceremony"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-6 gap-6"
          >
            {/* Golden pulse loader */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
              <span className="text-[#D4AF37] text-lg">✨</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={loadingTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-white/80 font-light text-base tracking-wide"
              >
                {scene === "family_loading" 
                  ? ["Preparing Celebration...", "Loading Memories...", "Almost Ready..."][loadingTextIndex]
                  : ["Preparing Your Journey...", "Loading Memories...", "Unlocking Every Surprise...", "Almost Ready..."][loadingTextIndex]
                }
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error messages overlay */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-10 px-6 py-3 bg-red-500/20 border border-red-500/50 backdrop-blur-md rounded-full text-white text-sm font-poppins z-[9999]"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
