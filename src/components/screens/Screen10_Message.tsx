"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import CinematicButton from "@/components/ui/CinematicButton";

export default function Screen10_Message() {
  const { setCurrentScreen } = useStore();
  const [opened, setOpened] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen w-full relative px-4"
    >
      <AnimatePresence>
        {!opened ? (
          <motion.div 
            key="envelope"
            exit={{ opacity: 0, y: -50 }}
            className="cursor-pointer group flex flex-col items-center"
            onClick={() => setOpened(true)}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-80 h-52 bg-pink-100 rounded-lg shadow-2xl overflow-hidden border-2 border-pink-200"
            >
              {/* Envelope Flap */}
              <div className="absolute top-0 left-0 border-[160px] border-t-pink-200 border-x-transparent border-b-transparent origin-top z-10 drop-shadow-md" />
              <div className="absolute bottom-0 left-0 border-[160px] border-b-pink-100 border-x-pink-50 border-t-transparent z-0" />
              
              {/* Wax Seal */}
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-12 h-12 bg-red-800 rounded-full z-20 shadow-md flex items-center justify-center border-2 border-red-900 group-hover:bg-red-700 transition-colors">
                <span className="text-pink-100 font-playfair text-xl">A</span>
              </div>
            </motion.div>
            <p className="mt-8 font-poppins text-white/80 animate-pulse">Tap to break the seal</p>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="bg-[#fcf8f2] w-full max-w-2xl rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 md:p-12 relative z-20 text-black before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/old-wall.png')] before:opacity-30"
          >
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 1.5 } // 1.5 seconds between each paragraph
                }
              }}
              className="font-playfair text-lg md:text-xl leading-relaxed relative z-10 text-gray-800"
            >
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
                className="mb-8 font-bold text-3xl"
              >
                My Dearest Anushka, ❤️
              </motion.p>
              
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
                className="mb-6"
              >
                <strong>13 January 2024</strong> ko hum pehli baar mile the... ❤️<br/>
                Aur aaj <strong>13 July 2026</strong> hai. Ye tumhare saath mera <strong>3rd Birthday</strong> hai, aur ye mere liye bahut special hai. 🥹🎂
              </motion.p>
              
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
                className="mb-6"
              >
                In 2.5 saalon mein humne bahut kuch saath dekha—khushiyan, memories aur chhoti-badi fights bhi. Main maanta hoon ki kai baar maine bina wajah gussa kiya, lekin tumne kabhi mera saath nahi chhoda.
              </motion.p>
              
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
                className="mb-6"
              >
                <strong>Thank You So Much.</strong> ❤️ Har baar mujhe samajhne, meri har kami ko accept karne aur hamesha mere saath khade rehne ke liye. Main shayad har baar express nahi kar pata, lekin tum meri life ka sabse important hissa ho.
              </motion.p>
              
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
                className="mb-6 text-center mt-10"
              >
                <strong className="text-2xl block mb-2">Happy Birthday, Anushka! 🎉</strong>
                <strong>Bas hamesha aise hi muskurati rehna. I’m grateful to have you in my life. ❤️✨</strong>
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {opened && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="mt-12 z-20"
          >
            <CinematicButton onClick={() => setCurrentScreen(11)}>
              Our Memories 📸
            </CinematicButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
