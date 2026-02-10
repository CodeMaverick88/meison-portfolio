"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  Environment
} from "@react-three/drei";
import * as THREE from "three";

// --- 3D VISUALS ---
const SectionVisual = ({ type }: { type: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current) return;
    
    // Smooth rotation logic
    if (type === "I") {
      meshRef.current.rotation.z = t * 0.2;
      meshRef.current.rotation.x = t * 0.1;
    } else {
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.15;
    }
  });

  const geometry = useMemo(() => {
    switch(type) {
        case "E": return <boxGeometry args={[1.5, 1.5, 1.5]} />;
        case "I": return <octahedronGeometry args={[1.6, 0]} />;
        case "S": return <coneGeometry args={[1.1, 2.4, 32]} />; 
        case "O": return <torusKnotGeometry args={[0.9, 0.3, 100, 16]} />;
        case "N": return <torusGeometry args={[1.1, 0.35, 16, 100]} />;
        default: return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    }
  }, [type]);

  return (
    <mesh ref={meshRef}>
      {geometry}
      <MeshDistortMaterial 
        color={type === "I" ? "#708090" : "#D4AF37"} 
        speed={2} 
        distort={0.3} 
        wireframe
      />
    </mesh>
  );
};

// --- OPTIMIZED CUSTOM CURSOR ---
const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Smooth spring physics for the cursor
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveMouse);
    return () => window.removeEventListener("mousemove", moveMouse);
  }, [mouseX, mouseY]);

  return (
    <motion.div 
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }} 
        className="fixed top-0 left-0 w-4 h-4 bg-[#D4AF37] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block" 
    />
  );
};

// --- BACKGROUND EFFECT ---
const MasteryBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#D4AF37_0%,_transparent_60%)]"
      />
      <div className="absolute inset-0 bg-black/20 z-10"></div>
    </div>
  );
};

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
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", amount: 0.2 });

  if (isDivider) {
    return (
      <section ref={ref} id="section-DIVIDER" className="relative py-32 md:py-48 w-full flex items-center justify-center overflow-hidden">
        <motion.div 
            animate={{ opacity: [0.02, 0.05, 0.02], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#D4AF37] blur-[100px] md:blur-[150px] rounded-full pointer-events-none"
        />
        <div className="max-w-3xl text-center px-6 z-10 space-y-10">
          {details?.map((text, i) => (
            <motion.p 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-lg md:text-2xl text-white/70 font-light leading-relaxed"
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
        className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10"
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="space-y-8 order-2 lg:order-1 pb-20 lg:pb-0">
          <div className="flex flex-col">
            <span className="text-white/30 font-mono text-xs md:text-sm tracking-[0.6em] uppercase mb-2">{subtitle}</span>
            <h2 className="text-6xl md:text-8xl font-black text-[#D4AF37] tracking-tighter uppercase">
              {title}<span className="text-white">.</span>
            </h2>
          </div>

          <div className="space-y-6 text-base md:text-lg text-white/60 leading-relaxed font-light">
            {details?.map((text, i) => <p key={i}>{text}</p>)}
          </div>

          {projects && (
            <div className="grid grid-cols-1 gap-4 mt-8">
              {projects.map((p, i) => (
                <motion.a 
                  key={i}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 10, borderColor: "#D4AF37", backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md group transition-all block relative"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start">
                    <div>
                        <span className="text-[9px] text-[#708090] tracking-widest uppercase mb-1 block">{p.tag}</span>
                        <h4 className="text-white font-bold text-lg uppercase group-hover:text-[#D4AF37] transition-colors">{p.name}</h4>
                    </div>
                    <span className="text-white/20 text-xs">↗</span>
                  </div>
                  <p className="text-white/40 text-xs mt-2 font-light">{p.desc}</p>
                </motion.a>
              ))}
            </div>
          )}

          {personal && (
            <div className="flex flex-wrap gap-2 md:gap-3 mt-6">
              {personal.map((tag, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 border border-white/10 text-white/40 text-[9px] uppercase tracking-widest rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isLast && (
             <div className="pt-10 flex flex-col gap-6">
                <motion.a 
                  href="mailto:meisonramsay@gmail.com"
                  whileHover={{ scale: 1.05, backgroundColor: "#D4AF37", color: "#000" }}
                  className="inline-block px-10 py-4 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] transition-all font-bold w-fit"
                >
                  Hire Meison
                </motion.a>
                <div className="text-white/20 text-[9px] tracking-[0.3em] uppercase">
                    Direct Contact: +254 790 827 742
                </div>
             </div>
          )}
        </div>

        <div className="h-[350px] md:h-[600px] w-full relative z-10 order-1 lg:order-2 flex items-center justify-center">
            {hasImage ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-[280px] h-[380px] md:w-[400px] md:h-[500px]"
                >
                    <div className="w-full h-full overflow-hidden border border-white/10 p-2 bg-white/5 backdrop-blur-sm grayscale hover:grayscale-0 transition-all duration-700">
                        <img 
                            src="/Meison-modified.jpg" 
                            alt="Meison" 
                            className="w-full h-full object-cover object-top opacity-90" 
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-[#D4AF37]/50" />
                    <div className="absolute -top-4 -left-4 w-24 h-24 border-l border-t border-[#D4AF37]/50" />
                </motion.div>
            ) : (
                <div className="w-full h-full">
                    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
                        <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <SectionVisual type={letter} />
                        </Float>
                        <Environment preset="city" />
                        </Suspense>
                    </Canvas>
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
  const [time, setTime] = useState(() => 
    new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit" })
  );

  // CLOCK
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // PERFORMANCE OPTIMIZED SCROLL TRACKER
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Extract the letter from ID (e.g. "section-M" -> "M")
            const id = entry.target.id.replace("section-", "");
            if (id !== "DIVIDER") setActiveSection(id);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    );

    const sections = ["M", "E", "I", "S", "O", "N"];
    sections.forEach(letter => {
      const el = document.getElementById(`section-${letter}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

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
      title: "",
      subtitle: "",
      isDivider: true,
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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=Outfit:wght@100;400;900&display=swap');
        body { 
            background: #050505; 
            font-family: 'Outfit', sans-serif; 
            scroll-behavior: smooth;
        }
        /* Hide default scrollbar but allow scrolling */
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>

      <CustomCursor />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-[100] px-6 md:px-12 backdrop-blur-md border-b border-white/5 md:border-none">
        <div className="flex items-center gap-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm tracking-[0.6em] text-[#D4AF37] font-black uppercase border-b border-[#D4AF37] pb-1">
            MEISON
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] uppercase tracking-widest text-white/50">Open for Hire</span>
            </div>
        </div>
        <div className="flex gap-10 text-[9px] tracking-[0.4em] uppercase text-white/40 font-bold">
          <span className="hidden md:block">{time} EAT</span>
          <a href="#section-S" className="hover:text-white transition-colors">Portfolio</a>
        </div>
      </nav>

      {/* DESKTOP SPINE (LEFT) */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 z-[100]">
        {spineData.map((s) => !s.isDivider && (
            <a key={s.letter} href={`#section-${s.letter}`} className="group relative flex items-center">
                <span className={`transition-all duration-500 font-black text-2xl ${activeSection === s.letter ? "text-[#D4AF37] scale-150" : "text-white/10 group-hover:text-white/40"}`}>
                    {s.letter}
                </span>
                <span className="absolute left-10 text-[8px] tracking-[0.5em] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all uppercase whitespace-nowrap">
                {s.title}
                </span>
            </a>
        ))}
      </div>

      {/* MOBILE SPINE DOCK (BOTTOM) */}
      <div className="fixed bottom-0 left-0 w-full md:hidden z-[100] border-t border-white/10 bg-black/90 backdrop-blur-xl pb-6 pt-4 px-6 flex justify-between items-center">
        {spineData.map((s) => !s.isDivider && (
            <a key={s.letter} href={`#section-${s.letter}`} className="flex flex-col items-center gap-1 group">
                <span className={`text-sm font-black transition-all ${activeSection === s.letter ? "text-[#D4AF37] scale-125" : "text-white/20"}`}>
                    {s.letter}
                </span>
                {activeSection === s.letter && <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />}
            </a>
        ))}
      </div>

      <motion.section 
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="h-screen flex flex-col items-center justify-center text-center px-4 pt-20"
      >
        <span className="text-[#708090] tracking-[0.8em] text-[10px] uppercase mb-6 font-bold">Software Engineer • Designer</span>
        <h1 className="text-6xl md:text-9xl font-black leading-none tracking-tighter">
          MEISON <br/> 
          <span className="text-transparent" style={{ WebkitTextStroke: "1px white" }}>MUGWE</span> <br/>
          <span className="text-[#D4AF37]">NJONJO.</span>
        </h1>
        <p className="mt-8 md:mt-12 max-w-lg text-white/40 tracking-[0.4em] text-[10px] uppercase font-bold">
          Available for Junior Roles & Contracts
        </p>
        <div className="absolute bottom-24 md:bottom-12 flex flex-col items-center gap-2 opacity-50">
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
            <span className="text-[8px] uppercase tracking-widest text-[#D4AF37]">Scroll</span>
        </div>
      </motion.section>

      <main className="space-y-0 pb-24 md:pb-0">
        {spineData.map((data, index) => (
          <ContentBlock key={index} {...data} />
        ))}
      </main>

      <footer className="h-[60vh] md:h-[80vh] flex flex-col items-center justify-center bg-black border-t border-white/5 px-6 pb-20 md:pb-0">
        <div className="text-center space-y-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white/10 mb-12">Let s Build</h2>
            <div className="flex flex-wrap justify-center gap-10">
                 <a href="https://www.linkedin.com/in/meison-mugwe-09509b307" className="text-[#708090] hover:text-[#D4AF37] text-xs tracking-widest transition-colors uppercase">LinkedIn</a>
                 <a href="https://github.com/codemaveric88" className="text-[#708090] hover:text-[#D4AF37] text-xs tracking-widest transition-colors uppercase">GitHub</a>
                 <a href="https://wa.me/254701641896" className="text-[#708090] hover:text-[#D4AF37] text-xs tracking-widest transition-colors uppercase">WhatsApp</a>
            </div>
            <div className="pt-20">
                <p className="text-[#D4AF37] text-[10px] tracking-[1em] font-bold uppercase mb-4">Soli Deo Gloria</p>
                <p className="text-white/10 text-[8px] tracking-[0.5em] uppercase">
                © 2026 Meison Mugwe Njonjo. Built with intent.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
}