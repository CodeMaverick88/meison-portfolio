"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useTime, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// --- Integrated Minimalist Navbar (No Background, Pure 3D) ---
const Navbar = ({ isVisible }: { isVisible: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Works", href: "/works" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -50, opacity: isVisible ? 1 : 0 }}
        className="fixed top-0 left-0 w-full z-[100] px-8 md:px-16 py-10 flex justify-between items-center pointer-events-none"
      >
        <Link href="/" className="pointer-events-auto group perspective-1000">
          <motion.div whileHover={{ scale: 1.05 }} className="font-black tracking-tighter text-2xl text-black flex items-center gap-1">
            MEISON<span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_15px_#d4af37]" />
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-12 items-center pointer-events-auto">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="relative group perspective-500">
              <motion.div whileHover={{ rotateX: 90 }} className="relative preserve-3d h-5">
                <span className="block text-[10px] uppercase tracking-[0.4em] font-black text-black/30 group-hover:text-[#d4af37] transition-colors duration-500">
                  {link.name}
                </span>
                <span className="absolute top-full left-0 block text-[10px] uppercase tracking-[0.4em] font-black text-black origin-top -rotate-x-90" style={{ transform: "translateY(5px) rotateX(-90deg)" }}>
                  {link.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden pointer-events-auto z-[110] flex flex-col gap-1.5">
          <div className={`w-7 h-[2px] bg-black transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-7 h-[2px] bg-[#d4af37] ${isOpen ? 'opacity-0' : ''}`} />
          <div className={`w-7 h-[2px] bg-black transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[105] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-5xl font-black tracking-tighter hover:text-[#d4af37] transition-colors">
                {link.name.toUpperCase()}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [navVisible, setNavVisible] = useState(false);

  // REDUCED HEIGHT: Changed from 300vh to 180vh for faster interaction
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
    mass: 1
  });

  const time = useTime();
  const rotate = useTime(); // Simplified for faster rotation
  
  // Adjusted timing for 180vh total height
  const ringScale = useTransform(smoothProgress, [0, 0.4], [1, 40]);
  const ringOpacity = useTransform(smoothProgress, [0.3, 0.5], [1, 0]);
  const btnOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const btnScale = useTransform(smoothProgress, [0, 0.15], [1, 0.5]);

  const contentOpacity = useTransform(smoothProgress, [0.35, 0.6], [0, 1]);
  const contentY = useTransform(smoothProgress, [0.35, 0.6], [40, 0]);
  const contentScale = useTransform(smoothProgress, [0.35, 0.6], [0.98, 1]);

  const glow1X = useTransform(smoothProgress, [0.3, 0.8], ["-10%", "5%"]);
  const glow2Y = useTransform(smoothProgress, [0.3, 0.8], ["5%", "-5%"]);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setNavVisible(v > 0.45));
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative bg-white h-[180vh] w-full selection:bg-[#d4af37]/30">
      <Navbar isVisible={navVisible} />

      {/* --- ATMOSPHERIC BG GLOWS --- */}
      <motion.div style={{ opacity: contentOpacity }} className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          style={{ x: glow1X }}
          className="absolute top-[20%] left-[-10%] w-[70vw] h-[70vw] bg-[#d4af37]/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ y: glow2Y }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#a855f7]/5 rounded-full blur-[100px]" 
        />
      </motion.div>

      {/* --- SCROLL HINT --- */}
      <motion.div
        style={{ opacity: useTransform(smoothProgress, [0, 0.1], [1, 0]) }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] uppercase tracking-[0.8em] text-black/20 font-black">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-black/20 to-transparent" />
      </motion.div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* === THE RING PORTAL === */}
        <motion.div
          style={{ 
            scale: ringScale, 
            opacity: ringOpacity, 
            rotate: useTransform(rotate, (t) => t / 25) 
          }}
          className="absolute z-40 w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full border-[1px] border-black/5 flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 rounded-full border-t-[3px] border-t-[#d4af37] border-l-[1px] border-l-[#a855f7] opacity-80 blur-[0.5px]" />
          
          <motion.button
            style={{ opacity: btnOpacity, scale: btnScale }}
            className="pointer-events-auto px-10 py-4 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:shadow-[#d4af37]/40 transition-shadow border border-white/10"
          >
            Welcome
          </motion.button>
        </motion.div>

        {/* === MAIN CONTENT REVEAL === */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
          className="relative z-30 flex flex-col md:flex-row items-center gap-16 md:gap-32 px-10"
        >
          <motion.div 
            whileHover={{ scale: 1.02, rotateY: 5, rotateX: -2 }}
            className="relative w-[280px] md:w-[420px] aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] group cursor-pointer"
          >
            <img src="/Meison.jpg" alt="Meison" className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[3rem]" />
          </motion.div>

          <div className="text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-2xl md:text-[6.0vw] font-black tracking-tighter leading-[0.82] mb-8"
            >
              <span className="glow-ui text-black">HELLO</span> <br />
              <span className="glow-ui text-black">I’M MEISON</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              <div className="h-[1px] w-16 bg-black/10 hidden md:block" />
              <p className="glow-ui text-[10px] md:text-xs  uppercase tracking-[0.6em] font-black">
                Interactive Architect <span className="text-[#f0bb0c]">&</span> Full-Stack Developer|
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .glow-ui {
          position: relative;
          display: inline-block;
          text-shadow: 0 0 30px rgba(212, 175, 55, 0.1), 0 0 60px rgba(168, 85, 247, 0.05);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .glow-ui:hover {
          text-shadow: 0 0 25px rgba(212, 175, 55, 0.5), 0 0 50px rgba(168, 85, 247, 0.3);
          transform: translateY(-2px);
        }
        .perspective-1000 { perspective: 1000px; }
        .perspective-500 { perspective: 500px; }
        .preserve-3d { transform-style: preserve-3d; }
        .-rotate-x-90 { transform: rotateX(-90deg); }
        body { background: #ffffff; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}