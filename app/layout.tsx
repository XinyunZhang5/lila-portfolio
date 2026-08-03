import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Limelight } from "next/font/google";
import type { PropsWithChildren } from "react";

import { BookProvider } from "@/components/main/book-context";
import { Navbar } from "@/components/main/navbar";
import { StarsCanvas } from "@/components/main/star-background";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// display face for the mastheads + chapter titles, mono for editorial captions
const limelight = Limelight({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#e9e4d5",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" data-theme="day">
      <body
        className={cn(
          "overflow-hidden",
          inter.className,
          limelight.variable,
          plexMono.variable
        )}
      >
        <BookProvider>
          <StarsCanvas />
          <Navbar />
          {children}
        </BookProvider>
      </body>
    </html>
  );
}
