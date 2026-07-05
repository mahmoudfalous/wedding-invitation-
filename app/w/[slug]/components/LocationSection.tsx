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

export default function LocationSection({ wedding, theme, langConfig }: Props) {
  const { isAr, dir, fontTitle, fontBody, t } = langConfig;

  return (
    <>
      {/* 4. LOCATION */}
      <section dir={dir} className="py-24 px-6 max-w-3xl mx-auto text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }} 
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Accent decoration */}
          <div className={`text-xl opacity-30 ${theme.accent} mb-6`}>✦</div>

          <h2 className={`text-4xl sm:text-5xl italic ${fontTitle} mb-4 text-rose-800 dark:text-rose-100 font-light`}>
            {t.location}
          </h2>
          <p className={`text-3xl mb-6 font-serif italic text-stone-700 dark:text-stone-300 ${isAr ? fontTitle : ''}`}>{wedding.location}</p>
          <p className={`text-lg sm:text-xl leading-relaxed opacity-85 px-4 mb-8 ${fontBody}`}>
            {isAr ? t.venueDesc : `An open-air ${wedding.type === 'engagement' ? 'engagement' : 'wedding'} venue tucked among olive trees and warm string lights, just outside the heart of ${wedding.location}.`}
          </p>

          {wedding.location_url && (
            <div className="mb-10">
              <a 
                href={wedding.location_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 transition-all hover:scale-105 tracking-[0.1em] uppercase text-xs sm:text-sm shadow-xl font-bold bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-transparent hover:shadow-2xl flex-row`}
              >
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.viewOnMap}
              </a>
            </div>
          )}

          {wedding.location_url && (
            <div className="w-full aspect-[4/3] sm:aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-stone-200 border-4 border-white dark:border-stone-900">
              <iframe 
                src={(() => {
                  let q = wedding.location;
                  let ftid = '';
                  const resolvedUrl = wedding.resolved_location_url || wedding.location_url;
                  
                  if (resolvedUrl) {
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
                      const atCoordMatch = resolvedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                      if (atCoordMatch) {
                        q = `${atCoordMatch[1]},${atCoordMatch[2]}`;
                      } else {
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

      {/* ROMANTIC QUOTE DIVIDER 3 */}
      <section dir={dir} className="py-12 px-6 max-w-xl mx-auto text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.65, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center gap-4"
        >
          <p className={`italic text-lg sm:text-xl text-stone-500 dark:text-stone-400 ${isAr ? fontTitle : 'font-serif'}`}>
            {t.quote3}
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 opacity-60" />
        </motion.div>
      </section>
    </>
  );
}
