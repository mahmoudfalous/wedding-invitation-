'use client';

import { motion } from 'framer-motion';
import { ThemeConfig } from '@/app/constants/themes';

interface Props {
  wedding: any;
  theme: ThemeConfig;
  langConfig: {
    lang: 'en' | 'ar';
    isAr: boolean;
    dir: 'ltr' | 'rtl';
    fontTitle: string;
    fontBody: string;
    t: Record<string, string>;
  };
}

export default function WelcomeSection({ wedding, theme, langConfig }: Props) {
  const { isAr, dir, fontTitle, fontBody, t } = langConfig;

  return (
    <>
      {/* 2. WELCOME MESSAGE */}
      <section dir={dir} className="py-24 px-6 max-w-2xl mx-auto text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }} 
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Gentle Romantic Accent Indicator */}
          <div className="flex justify-center items-center gap-4 mb-8 opacity-40">
            <div className="w-16 h-px bg-current opacity-30" />
            <span className={`text-xl ${theme.accent}`}>✦</span>
            <div className="w-16 h-px bg-current opacity-30" />
          </div>

          <h2 className={`text-4xl sm:text-5xl italic ${fontTitle} mb-8 text-rose-800 dark:text-rose-100 font-light`}>
            {t.dearGuests}
          </h2>

          <p className={`text-xl sm:text-2xl leading-relaxed opacity-85 px-4 whitespace-pre-wrap font-serif italic text-stone-700 dark:text-stone-300 ${isAr ? fontTitle : ''}`}>
            {wedding.message ? (
              wedding.message
            ) : wedding.type === 'engagement' ? (
              t.defaultEngagementMsg
            ) : (
              t.defaultWeddingMsg
            )}
          </p>
        </motion.div>
      </section>

      {/* ROMANTIC QUOTE DIVIDER 1 */}
      <section dir={dir} className="py-12 px-6 max-w-xl mx-auto text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.65, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center gap-4"
        >
          <p className={`italic text-lg sm:text-xl text-stone-500 dark:text-stone-400 ${isAr ? fontTitle : 'font-serif'}`}>
            {t.quote1}
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 opacity-60" />
        </motion.div>
      </section>
    </>
  );
}
