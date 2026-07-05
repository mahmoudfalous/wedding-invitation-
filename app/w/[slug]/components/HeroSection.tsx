'use client';

import { motion } from 'framer-motion';
import { ThemeConfig } from '@/app/constants/themes';

interface Props {
  wedding: any;
  theme: ThemeConfig;
  timeLeft: { days: number; hours: number; minutes: number };
  brideImg: string;
  groomImg: string;
  langConfig: {
    lang: 'en' | 'ar';
    isAr: boolean;
    dir: 'ltr' | 'rtl';
    fontTitle: string;
    fontBody: string;
    t: Record<string, string>;
  };
}

export default function HeroSection({ wedding, theme, timeLeft, brideImg, groomImg, langConfig }: Props) {
  const { isAr, dir, fontTitle, fontBody, t } = langConfig;

  return (
    <section dir={dir} className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative pt-12 sm:pt-20">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`text-xs uppercase tracking-[0.3em] mb-6 ${fontBody}`}
      >
        {wedding.type === 'engagement' ? t.typeEngagement : t.typeWedding}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={`text-5xl sm:text-7xl font-black ${fontTitle} tracking-tight uppercase leading-none mb-12`}
      >
        {wedding.type === 'engagement' ? t.letsGetEngaged : t.letsGetMarried}
      </motion.h1>

      <div className="flex justify-center gap-4 sm:gap-12 w-full mt-4 flex-row">
        {/* Partner One Polaroid */}
        <motion.div
          initial={{ opacity: 0, rotate: -10, x: -20 }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: [-4, -2, -4],
            y: [0, -8, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.2 },
            x: { duration: 0.8, delay: 0.2 },
            rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
            y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
          }}
          className="flex flex-col items-center"
        >
          <p className={`text-2xl sm:text-3xl italic ${fontTitle} mb-3`}>{wedding.partner_one}</p>
          <div className={`p-2 pb-8 sm:p-3 sm:pb-12 shadow-xl rounded-sm border ${theme.border} ${theme.cardBg} w-36 sm:w-56 aspect-[3/4]`}>
            <img
              src={brideImg}
              alt={wedding.partner_one}
              className={`w-full h-full object-cover rounded-sm ${!wedding.image_one_url ? 'grayscale contrast-125' : 'grayscale-[20%]'}`}
            />
          </div>
        </motion.div>

        {/* Partner Two Polaroid */}
        <motion.div
          initial={{ opacity: 0, rotate: 10, x: 20 }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: [4, 6, 4],
            y: [0, -10, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4 },
            x: { duration: 0.8, delay: 0.4 },
            rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
            y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }
          }}
          className="flex flex-col items-center mt-8 sm:mt-12"
        >
          <p className={`text-2xl sm:text-3xl italic ${fontTitle} mb-3`}>{wedding.partner_two}</p>
          <div className={`p-2 pb-8 sm:p-3 sm:pb-12 shadow-xl rounded-sm border ${theme.border} ${theme.cardBg} w-36 sm:w-56 aspect-[3/4]`}>
            <img
              src={groomImg}
              alt={wedding.partner_two}
              className={`w-full h-full object-cover rounded-sm ${!wedding.image_two_url ? 'grayscale contrast-125' : 'grayscale-[20%]'}`}
            />
          </div>
        </motion.div>
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className={`mt-16 text-3xl sm:text-4xl ${fontTitle}`}>
        {wedding.partner_one} <span className={`px-2 ${theme.accent}`}>{isAr ? "و" : "&"}</span> {wedding.partner_two}
      </motion.p>

      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className={`flex justify-center gap-6 sm:gap-12 text-center mt-12 border-y py-6 border-opacity-20 max-w-xl mx-auto w-full ${theme.border} flex-row`}
      >
        {[
          { label: t.days, val: timeLeft.days },
          { label: t.hours, val: timeLeft.hours },
          { label: t.mins, val: timeLeft.minutes }
        ].map((unit, i) => (
          <div key={i} className="flex-1">
            <p className={`text-3xl sm:text-5xl font-light ${fontTitle}`}>
              {unit.val}
            </p>
            <p className={`text-xs uppercase tracking-widest opacity-60 mt-2 ${fontBody}`}>{unit.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
