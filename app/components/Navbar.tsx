"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ isVisible }: { isVisible: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const isHomeActive = pathname === "/";

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Works", href: "/works" },
    { name: "Contact", href: "/contact" },
  ];

  // Variants for staggered mobile text entrance
  const menuVariants = {
    open: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    open: { opacity: 1, y: 0, rotateX: 0 },
    closed: { opacity: 0, y: 50, rotateX: 45 }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -50, opacity: isVisible ? 1 : 0 }}
        className="fixed top-0 left-0 w-full z-[100] px-8 md:px-16 py-10 flex justify-between items-center pointer-events-none"
      >
        {/* LOGO / HOME BUTTON */}
        <Link href="/" className="pointer-events-auto group perspective-1000">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className={`font-black tracking-tighter text-2xl flex items-center gap-1 transition-colors duration-500 ${isHomeActive ? 'text-black' : 'text-black/40 hover:text-black'}`}
          >
            MEISON
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${isHomeActive ? 'bg-[#d4af37] shadow-[0_0_15px_#d4af37]' : 'bg-black/20'}`} />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-12 items-center pointer-events-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} className="relative group perspective-500">
                <motion.div whileHover={{ rotateX: 90 }} className="relative preserve-3d h-5">
                  <span className={`block text-[10px] uppercase tracking-[0.4em] font-black transition-colors duration-500 ${isActive ? 'text-[#d4af37]' : 'text-black/30 group-hover:text-[#d4af37]'}`}>
                    {link.name}
                  </span>
                  <span 
                    className="absolute top-full left-0 block text-[10px] uppercase tracking-[0.4em] font-black text-black origin-top" 
                    style={{ transform: "translateY(5px) rotateX(-90deg)" }}
                  >
                    {link.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle (Hamburger) */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden pointer-events-auto z-[110] flex flex-col items-end gap-1.5 p-2"
        >
          <div className={`h-[2px] bg-black transition-all duration-500 ${isOpen ? 'w-8 rotate-45 translate-y-2' : 'w-8'}`} />
          <div className={`h-[2px] bg-[#d4af37] transition-all duration-300 ${isOpen ? 'w-0 opacity-0' : 'w-5 opacity-100'}`} />
          <div className={`h-[2px] bg-black transition-all duration-500 ${isOpen ? 'w-8 -rotate-45 -translate-y-2' : 'w-8'}`} />
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105] bg-white flex flex-col items-center justify-center md:hidden"
          >
            {/* Artistic Background Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-hidden">
               <h2 className="text-[25vw] font-black text-black/[0.03] select-none leading-none">
                 MENU
               </h2>
            </div>

            <motion.div 
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col items-center gap-6 z-10"
            >
              {/* Home Link (Mobile) */}
              <motion.div variants={itemVariants} className="perspective-500">
                <Link 
                  href="/" 
                  onClick={() => setIsOpen(false)} 
                  className={`block text-5xl font-black tracking-tighter italic transition-colors ${isHomeActive ? 'text-[#d4af37]' : 'text-black/20 hover:text-black'}`}
                >
                  HOME.
                </Link>
              </motion.div>

              {/* Dynamic Links (Mobile) */}
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={itemVariants} className="perspective-500">
                  <Link 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} 
                    className={`block text-5xl font-black tracking-tighter italic transition-colors ${pathname === link.href ? 'text-[#d4af37]' : 'text-black/20 hover:text-black'}`}
                  >
                    {link.name.toUpperCase()}.
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom Footer Info (Mobile) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 flex flex-col items-center gap-2"
            >
              <div className="w-8 h-[1px] bg-[#d4af37]" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-black/40">Meison 2026</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;