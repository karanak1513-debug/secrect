"use client";

import { useStore } from "@/contexts/StoreContext";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AudioPlayer() {
  const { audioPlaying, setAudioPlaying, audioVolume, setAudioVolume, currentScreen } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Use a placeholder romantic piano music
    audioRef.current = new Audio("/bg-music.mp3");
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = audioVolume;
    
    if (audioPlaying) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    } else {
      audioRef.current.pause();
    }
  }, [audioPlaying, audioVolume]);

  if (!mounted) return null;

  // Don't show controls on splash screen
  if (currentScreen === 1) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-6 right-6 z-50 p-2 md:p-3 flex items-center gap-3 md:gap-4 rounded-full backdrop-blur-md transition-all duration-500 border ${
        audioPlaying 
          ? 'bg-black/60 border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
          : 'bg-black/40 border-white/10 hover:border-white/20'
      }`}
    >
      <button 
        onClick={() => setAudioPlaying(!audioPlaying)}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 relative ${
          audioPlaying 
            ? 'bg-gradient-to-tr from-[#D4AF37] to-[#FFF3B0] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
            : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        {audioPlaying ? (
          <div className="flex items-end justify-center gap-[2px] w-4 h-4">
            <motion.div animate={{ height: ["40%", "100%", "40%"] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-1 bg-black rounded-full" />
            <motion.div animate={{ height: ["80%", "30%", "80%"] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }} className="w-1 bg-black rounded-full" />
            <motion.div animate={{ height: ["50%", "90%", "50%"] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.4 }} className="w-1 bg-black rounded-full" />
          </div>
        ) : (
          <FaPlay className="text-white text-xs md:text-sm pl-1 opacity-80" />
        )}
      </button>
      
      <div className="flex items-center gap-2 md:gap-3 pr-2 group cursor-pointer">
        <button 
          onClick={() => setAudioVolume(audioVolume === 0 ? 0.5 : 0)}
          className={`transition-colors duration-300 ${audioPlaying ? 'text-[#D4AF37]' : 'text-white/70 hover:text-white'}`}
        >
          {audioVolume === 0 ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
        </button>
        <div className="relative flex items-center h-4 overflow-hidden w-0 opacity-0 group-hover:w-20 group-hover:opacity-100 transition-all duration-500 ease-out">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={audioVolume}
            onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
            className="w-20 accent-[#D4AF37] h-1 bg-white/20 rounded-full appearance-none outline-none absolute left-0"
            style={{
              background: `linear-gradient(to right, #D4AF37 ${audioVolume * 100}%, rgba(255,255,255,0.2) ${audioVolume * 100}%)`
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
