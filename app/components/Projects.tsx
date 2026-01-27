"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  desc: string;
  img: string;
  link: string;
  tags: string[];
  color: string;
  bgColor: string;
}

const ProjectData: Project[] = [
  {
    id: 1,
    title: "Overcomers Chapel",
    desc: "A spiritual digital hub for the international church community.",
    img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1600",
    link: "https://overcomers.vercel.app",
    tags: ["React", "Community", "Vercel"],
    color: "#d4af37",
    bgColor: "#fcfaf2" // Gold Tint
  },
  {
    id: 2,
    title: "Crystal Five",
    desc: "A sophisticated management system for luxury operations.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600",
    link: "https://crystal-f5.vercel.app",
    tags: ["Management", "React", "Enterprise"],
    color: "#a855f7",
    bgColor: "#f8f2ff" // Purple Tint
  },
  {
    id: 3,
    title: "Space Exploration",
    desc: "Immersive educational portal into the wonders of the cosmos.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600",
    link: "https://fun-projects-snowy.vercel.app/",
    tags: ["Space", "Interactive", "Education"],
    color: "#22c55e",
    bgColor: "#f2fff5" // Green Tint
  },
  {
    id: 4,
    title: "Intime Homes",
    desc: "Next-gen real estate locator and home discovery platform.",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1600",
    link: "https://intimehomes-tau.vercel.app/",
    tags: ["Real Estate", "Next.js", "Locators"],
    color: "#000000",
    bgColor: "#f5f5f5" // Grey Tint
  }
];

interface ProjectCardProps {
  project: Project;
  index: number;
  scrollYProgress: MotionValue<number>;
}

const ProjectCard = ({ project, index, scrollYProgress }: ProjectCardProps) => {
  const start = index * 0.25;
  const end = (index + 1) * 0.25;

  // Visual transitions for the card itself
  const scale = useTransform(scrollYProgress, [start, start + 0.1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  
  return (
    <motion.div 
      style={{ scale, opacity }}
      className="sticky top-0 h-screen w-full flex items-center justify-center p-4 md:p-12"
    >
      <div className="relative w-full max-w-6xl aspect-[4/5] md:aspect-[21/9] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden group border border-black/5 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.07)]">
        {/* Project Image */}
        <img 
          src={project.img} 
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent opacity-95 md:opacity-90 group-hover:opacity-40 transition-opacity duration-700" />

        {/* Content */}
        <div className="absolute inset-0 p-6 md:p-16 flex flex-col justify-end items-start z-10">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
            {project.tags.map((tag) => (
              <span key={tag} className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-black/10 bg-white/80 backdrop-blur-md text-black/60">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-3xl md:text-7xl font-black uppercase tracking-tighter text-black mb-2 md:mb-3">
            {project.title}
          </h3>
          <p className="text-xs md:text-lg text-black/60 mb-6 md:mb-8 max-w-xl font-medium tracking-tight leading-relaxed">
            {project.desc}
          </p>

          <Link 
            href={project.link} 
            target="_blank"
            className="group/link flex items-center gap-3 text-[10px] md:text-xs uppercase font-black tracking-[0.2em] text-black hover:bg-black hover:text-white px-6 py-3 md:px-8 md:py-4 border border-black transition-all duration-300 rounded-full"
          >
            Visit Project 
            <span className="group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Subtle Ambient Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-1000"
          style={{ background: `radial-gradient(circle at center, ${project.color} 0%, transparent 70%)` }}
        />
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Dynamic background color mapping
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#ffffff", ProjectData[0].bgColor, ProjectData[1].bgColor, ProjectData[2].bgColor, ProjectData[3].bgColor]
  );

  return (
    <motion.div style={{ backgroundColor: bgColor }} className="transition-colors duration-500">
      {/* --- SEPARATE SECTION TITLE --- */}
      <div className="w-full pt-24 md:pt-32 flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-9xl font-black tracking-tighter text-black uppercase leading-none text-center px-4"
        >
          My Projects
        </motion.h2>
        <div className="w-16 md:w-24 h-2 bg-black mt-4 md:mt-6" />
        <p className="text-[8px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] text-black/40 mt-6 md:mt-8 font-bold">
          Digital Solutions & Platforms
        </p>
      </div>

      <section ref={containerRef} className="relative h-[400vh] w-full">
        <div className="relative">
          {ProjectData.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </section>
      
      <div className="h-[10vh]" />
    </motion.div>
  );
}