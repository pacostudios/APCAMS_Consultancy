import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import ReactLenis from "lenis/react";
import LayoutWrapper from "./components/LayoutWrapper";

export const metadata: Metadata = {
  title: "APCAMS",
};



const dmsans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactLenis root >
    <html lang="en">
      <body className={`${outfit.variable} ${dmsans.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
    </ReactLenis>
  );
}
