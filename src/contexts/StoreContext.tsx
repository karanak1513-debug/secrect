"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface StoreContextType {
  currentScreen: number;
  setCurrentScreen: (screen: number) => void;
  audioPlaying: boolean;
  setAudioPlaying: (playing: boolean) => void;
  audioVolume: number;
  setAudioVolume: (volume: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [audioPlaying, setAudioPlaying] = useState(true);
  const [audioVolume, setAudioVolume] = useState(0.5);

  return (
    <StoreContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        audioPlaying,
        setAudioPlaying,
        audioVolume,
        setAudioVolume,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
