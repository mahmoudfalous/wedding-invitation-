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

export default function DressCodeSection({ wedding, theme, langConfig }: Props) {
  const { isAr, dir, fontTitle, fontBody, t } = langConfig;

  if (!wedding.dress_code || wedding.dress_code.length === 0) return null;

  return (
    <>
      {/* 4.5 DRESS CODE */}
      <section dir={dir} className="py-24 px-6 max-w-3xl mx-auto text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }} 
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Accent decoration */}
          <div className={`text-xl opacity-30 ${theme.accent} mb-6`}>✦</div>

          <h2 className={`text-4xl sm:text-5xl italic ${fontTitle} mb-6 text-rose-800 dark:text-rose-100 font-light`}>
            {t.dressCode}
          </h2>
          <p className={`text-lg sm:text-xl leading-relaxed opacity-85 px-4 mb-8 ${fontBody}`}>
            {t.dressCodeDesc}
          </p>
          <div className="flex justify-center gap-6 flex-wrap mt-6 flex-row">
            {wedding.dress_code.map((color: string, i: number) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg border-2 border-white dark:border-stone-900 transform hover:scale-110 transition-transform duration-300" style={{ backgroundColor: color }}></div>
                <span className="text-[10px] uppercase opacity-70 tracking-widest font-mono font-bold">{color}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ROMANTIC QUOTE DIVIDER 4 */}
      <section dir={dir} className="py-12 px-6 max-w-xl mx-auto text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.65, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center gap-4"
        >
          <p className={`italic text-lg sm:text-xl text-stone-500 dark:text-stone-400 ${isAr ? fontTitle : 'font-serif'}`}>
            {t.quote4}
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 opacity-60" />
        </motion.div>
      </section>
    </>
  );
}
