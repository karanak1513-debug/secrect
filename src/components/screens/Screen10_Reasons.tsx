"use client";

import { motion } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";

const REASONS = [
  "Your smile lights up my day. 😊",
  "You always care for me. ❤️",
  "You never gave up on us.",
  "You make every moment special.",
  "You always believe in me.",
  "You make me a better person.",
  "You stand by me in every situation.",
  "You bring peace to my life.",
  "You make me genuinely happy.",
  "You are my favorite person.",
  "You are one of the best things in my life.",
  "Because you're simply you. 💖✨"
];

export default function Screen10_Reasons() {
  const { setCurrentScreen } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen w-full relative px-6 py-24 overflow-x-hidden bg-[#02040A] custom-scrollbar"
    >
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFB6C1]/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-20 mb-20 w-full max-w-4xl"
      >
        <h2 className="font-playfair text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D4AF37] to-[#F3E5AB] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          12 Reasons You&apos;re Special
        </h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mt-8" />
      </motion.div>

      <div className="w-full max-w-3xl z-20 flex flex-col gap-12 md:gap-16 pb-20">
        {REASONS.map((reason, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-start md:items-center gap-6 md:gap-10 group"
          >
            <div className="font-playfair text-5xl md:text-7xl font-bold text-[#D4AF37]/20 group-hover:text-[#D4AF37]/40 transition-colors duration-500 select-none">
              {(index + 1).toString().padStart(2, '0')}
            </div>
            
            <div className="flex-1">
              <h3 className="font-playfair text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] to-white leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {reason}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mt-12 mb-32 z-20 text-center"
      >
        <h3 className="font-playfair text-3xl md:text-5xl text-[#D4AF37] mb-12 drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]">
          I love you ❤️
        </h3>
        <CinematicButton onClick={() => setCurrentScreen(11)}>
          What&apos;s Next? 🎁
        </CinematicButton>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #02040A; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5); 
        }
      `}} />
    </motion.div>
  );
}
