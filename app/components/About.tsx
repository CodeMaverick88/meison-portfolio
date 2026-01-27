"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const AboutData = [
  {
    id: 1,
    title: "The Vision",
    text: "Bridging raw emotion and digital precision.",
    img: "/vision.jpeg",
    // Vibrant Gold
    bgColor: "#FFF8E1", 
    accent: "#d4af37"
  },
  {
    id: 2,
    title: "The Craft",
    text: "Intentional pixels, seamless motion.",
    img: "/AI-Debouge-Tech-scaled.jpeg",
    // Richer Purple
    bgColor: "#F3E5F5",
    accent: "#a855f7"
  },
  {
    id: 3,
    title: "The Future",
    text: "Building next-gen digital interfaces.",
    img: "/ai-article-1-banner-shot-min.jpg",
    // Brighter Green
    bgColor: "#E8F5E9",
    accent: "#22c55e"
  },
  {
    id: 4,
    title: "The Spirit",
    text: "Depth and immersion in every frame.",
    img: "/Coding.jpeg",
    // Cleaner Grey
    bgColor: "#F5F5F5",
    accent: "#000000"
  },
];

export default function About() {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const rotation = index * -90;

  const handleNext = useCallback(() => setIndex((prev) => prev + 1), []);
  const handlePrev = useCallback(() => setIndex((prev) => prev - 1), []);

  const resetAutoplayTimer = () => {
    setIsAutoPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const manualNext = () => { handleNext(); resetAutoplayTimer(); };
  const manualPrev = () => { handlePrev(); resetAutoplayTimer(); };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => handleNext(), 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAutoPlaying, handleNext]);

  const currentIndex = ((index % AboutData.length) + AboutData.length) % AboutData.length;
  const currentItem = AboutData[currentIndex];

  return (
    <motion.section 
      animate={{ backgroundColor: currentItem.bgColor }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative min-h-screen w-full flex flex-col items-center py-24 overflow-hidden"
    >
      
      {/* --- SECTION INTRODUCTION TITLE --- */}
      <div className="relative z-20 mb-12 md:mb-20 flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-7xl font-black tracking-tighter text-black uppercase leading-none"
        >
          About Me
        </motion.h2>
        <motion.div 
          animate={{ backgroundColor: currentItem.accent }}
          initial={{ width: 0 }}
          whileInView={{ width: 120 }}
          transition={{ duration: 0.6 }}
          className="h-[5px] mt-4"
        />
      </div>

      {/* --- 3D GALLERY STAGE --- */}
      <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center perspective-2000 mt-10">
        
        <motion.div 
          animate={{ rotateY: rotation }}
          transition={{ type: "spring", stiffness: 25, damping: 30 }}
          className="relative w-full h-full flex items-center justify-center preserve-3d"
        >
          {AboutData.map((item, i) => {
            const angle = i * 90;
            return (
              <div
                key={item.id}
                className="absolute w-[260px] md:w-[300px] preserve-3d"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(450px)`,
                }}
              >
                <motion.div 
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="relative group cursor-default"
                >
                  <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] transition-all duration-700">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale brightness-105 group-hover:grayscale-0 transition-all duration-1000"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/5">
                      <Link href="/about" className="flex flex-col items-center gap-2">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl group/btn hover:border-[#d4af37] transition-colors"
                        >
                          <svg className="w-7 h-7 group-hover/btn:text-[#d4af37] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white drop-shadow-md">View Story</span>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <h3 className="text-3xl font-black tracking-tighter mb-1 uppercase text-black">
                      {item.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-black/50 font-black">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* --- NAVIGATION ARROWS --- */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 z-50 pointer-events-none">
          <button 
            onClick={manualPrev}
            className="pointer-events-auto p-4 transition-all hover:text-[#d4af37] text-black/20 hover:scale-110"
          >
            <svg className="w-10 h-10 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={manualNext}
            className="pointer-events-auto p-4 transition-all hover:text-[#d4af37] text-black/20 hover:scale-110"
          >
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </motion.section>
  );
}