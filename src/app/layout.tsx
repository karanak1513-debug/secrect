import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/contexts/StoreContext";
import BackgroundEngine from "@/components/BackgroundEngine";
import AudioPlayer from "@/components/AudioPlayer";
import LaunchTimer from "@/components/LaunchTimer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Secret",
  description: "A secure project preview.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfair.variable} font-poppins antialiased bg-[#030303] text-white relative min-h-screen`}
      >
        <StoreProvider>
          <BackgroundEngine />
          <AudioPlayer />
          <LaunchTimer>
            <div className="relative z-10 min-h-screen flex flex-col">
              {children}
            </div>
          </LaunchTimer>
        </StoreProvider>
      </body>
    </html>
  );
}
