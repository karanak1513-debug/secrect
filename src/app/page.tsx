"use client";

import { useStore } from "@/contexts/StoreContext";
import { useEffect } from "react";
import Lenis from "lenis";

import Screen1_Splash from "@/components/screens/Screen1_Splash";
import Screen2_Welcome from "@/components/screens/Screen2_Welcome";
import Screen3_MagicDoor from "@/components/screens/Screen3_MagicDoor";
import Screen4_BalloonGame from "@/components/screens/Screen4_BalloonGame";
import Screen5_MemoryPuzzle from "@/components/screens/Screen5_MemoryPuzzle";
import Screen6_BirthdayCake from "@/components/screens/Screen6_BirthdayCake";
import Screen7_RoseBouquet from "@/components/screens/Screen7_RoseBouquet";
import Screen8_Reasons from "@/components/screens/Screen8_Reasons";
import Screen9_GiftBox from "@/components/screens/Screen9_GiftBox";
import Screen10_Message from "@/components/screens/Screen10_Message";
import Screen11_MemoryGallery from "@/components/screens/Screen11_MemoryGallery";
import Screen12_VideoSurprise from "@/components/screens/Screen12_VideoSurprise";
import Screen13_FinalWish from "@/components/screens/Screen13_FinalWish";
import Screen14_MemoryCapsule from "@/components/screens/Screen14_MemoryCapsule";
// We will import others as we build them

export default function Home() {
  const { currentScreen } = useStore();

  useEffect(() => {
    // Initialize smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="flex-1 w-full flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {currentScreen === 1 && <Screen1_Splash />}
      {currentScreen === 2 && <Screen2_Welcome />}
      {currentScreen === 3 && <Screen3_MagicDoor />}
      {currentScreen === 4 && <Screen4_BalloonGame />}
      {currentScreen === 5 && <Screen5_MemoryPuzzle />}
      {currentScreen === 6 && <Screen6_BirthdayCake />}
      {currentScreen === 7 && <Screen7_RoseBouquet />}
      {currentScreen === 8 && <Screen8_Reasons />}
      {currentScreen === 9 && <Screen9_GiftBox />}
      {currentScreen === 10 && <Screen10_Message />}
      {currentScreen === 11 && <Screen11_MemoryGallery />}
      {currentScreen === 12 && <Screen12_VideoSurprise />}
      {currentScreen === 13 && <Screen13_FinalWish />}
      {currentScreen === 14 && <Screen14_MemoryCapsule />}
      
      {currentScreen > 1 && <ProgressIndicator />}
    </main>
  );
}

import { motion } from "framer-motion";

function ProgressIndicator() {
  const { currentScreen } = useStore();
  const totalScreens = 14;
  
  if (currentScreen === 1 || currentScreen === totalScreens) return null;

  const romanNumerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"];
  const progressPercentage = (currentScreen / totalScreens) * 100;

  return (
    <>
      {/* Ultra-thin Luxury Progress Line at the very top */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-white/5 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>

      {/* Elegant Chapter Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        key={`step-${currentScreen}`}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none"
      >
        <span className="font-playfair text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D4AF37]/80 drop-shadow-[0_0_5px_rgba(212,175,55,0.3)] flex items-center gap-3">
          <span className="text-[8px] text-[#D4AF37]/50">✦</span>
          Chapter {romanNumerals[currentScreen]}
          <span className="text-[8px] text-[#D4AF37]/50">✦</span>
        </span>
      </motion.div>
    </>
  );
}
