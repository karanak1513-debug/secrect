"use client";

import { useStore } from "@/contexts/StoreContext";
import { useEffect } from "react";
import Lenis from "lenis";

import Screen1_Splash from "@/components/screens/Screen1_Splash";
import Screen2_Disclaimer from "@/components/screens/Screen2_Disclaimer";
import Screen3_Welcome from "@/components/screens/Screen3_Welcome";
import Screen4_MagicDoor from "@/components/screens/Screen4_MagicDoor";
import Screen5_WhereItAllBegan from "@/components/screens/Screen5_WhereItAllBegan";
import Screen6_MemoryGallery from "@/components/screens/Screen6_MemoryGallery";
import Screen7_MemoryPuzzle from "@/components/screens/Screen7_MemoryPuzzle";
import Screen8_BalloonGame from "@/components/screens/Screen8_BalloonGame";
import Screen9_Quiz from "@/components/screens/Screen9_Quiz";
import Screen10_Reasons from "@/components/screens/Screen10_Reasons";
import Screen11_LoveMeter from "@/components/screens/Screen11_LoveMeter";
import Screen12_RoseBouquet from "@/components/screens/Screen12_RoseBouquet";
import Screen13_BirthdayCake from "@/components/screens/Screen13_BirthdayCake";
import Screen14_GiftBox from "@/components/screens/Screen14_GiftBox";
import Screen15_SlotMachine from "@/components/screens/Screen15_SlotMachine";
import Screen16_Message from "@/components/screens/Screen16_Message";
import Screen17_VideoSurprise from "@/components/screens/Screen17_VideoSurprise";
import Screen18_TimeFreeze from "@/components/screens/Screen18_TimeFreeze";
import Screen19_FinalWish from "@/components/screens/Screen19_FinalWish";
import Screen20_OneLastSurprise from "@/components/screens/Screen20_OneLastSurprise";
import Screen21_MemoryCapsule from "@/components/screens/Screen21_MemoryCapsule";

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
      {currentScreen === 2 && <Screen2_Disclaimer />}
      {currentScreen === 3 && <Screen3_Welcome />}
      {currentScreen === 4 && <Screen4_MagicDoor />}
      {currentScreen === 5 && <Screen5_WhereItAllBegan />}
      {currentScreen === 6 && <Screen6_MemoryGallery />}
      {currentScreen === 7 && <Screen7_MemoryPuzzle />}
      {currentScreen === 8 && <Screen8_BalloonGame />}
      {currentScreen === 9 && <Screen9_Quiz />}
      {currentScreen === 10 && <Screen10_Reasons />}
      {currentScreen === 11 && <Screen11_LoveMeter />}
      {currentScreen === 12 && <Screen12_RoseBouquet />}
      {currentScreen === 13 && <Screen13_BirthdayCake />}
      {currentScreen === 14 && <Screen14_GiftBox />}
      {currentScreen === 15 && <Screen15_SlotMachine />}
      {currentScreen === 16 && <Screen16_Message />}
      {currentScreen === 17 && <Screen17_VideoSurprise />}
      {currentScreen === 18 && <Screen18_TimeFreeze />}
      {currentScreen === 19 && <Screen19_FinalWish />}
      {currentScreen === 20 && <Screen20_OneLastSurprise />}
      {currentScreen === 21 && <Screen21_MemoryCapsule />}

      {currentScreen > 1 && <ProgressIndicator />}
    </main>
  );
}

import { motion } from "framer-motion";

function ProgressIndicator() {
  const { currentScreen } = useStore();
  const totalScreens = 21;
  
  if (currentScreen === 1 || currentScreen === totalScreens) return null;

  const romanNumerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
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
