'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ThemeConfig } from '@/app/constants/themes';

interface Props {
  wedding: any;
  theme: ThemeConfig;
  rsvpSubmitted: boolean;
  setRsvpSubmitted: (val: boolean) => void;
  rsvpAttending: boolean | null;
  setRsvpAttending: (val: boolean | null) => void;
  rsvpName: string;
  setRsvpName: (val: string) => void;
  rsvpGuestsCount: number;
  setRsvpGuestsCount: (val: number) => void;
  rsvpNotes: string;
  setRsvpNotes: (val: string) => void;
  rsvpLoading: boolean;
  rsvpError: string;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  langConfig: {
    lang: 'en' | 'ar';
    isAr: boolean;
    dir: 'ltr' | 'rtl';
    fontTitle: string;
    fontBody: string;
    t: Record<string, string>;
  };
}

export default function RsvpSection({
  wedding,
  theme,
  rsvpSubmitted,
  setRsvpSubmitted,
  rsvpAttending,
  setRsvpAttending,
  rsvpName,
  setRsvpName,
  rsvpGuestsCount,
  setRsvpGuestsCount,
  rsvpNotes,
  setRsvpNotes,
  rsvpLoading,
  rsvpError,
  handleRsvpSubmit,
  langConfig
}: Props) {
  const { isAr, dir, fontTitle, fontBody, t } = langConfig;

  // reply by date (30 days before wedding) — always in English
  const targetDate = new Date(wedding.wedding_date);
  const replyDateObj = new Date(targetDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const replyByDate = replyDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Format options — always use English numbers
  const selectLabel = (num: number) => {
    if (!isAr) return `${num} ${num === 1 ? t.guest : t.guests}`;
    if (num === 1) return `1 (${t.guest})`;
    return `${num} ${t.guests}`;
  };

  return (
    <section id="rsvp-section" className="py-20 px-6 max-w-3xl mx-auto">
      <motion.div
        dir={dir}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className={`p-10 sm:p-14 rounded-[3xl] border-2 ${theme.border} ${theme.cardBg} shadow-2xl relative overflow-hidden backdrop-blur-sm`}
      >
        <div className="text-center mb-8">
          <h2 className={`text-4xl sm:text-5xl italic ${fontTitle}`}>{t.rsvp}</h2>
          <p className={`text-[10px] uppercase tracking-[0.25em] opacity-60 mt-3 ${fontBody}`}>
            {t.kindlyReply} {replyByDate}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {rsvpSubmitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 flex flex-col items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.8, repeat: 1 }}
                className="text-5xl mb-6"
              >
                🎉
              </motion.div>
              <h3 className={`text-2xl font-bold mb-4 ${fontTitle}`}>{t.thankYou}</h3>
              <p className={`text-base leading-relaxed opacity-90 max-w-sm mx-auto mb-8 ${fontBody}`}>
                {t.rsvpReceived}
              </p>
              <button
                type="button"
                onClick={() => {
                  setRsvpSubmitted(false);
                  // Clear localStorage so user can re-submit
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem(`rsvp_submitted_${wedding.slug}`);
                  }
                }}
                className={`px-8 py-3.5 rounded-full border border-dashed border-current text-xs uppercase tracking-widest hover:opacity-75 transition-opacity font-bold ${fontBody}`}
              >
                {t.editResponse}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleRsvpSubmit}
              className="space-y-6"
            >
              {/* Attendance choice */}
              <div className="space-y-3">
                <label className={`block text-xs uppercase tracking-widest opacity-60 font-bold ${fontBody} ${isAr ? 'text-right' : 'text-left'}`}>
                  {t.willYouAttend}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(true)}
                    className={`py-4 rounded-2xl border-2 font-bold text-sm tracking-wider transition-all ${
                      rsvpAttending === true
                        ? 'border-transparent bg-emerald-600 text-white shadow-lg shadow-emerald-900/10'
                        : `border-current border-opacity-20 hover:border-opacity-65`
                    } ${fontBody}`}
                  >
                    {t.happilyAttend}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(false)}
                    className={`py-4 rounded-2xl border-2 font-bold text-sm tracking-wider transition-all ${
                      rsvpAttending === false
                        ? 'border-transparent bg-rose-700 text-white shadow-lg shadow-rose-950/10'
                        : `border-current border-opacity-20 hover:border-opacity-65`
                    } ${fontBody}`}
                  >
                    {t.regretfullyDecline}
                  </button>
                </div>
              </div>

              {/* Guest Name */}
              <div className="space-y-2">
                <label htmlFor="rsvp-name" className={`block text-xs uppercase tracking-widest opacity-60 font-bold ${fontBody} ${isAr ? 'text-right' : 'text-left'}`}>
                  {t.yourName}
                </label>
                <input
                  type="text"
                  id="rsvp-name"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder={t.guestFullName}
                  required
                  className={`w-full p-4 rounded-2xl border-2 border-current border-opacity-20 focus:border-opacity-80 bg-transparent outline-none transition-all placeholder:opacity-40 text-sm ${fontBody} ${isAr ? 'text-right' : 'text-left'}`}
                />
              </div>

              {/* Guests Count (Only if attending) */}
              {rsvpAttending === true && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 overflow-hidden"
                >
                  <label htmlFor="rsvp-guests" className={`block text-xs uppercase tracking-widest opacity-60 font-bold ${fontBody} ${isAr ? 'text-right' : 'text-left'}`}>
                    {t.guestsCount}
                  </label>
                  <select
                    id="rsvp-guests"
                    value={rsvpGuestsCount}
                    onChange={(e) => setRsvpGuestsCount(Number(e.target.value))}
                    className={`w-full p-4 rounded-2xl border-2 border-current border-opacity-20 focus:border-opacity-80 bg-transparent outline-none transition-all text-sm ${fontBody} ${isAr ? 'text-right' : 'text-left'}`}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num} className="bg-stone-900 text-white">
                        {selectLabel(num)}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}

              {/* Notes/Wishes */}
              <div className="space-y-2">
                <label htmlFor="rsvp-notes" className={`block text-xs uppercase tracking-widest opacity-60 font-bold ${fontBody} ${isAr ? 'text-right' : 'text-left'}`}>
                  {t.messageToCouple}
                </label>
                <textarea
                  id="rsvp-notes"
                  value={rsvpNotes}
                  onChange={(e) => setRsvpNotes(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  rows={3}
                  className={`w-full p-4 rounded-2xl border-2 border-current border-opacity-20 focus:border-opacity-80 bg-transparent outline-none transition-all placeholder:opacity-40 text-sm resize-none ${fontBody} ${isAr ? 'text-right' : 'text-left'}`}
                />
              </div>

              {rsvpError && (
                <p className="text-red-500 text-xs font-bold text-center tracking-wider">{rsvpError}</p>
              )}

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={rsvpLoading || rsvpAttending === null}
                className={`w-full py-4 rounded-full border border-current font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-75 transition-all shadow-md ${
                  rsvpAttending === null ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                } ${fontBody}`}
              >
                {rsvpLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  t.submitRsvp
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
