// app/not-found.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  const [stars, setStars] = useState<{ top: string; left: string; size: number; delay: number }[]>([]);

  // Hydration-safe random position generation for background stars
  useEffect(() => {
    const generatedStars = [...Array(12)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.8, // size in rem
      delay: Math.random() * 4,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <main className="min-h-screen bg-[#fdfbf7] text-[#5c3a21] relative overflow-hidden flex flex-col items-center justify-center px-6 py-12 select-none">
      {/* React 19 Document Metadata Hoisting */}
      <title>Invitation Not Found | ForeverInvites</title>
      <meta name="description" content="We searched the stars, but this invitation couldn't be found. Create your own beautiful wedding or engagement invitation on ForeverInvites." />

      {/* Decorative background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-[5%] w-80 h-80 bg-[#e4a6a1]/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-[5%] w-96 h-96 bg-[#8a4b3b]/8 rounded-full blur-3xl"
        />
      </div>

      {/* Twinkling Stars Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0.1, scale: 0.8 }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut"
            }}
            style={{
              top: star.top,
              left: star.left,
              fontSize: `${star.size}rem`
            }}
            className="absolute text-[#e4a6a1]/40"
          >
            ✦
          </motion.div>
        ))}
      </div>

      {/* Main Content Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-xl text-center z-10"
      >
        {/* Poetic Pre-title */}
        <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-[#8a6b52] mb-6 block">
          Chapter Not Found • 404 Error
        </span>

        {/* Floating Interactive Lost Envelope Card */}
        <motion.div
          id="notfound-interactive-envelope"
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto w-[290px] h-[200px] sm:w-[380px] sm:h-[260px] cursor-pointer group mb-12"
          style={{ perspective: "1000px" }}
        >
          {/* Card Glass Container */}
          <div className="absolute inset-0 rounded-[2rem] bg-white/40 backdrop-blur-md shadow-2xl border border-[#eadecc] transition-all duration-500 group-hover:shadow-[#e4a6a1]/25 group-hover:border-[#e4a6a1]/50 group-hover:scale-[1.02] flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Elegant SVG Envelope outline */}
            <svg
              className="absolute inset-0 w-full h-full text-[#8a6b52]/10 transition-colors group-hover:text-[#e4a6a1]/10 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M 0 0 L 50 45 L 100 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 0 100 L 40 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 100 100 L 60 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>

            {/* Inner elegant decorative frame */}
            <div className="absolute inset-3 border border-dashed border-[#eadecc]/60 rounded-[1.5rem] pointer-events-none flex flex-col items-center justify-center">
              <span className="text-[12px] tracking-[0.2em] uppercase opacity-40 font-body mb-2 text-[#8a6b52]">An Invitation Left in the Wind</span>
              
              {/* Calligraphy 404 */}
              <h2 className="text-5xl sm:text-6xl font-serif italic text-[#8a4b3b] font-light leading-none my-1 tracking-wider">
                404
              </h2>

              {/* Romantic broken wax seal */}
              <div className="mt-4 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#8a4b3b]/10 border border-[#8a4b3b]/30 flex items-center justify-center group-hover:bg-[#8a4b3b]/20 group-hover:border-[#8a4b3b]/50 transition-all duration-300">
                  <span className="text-[#8a4b3b] text-base">♥</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Poetic Romantic Message */}
        <h1 className="text-4xl sm:text-5xl font-serif leading-tight text-[#5c3a21] mb-6 italic">
          "The love story is still <br/>
          <span className="text-[#e4a6a1]">being written...</span>"
        </h1>

        <p className="max-w-md mx-auto text-base sm:text-lg font-body font-light text-[#8a6b52] leading-relaxed mb-10 italic px-4">
          We searched the stars, but we couldn't find this invitation. The link might have expired, or perhaps the happy couple is still putting the final, magical touches on their special day.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            id="notfound-btn-create"
            href="/create"
            className="w-full sm:w-auto group relative inline-flex items-center justify-center bg-[#8a4b3b] text-white px-10 py-4 rounded-full text-sm font-medium transition-all shadow-xl hover:shadow-[#8a4b3b]/40 hover:-translate-y-1 active:translate-y-0 duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Own Invitation
              <span className="transition-transform duration-300 group-hover:translate-x-1">✦</span>
            </span>
            <motion.div
              whileHover={{ x: "100%" }}
              initial={{ x: "-100%" }}
              className="absolute inset-0 bg-white/10 skew-x-12 transition-transform duration-500"
            />
          </Link>

          <Link
            id="notfound-btn-home"
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-[#eadecc] hover:border-[#8a4b3b] text-[#8a6b52] hover:text-[#8a4b3b] px-10 py-4 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 duration-300"
          >
            Return Home
          </Link>
        </div>

        {/* Little decorative stars footer */}
        <div className="mt-16 flex justify-center gap-3 text-[#e4a6a1]/50">
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>
      </motion.div>
    </main>
  );
}
