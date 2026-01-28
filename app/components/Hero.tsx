"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

export default function PortfolioPage() {
  const [stage, setStage] = useState('intro'); 
  const [activeTab, setActiveTab] = useState<string | null>(null); // 'who', 'resilience', 'mission'
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. SCROLL ENGINE
  const { scrollYProgress } = useScroll({
    target: stage === 'explore' ? scrollRef : undefined,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 20,
    restDelta: 0.001
  });

  // 2. 3D TRANSFORMATION MATH
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-200%"]);
  const rotateY = useTransform(smoothProgress, [0, 0.45, 0.5, 0.55, 1], [0, 0, -25, 0, 0]);
  const scale = useTransform(smoothProgress, [0, 0.45, 0.5, 0.55, 1], [1, 1, 0.85, 1, 1]);

  // 3. INTRO TIMELINE
  useEffect(() => {
    const toWarp = setTimeout(() => setStage('warp'), 7000);
    const toExplore = setTimeout(() => setStage('explore'), 8200);
    return () => { clearTimeout(toWarp); clearTimeout(toExplore); };
  }, []);

  // Content for the clicks
  const infoMap: Record<string, { title: string, body: string }> = {
    who: { title: "WHO AM I", body: "I am Benjamin, a developer who bridges the gap between raw hardware performance and high-end visual design. I build for the future." },
    resilience: { title: "RESILIENCE", body: "My code is built to survive. Every system I architect is stress-tested to ensure it remains standing when others fail." },
    mission: { title: "THE MISSION", body: "To push mobile and web interfaces into a new dimension where interaction feels like a physical sensation." }
  };

  return (
    <div className="relative bg-[#020202] text-white font-audiowide overflow-x-hidden">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
        .font-audiowide { font-family: 'Audiowide', cursive; }
        ::-webkit-scrollbar { display: none; }
        
        .vein-pulse {
          background: linear-gradient(90deg, #4b0000, #ff0000, #ff6a00, #ff0000, #4b0000);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: bloodFlow 3s linear infinite;
        }

        @keyframes bloodFlow { to { background-position: 200% center; } }
      `}</style>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 w-full z-[100] p-10 flex justify-between items-center">
        <motion.button 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setStage('explore');
          }}
          className="text-[#ff4d00] text-3xl font-black tracking-tighter flex items-center gap-3"
        >
          MEISON <span className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#ff4d00] animate-pulse" />
        </motion.button>
        
        {stage === 'intro' && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 7, ease: "linear" }}
            className="absolute bottom-0 left-0 h-[1px] bg-white/20"
          />
        )}
      </nav>

      {/* --- LAYER 1: CINEMATIC INTRO --- */}
      <AnimatePresence>
        {(stage === 'intro' || stage === 'warp') && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ scale: 8, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
          >
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
              <source src="/17486487-uhd_3840_2160_30fps.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}
                className="absolute top-[20%] right-[10%] text-right"
              >
                <h2 className="text-5xl font-black">ARCHITECT</h2>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 1 }}
                className="absolute bottom-[20%] left-[10%]"
              >
                <h2 className="text-5xl font-black">RESILIENT</h2>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 5, duration: 1.5 }}
                className="text-8xl md:text-[14vw] font-black tracking-tighter vein-pulse"
              >
                MEISON
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LAYER 2: 3D WORLD --- */}
      <div 
        ref={scrollRef} 
        className={`relative h-[300vh] ${stage !== 'explore' ? 'hidden' : 'block'}`}
      >
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden perspective-2000">
          <motion.div 
            style={{ x, rotateY, scale, transformStyle: "preserve-3d" }}
            className="flex h-screen w-[300vw]"
          >
            
            {/* SECTION 1: THE PORTRAIT (UNIQUE 3D INTERACTION) */}
            <section className="relative w-screen h-screen flex flex-col md:flex-row items-center justify-center gap-10 md:gap-32 px-10">
              
              <div className="relative h-[80vh] aspect-[3/4] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {/* TINY ELEMENTS IN CORNERS */}
                <div className="absolute -top-5 -left-5 w-10 h-10 border-t-2 border-l-2 border-[#ff4d00]" />
                <div className="absolute -bottom-5 -right-5 w-10 h-10 border-b-2 border-r-2 border-[#ff4d00]" />

                <motion.div 
                  animate={{ 
                    z: activeTab ? -200 : 0,
                    rotateY: activeTab ? -10 : 0 
                  }}
                  className="relative w-full h-full cursor-pointer overflow-hidden rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                >
                  <img 
                    src="/Proper.png" 
                    className="w-full h-full object-cover grayscale brightness-90" 
                    alt="Meison" 
                  />
                  
                  {/* INVISIBLE CLICKABLE AREAS */}
                  <div className="absolute inset-0 grid grid-rows-3 z-20">
                    <div onClick={() => setActiveTab('who')} className="hover:bg-white/5 transition-colors" />
                    <div onClick={() => setActiveTab('resilience')} className="hover:bg-white/5 transition-colors" />
                    <div onClick={() => setActiveTab('mission')} className="hover:bg-white/5 transition-colors" />
                  </div>
                </motion.div>

                {/* FLOATING TEXT (Pops forward) */}
                <AnimatePresence>
                  {activeTab && (
                    <motion.div 
                      initial={{ opacity: 0, z: 100, x: 50 }}
                      animate={{ opacity: 1, z: 300, x: 0 }}
                      exit={{ opacity: 0, z: 100, x: 50 }}
                      className="absolute left-[80%] md:left-[90%] top-1/4 w-[300px] pointer-events-none"
                    >
                      <h3 className="text-[#ff4d00] text-4xl font-black mb-4 underline decoration-white/20 underline-offset-8">
                        {infoMap[activeTab].title}
                      </h3>
                      <p className="text-lg tracking-widest leading-relaxed text-white shadow-2xl bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                        {infoMap[activeTab].body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="max-w-md hidden md:block">
                <p className="text-xs tracking-[0.8em] opacity-30 uppercase mb-4">Interative Core</p>
                <h4 className="text-3xl font-black italic">CLICK IMAGE SEGMENTS TO DECRYPT DATA.</h4>
              </div>
            </section>

            {/* SECTION 2: TECH GEAR */}
            <section className="relative w-screen h-screen flex items-center justify-center bg-[#050505]">
                <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-[80vh] h-[80vh] border-4 border-dashed border-[#ff4d00] rounded-full"
                  />
                </div>
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-16">
                  {['Swift', 'Kotlin', 'Flutter', 'Next.js', 'Three.js', 'Framer'].map((tech) => (
                    <motion.div 
                      key={tech}
                      whileHover={{ scale: 1.2, color: '#ff4d00', opacity: 1 }}
                      className="text-4xl md:text-6xl font-black opacity-30 cursor-default uppercase"
                    >
                      {tech}
                    </motion.div>
                  ))}
                </div>
            </section>

            {/* SECTION 3: CONTACT */}
            <section className="w-screen h-screen flex flex-col items-center justify-center bg-black">
               <h2 className="text-[15vw] font-black opacity-5 vein-pulse select-none">RESILIENCE</h2>
               <motion.button 
                whileHover={{ scale: 1.1 }}
                className="mt-[-5vw] text-2xl font-black border-b-2 border-white pb-2"
               >
                 LETS BUILD THE IMPOSSIBLE
               </motion.button>
            </section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}