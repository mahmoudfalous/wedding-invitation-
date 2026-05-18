// app/w/[slug]/AnimatedInvitation.tsx
'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ThemeConfig } from '@/app/constants/themes';

interface Props {
  wedding: any;
  theme: ThemeConfig;
}

const yearToWords = (year: number) => {
  const years: Record<number, string> = {
    2026: "two thousand twenty-six",
    2027: "two thousand twenty-seven",
    2028: "two thousand twenty-eight",
    2029: "two thousand twenty-nine",
    2030: "two thousand thirty",
    2031: "two thousand thirty-one",
    2032: "two thousand thirty-two",
    2033: "two thousand thirty-three",
    2034: "two thousand thirty-four",
    2035: "two thousand thirty-five",
    2036: "two thousand thirty-six",
    2037: "two thousand thirty-seven",
    2038: "two thousand thirty-eight",
    2039: "two thousand thirty-nine",
    2040: "two thousand forty",

  };
  return years[year] || year.toString();
};

const PARTICLE_TEMPLATES = [
  { type: 'petal', color: 'from-rose-400 to-pink-500' },
  { type: 'petal', color: 'from-rose-500 to-red-600' },
  { type: 'sparkle', color: 'bg-amber-300' },
  { type: 'petal', color: 'from-pink-300 to-rose-400' },
  { type: 'sparkle', color: 'bg-yellow-400' },
];

export default function AnimatedInvitation({ wedding, theme }: Props) {
  const [themeKey, animationStyle] = (wedding.theme || '').split(':');
  const activeAnimation = animationStyle || 'envelope';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [showContent, setShowContent] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const weddingDate = new Date(wedding.wedding_date);

  const monthName = weddingDate.toLocaleString('en-US', { month: 'long' });
  const dayName = weddingDate.toLocaleString('en-US', { weekday: 'long' });
  const yearText = yearToWords(weddingDate.getFullYear());

  // Image Fallbacks
  const brideImg = wedding.image_one_url || '/bride.jpeg';
  const groomImg = wedding.image_two_url || '/groom.jpeg';

  useEffect(() => {
    const targetDate = weddingDate.getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [wedding.wedding_date]);

  const daysAround = [-2, -1, 0, 1, 2].map(offset => {
    const d = new Date(weddingDate);
    d.setDate(d.getDate() + offset);
    return { dayNum: d.getDate(), isTarget: offset === 0 };
  });

  const handleOpenEnvelope = () => {
    if (envelopeOpen) return;
    setEnvelopeOpen(true);
    setTimeout(() => {
      setShowContent(true);
    }, 2400);
  };

  const { scrollYProgress } = useScroll();
  const scaleImage = useTransform(scrollYProgress, [0.5, 1], [1, 1.15]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.main
            key="intro"
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className={`w-full min-h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.text} fixed inset-0 z-50 overflow-hidden`}
          >
            {/* Ambient Floating Rose Petals & Golden Fairy Dust */}
            {mounted && (
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
                {[...Array(30)].map((_, i) => {
                  const size = Math.random() * 10 + 6;
                  const item = PARTICLE_TEMPLATES[i % PARTICLE_TEMPLATES.length];
                  
                  if (item.type === 'sparkle') {
                    return (
                      <motion.div
                        key={i}
                        className={`absolute ${item.color} rounded-full opacity-60 shadow-[0_0_8px_rgba(251,191,36,0.8)]`}
                        style={{
                          width: size / 2,
                          height: size / 2,
                          left: Math.random() * 100 + "%",
                          top: (Math.random() * 100 + 100) + "%",
                        }}
                        animate={{ 
                          y: [0, -1200],
                          x: [0, Math.cos(i) * 80],
                          opacity: [0, 0.8, 0],
                          scale: [0.5, 1.2, 0.2]
                        }}
                        transition={{ 
                          duration: Math.random() * 8 + 6, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: Math.random() * 10
                        }}
                      />
                    );
                  } else {
                    return (
                      <motion.div
                        key={i}
                        className={`absolute bg-gradient-to-br ${item.color} opacity-40 shadow-sm`}
                        style={{
                          width: size,
                          height: size * 1.3,
                          borderRadius: '150px 0 150px 150px',
                          left: Math.random() * 100 + "%",
                          top: (Math.random() * 100 + 100) + "%",
                        }}
                        animate={{ 
                          y: [0, -1200],
                          x: [0, Math.sin(i) * 100],
                          rotate: [0, 360 + Math.random() * 360],
                          opacity: [0, 0.6, 0]
                        }}
                        transition={{ 
                          duration: Math.random() * 10 + 10, 
                          repeat: Infinity, 
                          ease: "linear",
                          delay: Math.random() * 10
                        }}
                      />
                    );
                  }
                })}
              </div>
            )}

            {/* The Animating Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }} 
              animate={{ 
                scale: envelopeOpen ? 1 : [1, 1.02, 1], 
                opacity: 1, 
                y: envelopeOpen ? 0 : [0, -8, 0] 
              }} 
              transition={{ 
                y: envelopeOpen ? { duration: 0.5 } : { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: envelopeOpen ? { duration: 0.5 } : { duration: 2, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 1.2, ease: "easeOut" }
              }}
              whileHover={!envelopeOpen ? { scale: 1.02, transition: { duration: 0.3 } } : {}}
              whileTap={!envelopeOpen ? { scale: 0.98 } : {}}
              className={`relative cursor-pointer mt-12 ${
                activeAnimation === 'gate' || activeAnimation === 'book' || activeAnimation === 'curtain' || activeAnimation === 'scroll' || activeAnimation === 'rose'
                  ? 'w-[280px] h-[360px] sm:w-[340px] sm:h-[440px]' 
                  : activeAnimation === 'locket'
                  ? 'w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] drop-shadow-[0_15px_45px_rgba(228,166,161,0.25)]'
                  : 'w-[320px] h-[220px] sm:w-[420px] sm:h-[280px] drop-shadow-2xl'
              }`}
              onClick={handleOpenEnvelope}
              style={{ perspective: "1500px" }}
            >
              {/* Back Aura / Glow */}
              <motion.div 
                animate={envelopeOpen ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: activeAnimation === 'envelope' ? 0.2 : 0.6 }}
                transition={{ duration: 1.5 }}
                className={`absolute inset-0 bg-radial-gradient from-amber-400/20 via-pink-400/5 to-transparent blur-3xl rounded-full scale-110 pointer-events-none`}
              ></motion.div>

              {/* The Letter inside */}
              <motion.div 
                initial={{ y: 0, scale: activeAnimation === 'gate' || activeAnimation === 'book' || activeAnimation === 'curtain' || activeAnimation === 'scroll' || activeAnimation === 'rose' ? 0.8 : activeAnimation === 'locket' ? 0.9 : 1, opacity: 0.9, zIndex: 10 }}
                animate={
                  envelopeOpen 
                    ? { 
                        y: [0, -120, -120, 0], 
                        scale: [
                          activeAnimation === 'gate' || activeAnimation === 'book' || activeAnimation === 'curtain' || activeAnimation === 'scroll' || activeAnimation === 'rose' ? 0.8 : activeAnimation === 'locket' ? 0.9 : 1, 
                          activeAnimation === 'gate' || activeAnimation === 'book' || activeAnimation === 'curtain' || activeAnimation === 'scroll' || activeAnimation === 'rose' ? 0.8 : activeAnimation === 'locket' ? 0.9 : 1, 
                          1.2, 
                          20
                        ], 
                        zIndex: [10, 40, 40, 40] 
                      } 
                    : { y: 0, scale: activeAnimation === 'gate' || activeAnimation === 'book' || activeAnimation === 'curtain' || activeAnimation === 'scroll' || activeAnimation === 'rose' ? 0.8 : activeAnimation === 'locket' ? 0.9 : 1, zIndex: 10 }
                }
                transition={
                  envelopeOpen
                    ? { 
                        delay: 0.4,
                        duration: 2.0, 
                        times: [0, 0.3, 0.6, 1], 
                        ease: "easeInOut" 
                      }
                    : { duration: 0.8 }
                }
                className={`absolute ${
                  activeAnimation === 'gate' || activeAnimation === 'book' || activeAnimation === 'curtain' || activeAnimation === 'scroll' || activeAnimation === 'rose'
                    ? 'inset-4'
                    : activeAnimation === 'locket'
                    ? 'inset-6'
                    : 'inset-x-3 top-3 bottom-3'
                } ${theme.bg} shadow-2xl flex flex-col items-center justify-center p-6 border ${theme.border} rounded-md`}
              >
                {activeAnimation === 'scroll' && envelopeOpen && (
                  <>
                    {/* Top wooden roller handle */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[105%] h-3.5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800 rounded-full shadow-md z-30 border border-amber-950/40" />
                    {/* Bottom wooden roller handle */}
                    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-[105%] h-3.5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800 rounded-full shadow-md z-30 border border-amber-950/40" />
                  </>
                )}
                <motion.div 
                  animate={{ opacity: envelopeOpen ? 0 : 1 }}
                  transition={{ delay: 1.2, duration: 0.3 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 mb-4 opacity-40 ${theme.accent}`}>
                    {wedding.type === 'engagement' ? (
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                    ) : (
                      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    )}
                  </div>
                  <h3 className={`text-xl sm:text-2xl italic text-center ${theme.fontTitle} mb-2`}>
                    {wedding.partner_one} & {wedding.partner_two}
                  </h3>
                  <p className={`text-[8px] sm:text-[10px] tracking-[0.2em] uppercase opacity-50 ${theme.fontBody}`}>Formal {wedding.type === 'engagement' ? 'Engagement' : 'Wedding'} Invitation</p>
                </motion.div>
              </motion.div>

              {/* Animation 1: Classic Envelope */}
              {activeAnimation === 'envelope' && (
                <>
                  {/* Left Gatefold Door */}
                  <motion.div 
                    initial={{ rotateY: 0, opacity: 1 }}
                    animate={
                      envelopeOpen 
                        ? { rotateY: -140, opacity: 0, zIndex: 20 } 
                        : { rotateY: 0, opacity: 1, zIndex: 30 }
                    }
                    transition={{ 
                      rotateY: { duration: 1.2, ease: "easeInOut" },
                      opacity: { delay: 0.8, duration: 0.8, ease: "easeIn" }
                    }}
                    style={{ transformOrigin: "left" }}
                    className={`absolute inset-y-0 left-0 w-1/2 ${theme.cardBg} brightness-100 shadow-[2px_0_10px_rgba(0,0,0,0.1)] rounded-l-md border-y border-l border-r border-r-black/5 ${theme.border}`}
                  >
                     <div className={`absolute inset-2 border border-current opacity-20 ${theme.accent} rounded-sm`} />
                  </motion.div>

                  {/* Right Gatefold Door */}
                  <motion.div 
                    initial={{ rotateY: 0, opacity: 1 }}
                    animate={
                      envelopeOpen 
                        ? { rotateY: 140, opacity: 0, zIndex: 20 } 
                        : { rotateY: 0, opacity: 1, zIndex: 30 }
                    }
                    transition={{ 
                      rotateY: { duration: 1.2, ease: "easeInOut" },
                      opacity: { delay: 0.8, duration: 0.8, ease: "easeIn" }
                    }}
                    style={{ transformOrigin: "right" }}
                    className={`absolute inset-y-0 right-0 w-1/2 ${theme.cardBg} brightness-100 shadow-[-2px_0_10px_rgba(0,0,0,0.1)] rounded-r-md border-y border-r border-l border-l-black/5 ${theme.border}`}
                  >
                     <div className={`absolute inset-2 border border-current opacity-20 ${theme.accent} rounded-sm`} />
                  </motion.div>

                  {/* Wax Seal */}
                  <motion.div 
                    animate={
                      envelopeOpen 
                        ? { scale: 2, opacity: 0, filter: "blur(4px)" } 
                        : { scale: 1, opacity: 1, filter: "blur(0px)" }
                    }
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg flex items-center justify-center border ring-2 ${wedding.type === 'engagement' ? 'bg-indigo-800 border-indigo-950/30 ring-indigo-900/20' : 'bg-rose-800 border-rose-950/30 ring-rose-900/20'}`}>
                      <span className="text-white/90 font-serif italic text-xl sm:text-2xl drop-shadow-sm flex items-center gap-[2px]">
                        <span>{wedding.partner_one[0]}</span>
                        <span className="text-xs sm:text-sm text-white/70">&</span>
                        <span>{wedding.partner_two[0]}</span>
                      </span>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Animation 2: Heart Locket */}
              {activeAnimation === 'locket' && (
                <>
                  {/* Left Heart Locket Door */}
                  <motion.div 
                    initial={{ rotateY: 0, x: 0 }}
                    animate={
                      envelopeOpen 
                        ? { rotateY: -130, x: -60, opacity: 0, zIndex: 20 } 
                        : { rotateY: 0, x: 0, opacity: 1, zIndex: 30 }
                    }
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{ transformOrigin: "0% 50%" }}
                    className="absolute inset-y-0 left-0 w-1/2 overflow-visible"
                  >
                    <svg viewBox="0 0 50 100" className="w-full h-full drop-shadow-xl" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="leftHeartGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#9C2D3C" />
                          <stop offset="50%" stopColor="#C24D5F" />
                          <stop offset="100%" stopColor="#6B131F" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M50,15 C30,-5 0,0 0,35 C0,65 50,90 50,90 L50,15 Z" 
                        fill="url(#leftHeartGrad)" 
                        stroke="#D4AF37" 
                        strokeWidth="1.5"
                      />
                      <path 
                        d="M45,22 C28,5 4,10 4,35 C4,60 45,82 45,82" 
                        fill="none" 
                        stroke="#E6C280" 
                        strokeWidth="0.5" 
                        strokeDasharray="2,2"
                        opacity="0.6"
                      />
                    </svg>
                  </motion.div>

                  {/* Right Heart Locket Door */}
                  <motion.div 
                    initial={{ rotateY: 0, x: 0 }}
                    animate={
                      envelopeOpen 
                        ? { rotateY: 130, x: 60, opacity: 0, zIndex: 20 } 
                        : { rotateY: 0, x: 0, opacity: 1, zIndex: 30 }
                    }
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{ transformOrigin: "100% 50%" }}
                    className="absolute inset-y-0 right-0 w-1/2 overflow-visible"
                  >
                    <svg viewBox="0 0 50 100" className="w-full h-full drop-shadow-xl" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="rightHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#9C2D3C" />
                          <stop offset="50%" stopColor="#C24D5F" />
                          <stop offset="100%" stopColor="#6B131F" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M0,15 L0,90 C0,90 50,65 50,35 C50,0 20,-5 0,15 Z" 
                        fill="url(#rightHeartGrad)" 
                        stroke="#D4AF37" 
                        strokeWidth="1.5"
                      />
                      <path 
                        d="M5,22 C22,5 46,10 46,35 C46,60 5,82 5,82" 
                        fill="none" 
                        stroke="#E6C280" 
                        strokeWidth="0.5" 
                        strokeDasharray="2,2"
                        opacity="0.6"
                      />
                    </svg>
                  </motion.div>

                  {/* Golden Initials Lock Medallion */}
                  <motion.div 
                    animate={
                      envelopeOpen 
                        ? { scale: 2, opacity: 0, filter: "blur(4px)" } 
                        : { scale: [1, 1.05, 1], opacity: 1, filter: "blur(0px)" }
                    }
                    transition={
                      envelopeOpen 
                        ? { duration: 0.5, ease: "easeOut" } 
                        : { repeat: Infinity, duration: 2.0, ease: "easeInOut" }
                    }
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-2xl flex flex-col items-center justify-center border-2 border-amber-400 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 ring-4 ring-amber-300/30">
                      <div className="absolute inset-1 border border-dashed border-amber-200/50 rounded-full animate-spin-slow animate-pulse"></div>
                      <span className="text-stone-900 font-serif italic text-base sm:text-lg font-bold drop-shadow-sm flex items-center gap-[2px]">
                        <span>{wedding.partner_one[0]}</span>
                        <span className="text-xs text-stone-900/60">&</span>
                        <span>{wedding.partner_two[0]}</span>
                      </span>
                      <svg className="w-3.5 h-3.5 text-red-700 animate-pulse mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Animation 3: Garden Gates */}
              {activeAnimation === 'gate' && (
                <>
                  {/* Left Wrought Iron Gate */}
                  <motion.div 
                    initial={{ rotateY: 0, x: 0 }}
                    animate={
                      envelopeOpen 
                        ? { rotateY: -125, x: -40, opacity: 0, zIndex: 20 } 
                        : { rotateY: 0, x: 0, opacity: 1, zIndex: 30 }
                    }
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    style={{ transformOrigin: "0% 50%" }}
                    className="absolute inset-y-0 left-0 w-1/2 overflow-visible"
                  >
                    <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-xl" preserveAspectRatio="none">
                      <path d="M10,190 L10,30 C10,30 50,10 95,30 L95,190 Z" fill="none" stroke="#D4AF37" strokeWidth="3" />
                      <path d="M10,50 C30,45 60,40 95,50" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      <path d="M10,100 C30,95 60,90 95,100" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      <path d="M10,150 C30,145 60,140 95,150" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      <path d="M30,75 C20,60 40,60 30,75 C20,90 40,90 30,75 Z" fill="none" stroke="#E6C280" strokeWidth="1" />
                      <path d="M70,75 C60,60 80,60 70,75 C60,90 80,90 70,75 Z" fill="none" stroke="#E6C280" strokeWidth="1" />
                      <path d="M30,125 C20,110 40,110 30,125 C20,140 40,140 30,125 Z" fill="none" stroke="#E6C280" strokeWidth="1" />
                      <path d="M70,125 C60,110 80,110 70,125 C60,140 80,140 70,125 Z" fill="none" stroke="#E6C280" strokeWidth="1" />
                      <line x1="30" y1="30" x2="30" y2="190" stroke="#D4AF37" strokeWidth="1" />
                      <line x1="50" y1="20" x2="50" y2="190" stroke="#D4AF37" strokeWidth="1" />
                      <line x1="70" y1="30" x2="70" y2="190" stroke="#D4AF37" strokeWidth="1" />
                      <path d="M10,190 Q20,140 12,90 T25,30" fill="none" stroke="#2D5A27" strokeWidth="2.5" />
                      <circle cx="15" cy="140" r="5" fill="#C24D5F" stroke="#9C2D3C" />
                      <circle cx="11" cy="95" r="4" fill="#C24D5F" stroke="#9C2D3C" />
                      <circle cx="20" cy="55" r="5" fill="#C24D5F" stroke="#9C2D3C" />
                    </svg>
                  </motion.div>

                  {/* Right Wrought Iron Gate */}
                  <motion.div 
                    initial={{ rotateY: 0, x: 0 }}
                    animate={
                      envelopeOpen 
                        ? { rotateY: 125, x: 40, opacity: 0, zIndex: 20 } 
                        : { rotateY: 0, x: 0, opacity: 1, zIndex: 30 }
                    }
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    style={{ transformOrigin: "100% 50%" }}
                    className="absolute inset-y-0 right-0 w-1/2 overflow-visible"
                  >
                    <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-xl" preserveAspectRatio="none">
                      <path d="M90,190 L90,30 C90,30 50,10 5,30 L5,190 Z" fill="none" stroke="#D4AF37" strokeWidth="3" />
                      <path d="M90,50 C70,45 40,40 5,50" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      <path d="M90,100 C70,95 40,90 5,100" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      <path d="M90,150 C70,145 40,140 5,150" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      <path d="M70,75 C80,60 60,60 70,75 C80,90 60,90 70,75 Z" fill="none" stroke="#E6C280" strokeWidth="1" />
                      <path d="M30,75 C40,60 20,60 30,75 C40,90 20,90 30,75 Z" fill="none" stroke="#E6C280" strokeWidth="1" />
                      <path d="M70,125 C80,110 60,110 70,125 C80,140 60,140 70,125 Z" fill="none" stroke="#E6C280" strokeWidth="1" />
                      <path d="M30,125 C40,110 20,110 30,125 C40,140 20,140 30,125 Z" fill="none" stroke="#E6C280" strokeWidth="1" />
                      <line x1="70" y1="30" x2="70" y2="190" stroke="#D4AF37" strokeWidth="1" />
                      <line x1="50" y1="20" x2="50" y2="190" stroke="#D4AF37" strokeWidth="1" />
                      <line x1="30" y1="30" x2="30" y2="190" stroke="#D4AF37" strokeWidth="1" />
                      <path d="M90,190 Q80,140 88,90 T75,30" fill="none" stroke="#2D5A27" strokeWidth="2.5" />
                      <circle cx="85" cy="140" r="5" fill="#C24D5F" stroke="#9C2D3C" />
                      <circle cx="89" cy="95" r="4" fill="#C24D5F" stroke="#9C2D3C" />
                      <circle cx="80" cy="55" r="5" fill="#C24D5F" stroke="#9C2D3C" />
                    </svg>
                  </motion.div>

                  {/* Heart Padlock Lock */}
                  <motion.div 
                    animate={
                      envelopeOpen 
                        ? { y: 220, opacity: 0, scale: 0.8 } 
                        : { scale: [1, 1.04, 1], opacity: 1 }
                    }
                    transition={
                      envelopeOpen 
                        ? { duration: 0.8, ease: "easeIn" } 
                        : { repeat: Infinity, duration: 2.0, ease: "easeInOut" }
                    }
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                  >
                    <div className="w-14 h-18 sm:w-16 sm:h-[84px] flex flex-col items-center justify-center relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 border-[3px] border-amber-500 rounded-t-full absolute top-0 z-0"></div>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border border-amber-300 shadow-2xl absolute bottom-0 z-10 flex flex-col items-center justify-center ring-4 ring-amber-300/20">
                        <span className="text-[10px] sm:text-[11px] text-stone-900 font-serif font-black tracking-tight leading-none">{wedding.partner_one[0]}&{wedding.partner_two[0]}</span>
                        <div className="w-2.5 h-3.5 bg-stone-950 rounded-full mt-1 relative flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-stone-950 absolute bottom-0"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Animation 4: Storybook */}
              {activeAnimation === 'book' && (
                <>
                  {/* Left Book Cover */}
                  <motion.div 
                    initial={{ rotateY: 0, x: 0 }}
                    animate={
                      envelopeOpen 
                        ? { rotateY: -150, x: -30, opacity: 0, zIndex: 20 } 
                        : { rotateY: 0, x: 0, opacity: 1, zIndex: 30 }
                    }
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    style={{ transformOrigin: "0% 50%" }}
                    className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-gradient-to-r from-red-950 via-red-900 to-red-800 border-y border-l border-amber-500/50 shadow-2xl rounded-l-lg"
                  >
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay opacity-80" />
                    <div className="absolute inset-3 border border-amber-500/30 rounded flex flex-col items-end justify-center px-4">
                      <span className="absolute top-1 right-1 text-amber-500/60 text-lg">✦</span>
                      <span className="absolute bottom-1 right-1 text-amber-500/60 text-lg">✦</span>
                      <span className="text-amber-400 font-serif italic text-3xl font-bold opacity-80 select-none">OUR</span>
                      <span className="text-amber-400 font-serif italic text-2xl font-bold opacity-80 select-none">LOVE</span>
                    </div>
                  </motion.div>

                  {/* Right Book Cover */}
                  <motion.div 
                    initial={{ rotateY: 0, x: 0 }}
                    animate={
                      envelopeOpen 
                        ? { rotateY: 30, x: 30, opacity: 0, zIndex: 20 } 
                        : { rotateY: 0, x: 0, opacity: 1, zIndex: 30 }
                    }
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    style={{ transformOrigin: "100% 50%" }}
                    className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-gradient-to-l from-red-950 via-red-900 to-red-800 border-y border-r border-amber-500/50 shadow-2xl rounded-r-lg"
                  >
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay opacity-80" />
                    <div className="absolute inset-3 border border-amber-500/30 rounded flex flex-col items-start justify-center px-4">
                      <span className="absolute top-1 left-1 text-amber-500/60 text-lg">✦</span>
                      <span className="absolute bottom-1 left-1 text-amber-500/60 text-lg">✦</span>
                      <span className="text-amber-400 font-serif italic text-3xl font-bold opacity-80 select-none">STORY</span>
                      <span className="text-amber-400 font-serif italic text-lg font-bold opacity-80 select-none">✦</span>
                    </div>
                  </motion.div>

                  {/* Gold Book Clasp / Seal */}
                  <motion.div 
                    animate={
                      envelopeOpen 
                        ? { scale: 2, opacity: 0, y: 100, filter: "blur(4px)" } 
                        : { scale: [1, 1.03, 1], opacity: 1, filter: "blur(0px)" }
                    }
                    transition={
                      envelopeOpen 
                        ? { duration: 0.8, ease: "easeIn" } 
                        : { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
                    }
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center relative">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center ring-4 ring-amber-300/30">
                        <div className="absolute inset-1 border border-dashed border-amber-200/50 rounded-full animate-spin-slow"></div>
                        <span className="text-stone-900 font-serif text-lg font-black tracking-tighter drop-shadow-sm flex items-center gap-[2px]">
                          <span>{wedding.partner_one[0]}</span>
                          <span className="text-xs text-stone-900/60">♥</span>
                          <span>{wedding.partner_two[0]}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Animation 5: Velvet Curtains */}
              {activeAnimation === 'curtain' && (
                <>
                  {/* Left Velvet Curtain */}
                  <motion.div 
                    initial={{ x: 0 }}
                    animate={
                      envelopeOpen 
                        ? { x: "-100%", opacity: 0, scaleX: 0.8 } 
                        : { x: 0, opacity: 1, scaleX: 1 }
                    }
                    transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
                    style={{ transformOrigin: "left center" }}
                    className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-red-950 via-[#722F37] to-red-900 border-r-2 border-amber-500/40 shadow-2xl z-30 flex flex-col justify-between p-4 rounded-l-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                    <div className="h-full border-r border-dashed border-amber-500/10" />
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-amber-600 to-yellow-500 border-t border-amber-400" />
                  </motion.div>

                  {/* Right Velvet Curtain */}
                  <motion.div 
                    initial={{ x: 0 }}
                    animate={
                      envelopeOpen 
                        ? { x: "100%", opacity: 0, scaleX: 0.8 } 
                        : { x: 0, opacity: 1, scaleX: 1 }
                    }
                    transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
                    style={{ transformOrigin: "right center" }}
                    className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-red-950 via-[#722F37] to-red-900 border-l-2 border-amber-500/40 shadow-2xl z-30 flex flex-col justify-between p-4 rounded-r-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                    <div className="h-full border-l border-dashed border-amber-500/10" />
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-yellow-500 to-amber-600 border-t border-amber-400" />
                  </motion.div>

                  {/* Curtain Tie Rope / Gold Tassel */}
                  <motion.div 
                    animate={
                      envelopeOpen 
                        ? { y: -80, opacity: 0, scale: 0.5 } 
                        : { y: [0, 4, 0], opacity: 1 }
                    }
                    transition={
                      envelopeOpen 
                        ? { duration: 0.8, ease: "easeIn" } 
                        : { repeat: Infinity, duration: 3, ease: "easeInOut" }
                    }
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center ring-4 ring-amber-400/20">
                      <span className="text-stone-900 font-serif text-sm font-extrabold tracking-tight uppercase leading-none">OPERA</span>
                      <div className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-yellow-600 mt-1 shadow-md rounded-full animate-bounce"></div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Animation 6: Vintage Scroll */}
              {activeAnimation === 'scroll' && (
                <>
                  <motion.div 
                    animate={
                      envelopeOpen 
                        ? { scaleY: 0, opacity: 0, zIndex: 10 } 
                        : { scaleY: 1, opacity: 1, zIndex: 30 }
                    }
                    transition={{ duration: 0.8, ease: "easeIn" }}
                    className="absolute inset-0 bg-[#d9c5a0] border-y-8 border-amber-800 rounded-lg shadow-2xl flex flex-col items-center justify-center p-6"
                  >
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 border-b border-amber-950/40 rounded-t-md" />
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 border-t border-amber-950/40 rounded-b-md" />
                    
                    <div className="border border-dashed border-amber-800/20 rounded-md p-6 flex flex-col items-center justify-center">
                      <span className="text-amber-800 text-3xl mb-1">📜</span>
                      <span className="text-amber-900 font-serif italic text-sm font-semibold uppercase tracking-wider text-center">Royal Proclamation</span>
                    </div>

                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
                      className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-rose-700 to-rose-500 shadow-md flex items-center justify-center z-40"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border border-amber-300 shadow-xl flex items-center justify-center font-serif text-stone-900 font-black text-xs">
                        {wedding.partner_one[0]}&{wedding.partner_two[0]}
                      </div>
                    </motion.div>
                  </motion.div>
                </>
              )}

              {/* Animation 7: Blooming Rose */}
              {activeAnimation === 'rose' && (
                <>
                  <motion.div 
                    animate={
                      envelopeOpen 
                        ? { opacity: 0, scale: 0.9, zIndex: 10 } 
                        : { opacity: 1, scale: 1, zIndex: 30 }
                    }
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0 bg-stone-900/40 border border-white/10 rounded-3xl backdrop-blur-[2px] shadow-2xl flex flex-col items-center justify-center overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff7e5f]/10 via-transparent to-transparent pointer-events-none" />

                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <motion.div 
                        animate={
                          envelopeOpen 
                            ? { rotate: -130, x: -70, y: 30, scale: 1.3, opacity: 0 } 
                            : { rotate: 0, x: 0, y: 0, scale: 1, opacity: 1 }
                        }
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="w-14 h-20 absolute bg-gradient-to-b from-red-500 to-red-800 rounded-full border border-red-950/20 shadow-lg origin-bottom-right"
                      />

                      <motion.div 
                        animate={
                          envelopeOpen 
                            ? { rotate: 130, x: 70, y: 30, scale: 1.3, opacity: 0 } 
                            : { rotate: 0, x: 0, y: 0, scale: 1, opacity: 1 }
                        }
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="w-14 h-20 absolute bg-gradient-to-b from-red-500 to-red-800 rounded-full border border-red-950/20 shadow-lg origin-bottom-left"
                      />

                      <motion.div 
                        animate={
                          envelopeOpen 
                            ? { rotate: -30, y: -60, scale: 1.1, opacity: 0 } 
                            : { rotate: 0, y: 0, scale: 1, opacity: 1 }
                        }
                        transition={{ duration: 1.3, ease: "easeInOut" }}
                        className="w-12 h-18 absolute bg-gradient-to-b from-red-600 to-red-900 rounded-full border border-red-950/20 shadow-md origin-bottom z-0"
                      />

                      <motion.div 
                        animate={
                          envelopeOpen 
                            ? { scale: 1.6, opacity: 0, y: 80 } 
                            : { scale: [1, 1.05, 1], opacity: 0.95 }
                        }
                        transition={
                          envelopeOpen 
                            ? { duration: 0.8 } 
                            : { repeat: Infinity, duration: 2.0, ease: "easeInOut" }
                        }
                        className="w-12 h-16 absolute bg-gradient-to-b from-red-400 to-red-700 rounded-full border border-red-950/15 shadow-xl origin-bottom z-10 flex items-center justify-center"
                      >
                        <span className="text-[10px] text-white/45 font-serif select-none uppercase tracking-widest font-black">BLOOM</span>
                      </motion.div>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#e4a6a1] font-bold mt-4 animate-pulse select-none">Tap to Bloom</p>
                  </motion.div>
                </>
              )}
            </motion.div>

            <motion.p 
              animate={{ opacity: envelopeOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className={`mt-16 text-xs sm:text-sm tracking-[0.3em] uppercase opacity-60 ${theme.fontBody}`}
            >
              Tap to open
            </motion.p>
          </motion.main>
        ) : (
          <motion.main 
            key="content"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`w-full min-h-screen ${theme.bg} ${theme.text} font-sans overflow-x-hidden transition-colors duration-500`}
          >

      {/* 1. HERO SECTION (Polaroids & Title) */}
      <section className="pt-20 pb-12 px-6 flex flex-col items-center text-center relative max-w-4xl mx-auto">
        <div className={`absolute top-10 right-6 opacity-40 ${theme.accent}`}>
          <svg width="48" height="32" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="24" cy="20" r="16" />
            <circle cx="40" cy="20" r="16" />
          </svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className={`text-5xl sm:text-7xl font-black ${theme.fontTitle} tracking-tight uppercase leading-none mb-12`}
        >
          Let's Get<br/>{wedding.type === 'engagement' ? 'Engaged' : 'Married'}
        </motion.h1>

        <div className="flex justify-center gap-4 sm:gap-12 w-full mt-4">
          {/* Bride Polaroid */}
          <motion.div initial={{ opacity: 0, rotate: -10, x: -20 }} animate={{ opacity: 1, rotate: -4, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col items-center">
            <p className={`text-2xl sm:text-3xl italic ${theme.fontTitle} mb-3`}>{wedding.partner_one}</p>
            <div className={`p-2 pb-8 sm:p-3 sm:pb-12 shadow-xl rounded-sm border ${theme.border} ${theme.cardBg} w-36 sm:w-56 aspect-[3/4]`}>
              <img
                src={brideImg}
                alt="Bride"
                className={`w-full h-full object-cover rounded-sm ${!wedding.image_one_url ? 'grayscale contrast-125' : 'grayscale-[20%]'}`}
              />
            </div>
          </motion.div>

          {/* Groom Polaroid */}
          <motion.div initial={{ opacity: 0, rotate: 10, x: 20 }} animate={{ opacity: 1, rotate: 4, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col items-center mt-8 sm:mt-12">
            <p className={`text-2xl sm:text-3xl italic ${theme.fontTitle} mb-3`}>{wedding.partner_two}</p>
            <div className={`p-2 pb-8 sm:p-3 sm:pb-12 shadow-xl rounded-sm border ${theme.border} ${theme.cardBg} w-36 sm:w-56 aspect-[3/4]`}>
              <img
                src={groomImg}
                alt="Groom"
                className={`w-full h-full object-cover rounded-sm ${!wedding.image_two_url ? 'grayscale contrast-125' : 'grayscale-[20%]'}`}
              />
            </div>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className={`mt-16 text-3xl sm:text-4xl ${theme.fontTitle}`}>
          {wedding.partner_one} <span className={`px-2 ${theme.accent}`}>&</span> {wedding.partner_two}
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className={`flex justify-center gap-6 sm:gap-12 text-center mt-12 border-y py-6 border-opacity-20 max-w-xl mx-auto w-full ${theme.border}`}
        >
          {['Days', 'Hours', 'Mins'].map((unit, i) => (
            <div key={unit}>
              <p className={`text-3xl sm:text-5xl font-light ${theme.fontTitle}`}>
                {i === 0 ? timeLeft.days : i === 1 ? timeLeft.hours : timeLeft.minutes}
              </p>
              <p className={`text-xs uppercase tracking-widest opacity-60 mt-2 ${theme.fontBody}`}>{unit}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 2. WELCOME MESSAGE */}
      <section className="py-16 px-6 max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }}>
          <h2 className={`text-5xl sm:text-6xl mb-6 italic ${theme.fontTitle}`}>Dear Guests!</h2>
          <div className={`flex justify-center mb-8 opacity-60 ${theme.accent}`}>
            <svg width="32" height="20" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="24" cy="20" r="16" />
              <circle cx="40" cy="20" r="16" />
            </svg>
          </div>
          <p className={`text-lg sm:text-xl leading-relaxed opacity-90 px-4 whitespace-pre-wrap ${theme.fontBody}`}>
            {wedding.message ? (
              wedding.message
            ) : wedding.type === 'engagement' ? (
              "We are thrilled to announce our engagement! Please join us for a celebration of love, laughter, and our new chapter together. We can't wait to share this beautiful milestone with our dearest friends and family."
            ) : (
              "Something wonderful is about to happen in our lives. We would be so happy to share this special day with the people who matter most to us — our family and dearest friends. Please join us as we celebrate the beginning of our forever."
            )}
          </p>
        </motion.div>
      </section>

      {/* 3. CALENDAR */}
      <section className="py-16 px-6 relative max-w-3xl mx-auto text-center">
        <span className={`absolute top-10 left-10 text-2xl ${theme.accent}`}>✦</span>
        <span className={`absolute bottom-20 right-10 text-xl ${theme.accent}`}>✦</span>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className={`text-6xl sm:text-8xl tracking-widest uppercase font-black ${theme.fontTitle}`}>{monthName}</h2>
          <p className={`text-xl sm:text-2xl mt-4 italic ${theme.fontTitle} opacity-80`}>{yearText}</p>
          <div className={`flex justify-center items-center gap-4 sm:gap-8 my-16 text-3xl sm:text-5xl font-black ${theme.fontTitle}`}>
            {daysAround.map((d, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={d.isTarget ? "relative flex items-center justify-center scale-125 mx-2" : "opacity-70"}
              >
                {d.isTarget ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md ${theme.accent}`}>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="absolute text-white mix-blend-difference text-xl sm:text-2xl z-10 font-bold">{d.dayNum}</span>
                  </>
                ) : (
                  <span>{d.dayNum}</span>
                )}
              </motion.div>
            ))}
          </div>
          <p className={`text-2xl sm:text-3xl italic ${theme.fontTitle}`}>{dayName}, {monthName} {weddingDate.getDate()}, {weddingDate.getFullYear()}</p>
        </motion.div>
      </section>

      {/* 4. LOCATION */}
      <section className="py-16 px-6 max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className={`text-5xl sm:text-7xl tracking-wide uppercase font-black mb-6 ${theme.fontTitle}`}>Location</h2>
          <p className={`text-3xl mb-6 italic ${theme.fontTitle}`}>{wedding.location}</p>
          <p className={`text-lg sm:text-xl leading-relaxed opacity-90 px-4 mb-8 ${theme.fontBody}`}>
            An open-air {wedding.type === 'engagement' ? 'engagement' : 'wedding'} venue tucked among olive trees and warm string lights, just outside the heart of {wedding.location}.
          </p>

          {wedding.location_url && (
            <div className="mb-10">
              <a 
                href={wedding.location_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 transition-all hover:scale-105 tracking-[0.1em] uppercase text-xs sm:text-sm shadow-xl font-bold bg-white text-stone-800 border-transparent hover:shadow-2xl`}
              >
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View on Map
              </a>
            </div>
          )}

          {wedding.location_url && (
            <div className="w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden shadow-2xl relative bg-stone-200">
              <iframe 
                src={(() => {
                  let q = wedding.location;
                  let ftid = '';
                  const resolvedUrl = wedding.resolved_location_url || wedding.location_url;
                  
                  if (resolvedUrl) {
                    // Extract ftid (Feature ID) if present in the URL
                    const ftidMatch = resolvedUrl.match(/[?&]ftid=([^&]+)/);
                    if (ftidMatch && ftidMatch[1]) {
                      try {
                        ftid = decodeURIComponent(ftidMatch[1]);
                      } catch {
                        ftid = ftidMatch[1];
                      }
                    }

                    if (resolvedUrl.includes('query=')) {
                      const m = resolvedUrl.match(/query=([^&]+)/);
                      if (m && m[1]) {
                        try {
                          q = decodeURIComponent(m[1]);
                        } catch {
                          q = m[1];
                        }
                      }
                    } else if (resolvedUrl.includes('q=')) {
                      const m = resolvedUrl.match(/q=([^&]+)/);
                      if (m && m[1]) {
                        try {
                          q = decodeURIComponent(m[1]);
                        } catch {
                          q = m[1];
                        }
                      }
                    } else {
                      // Extract coordinates from @lat,lng pattern if present
                      const atCoordMatch = resolvedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                      if (atCoordMatch) {
                        q = `${atCoordMatch[1]},${atCoordMatch[2]}`;
                      } else {
                        // If it's a general URL and no coordinates found, fallback to location name
                        q = wedding.location;
                      }
                    }
                  }

                  let embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
                  if (ftid) {
                    embedUrl += `&ftid=${ftid}`;
                  }
                  return embedUrl;
                })()}
                className="w-full h-full border-0 grayscale-[20%]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className={`absolute inset-0 ${theme.bg} mix-blend-overlay opacity-30 pointer-events-none`}></div>
            </div>
          )}
        </motion.div>
      </section>

      {/* 4.5 DRESS CODE */}
      {wedding.dress_code && wedding.dress_code.length > 0 && (
      <section className="py-16 px-6 max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className={`text-4xl sm:text-6xl tracking-wide uppercase font-black mb-6 ${theme.fontTitle}`}>Dress Code</h2>
          <p className={`text-lg sm:text-xl leading-relaxed opacity-90 px-4 mb-8 ${theme.fontBody}`}>
            We would love it if you wore these colors to our special day!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {wedding.dress_code.map((color: string, i: number) => (
              <div key={i} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-lg border-2 border-white/20" style={{ backgroundColor: color }}></div>
            ))}
          </div>
        </motion.div>
      </section>
      )}

      {/* 5. OUTRO */}
      <section className="py-20 px-6 max-w-xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className={`flex justify-center mb-8 opacity-60 ${theme.accent}`}>
            <svg width="40" height="24" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="24" cy="20" r="16" /><circle cx="40" cy="20" r="16" />
            </svg>
          </div>
          <p className={`text-3xl mb-6 italic ${theme.fontTitle}`}>With love,</p>
          <h2 className={`text-6xl sm:text-8xl tracking-widest font-black drop-shadow-sm mb-12 ${theme.fontTitle}`}>
            {wedding.partner_one} <span className="text-5xl">&</span> {wedding.partner_two}
          </h2>
          <p className={`text-sm tracking-[0.2em] uppercase opacity-60 mb-12 ${theme.fontBody}`}>
            {weddingDate.toLocaleDateString('en-GB').replace(/\//g, ' • ')} — {wedding.location}
          </p>

          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={`px-8 py-3 rounded-full border border-current hover:opacity-70 transition-opacity tracking-[0.1em] uppercase text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 mx-auto ${theme.fontBody}`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Link Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Invitation
              </>
            )}
          </button>

          <div className="mt-16 pt-8 border-t border-current border-opacity-10 max-w-xs mx-auto">
            <p className={`text-xs uppercase tracking-widest opacity-50 mb-4 ${theme.fontBody}`}>Want an invitation like this?</p>
            <a 
              href="/" 
              className={`inline-block px-8 py-3 rounded-full border border-current hover:opacity-70 transition-opacity tracking-[0.1em] uppercase text-xs sm:text-sm shadow-sm ${theme.fontBody}`}
            >
              Create Your Own
            </a>
          </div>
        </motion.div>
      </section>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}