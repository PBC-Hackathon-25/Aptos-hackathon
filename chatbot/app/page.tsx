'use client';

import Image from "next/image";
import { useState } from "react";
import AptosAIModal from "./components/AptosAIModal";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [buildOpen, setBuildOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [additionalOpen, setAdditionalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#051419]">
      <main className="pt-32 pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-[50px]">
          <h1 
            className={`${inter.className} text-[64px] leading-[1.1] font-normal text-white mb-4 tracking-[-0.02em]`}
          >
            Build the Future of Web3
            <br />
            on Aptos
          </h1>
          
          <p className="text-white text-lg mb-8">
            Everything you need to build the best-in-class
            <br />
            Web3 developer experience.
          </p>

          <div className="mt-8 flex justify-center">
            <a 
              href="https://aptos.dev/en/build/get-started" 
              className="bg-white text-black px-8 py-3 font-medium transition-colors hover:bg-gray-100 shadow-[0_1px_0_rgba(255,255,255,0.4)]"
            >
              Get Started
            </a>
          </div>

          <div className="mt-32">
            <p className="text-white text-lg tracking-widest uppercase">
              CRAFT SAFE AND HIGH-PERFORMANCE SMART CONTRACTS WITH MOVE
            </p>
          </div>
        </div>

        <AptosAIModal 
          isOpen={isAIModalOpen} 
          onClose={() => setIsAIModalOpen(false)} 
        />
      </main>
    </div>
  );
}