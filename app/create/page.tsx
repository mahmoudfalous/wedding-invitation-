// app/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion
import { WEDDING_THEMES } from "@/app/constants/themes";
import { supabase } from "@/app/lib/supabase";

export default function CreateWedding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [brideImage, setBrideImage] = useState<File | null>(null);
  const [groomImage, setGroomImage] = useState<File | null>(null);
  const [today, setToday] = useState('');
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    date: '',
    location: '',
    theme: 'minimal',
    type: 'wedding',
  });

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setToday(currentDate);
  }, []);

  const generateSlug = (bride: string, groom: string, date: string, location: string) => {
    const datePart = date ? date.split('-').reverse().join('-') : '';
    const locPart = location.split(',')[0].toLowerCase().trim();
    const rawSlug = `${bride.toLowerCase().trim()}-${groom.toLowerCase().trim()}-${datePart}-${locPart}`;
    return rawSlug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('wedding-photos').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('wedding-photos').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = generateSlug(formData.brideName, formData.groomName, formData.date, formData.location);
      let brideImageUrl = null;
      let groomImageUrl = null;
      if (brideImage) brideImageUrl = await uploadImage(brideImage);
      if (groomImage) groomImageUrl = await uploadImage(groomImage);

      const { data, error } = await supabase
        .from('weddings')
        .insert({
          slug: slug,
          partner_one: formData.brideName,
          partner_two: formData.groomName,
          wedding_date: formData.date,
          location: formData.location,
          theme: formData.theme,
          image_one_url: brideImageUrl,
          image_two_url: groomImageUrl,
          type: formData.type,
        })
        .select('slug, edit_token')
        .single();

      if (error) {
        if (error.code === '23505') alert('This exact invitation already exists!');
        else throw error;
        setLoading(false);
        return;
      }
      localStorage.setItem(`wedding_edit_${data.slug}`, data.edit_token);
      router.push(`/w/${data.slug}`);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Something went wrong.');
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const activeTheme = WEDDING_THEMES[formData.theme] || WEDDING_THEMES.minimal;

  return (
    <main className={`min-h-screen ${activeTheme.bg} ${activeTheme.text} flex flex-col items-center justify-center p-4 md:p-8 relative transition-colors duration-700`}>

      {/* Background Decorative Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 left-10 text-pink-200 text-6xl">✦</motion.div>
        <motion.div animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute bottom-20 right-10 text-pink-200 text-8xl">✦</motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl z-10"
      >
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[#8a6b52] hover:text-[#8a4b3b] transition-colors font-medium text-sm mb-6"
        >
          <motion.span whileHover={{ x: -4 }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </motion.span>
          Go Back
        </button>

        <div className={`${activeTheme.cardBg} backdrop-blur-lg p-8 md:p-12 rounded-[2.5rem] shadow-2xl border ${activeTheme.border} transition-colors duration-700`}>
          <div className="text-center mb-10">
            <motion.p variants={itemVariants} className="uppercase tracking-[0.3em] text-[#e4a6a1] text-[10px] font-bold mb-3">Your Journey Starts Here</motion.p>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-serif font-medium text-[#5c3a21] mb-2 italic">Design Your Story</motion.h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Section 0: Event Type */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#eadecc]"></span>
                <h3 className="font-serif text-lg italic text-[#8a4b3b]">The Celebration</h3>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#eadecc]"></span>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'wedding' })}
                  className={`px-8 py-3 rounded-full border transition-all text-sm tracking-widest uppercase font-bold ${formData.type === 'wedding' ? 'bg-[#8a4b3b] text-white border-[#8a4b3b]' : 'border-[#eadecc] text-[#8a6b52] hover:border-[#8a4b3b]'}`}
                >
                  Wedding
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'engagement' })}
                  className={`px-8 py-3 rounded-full border transition-all text-sm tracking-widest uppercase font-bold ${formData.type === 'engagement' ? 'bg-[#8a4b3b] text-white border-[#8a4b3b]' : 'border-[#eadecc] text-[#8a6b52] hover:border-[#8a4b3b]'}`}
                >
                  Engagement
                </button>
              </div>
            </motion.div>

            {/* Section 1: Names */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#eadecc]"></span>
                <h3 className="font-serif text-lg italic text-[#8a4b3b]">The Happy Couple</h3>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#eadecc]"></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8a6b52] ml-1">Bride's Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Nermeen"
                    className="w-full border-b-2 border-[#f0e4dc] focus:border-[#e4a6a1] bg-transparent p-3 outline-none transition-all placeholder:text-stone-300 font-serif text-lg"
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8a6b52] ml-1">Groom's Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Youssef"
                    className="w-full border-b-2 border-[#f0e4dc] focus:border-[#e4a6a1] bg-transparent p-3 outline-none transition-all placeholder:text-stone-300 font-serif text-lg"
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>

            {/* Section 2: Details */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#eadecc]"></span>
                <h3 className="font-serif text-lg italic text-[#8a4b3b]">The Special Day</h3>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#eadecc]"></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 relative">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8a6b52] ml-1">Date</label>
                  <input
                    required
                    type="date"
                    min={today}
                    className="w-full border-b-2 border-[#f0e4dc] focus:border-[#e4a6a1] bg-transparent p-3 outline-none transition-all cursor-pointer"
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8a6b52] ml-1">Location</label>
                  <input
                    required
                    type="text"
                    placeholder="The White Garden, Cairo"
                    className="w-full border-b-2 border-[#f0e4dc] focus:border-[#e4a6a1] bg-transparent p-3 outline-none transition-all placeholder:text-stone-300"
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>

            {/* Section 3: Themes */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-[#8a4b3b]">
                <h3 className="font-serif text-lg italic">Choose Your Aesthetic</h3>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#eadecc]"></span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(WEDDING_THEMES).map(([themeKey, themeStyles]) => (
                  <motion.button
                    key={themeKey}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: themeKey })}
                    className={`relative h-20 rounded-2xl border-2 transition-all overflow-hidden flex items-center justify-center ${
                      formData.theme === themeKey ? 'border-[#8a4b3b] shadow-lg shadow-pink-100' : 'border-[#f0e4dc]'
                    }`}
                  >
                    <div className={`absolute inset-0 ${themeStyles.bg} opacity-50`}></div>
                    <span className={`relative z-10 text-[10px] font-bold uppercase tracking-widest ${themeStyles.text}`}>
                      {themeKey}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Section 4: Portraits */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="font-serif text-lg italic text-[#8a4b3b]">The Portraits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 border-2 border-dashed rounded-3xl transition-all text-center ${brideImage ? 'border-[#e4a6a1] bg-pink-50/30' : 'border-[#f0e4dc]'}`}>
                  <label className="cursor-pointer block">
                    <p className="text-[10px] font-bold uppercase mb-2 text-[#8a6b52]">{brideImage ? '✓ Bride Selected' : 'Upload Bride'}</p>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setBrideImage(e.target.files ? e.target.files[0] : null)} />
                    <div className="text-xs text-stone-400 font-serif">Click to choose</div>
                  </label>
                </div>
                <div className={`p-4 border-2 border-dashed rounded-3xl transition-all text-center ${groomImage ? 'border-[#e4a6a1] bg-pink-50/30' : 'border-[#f0e4dc]'}`}>
                  <label className="cursor-pointer block">
                    <p className="text-[10px] font-bold uppercase mb-2 text-[#8a6b52]">{groomImage ? '✓ Groom Selected' : 'Upload Groom'}</p>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setGroomImage(e.target.files ? e.target.files[0] : null)} />
                    <div className="text-xs text-stone-400 font-serif">Click to choose</div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8a4b3b] text-white font-serif text-xl py-5 rounded-full hover:bg-[#6e3b2e] hover:shadow-2xl transition-all disabled:opacity-50 relative overflow-hidden group"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="text-2xl">♥</motion.span>
                      Crafting...
                    </motion.div>
                  ) : (
                    <motion.span key="normal">Publish Invitation</motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </main>
  );
}