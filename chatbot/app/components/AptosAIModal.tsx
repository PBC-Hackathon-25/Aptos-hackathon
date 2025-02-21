'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  urls?: string[]; // Optional property for scraped URLs
}

interface AptosAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiResponse {
  response: {
    response: {
      content: string;
    };
    scraped_urls: string[];
  };
}

const SUGGESTED_QUESTIONS = [
  {
    text: "How do I deploy a Move module?",
    category: "Smart Contracts"
  },
  {
    text: "How to create a new Aptos project?",
    category: "Getting Started"
  },
  {
    text: "What are the best practices for Move development?",
    category: "Smart Contracts"
  },
  {
    text: "How to interact with the Aptos blockchain using TypeScript SDK?",
    category: "SDKs"
  },
  {
    text: "How to set up a local testnet?",
    category: "Network"
  },
  {
    text: "How to mint NFTs on Aptos?",
    category: "NFTs"
  }
];

export default function AptosAIModal({ isOpen, onClose }: AptosAIModalProps) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data: ApiResponse = await response.json();
      console.log('Raw API Response:', data);
      
      // Access the nested response structure
      const responseContent = data.response?.response?.content;
      console.log('Response content:', responseContent);
      
      let markdownContent = responseContent || 'No content available';
      console.log('Initial markdown content:', markdownContent);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: markdownContent,
        urls: data.response.scraped_urls && data.response.scraped_urls.length > 0 ? data.response.scraped_urls : undefined,
      };

      console.log('Final assistant message:', assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error while processing your request.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"> {/* scrollbar edit needed for this component */}
      <div className="bg-[#051419] border border-white/20 rounded-lg w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#ffffff1a]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2DD8A7]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-lg font-medium text-white">Aptos AI Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col h-[80vh]">
          <div className="flex-1 overflow-y-auto p-4 modal-scrollbar">
            {messages.length === 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-[#2DD8A7] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-white text-lg">Ask me anything about Aptos!</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(question.text);
                      }}
                      className="w-full text-left px-4 py-2.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span>{question.text}</span>
                        <span className="text-xs text-[#2DD8A7]">{question.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 break-all ${
                    msg.role === 'user'
                      ? 'bg-[#1f1f1f] text-white'
                      : 'bg-[#2a2a2a] text-white overflow-x-auto modal-scrollbar'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                      {msg.urls && msg.urls.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1">
                          {msg.urls.map((url, idx) => (
                            <div key={idx} className="bg-[#141a26] rounded-md p-[2px] inline-block">
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 break-all">
                                {url}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-[#1a2634] text-blue-400 rounded-lg px-4 py-2 animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#ffffff1a] p-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about Aptos..."
                className="w-full bg-[#1f1f1f] text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-[#2DD8A7]"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white disabled:opacity-50 disabled:cursor-not-allowed p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors"
              >
                <svg className="w-5 h-5 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}