"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  Environment,
  Preload
} from "@react-three/drei";
import * as THREE from "three";

// --- 3D VISUALS (Optimized for zero-lag while keeping your specific geometries) ---
const SectionVisual = ({ type }: { type: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (type === "I") {
      meshRef.current.rotation.z = t * 0.5;
      meshRef.current.rotation.x = t * 0.2;
    } else {
      meshRef.current.rotation.x = t * 0.3;
      meshRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Restoring your exact requested 3D elements */}
      {type === "E" && <boxGeometry args={[1.6, 1.6, 1.6]} />}
      {type === "I" && <octahedronGeometry args={[1.8, 0]} />}
      {type === "S" && <coneGeometry args={[1.2, 2.5, 32]} />} 
      {type === "O" && <torusKnotGeometry args={[1, 0.3, 100, 16]} />}
      {type === "N" && <torusGeometry args={[1.2, 0.4, 16, 100]} />}
      
      <MeshDistortMaterial 
        color={type === "I" ? "#708090" : "#D4AF37"} 
        speed={1.5} 
        distort={0.2} 
        wireframe
      />
    </mesh>
  );
};

// --- BACKGROUND EFFECT FOR MASTERY ---
const MasteryBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 2, -2, 0],
        opacity: [0.03, 0.05, 0.03]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#D4AF37_0%,_transparent_70%)]"
    />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

// --- CONTENT COMPONENT ---
interface ContentBlockProps {
  letter: string;
  title: string;
  subtitle: string;
  details?: string[];
  projects?: { name: string; desc: string; link: string; tag: string }[];
  personal?: string[];
  isLast?: boolean;
  hasImage?: boolean;
  isDivider?: boolean; 
}

const ContentBlock = ({ letter, title, subtitle, details, projects, personal, isLast = false, hasImage = false, isDivider = false }: ContentBlockProps) => {
  const ref = useRef(null);
  // Improved detection for mobile
  const isInView = useInView(ref, { margin: "-15% 0px -15% 0px", amount: 0.2 });

  if (isDivider) {
    return (
      <section ref={ref} className="relative py-32 md:py-48 w-full flex items-center justify-center overflow-hidden">
        <motion.div 
            animate={{ opacity: [0.02, 0.04, 0.02], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#D4AF37] blur-[100px] md:blur-[150px] rounded-full pointer-events-none"
        />
        <div className="max-w-3xl text-center px-6 z-10 space-y-8 md:space-y-10">
          {details?.map((text, i) => (
            <motion.p 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: i * 0.4 }}
                viewport={{ once: true }}
                className="text-lg md:text-2xl text-white/70 font-light leading-relaxed font-sans"
            >
                {text}
            </motion.p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={ref}
      id={`section-${letter}`}
      className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-24 overflow-hidden"
    >
      {letter === "M" && <MasteryBackground />}

      <motion.div 
        className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10"
        animate={{ opacity: isInView ? 1 : 0.1, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
          <div className="flex flex-col">
            <span className="text-white/30 font-mono text-[10px] md:text-sm tracking-[0.6em] uppercase mb-2">{subtitle}</span>
            <h2 className="text-5xl md:text-8xl font-black text-[#D4AF37] tracking-tighter uppercase">
              {title}<span className="text-white">.</span>
            </h2>
          </div>

          <div className="space-y-4 md:space-y-6 text-sm md:text-lg text-white/60 leading-relaxed font-light">
            {details?.map((text, i) => <p key={i}>{text}</p>)}
          </div>

          {projects && (
            <div className="grid grid-cols-1 gap-3 md:gap-4 mt-8">
              {projects.map((p, i) => (
                <motion.a 
                  key={i}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 10 }}
                  className="p-4 md:p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md group transition-all block relative"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start">
                    <div>
                        <span className="text-[8px] text-[#708090] tracking-widest uppercase mb-1 block">{p.tag}</span>
                        <h4 className="text-white font-bold text-sm md:text-lg uppercase group-hover:text-[#D4AF37] transition-colors">{p.name}</h4>
                    </div>
                    <span className="text-white/20 text-xs transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                  </div>
                  <p className="text-white/40 text-[10px] md:text-xs mt-2 font-light">{p.desc}</p>
                </motion.a>
              ))}
            </div>
          )}

          {personal && (
            <div className="flex flex-wrap gap-2 mt-6">
              {personal.map((tag, i) => (
                <span key={i} className="px-3 py-1 border border-white/10 text-white/40 text-[9px] uppercase tracking-widest rounded-full transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isLast && (
             <div className="pt-8 flex flex-col gap-4">
                <motion.a 
                  href="mailto:meisonramsay@gmail.com"
                  whileHover={{ scale: 1.02, backgroundColor: "#D4AF37", color: "#000" }}
                  className="inline-block px-8 py-4 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] transition-all font-bold w-fit"
                >
                  Hire Meison
                </motion.a>
                <div className="text-white/20 text-[9px] tracking-[0.3em] uppercase">
                    Direct Contact: +254 790 827 742
                </div>
             </div>
          )}
        </div>

        <div className="h-[300px] md:h-[600px] w-full relative z-10 order-1 lg:order-2 flex items-center justify-center">
            {hasImage ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative w-[260px] h-[350px] md:w-[400px] md:h-[500px]"
                >
                    <div className="w-full h-full overflow-hidden border border-white/10 p-2 bg-white/5 backdrop-blur-sm grayscale hover:grayscale-0 transition-all duration-1000">
                        <img 
                            src="/Meison-modified.jpg" 
                            alt="Meison" 
                            className="w-full h-full object-cover object-top opacity-90" 
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 border-r border-b border-[#D4AF37]/50" />
                    <div className="absolute -top-4 -left-4 w-20 h-20 border-l border-t border-[#D4AF37]/50" />
                </motion.div>
            ) : (
                <div className="w-full h-full">
                  {/* PERFORMANCE FIX: Only render the canvas if the section is in view */}
                  {isInView && (
                    <Canvas 
                      dpr={1} 
                      camera={{ position: [0, 0, 5], fov: 45 }}
                      gl={{ antialias: false, powerPreference: "high-performance" }}
                    >
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
                            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                                <SectionVisual type={letter} />
                            </Float>
                            <Environment preset="city" />
                            <Preload all />
                        </Suspense>
                    </Canvas>
                  )}
                </div>
            )}
        </div>
      </motion.div>
    </section>
  );
};

export default function FinalMeisonPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("M");
  
  // Custom cursor using useSpring to avoid React Re-renders (Zero Lag)
  const cursorX = useSpring(0, { stiffness: 500, damping: 50 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 50 });

  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);
    };
    window.addEventListener("mousemove", handleMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("section-", "");
            if (id !== "DIVIDER") setActiveSection(id);
          }
        });
      },
      { threshold: 0.3 }
    );

    ["M", "E", "I", "S", "O", "N"].forEach(letter => {
      const el = document.getElementById(`section-${letter}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // FULL PROJECT DATA RESTORED
  const spineData: ContentBlockProps[] = [
    {
      letter: "M",
      title: "Mastery",
      subtitle: "The Architect",
      hasImage: true, 
      details: [
        "I’m Meison. I build digital systems that feel alive.",
        "I focus on orchestrating logic and design into tools people actually want to use.",
        "Production systems used by real clients. Driven by discipline."
      ],
      personal: ["21 Years Old", "Full-Stack", "Fast Learner", "Christian", "Visionary"]
    },
    {
      letter: "E",
      title: "Engine",
      subtitle: "The Foundation",
      details: [
        "I build things that work—clean systems, smooth interfaces, and reliable infrastructure.",
        "I learn fast, build often, and improve every project I touch."
      ],
      personal: ["TypeScript", "React Native", "Java", "Neon DB", "Supabase", "Expo", "C"]
    },
    {
      letter: "I",
      title: "Intelligence",
      subtitle: "Future Tech",
      details: [
        "Exploring AI—teaching software how to think, decide, and assist, not just respond.",
        "It’s not about hype; it’s about solving real-world complexity with utility."
      ],
      personal: ["LLM Integration", "AI Agents", "Prompting", "Python"]
    },
    {
      letter: "DIVIDER",
      title: "", subtitle: "", isDivider: true,
      details: [
        "I don’t rush projects. I think, design, and refine.",
        "Clarity and performance are non-negotiable.",
        "Good software should be quiet, confident, and reliable."
      ]
    },
    {
      letter: "S",
      title: "Systems",
      subtitle: "Deployed Work",
      projects: [
        { name: "Crystal Five Database", desc: "Enterprise SaaS invoicing and logistics.", link: "https://crystal5-new-website-o27v.vercel.app/login", tag: "Full-Stack SaaS" },
        { name: "Overcomers Chapel", desc: "Community portal and booking system.", link: "https://overcomers.vercel.app/", tag: "Web Platform" },
        { name: "Intime Home", desc: "Real estate and agency digital solution.", link: "https://intimehomes-tau.vercel.app/", tag: "Real Estate" },
        { name: "Bidding App", desc: "Live auction and bidding interface.", link: "https://biddingapp-v2.vercel.app/", tag: "Web App" },
        { name: "Salon Platform", desc: "Session booking and stylist management.", link: "https://salon-platform-web.vercel.app/", tag: "Booking System" },
        { name: "Playground", desc: "Experimental concepts and R&D.", link: "https://fun-projects-snowy.vercel.app/", tag: "R&D" }
      ]
    },
    {
      letter: "O",
      title: "Originality",
      subtitle: "Design Soul",
      details: [
        "Design matters to me as much as logic. I care about details because details are what people remember.",
        "High-impact branding and creative direction for projects that need an edge."
      ],
      personal: ["UI/UX", "Branding", "Video Editing", "Creative Direction"]
    },
    {
      letter: "N",
      title: "Notes",
      subtitle: "Human",
      isLast: true,
      details: [
        "My life is rhythm and service. I play guitar, sing, and serve my church.",
        "I believe in helping the next generation find their footing.",
        "Soli Deo Gloria. Glory to God alone."
      ],
      personal: ["Guitarist", "Vocalist", "Damacrest Mentor", "Ministry"]
    }
  ];

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white overflow-x-hidden selection:bg-[#D4AF37]/40">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;900&display=swap');
        body { background: #050505; font-family: 'Outfit', sans-serif; }
        ::-webkit-scrollbar { display: none; }
        * { cursor: none !important; }
        @media (max-width: 768px) { * { cursor: auto !important; } }
      `}</style>

      {/* Zero-Lag Custom Cursor */}
      <motion.div 
        style={{ x: cursorX, y: cursorY }} 
        className="fixed top-0 left-0 w-2 h-2 bg-[#D4AF37] rounded-full pointer-events-none z-[9999] hidden md:block" 
      />

      <nav className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-[100] bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className={`text-sm tracking-[0.6em] font-black uppercase transition-colors ${activeSection === "M" ? "text-[#D4AF37]" : "text-white"}`}
            >
            MEISON
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[8px] uppercase tracking-widest text-white/50">Open for Hire</span>
            </div>
        </div>
        <div className="flex gap-6 md:gap-10 text-[9px] tracking-[0.4em] uppercase text-white/40 font-bold">
          <span className="hidden lg:block">{time} EAT</span>
          <a href="#section-S" className="hover:text-white transition-colors">Portfolio</a>
          <a href="mailto:meisonramsay@gmail.com" className="text-[#D4AF37]">Contact</a>
        </div>
      </nav>

      <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 md:gap-8 z-[100]">
        {spineData.map((s) => !s.isDivider && (
            <a key={s.letter} href={`#section-${s.letter}`} className="group relative flex items-center">
                <span className={`transition-all duration-500 font-black text-xl md:text-2xl ${activeSection === s.letter ? "text-[#D4AF37] scale-125" : "text-white/10 group-hover:text-white/40"}`}>
                    {s.letter}
                </span>
                <span className="absolute left-8 md:left-10 text-[7px] md:text-[8px] tracking-[0.5em] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all uppercase whitespace-nowrap">
                {s.title}
                </span>
            </a>
        ))}
      </div>

      {/* REFINED HERO M ANIMATION */}
      <motion.section 
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="h-screen flex flex-col items-center justify-center text-center px-4"
      >
        <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.8em" }}
            transition={{ duration: 1.5 }}
            className="text-[#708090] text-[10px] uppercase mb-8 font-bold"
        >
            Software Engineer • Designer
        </motion.span>
        
        <h1 className="text-5xl md:text-9xl font-black leading-none tracking-tighter flex flex-col items-center">
          <motion.div 
            initial={{ y: 40, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            MEISON
          </motion.div>
          <motion.div 
            initial={{ y: 40, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-transparent" style={{ WebkitTextStroke: "1px white" }}
          >
            MUGWE
          </motion.div>
          <motion.div 
            initial={{ y: 40, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#D4AF37]"
          >
            NJONJO.
          </motion.div>
        </h1>
        
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.4 }} 
            transition={{ delay: 1 }}
            className="mt-12 max-w-lg text-white/40 tracking-[0.4em] text-[8px] md:text-[10px] uppercase font-bold"
        >
          Available for Junior Roles & Contracts
        </motion.p>
        
        <div className="absolute bottom-12 flex flex-col items-center gap-2">
            <motion.div 
                animate={{ height: [0, 48, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent" 
            />
            <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] opacity-50">Scroll</span>
        </div>
      </motion.section>

      <main className="space-y-0">
        {spineData.map((data, index) => (
          <ContentBlock key={index} {...data} />
        ))}
      </main>

      <footer className="h-[60vh] md:h-[80vh] flex flex-col items-center justify-center bg-black border-t border-white/5 px-6">
        <div className="text-center space-y-10 md:space-y-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white/10 mb-8 md:mb-12">Let's Build</h2>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                 <a href="https://www.linkedin.com/in/meison-mugwe-09509b307" target="_blank" className="text-[#708090] hover:text-[#D4AF37] text-[10px] tracking-widest transition-colors uppercase">LinkedIn</a>
                 <a href="https://github.com/codemaveric88" target="_blank" className="text-[#708090] hover:text-[#D4AF37] text-[10px] tracking-widest transition-colors uppercase">GitHub</a>
                 <a href="https://wa.me/254790827742" target="_blank" className="text-[#708090] hover:text-[#D4AF37] text-[10px] tracking-widest transition-colors uppercase">WhatsApp</a>
            </div>
            <div className="pt-16 md:pt-20">
                <p className="text-[#D4AF37] text-[10px] tracking-[1.2em] font-bold uppercase mb-4">Soli Deo Gloria</p>
                <p className="text-white/10 text-[8px] tracking-[0.5em] uppercase">
                © 2026 Meison Mugwe Njonjo. Built with intent.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
}