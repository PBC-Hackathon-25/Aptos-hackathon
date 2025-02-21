import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google';
import "./globals.css";
import ClientNav from "./components/ClientNav";
import AptosAIModal from "./components/AptosAIModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Aptos Developers",
  description: "Build the Future of Web3 on Aptos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const combinedClasses = `${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={combinedClasses}>
        <ClientNav />
        {children}
      </body>
    </html>
  );
}
