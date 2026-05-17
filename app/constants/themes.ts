// constants/themes.ts
export interface ThemeConfig {
  bg: string;
  text: string;
  accent: string;
  fontTitle: string;
  fontBody: string;
  border: string;
  cardBg: string;
}

export const WEDDING_THEMES: Record<string, ThemeConfig> = {
  minimal: {
    bg: "bg-neutral-50",
    text: "text-neutral-800",
    accent: "text-neutral-500",
    fontTitle: "font-serif tracking-tight",
    fontBody: "font-sans font-light",
    border: "border-neutral-200",
    cardBg: "bg-white"
  },
  classic: {
    bg: "bg-stone-100",
    text: "text-stone-950",
    accent: "text-amber-800",
    fontTitle: "font-serif tracking-wide italic",
    fontBody: "font-serif",
    border: "border-amber-200",
    cardBg: "bg-stone-50"
  },
  vintage: {
    bg: "bg-emerald-950",
    text: "text-emerald-50",
    accent: "text-yellow-200/90",
    fontTitle: "font-serif tracking-widest uppercase",
    fontBody: "font-sans tracking-wide",
    border: "border-emerald-800",
    cardBg: "bg-emerald-900/50"
  },
  romantic: {
    bg: "bg-rose-50",
    text: "text-rose-950",
    accent: "text-rose-500",
    fontTitle: "font-serif tracking-widest italic",
    fontBody: "font-sans",
    border: "border-rose-200",
    cardBg: "bg-rose-100/50"
  },
  modern: {
    bg: "bg-zinc-950",
    text: "text-zinc-50",
    accent: "text-zinc-400",
    fontTitle: "font-sans tracking-tight uppercase",
    fontBody: "font-sans font-light",
    border: "border-zinc-800",
    cardBg: "bg-zinc-900"
  },
  nature: {
    bg: "bg-[#f4f1eb]",
    text: "text-[#3e4a3d]",
    accent: "text-[#5e745b]",
    fontTitle: "font-serif",
    fontBody: "font-serif",
    border: "border-[#d8d3c8]",
    cardBg: "bg-[#edeae1]"
  },
  coastal: {
    bg: "bg-slate-50",
    text: "text-slate-900",
    accent: "text-sky-600",
    fontTitle: "font-serif tracking-wide",
    fontBody: "font-sans font-light",
    border: "border-slate-200",
    cardBg: "bg-white"
  },
  terracotta: {
    bg: "bg-[#faf6f0]",
    text: "text-[#5e3a2f]",
    accent: "text-[#c26d53]",
    fontTitle: "font-serif italic",
    fontBody: "font-sans",
    border: "border-[#e8d5c4]",
    cardBg: "bg-[#f4ebe1]"
  },
  royal: {
    bg: "bg-slate-950",
    text: "text-amber-50",
    accent: "text-amber-400",
    fontTitle: "font-serif tracking-widest uppercase",
    fontBody: "font-serif",
    border: "border-slate-800",
    cardBg: "bg-slate-900"
  }
};