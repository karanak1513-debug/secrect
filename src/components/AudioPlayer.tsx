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
      className="fixed bottom-6 right-6 z-50 glass-card p-3 flex items-center gap-4"
    >
      <button 
        onClick={() => setAudioPlaying(!audioPlaying)}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors ripple"
      >
        {audioPlaying ? <FaPause className="text-white text-sm" /> : <FaPlay className="text-white text-sm pl-1" />}
      </button>
      
      <div className="flex items-center gap-2 group cursor-pointer">
        <button onClick={() => setAudioVolume(audioVolume === 0 ? 0.5 : 0)}>
          {audioVolume === 0 ? <FaVolumeMute className="text-white" /> : <FaVolumeUp className="text-white" />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={audioVolume}
          onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
          className="w-0 opacity-0 group-hover:w-20 group-hover:opacity-100 transition-all duration-300 accent-white h-1 bg-white/30 rounded-full appearance-none outline-none"
        />
      </div>
    </motion.div>
  );
}
