import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_Devanagari, Noto_Sans_Malayalam, Outfit } from "next/font/google";
import "./globals.css";
import ReactLenis from "lenis/react";

export const metadata: Metadata = {
  title: "Alchemetanoia",
};



const dmsans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
})

// Malayalam and Hindi text on the public site. Not preloaded: they download only when that script is on the page.
const notoMalayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-ml",
  subsets: ["malayalam"],
  preload: false,
})

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-hi",
  subsets: ["devanagari"],
  preload: false,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactLenis root >
    <html lang="en">
      <body className={`${outfit.variable} ${dmsans.variable} ${notoMalayalam.variable} ${notoDevanagari.variable} antialiased`}>
        {children}
      </body>
    </html>
    </ReactLenis>
  );
}
