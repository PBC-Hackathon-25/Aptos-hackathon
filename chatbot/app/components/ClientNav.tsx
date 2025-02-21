'use client';

import { useState } from 'react';
import AptosAIModal from './AptosAIModal';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function ClientNav() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed w-full bg-[#051419] z-50 border-b border-[#ffffff1a]">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and DEVELOPERS text */}
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8">
                  <img 
                    src="/aptos-white.svg" 
                    alt="Aptos Logo" 
                    width={32}
                    height={32}
                  />
                </div>
                <span className={`${inter.className} text-white text-sm font-medium tracking-wider`}>
                  DEVELOPERS
                </span>
              </div>
            </div>

            {/* Right side navigation items */}
            <div className="flex items-center space-x-4">
              {/* Navigation Buttons */}
              <div className="flex items-center space-x-4">
                {/* Build Dropdown */}
                <div className="relative group">
                  <button className="text-[#A3A3A3] hover:text-white py-2 text-sm font-medium flex items-center gap-2">
                    Build
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-1 w-64 bg-[#0C0C0C]/95 backdrop-blur-md rounded-lg shadow-lg py-2 z-10 hidden group-hover:block border border-[#ffffff1a]">
                    <a href="https://aptos.dev/en/build/get-started" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Get Started</a>
                    <a href="https://aptos.dev/en/build/smart-contracts" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Smart Contracts (Move)</a>
                    <a href="https://aptos.dev/en/build/apis" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">APIs</a>
                    <a href="https://aptos.dev/en/build/sdks" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">SDKs</a>
                    <a href="https://aptos.dev/en/build/indexer" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Indexer</a>
                    <a href="https://aptos.dev/en/build/cli" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">CLI</a>
                    <a href="https://aptos.dev/en/build/create-aptos-dapp" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Create Aptos Dapp</a>
                    <a href="https://aptos.dev/en/build/guides" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Guides</a>
                  </div>
                </div>

                {/* Network Dropdown */}
                <div className="relative group">
                  <button className="text-[#A3A3A3] hover:text-white py-2 text-sm font-medium flex items-center gap-2">
                    Network
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-1 w-64 bg-[#0C0C0C]/95 backdrop-blur-md rounded-lg shadow-lg py-2 z-10 hidden group-hover:block border border-[#ffffff1a]">
                    <a href="https://aptos.dev/en/network/blockchain" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Blockchain</a>
                    <a href="https://aptos.dev/en/network/nodes" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Nodes</a>
                    <a href="https://aptos.dev/en/network/releases" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Releases</a>
                    <a href="https://aptos.dev/en/network/glossary" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Glossary</a>
                    <a href="https://aptos.dev/en/network/faucet" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Faucet</a>
                  </div>
                </div>

                {/* Additional Resources Dropdown */}
                <div className="relative group">
                  <button className="text-[#A3A3A3] hover:text-white py-2 text-sm font-medium flex items-center gap-2">
                    Additional Resources
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-1 w-64 bg-[#0C0C0C]/95 backdrop-blur-md rounded-lg shadow-lg py-2 z-10 hidden group-hover:block border border-[#ffffff1a]">
                    <a href="https://learn.aptoslabs.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Aptos Learn ↗</a>
                    <a href="https://forum.aptosfoundation.org" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Community Forum ↗</a>
                    <a href="https://github.com/aptos-labs/aptos-developer-discussions" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Developer Discussions ↗</a>
                    <a href="https://developers.aptoslabs.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">API Gateway ↗</a>
                    <a href="https://aptosfoundation.org" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Aptos Foundation ↗</a>
                    <a href="/contribute" className="block px-4 py-2 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#ffffff0d]">Contribute</a>
                  </div>
                </div>

                {/* Aptos AI Button */}
                <div className="relative group">
                  <button 
                    onClick={() => setIsAIModalOpen(true)}
                    className="text-[#A3A3A3] hover:text-white py-2 text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Aptos AI
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documentation"
                    className="bg-[#ffffff0d] text-white pl-4 pr-16 py-1.5 rounded text-sm w-60"
                  />
                  <span className="absolute right-2 top-1.5 text-[#A3A3A3] text-xs border border-[#A3A3A3] rounded px-1.5 py-0.5">
                    CTRL K
                  </span>
                </div>

                {/* GitHub */}
                <a 
                  href="https://github.com/aptos-labs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <AptosAIModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </>
  );
} 