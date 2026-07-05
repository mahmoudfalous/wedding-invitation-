'use client';

import { motion } from 'framer-motion';
import { ThemeConfig } from '@/app/constants/themes';

interface Props {
  theme: ThemeConfig;
  monthName: string;
  yearText: string;
  daysAround: { dayNum: number; isTarget: boolean }[];
  dayName: string;
  weddingDate: Date;
  langConfig: {
    lang: 'en' | 'ar';
    isAr: boolean;
    dir: 'ltr' | 'rtl';
    fontTitle: string;
    fontBody: string;
    t: Record<string, string>;
  };
}

export default function CalendarSection({
  theme,
  monthName,
  yearText,
  daysAround,
  dayName,
  weddingDate,
  langConfig
}: Props) {
  const { isAr, dir, fontTitle, t } = langConfig;

  // Always use English numerals for dates
  const formattedFullDate = `${dayName}, ${monthName} ${weddingDate.getDate()}, ${weddingDate.getFullYear()}`;

  return (
    <>
      {/* 3. CALENDAR */}
      <section dir={dir} className="py-24 px-6 relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="border-t border-b border-opacity-10 border-current py-16"
        >
          {/* Subtle star elements */}
          <div className={`text-xl opacity-30 ${theme.accent} mb-6`}>✦</div>

          <h2 className={`text-5xl sm:text-7xl tracking-widest uppercase font-black ${fontTitle}`}>{monthName}</h2>
          <p className={`text-xl sm:text-2xl mt-4 italic ${fontTitle} opacity-80`}>{yearText}</p>
          
          <div className={`flex justify-center items-center gap-3 my-8 opacity-70 ${theme.accent} flex-row`}>
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-current" />
            <span className={`text-xs tracking-widest uppercase ${fontTitle}`}>{t.saveTheDate}</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-current" />
          </div>

          <div className={`flex justify-center items-center gap-4 sm:gap-8 my-12 text-3xl sm:text-5xl font-black ${fontTitle} flex-row`}>
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
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="relative flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md ${theme.accent}`}>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="absolute text-white mix-blend-difference text-xl sm:text-2xl z-10 font-bold">{d.dayNum}</span>
                    <motion.div
                      animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border border-pink-400 pointer-events-none"
                    />
                  </motion.div>
                ) : (
                  <span>{d.dayNum}</span>
                )}
              </motion.div>
            ))}
          </div>
          <p className={`text-2xl sm:text-3xl italic ${fontTitle}`}>{formattedFullDate}</p>
        </motion.div>
      </section>

      {/* ROMANTIC QUOTE DIVIDER 2 */}
      <section dir={dir} className="py-12 px-6 max-w-xl mx-auto text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.65, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center gap-4"
        >
          <p className={`italic text-lg sm:text-xl text-stone-500 dark:text-stone-400 ${isAr ? fontTitle : 'font-serif'}`}>
            {t.quote2}
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 opacity-60" />
        </motion.div>
      </section>
    </>
  );
}
