'use client';

import { ThemeConfig } from '@/app/constants/themes';

interface Props {
  isCreator: boolean;
  theme: ThemeConfig;
  rsvps: any[];
  rsvpsLoading: boolean;
  fetchRsvps: () => void;
  langConfig: {
    lang: 'en' | 'ar';
    isAr: boolean;
    dir: 'ltr' | 'rtl';
    fontTitle: string;
    fontBody: string;
    t: Record<string, string>;
  };
}

export default function CreatorDashboard({ isCreator, theme, rsvps, rsvpsLoading, fetchRsvps, langConfig }: Props) {
  const { isAr, dir, fontTitle, fontBody, t } = langConfig;

  if (!isCreator) return null;

  // Always use English numbers
  const formatNum = (num: number) => num.toString();

  const formattedDate = (dString: string) => {
    const d = new Date(dString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalGuestsCount = rsvps.reduce((acc, r) => acc + (r.attending ? (r.guests_count || 1) : 0), 0);

  return (
    <section dir={dir} className="py-16 px-6 max-w-4xl mx-auto">
      <div className="border-2 border-dashed border-amber-500/35 bg-amber-500/5 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-inner">
        {/* Absolute badge */}
        <div className={`absolute top-0 bg-amber-500 text-stone-950 px-4 py-1.5 font-serif text-[10px] uppercase font-bold tracking-widest select-none ${isAr ? 'left-0 rounded-br-2xl' : 'right-0 rounded-bl-2xl'}`}>
          {t.creatorAccess}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-serif font-black tracking-wide text-amber-500 uppercase">{t.rsvpDashboard}</h2>
            <p className="text-xs text-white/50 font-sans tracking-wide mt-1">{t.realtimeStats}</p>
          </div>
          <button
            type="button"
            onClick={fetchRsvps}
            disabled={rsvpsLoading}
            className="px-4 py-2 rounded-full border border-amber-500/40 text-[10px] text-amber-400 font-bold uppercase tracking-widest hover:bg-amber-500/10 transition-all flex items-center gap-1.5 disabled:opacity-40"
          >
            {rsvpsLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              `🔄 ${t.refreshList}`
            )}
          </button>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-[#1c1c1c]/80 border border-white/5 p-4 rounded-2xl text-center">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-1">{t.responses}</span>
            <span className="text-2xl sm:text-3xl font-serif font-black text-amber-400">{formatNum(rsvps.length)}</span>
          </div>
          <div className="bg-[#1c1c1c]/80 border border-white/5 p-4 rounded-2xl text-center">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-1">{t.attending}</span>
            <span className="text-2xl sm:text-3xl font-serif font-black text-emerald-400">
              {formatNum(rsvps.filter(r => r.attending).length)}
            </span>
          </div>
          <div className="bg-[#1c1c1c]/80 border border-white/5 p-4 rounded-2xl text-center">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-1">{t.totalGuests}</span>
            <span className="text-2xl sm:text-3xl font-serif font-black text-sky-400">
              {formatNum(totalGuestsCount)}
            </span>
          </div>
        </div>

        {/* RSVP Guest List */}
        <div className="bg-[#151515]/90 border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className={`w-full text-left font-sans text-xs ${isAr ? 'text-right' : 'text-left'}`}>
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/60 font-bold uppercase tracking-widest">
                  <th className="p-4">{t.guestName}</th>
                  <th className="p-4">{t.status}</th>
                  <th className="p-4 text-center">{t.count}</th>
                  <th className="p-4">{t.messageNotes}</th>
                  <th className={`p-4 ${isAr ? 'text-left' : 'text-right'}`}>{t.rsvpDate}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rsvps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/35 font-light tracking-wide">
                      {rsvpsLoading ? t.loadingGuests : t.noResponses}
                    </td>
                  </tr>
                ) : (
                  rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-white/5 transition-all text-white/90">
                      <td className="p-4 font-bold tracking-wide">{rsvp.name}</td>
                      <td className="p-4">
                        {rsvp.attending ? (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                            {t.attending}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/40">
                            {t.declined}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center font-bold text-amber-200">
                        {rsvp.attending ? formatNum(rsvp.guests_count) : '—'}
                      </td>
                      <td className="p-4 max-w-xs truncate italic text-white/70" title={rsvp.notes}>
                        {rsvp.notes || <span className="opacity-30">—</span>}
                      </td>
                      <td className={`p-4 text-white/40 ${isAr ? 'text-left' : 'text-right'}`}>
                        {formattedDate(rsvp.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
