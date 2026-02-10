"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  Environment,
  ContactShadows,
  PerspectiveCamera
} from "@react-three/drei";
import * as THREE from "three";

/**
 * PERFORMANCE HOOKS & UTILITIES
 * Designed to reduce CPU/GPU overhead on mobile and fix lag.
 */
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
};

// Custom cursor logic only for desktop to save resources on mobile
const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) return;
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <motion.div 
      className="fixed top-0 left-0 w-4 h-4 border border-[#D4AF37] rounded-full pointer-events-none z-[9999] mix-blend-difference"
      animate={{ x: mousePos.x - 8, y: mousePos.y - 8 }}
      transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
};

/**
 * 3D COMPONENTS
 * Optimized geometries and materials.
 */
const SceneLighting = () => (
  <>
    <ambientLight intensity={0.4} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#D4AF37" />
    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#708090" />
    <Environment preset="city" />
  </>
);

const SectionVisual = ({ type }: { type: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.cos(t / 2) / 4, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.sin(t / 4) / 4, 0.1);
    meshRef.current.rotation.z += 0.005;
  });

  const geometry = useMemo(() => {
    switch(type) {
      case "E": return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case "I": return <octahedronGeometry args={[1.8, 0]} />;
      case "S": return <coneGeometry args={[1.2, 2.2, 3]} />; 
      case "O": return <torusKnotGeometry args={[1, 0.3, 128, 16]} />;
      case "N": return <torusGeometry args={[1.2, 0.4, 16, 100]} />;
      default: return <sphereGeometry args={[1, 32, 32]} />;
    }
  }, [type]);

  return (
    <group>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={meshRef}>
          {geometry}
          <MeshDistortMaterial 
            color={type === "I" ? "#708090" : "#D4AF37"} 
            speed={2} 
            distort={0.3} 
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
      <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
    </group>
  );
};

/**
 * CORE CONTENT BLOCK
 * Includes intersection observers to trigger animations and lazy-load 3D.
 */
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
  const isInView = useInView(ref, { margin: "-15% 0px -15% 0px", amount: 0.25 });

  if (isDivider) {
    return (
      <section ref={ref} className="relative py-40 md:py-64 w-full flex items-center justify-center overflow-hidden bg-[#080808]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#D4AF37_0%,_transparent_70%)] blur-3xl" />
        <div className="max-w-4xl text-center px-8 z-10">
          {details?.map((text, i) => (
            <motion.p 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.3 }}
              className="text-xl md:text-3xl text-white/50 font-light leading-relaxed mb-6 italic"
            >
              &ldquo;{text}&rdquo;
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
      className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-24 lg:p-32"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* TEXT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.1, x: -30 }}
          transition={{ duration: 0.8 }}
          className="space-y-10 order-2 lg:order-1"
        >
          <header className="space-y-4">
            <span className="text-[#D4AF37]/60 font-mono text-xs md:text-sm tracking-[0.8em] uppercase block">
              {subtitle}
            </span>
            <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none">
              {title}<span className="text-[#D4AF37]">.</span>
            </h2>
          </header>

          <div className="space-y-6 text-base md:text-xl text-white/40 leading-relaxed font-light max-w-xl">
            {details?.map((text, i) => <p key={i}>{text}</p>)}
          </div>

          {projects && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              {projects.map((p, i) => (
                <motion.a 
                  key={i}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, borderColor: "#D4AF37" }}
                  className="p-6 border border-white/5 bg-white/[0.01] backdrop-blur-xl group transition-all"
                >
                  <span className="text-[10px] text-[#D4AF37] tracking-[0.3em] uppercase mb-2 block">{p.tag}</span>
                  <h4 className="text-white font-bold text-lg uppercase group-hover:tracking-widest transition-all">{p.name}</h4>
                  <p className="text-white/30 text-xs mt-3 leading-snug">{p.desc}</p>
                </motion.a>
              ))}
            </div>
          )}

          {personal && (
            <div className="flex flex-wrap gap-3 mt-8">
              {personal.map((tag, i) => (
                <span key={i} className="px-4 py-2 border border-white/10 text-white/50 text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isLast && (
            <div className="pt-12 flex flex-col sm:flex-row items-center gap-8">
              <motion.a 
                href="mailto:meisonramsay@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto text-center px-12 py-5 bg-[#D4AF37] text-black uppercase tracking-[0.4em] text-xs font-black transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                Start a Project
              </motion.a>
              <div className="text-center sm:text-left">
                <p className="text-white/20 text-[10px] tracking-widest uppercase mb-1">Direct Line</p>
                <p className="text-white/60 font-mono text-sm">+254 790 827 742</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* VISUAL CONTENT (3D or Image) */}
        <div className="h-[400px] md:h-[600px] w-full relative order-1 lg:order-2">
          <AnimatePresence>
            {isInView && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-full h-full"
              >
                {hasImage ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-[280px] h-[380px] md:w-[450px] md:h-[550px] group">
                      <div className="absolute inset-0 border border-[#D4AF37]/30 translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
                      <div className="w-full h-full overflow-hidden bg-[#111] relative z-10 border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000">
                        <img 
                          src="/Meison-modified.jpg" 
                          alt="Meison Mugwe" 
                          className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <Suspense fallback={null}>
                      <SceneLighting />
                      <SectionVisual type={letter} />
                    </Suspense>
                  </Canvas>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/**
 * MAIN PAGE COMPONENT
 */
export default function FinalMeisonPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("M");
  const [time, setTime] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Section Tracking with Throttling for Performance
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          const sections = ["M", "E", "I", "S", "O", "N"];
          const threshold = window.innerHeight / 2;
          
          for (const letter of sections) {
            const el = document.getElementById(`section-${letter}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= threshold && rect.bottom >= threshold) {
                setActiveSection(letter);
                break;
              }
            }
          }
          scrollTimeout = null;
        }, 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const spineData: ContentBlockProps[] = [
    {
      letter: "M",
      title: "Mastery",
      subtitle: "The Architect",
      hasImage: true, 
      details: [
        "I’m Meison Mugwe Njonjo. I build digital systems that bridge the gap between complex logic and human intuition.",
        "Based in Kenya, I operate as a Full-Stack Engineer focused on performance, scalability, and aesthetic precision.",
        "My work is built on a foundation of Christian values, discipline, and a relentless drive for mastery."
      ],
      personal: ["21 Years Old", "Full-Stack", "Kenya-Based", "Christian", "Visionary"]
    },
    {
      letter: "E",
      title: "Engine",
      subtitle: "The Core Stack",
      details: [
        "Infrastructure is the heartbeat of every application. I specialize in building robust backends and fluid frontends.",
        "From low-level C programming to high-level TypeScript ecosystems, I select the right tool for the specific problem."
      ],
      personal: ["TypeScript", "Next.js", "Java", "Neon DB", "Supabase", "React Native", "C"]
    },
    {
      letter: "I",
      title: "Intelligence",
      subtitle: "Artificial Logic",
      details: [
        "AI is not just a tool; it's a teammate. I integrate LLMs and AI agents into production workflows to automate complexity.",
        "I focus on building 'Smart Software' that anticipates user needs rather than just reacting to inputs."
      ],
      personal: ["OpenAI", "LangChain", "Vector DBs", "Python", "Prompt Engineering"]
    },
    {
      letter: "DIVIDER",
      title: "",
      subtitle: "",
      isDivider: true,
      details: [
        "Software should be quiet, confident, and reliable.",
        "High performance is the ultimate form of user experience.",
        "Details are not the details; they make the design."
      ]
    },
    {
      letter: "S",
      title: "Systems",
      subtitle: "Live Deployments",
      projects: [
        { name: "Crystal Five", desc: "Enterprise SaaS for logistics and automated invoicing.", link: "https://crystal5-new-website-o27v.vercel.app/login", tag: "Production SaaS" },
        { name: "Overcomers Chapel", desc: "Global community platform with event management.", link: "https://overcomers.vercel.app/", tag: "Web Architecture" },
        { name: "Intime Home", desc: "Next-gen real estate platform for the Kenyan market.", link: "https://intimehomes-tau.vercel.app/", tag: "Real Estate" },
        { name: "Bidding V2", desc: "Low-latency live auction engine with real-time state sync.", link: "https://biddingapp-v2.vercel.app/", tag: "Real-time App" },
        { name: "Salon Web", desc: "Automated booking system for high-traffic stylists.", link: "https://salon-platform-web.vercel.app/", tag: "Service Platform" },
        { name: "The Lab", desc: "A collection of experimental R&D projects and UI kits.", link: "https://fun-projects-snowy.vercel.app/", tag: "R&D" }
      ]
    },
    {
      letter: "O",
      title: "Originality",
      subtitle: "Creative Ethos",
      details: [
        "Logic without design is dry; design without logic is hollow. I combine both to create unique brand identities.",
        "Every pixel I place and every line of code I write is intentional, aimed at creating a distinct digital fingerprint."
      ],
      personal: ["UI/UX Design", "Motion Graphics", "Branding", "Creative Direction"]
    },
    {
      letter: "N",
      title: "Notes",
      subtitle: "Beyond the Code",
      isLast: true,
      details: [
        "When I'm not coding, I'm making music. I'm a guitar player and vocalist dedicated to my ministry.",
        "I believe in mentorship and helping young developers in Kenya find their path in tech.",
        "Soli Deo Gloria — All for the glory of God."
      ],
      personal: ["Guitarist", "Vocalist", "Mentor", "Community Leader"]
    }
  ];

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=Outfit:wght@100;400;900&display=swap');
        body { 
          cursor: ${isMobile ? 'auto' : 'none'}; 
          background: #050505; 
          font-family: 'Outfit', sans-serif; 
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <CustomCursor />

      {/* TOP NAVBAR */}
      <nav className="fixed top-0 w-full p-6 md:p-10 flex justify-between items-center z-[100] px-6 md:px-16 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="text-sm md:text-base tracking-[0.8em] text-[#D4AF37] font-black uppercase hover:opacity-70 transition-opacity"
          >
            MEISON
          </button>
          <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 border border-white/10 rounded-full bg-white/5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">Available for Hire</span>
          </div>
        </div>
        <div className="flex items-center gap-12 text-[10px] tracking-[0.4em] uppercase text-white/40 font-bold">
          <span className="hidden lg:block">{time} EAT</span>
          <a href="#section-S" className="hover:text-[#D4AF37] transition-colors">Archive</a>
        </div>
      </nav>

      {/* DESKTOP LEFT SPINE */}
      {!isMobile && (
        <div className="fixed left-12 top-1/2 -translate-y-1/2 flex flex-col gap-10 z-[100]">
          {spineData.map((s) => !s.isDivider && (
            <a key={s.letter} href={`#section-${s.letter}`} className="group relative flex items-center">
              <span className={`transition-all duration-700 font-black text-3xl ${activeSection === s.letter ? "text-[#D4AF37] scale-125 translate-x-2" : "text-white/5 group-hover:text-white/20"}`}>
                {s.letter}
              </span>
              <span className={`absolute left-14 text-[10px] tracking-[0.6em] text-[#D4AF37] uppercase whitespace-nowrap transition-all duration-500 ${activeSection === s.letter ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                {s.title}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* MOBILE BOTTOM SPINE (NAVBAR STYLE) */}
      {isMobile && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 w-full p-4 pb-8 bg-black/80 backdrop-blur-2xl border-t border-white/10 z-[100] flex justify-around items-center"
        >
          {spineData.map((s) => !s.isDivider && (
            <a key={s.letter} href={`#section-${s.letter}`} className="flex flex-col items-center gap-2">
              <span className={`text-2xl font-black transition-all ${activeSection === s.letter ? "text-[#D4AF37] scale-110" : "text-white/20"}`}>
                {s.letter}
              </span>
              <motion.div 
                animate={activeSection === s.letter ? { width: 12, opacity: 1 } : { width: 0, opacity: 0 }}
                className="h-1 bg-[#D4AF37] rounded-full"
              />
            </a>
          ))}
        </motion.div>
      )}

      {/* HERO SECTION */}
      <motion.section 
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="h-screen flex flex-col items-center justify-center text-center px-6 relative"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full" />
        </div>
        
        <span className="text-[#708090] tracking-[1em] text-[10px] md:text-xs uppercase mb-8 font-bold relative z-10">
          Software Engineer <span className="text-white/20 mx-4">|</span> Creative Designer
        </span>
        <h1 className="text-6xl md:text-[12rem] font-black leading-[0.85] tracking-tighter relative z-10">
          MEISON <br/> 
          <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>MUGWE</span> <br/>
          <span className="text-[#D4AF37]">NJONJO.</span>
        </h1>
        <p className="mt-12 max-w-lg text-white/30 tracking-[0.5em] text-[10px] uppercase font-black relative z-10">
          Architecting Systems that Outlast Trends
        </p>

        <div className="absolute bottom-16 flex flex-col items-center gap-4">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[1px] h-16 bg-gradient-to-b from-[#D4AF37] to-transparent" 
          />
          <span className="text-[9px] uppercase tracking-[0.8em] text-[#D4AF37]">Explore</span>
        </div>
      </motion.section>

      {/* MAIN CONTENT STACK */}
      <main className="relative z-10">
        {spineData.map((data, index) => (
          <ContentBlock key={index} {...data} />
        ))}
      </main>

      {/* FOOTER SECTION */}
      <footer className="relative min-h-screen flex flex-col items-center justify-center bg-[#030303] overflow-hidden px-8">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="text-center z-10 w-full max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-8xl md:text-[15rem] font-black tracking-tighter uppercase text-white/[0.02] mb-12 select-none"
          >
            Connect
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
            <div className="space-y-4">
              <h5 className="text-[#D4AF37] text-xs tracking-widest uppercase font-bold">Socials</h5>
              <div className="flex flex-col gap-3">
                <a href="https://www.linkedin.com/in/meison-mugwe-09509b307" className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest">LinkedIn</a>
                <a href="https://github.com/codemaveric88" className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest">GitHub</a>
                <a href="https://wa.me/254701641896" className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest">WhatsApp</a>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-[#D4AF37] text-xs tracking-widest uppercase font-bold">Location</h5>
              <p className="text-white/40 text-sm uppercase tracking-widest">Nairobi, Kenya<br/>Remote Worldwide</p>
            </div>

            <div className="space-y-4">
              <h5 className="text-[#D4AF37] text-xs tracking-widest uppercase font-bold">Email</h5>
              <a href="mailto:meisonramsay@gmail.com" className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest">meisonramsay@gmail.com</a>
            </div>
          </div>

          <div className="mt-32 pt-16 border-t border-white/5">
            <p className="text-[#D4AF37] text-xs tracking-[1.5em] font-black uppercase mb-6">Soli Deo Gloria</p>
            <p className="text-white/10 text-[9px] tracking-[0.6em] uppercase">
              © 2026 Meison Mugwe Njonjo. All rights reserved. <br className="md:hidden" /> Crafted with intentionality.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}