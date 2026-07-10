"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CinematicButton from "@/components/ui/CinematicButton";
import { useStore } from "@/contexts/StoreContext";
import { FiMapPin, FiCalendar, FiClock, FiHeart } from "react-icons/fi";

export default function Screen5_WhereItAllBegan() {
  const { setCurrentScreen } = useStore();
  const [mapClicked, setMapClicked] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  useEffect(() => {
    if (mapClicked) {
      const interval = setInterval(() => {
        setStoryIndex((prev) => (prev + 1) % 3);
      }, 4000);
      return () => clearInterval(interval);
    } else {
      setStoryIndex(0);
    }
  }, [mapClicked]);

  const story = [
    <div key="0" className="flex flex-col items-center">
      <span className="text-[#D4AF37] not-italic font-medium text-lg block mb-3">Dopahar ke 12:56...</span>
      <p className="italic text-white/80 leading-relaxed text-sm md:text-base">Us waqt shayad hume bilkul bhi nahi pata tha ki ek chhoti si mulaqat itni special ban jayegi.</p>
    </div>,
    <div key="1" className="flex flex-col items-center">
      <span className="text-[#D4AF37] not-italic font-medium text-lg block mb-3">The Journey Begins</span>
      <p className="italic text-white/80 leading-relaxed text-sm md:text-base">Isi jagah se hamari journey shuru hui... Aur dheere-dheere ye safar hasi, masti, memories, chhoti-badi fights aur bahut saare khoobsurat moments se bhar gaya.</p>
    </div>,
    <div key="2" className="flex flex-col items-center">
      <span className="text-[#D4AF37] not-italic font-medium text-lg block mb-3">Always & Forever</span>
      <p className="text-white/95 font-medium not-italic text-base md:text-lg leading-relaxed">
        Aaj jab bhi is jagah ka naam sunta hoon...<br/>
        <span className="text-[#D4AF37]">Sabse pehle tum yaad aati ho. ❤️</span>
      </p>
    </div>
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen w-full relative px-4 py-12 md:py-20 overflow-x-hidden"
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#D4AF37]/30 blur-sm pointer-events-none"
            style={{ width: Math.random() * 4 + 2 + "px", height: Math.random() * 4 + 2 + "px", top: Math.random() * 100 + "%", left: Math.random() * 100 + "%" }}
            animate={{ y: [0, -50, 0], opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="z-10 text-center max-w-4xl w-full flex flex-col items-center">
        
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-[#D4AF37] mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            Where It All Began ❤️
          </h1>
          <p className="font-poppins text-white/80 text-sm md:text-lg max-w-2xl mx-auto italic font-light">
            &quot;Ek chhoti si mulaqat... aur bahut saari khoobsurat yaadon ki shuruaat. ❤️&quot;
          </p>
        </motion.div>

        {/* Interactive Map Section */}
        <motion.div 
          className="relative w-full max-w-3xl aspect-square md:aspect-video rounded-3xl overflow-hidden mb-12 border border-[#D4AF37]/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] bg-[#0a0a0a]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Mock Dark Map Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{
              backgroundImage: `linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          {/* Map subtle topographical circles */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <div className="w-[120%] aspect-square border border-[#D4AF37] rounded-full absolute" />
            <div className="w-[80%] aspect-square border border-[#D4AF37] rounded-full absolute" />
            <div className="w-[40%] aspect-square border border-[#D4AF37] rounded-full absolute" />
          </div>

          <motion.div 
            className="w-full h-full relative cursor-pointer"
            animate={mapClicked ? { scale: 1.5, x: '0%', y: '10%' } : { scale: 1, x: 0, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} // smooth apple-like ease out
            onClick={() => setMapClicked(true)}
          >
            {/* The Heart Marker */}
            <motion.div 
              className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
              animate={mapClicked ? { scale: 0.8 } : { scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              {/* Glowing Aura */}
              <motion.div 
                className="absolute bg-[#D4AF37] rounded-full blur-[20px]"
                animate={{ width: [40, 60, 40], height: [40, 60, 40], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="text-4xl md:text-5xl drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] relative z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ❤️
              </motion.div>
              {!mapClicked && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-2 text-xs font-poppins text-[#D4AF37] bg-black/60 px-3 py-1 rounded-full border border-[#D4AF37]/30 backdrop-blur-sm"
                >
                  Tap to Reveal
                </motion.div>
              )}
            </motion.div>
          </motion.div>


        </motion.div>

        {/* Timeline */}
        <motion.div 
          className="w-full max-w-2xl flex flex-col gap-8 mb-16 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {/* Vertical line connecting timeline nodes */}
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-[#D4AF37]/50 to-transparent z-0" />

          {/* Node 1 */}
          <div className="flex gap-6 z-10">
            <div className="w-14 h-14 rounded-full glass-card border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)] bg-black/60">
              <span className="text-xl">❤️</span>
            </div>
            <div className="flex flex-col items-start text-left pt-2">
              <h3 className="font-playfair text-xl md:text-2xl text-[#D4AF37]">First Meeting</h3>
              <p className="font-poppins text-white/60 text-sm mt-1">13 January 2024 • 12:56 PM</p>
            </div>
          </div>

          {/* Node 2 */}
          <div className="flex gap-6 z-10">
            <div className="w-14 h-14 rounded-full glass-card border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)] bg-black/60">
              <span className="text-xl">✨</span>
            </div>
            <div className="flex flex-col items-start text-left pt-2">
              <h3 className="font-playfair text-xl md:text-2xl text-[#D4AF37] mb-2">The Beginning</h3>
              <p className="font-poppins text-white/80 text-sm md:text-base leading-relaxed italic border-l-2 border-[#D4AF37]/30 pl-4 py-1">
                &quot;Ek chhoti si mulaqat...<br/>
                Aur bahut saari khoobsurat yaadon ki shuruaat. ❤️&quot;
              </p>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <CinematicButton onClick={() => setCurrentScreen(6)}>
            Continue Our Journey →
          </CinematicButton>
        </motion.div>

      </div>

      {/* Full Screen Popup Card (Moved outside overflow-hidden map container) */}
      <AnimatePresence>
        {mapClicked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md overflow-hidden"
          >
            {/* Clickable background to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setMapClicked(false)} />
            
            <motion.div 
              initial={{ y: 50, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring", bounce: 0.3 }}
              className="glass-card w-full max-w-xl max-h-[95vh] overflow-y-auto rounded-3xl border border-[#D4AF37]/30 shadow-[0_30px_80px_rgba(0,0,0,0.9)] bg-[#050505]/95 backdrop-blur-3xl pointer-events-auto custom-scrollbar relative z-10 flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setMapClicked(false)}
                className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors text-white/50 hover:text-white"
              >
                ✕
              </button>

              <div className="p-6 md:p-8 relative z-10 flex flex-col items-center w-full">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 mb-3 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative">
                    <FiHeart className="text-xl text-[#D4AF37]" />
                  </div>
                  <h3 className="font-playfair text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] drop-shadow-sm mb-1">
                    Our First Chapter
                  </h3>
                  <p className="font-poppins text-[#D4AF37]/50 text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">The Moment Time Stopped</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                  {/* Place */}
                  <div className="flex flex-col items-center justify-center text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <FiMapPin className="text-[#D4AF37] text-2xl mb-2" />
                    <h4 className="font-playfair text-[#D4AF37] text-base mb-1">The Place</h4>
                    <p className="font-poppins text-white/80 text-xs">Rainbow English Sr. Sec. School</p>
                  </div>
                  
                  {/* Date & Time */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <FiCalendar className="text-[#D4AF37] text-lg" />
                      <div className="text-left">
                        <p className="font-playfair text-[#D4AF37] text-sm mb-0.5">The Date</p>
                        <p className="font-poppins text-white/80 text-xs">13 January 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <FiClock className="text-[#D4AF37] text-lg" />
                      <div className="text-left">
                        <p className="font-playfair text-[#D4AF37] text-sm mb-0.5">The Time</p>
                        <p className="font-poppins text-white/80 text-xs">12:56 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative w-full">
                  {/* Auto-swiping Story Carousel */}
                  <div className="relative h-44 md:h-36 flex items-center justify-center text-center px-4 overflow-hidden rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={storyIndex}
                        initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center p-4 w-full h-full"
                      >
                        {story[storyIndex]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  {/* Dots Indicator */}
                  <div className="flex justify-center items-center gap-2 mt-4">
                    {story.map((_, i) => (
                      <div 
                        key={i} 
                        className={`transition-all duration-500 rounded-full ${i === storyIndex ? 'w-5 h-1 bg-[#D4AF37]' : 'w-1.5 h-1.5 bg-white/20'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
