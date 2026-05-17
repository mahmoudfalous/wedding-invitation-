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

export default function AnimatedInvitation({ wedding, theme }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [showContent, setShowContent] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
    }, 2800);
  };

  const { scrollYProgress } = useScroll();
  const scaleImage = useTransform(scrollYProgress, [0.5, 1], [1, 1.15]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.main
            key="intro"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`w-full min-h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.text} fixed inset-0 z-50 overflow-hidden`}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-[320px] h-[220px] sm:w-[420px] sm:h-[280px] cursor-pointer mt-12"
              onClick={handleOpenEnvelope}
              style={{ perspective: "1000px" }}
            >
              {/* Back inside of Envelope */}
              <div className={`absolute inset-0 rounded-md shadow-2xl ${theme.cardBg} brightness-95 border ${theme.border}`}></div>

              {/* The Letter inside */}
              <motion.div 
                initial={{ y: 0 }}
                animate={envelopeOpen ? { y: -200, scale: 1.05, zIndex: 30 } : { y: 0 }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                className={`absolute inset-x-3 top-3 bottom-3 ${theme.bg} shadow-md flex flex-col items-center justify-center p-4 z-10 border ${theme.border} rounded-sm`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-40 ${theme.accent}`}>
                  {wedding.type === 'engagement' ? (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                  ) : (
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  )}
                </div>
                <h3 className={`text-2xl sm:text-3xl italic text-center ${theme.fontTitle} mb-2`}>
                  {wedding.partner_one} & {wedding.partner_two}
                </h3>
                <p className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase opacity-50 ${theme.fontBody}`}>Formal {wedding.type === 'engagement' ? 'Engagement' : 'Wedding'} Invitation</p>
              </motion.div>

              {/* Envelope Body (Bottom, Left, Right flaps) */}
              <div 
                className={`absolute inset-0 z-20 pointer-events-none ${theme.cardBg} brightness-105 drop-shadow-xl rounded-b-md`}
                style={{ clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }}
              >
                 <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" preserveAspectRatio="none">
                   <line x1="0" y1="0" x2="50%" y2="55%" stroke="currentColor" strokeWidth="3" />
                   <line x1="100%" y1="0" x2="50%" y2="55%" stroke="currentColor" strokeWidth="3" />
                 </svg>
              </div>

              {/* Top Flap */}
              <motion.div 
                initial={{ rotateX: 0 }}
                animate={envelopeOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformOrigin: "top", clipPath: "polygon(0 0, 100% 0, 50% 55%)" }}
                className={`absolute top-0 left-0 right-0 h-full z-30 ${theme.cardBg} brightness-100 drop-shadow-md origin-top`}
              >
                 <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" preserveAspectRatio="none">
                   <line x1="0" y1="0" x2="50%" y2="55%" stroke="currentColor" strokeWidth="3" />
                   <line x1="100%" y1="0" x2="50%" y2="55%" stroke="currentColor" strokeWidth="3" />
                 </svg>
              </motion.div>

              {/* Wax Seal */}
              <AnimatePresence>
                {!envelopeOpen && (
                  <motion.div 
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg flex items-center justify-center border ring-2 ${wedding.type === 'engagement' ? 'bg-indigo-800 border-indigo-950/30 ring-indigo-900/20' : 'bg-rose-800 border-rose-950/30 ring-rose-900/20'}`}>
                      <span className="text-white/90 font-serif italic text-2xl sm:text-3xl drop-shadow-sm">
                        {wedding.partner_one[0]}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.p 
              animate={{ opacity: envelopeOpen ? 0 : 1 }}
              className={`mt-16 text-xs sm:text-sm tracking-[0.3em] uppercase opacity-60 ${theme.fontBody}`}
            >
              Tap to open envelope
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
          <p className={`text-lg sm:text-xl leading-relaxed opacity-90 px-4 mb-10 ${theme.fontBody}`}>
            An open-air {wedding.type === 'engagement' ? 'engagement' : 'wedding'} venue tucked among olive trees and warm string lights, just outside the heart of {wedding.location}.
          </p>
          <div className="w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden shadow-2xl relative">
            <motion.img 
              style={{ scale: scaleImage }}
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
              alt="Venue" 
              className="w-full h-full object-cover grayscale-[30%] origin-bottom" 
            />
            <div className={`absolute inset-0 ${theme.bg} mix-blend-overlay opacity-30`}></div>
          </div>
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