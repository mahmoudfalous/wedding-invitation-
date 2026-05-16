// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [stars, setStars] = useState<{ top: string; left: string }[]>([]);

  // Fix Hydration Mismatch by generating random positions only on the client
  useEffect(() => {
    const generatedStars = [...Array(8)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
    setStars(generatedStars);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <main className="bg-[#fdfbf7] text-[#5c3a21] overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-72 h-72 bg-[#e4a6a1]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -40, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-[10%] w-96 h-96 bg-[#8a4b3b]/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.span variants={fadeInUp} className="uppercase tracking-[0.5em] text-[10px] font-bold text-[#8a6b52] mb-6 block">
            Est. 2026 • Your Journey Begins
          </motion.span>

          <motion.h1 variants={fadeInUp} className="text-7xl md:text-9xl font-serif leading-none mb-8">
            Tell Your <br />
            <motion.span
              initial={{ backgroundPosition: "200% 0" }}
              animate={{ backgroundPosition: "0% 0" }}
              transition={{ duration: 2, delay: 0.5 }}
              className="italic font-light text-[#e4a6a1] bg-gradient-to-r from-[#e4a6a1] via-[#8a4b3b] to-[#e4a6a1] bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Love Story
            </motion.span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="max-w-md mx-auto text-lg md:text-xl font-serif italic text-[#8a6b52] leading-relaxed mb-10">
            "A wedding invitation is the first chapter of your forever." <br />
            Create yours in an instant, keep it for a lifetime.
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Link href="/create" className="group relative inline-block bg-[#8a4b3b] text-white px-12 py-5 rounded-full text-sm font-medium transition-all shadow-xl hover:shadow-[#8a4b3b]/40 hover:-translate-y-1 duration-300 overflow-hidden">
              <span className="relative z-10">Start Designing — Free</span>
              <motion.div
                whileHover={{ x: "100%" }}
                initial={{ x: "-100%" }}
                className="absolute inset-0 bg-white/10 skew-x-12 transition-transform duration-500"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <span className="text-[10px] tracking-widest uppercase font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-12 bg-[#8a4b3b]"
          />
        </motion.div>
      </section>

      {/* --- PREVIEW GALLERY --- */}
      <section className="py-24 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="md:mt-12 space-y-8"
            >
              <h2 className="text-5xl font-serif italic leading-tight">Every detail, <br/> <span className="text-[#e4a6a1]">crafted</span> with love.</h2>
              <p className="text-[#8a6b52] text-lg leading-relaxed font-serif">We believe your invitation should be as unique as your bond. Choose from hand-picked themes designed for the modern couple.</p>
            </motion.div>

            {/* Floating Image 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative group overflow-hidden rounded-2xl shadow-2xl aspect-[3/4]"
            >
              <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" alt="Wedding Detail" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-[#7a3e30]/10" />
            </motion.div>

            {/* Floating Image 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="relative group overflow-hidden rounded-2xl shadow-2xl aspect-[3/4] md:-mt-12"
            >
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop" alt="Couple" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-[#7a3e30]/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- THREE SIMPLE STEPS --- */}
      <section className="py-32 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl md:text-6xl font-serif mb-20 text-[#5c3a21]"
        >
          Your Journey in <span className="italic text-[#e4a6a1]">Three Steps</span>
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto"
        >
          {[
            { step: "01", title: "Fill the Details", desc: "Add your names, date, and that special location where it all happens." },
            { step: "02", title: "Upload Your Portraits", desc: "Share your favorite moments together to greet your guests with a smile." },
            { step: "03", title: "Share Your Link", desc: "Get an instant, beautiful URL to send to your family and dearest friends." }
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="flex flex-col items-center group">
              <motion.span
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-7xl font-serif italic text-[#e4a6a1]/20 mb-4 transition-colors group-hover:text-[#e4a6a1]/40"
              >
                {item.step}
              </motion.span>
              <h3 className="text-xl font-bold mb-3 uppercase tracking-widest">{item.title}</h3>
              <p className="text-[#8a6b52] leading-relaxed italic text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- ROMANTIC CTA --- */}
      <section className="py-40 bg-[#8a4b3b] text-[#fdfbf7] text-center px-6 relative overflow-hidden">
        {/* Animated stars/particles - Hydration Safe */}
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
        >
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute text-white/20 text-2xl"
              style={{ top: star.top, left: star.left }}
            >✦</div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <h2 className="text-6xl md:text-8xl font-serif mb-8 italic leading-tight">Ready to announce your forever?</h2>
          <p className="text-2xl opacity-80 mb-12 font-serif italic">No accounts, no credit cards, just love.</p>
          <Link href="/create" className="inline-block bg-[#fdfbf7] text-[#8a4b3b] px-16 py-6 rounded-full text-lg font-bold hover:bg-white transition-all shadow-2xl hover:-translate-y-2 active:scale-95 duration-300">
            Create Free Invitation
          </Link>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 border-t border-[#eadecc] text-center bg-[#fdfbf7]">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a6b52] font-bold">
            © {currentYear} ForeverInvites • Handcrafted by MaNo
          </p>
          <div className="mt-4 flex justify-center gap-4 text-[#e4a6a1] opacity-50">
            <span>✦</span><span>✦</span><span>✦</span>
          </div>
        </motion.div>
      </footer>
    </main>
  );
}