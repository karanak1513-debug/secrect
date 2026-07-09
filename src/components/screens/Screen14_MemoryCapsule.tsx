"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";

export default function Screen14_MemoryCapsule() {
  const { setCurrentScreen } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "done">("idle");
  
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = () => {
    setShowModal(true);
    setDownloadStatus("downloading");

    // Simulate packaging time
    setTimeout(() => {
      // Create the beautiful letter content
      const letterContent = `
My Dearest Anushka, ❤️

13 January 2024 ko hum pehli baar mile the... ❤️
Aur aaj 13 July 2026 hai. Ye tumhare saath mera 3rd Birthday hai, aur ye mere liye bahut special hai. 🥹🎂

In 2.5 saalon mein humne bahut kuch saath dekha—khushiyan, memories aur chhoti-badi fights bhi. Main maanta hoon ki kai baar maine bina wajah gussa kiya, lekin tumne kabhi mera saath nahi chhoda.

Thank You So Much. ❤️ Har baar mujhe samajhne, meri har kami ko accept karne aur hamesha mere saath khade rehne ke liye. Main shayad har baar express nahi kar pata, lekin tum meri life ka sabse important hissa ho.

Happy Birthday, Anushka! 🎉
Bas hamesha aise hi muskurati rehna. I’m grateful to have you in my life. ❤️✨

With infinite love,
Yours forever.
      `.trim();

      // Create a Blob and trigger download
      const blob = new Blob([letterContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Our_Beautiful_Memories.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadStatus("done");
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="glass-card p-8 md:p-12 max-w-md w-full text-center z-20 border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
      >
        <h2 className="font-playfair text-2xl md:text-3xl text-white mb-8">
          Memory Capsule
        </h2>
        
        <div className="space-y-6 font-poppins text-white/80">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span>Created On</span>
            <span className="font-medium text-white">{today}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span>Total Memories</span>
            <span className="font-medium text-white">Infinite</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span>Love Loaded</span>
            <span className="font-medium text-white">100%</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-4xl mb-4"
          >
            💖
          </motion.div>
          <p className="font-playfair text-lg text-pink-100 italic">
            Made with ❤️ just for Anushka.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-12 z-20 flex gap-4"
      >
        <CinematicButton variant="secondary" onClick={() => setCurrentScreen(1)}>
          Replay Experience 🔄
        </CinematicButton>
        <CinematicButton variant="secondary" onClick={handleDownload}>
          Download Memories 📥
        </CinematicButton>
      </motion.div>

      {/* Luxurious Custom Modal instead of ugly alert() */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card p-8 md:p-10 max-w-sm w-full text-center border-white/30 shadow-[0_0_60px_rgba(255,255,255,0.15)]"
            >
              {downloadStatus === "downloading" ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="text-4xl mb-6 inline-block"
                  >
                    ⏳
                  </motion.div>
                  <h3 className="font-playfair text-2xl text-white mb-3">
                    Preparing Memories...
                  </h3>
                  <p className="font-poppins text-white/70 text-sm mb-8 leading-relaxed">
                    We are packaging your beautiful journey into a memory box. This might take a moment.
                  </p>
                </>
              ) : (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-5xl mb-6 inline-block"
                  >
                    💌
                  </motion.div>
                  <h3 className="font-playfair text-2xl text-white mb-3">
                    Successfully Downloaded!
                  </h3>
                  <p className="font-poppins text-white/70 text-sm mb-8 leading-relaxed">
                    Your special letter has been saved to your device as a text file. Keep it safe forever.
                  </p>
                </>
              )}
              <CinematicButton variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </CinematicButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
