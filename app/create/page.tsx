// app/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion
import { WEDDING_THEMES } from "@/app/constants/themes";
import { supabase } from "@/app/lib/supabase";
import dynamic from 'next/dynamic';
import AnimatedInvitation from "@/app/w/[slug]/AnimatedInvitation";

const MapPicker = dynamic(() => import('@/app/components/MapPicker'), {
  ssr: false
});

const DRESS_CODES = {
  earthTone: ['#9A6B5B', '#C89F88', '#E6D7C3', '#C79A63', '#DCC696', '#685044'],
  metallic: ['#D4AF37', '#C0C0C0', '#CD7F32', '#B76E79', '#E5E4E2', '#8C92AC'],
  pastel: ['#faedcb', '#c9e4de', '#c6def1', '#dbcdf0', '#f2c6de', '#f7d9c4'],
  jewel: ['#950060', '#24513d', '#671f10', '#401c74', '#4c0043', '#048c8a']
};

export default function CreateWedding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [brideImage, setBrideImage] = useState<File | null>(null);
  const [groomImage, setGroomImage] = useState<File | null>(null);
  const [today, setToday] = useState('');
  const [previewStyle, setPreviewStyle] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    date: '',
    location: '',
    locationUrl: '',
    theme: 'minimal',
    type: 'wedding',
    message: '',
    dressCodePalette: 'earthTone',
    dressCodeColors: DRESS_CODES.earthTone,
    animationStyle: 'gate',
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
    setErrorMsg('');

    // Validation
    if (!formData.brideName || !formData.groomName || !formData.date || !formData.location) {
      setErrorMsg('Please fill in all required text fields.');
      return;
    }

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
          location_url: formData.locationUrl || null,
          theme: `${formData.theme}:${formData.animationStyle}`,
          image_one_url: brideImageUrl,
          image_two_url: groomImageUrl,
          type: formData.type,
          message: formData.message.trim() || null,
          dress_code: formData.dressCodeColors,
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

            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center font-medium">
                {errorMsg}
              </motion.div>
            )}

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
                <h3 className="font-serif text-lg italic text-[#8a4b3b]">The Special Day & Location</h3>
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
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8a6b52] ml-1">Location Name</label>
                  <input
                    required
                    type="text"
                    placeholder="The White Garden, Cairo"
                    className="w-full border-b-2 border-[#f0e4dc] focus:border-[#e4a6a1] bg-transparent p-3 outline-none transition-all placeholder:text-stone-300"
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#8a6b52] ml-1">Location Map Link (Optional)</label>
                <div className="flex flex-col gap-3">
                  <input
                    type="url"
                    placeholder="Paste Google Maps link here..."
                    className="w-full border-b-2 border-[#f0e4dc] focus:border-[#e4a6a1] bg-transparent p-3 outline-none transition-all placeholder:text-stone-300 text-sm"
                    value={formData.locationUrl}
                    onChange={(e) => setFormData({ ...formData, locationUrl: e.target.value })}
                  />
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-stone-200"></div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">OR</span>
                    <div className="h-px flex-1 bg-stone-200"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="flex-1 py-3 px-4 rounded-xl border-2 border-dashed border-[#e4a6a1] text-[#8a4b3b] hover:bg-[#fcf9f6] transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Open Map to Pin Location
                    </button>
                    {formData.locationUrl && formData.locationUrl.includes('query=') && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, locationUrl: '' })}
                        className="p-3 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Remove Pin"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 2.5: Message */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#eadecc]"></span>
                <h3 className="font-serif text-lg italic text-[#8a4b3b]">A Personal Note</h3>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#eadecc]"></span>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#8a6b52] ml-1">Special Message (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. We can't wait to celebrate with you!"
                  className="w-full border-b-2 border-[#f0e4dc] focus:border-[#e4a6a1] bg-transparent p-3 outline-none transition-all placeholder:text-stone-300 font-serif text-lg resize-none"
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
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

            {/* Section 3.2: Invitation Animation */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-[#8a4b3b]">
                <h3 className="font-serif text-lg italic">Choose Invitation Animation</h3>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#eadecc]"></span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { key: 'envelope', label: 'Classic Envelope', icon: '✉️' },
                  { key: 'locket', label: 'Heart Locket', icon: '💖' },
                  { key: 'gate', label: 'Garden Gates', icon: '🌹' },
                  { key: 'book', label: 'Storybook Clasp', icon: '📖' },
                  { key: 'curtain', label: 'Velvet Curtains', icon: '🎭' },
                  { key: 'scroll', label: 'Vintage Scroll', icon: '📜' },
                  { key: 'rose', label: 'Blooming Rose', icon: '🌸' },
                ].map((anim) => (
                  <motion.button
                    key={anim.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setFormData({ ...formData, animationStyle: anim.key })}
                    className={`relative p-4 pb-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 bg-white ${
                      formData.animationStyle === anim.key ? 'border-[#8a4b3b] shadow-lg shadow-pink-100 bg-[#fffcfb]' : 'border-[#f0e4dc] bg-white/50 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl">{anim.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6b52] text-center">
                      {anim.label}
                    </span>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewStyle(anim.key);
                      }}
                      className="text-[8px] font-bold tracking-widest text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2.5 py-0.5 rounded-full mt-1.5 transition-all flex items-center gap-0.5 cursor-pointer uppercase select-none"
                    >
                      👁️ Preview
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Section 3.5: Dress Code */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 text-[#8a4b3b]">
                <h3 className="font-serif text-lg italic">Choose Your Dress Code</h3>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#eadecc]"></span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(DRESS_CODES).map(([key, colors]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setFormData({ ...formData, dressCodePalette: key, dressCodeColors: colors })}
                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                      formData.dressCodePalette === key ? 'border-[#8a4b3b] shadow-lg shadow-pink-100 bg-white' : 'border-[#f0e4dc] bg-white/50 hover:bg-white'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a6b52]">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex gap-1">
                      {colors.map((c, i) => (
                        <div key={i} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-sm" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>
                  </motion.button>
                ))}

                {/* Custom Palette Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setFormData({ ...formData, dressCodePalette: 'custom' })}
                  className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                    formData.dressCodePalette === 'custom' ? 'border-[#8a4b3b] shadow-lg shadow-pink-100 bg-white' : 'border-[#f0e4dc] bg-white/50 hover:bg-white'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a6b52]">
                    Custom Palette
                  </span>
                  <div className="flex gap-1">
                    {formData.dressCodeColors.map((c, i) => (
                      <div key={i} className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden shadow-sm border border-black/10">
                         {formData.dressCodePalette === 'custom' ? (
                            <input 
                              type="color" 
                              value={c} 
                              onChange={(e) => {
                                const newColors = [...formData.dressCodeColors];
                                newColors[i] = e.target.value;
                                setFormData({ ...formData, dressCodeColors: newColors });
                              }}
                              className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer border-0 p-0"
                            />
                         ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300"></div>
                         )}
                      </div>
                    ))}
                  </div>
                </motion.button>
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

      <AnimatePresence>
        {isMapModalOpen && (
          <MapPicker 
            onClose={() => setIsMapModalOpen(false)}
            onLocationSelect={(lat, lng) => {
              const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
              setFormData({ ...formData, locationUrl: url });
            }}
          />
        )}
      </AnimatePresence>

      {/* The Live Animation Preview Modal */}
      <AnimatePresence>
        {previewStyle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            {/* Floating Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPreviewStyle(null)}
              className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 border border-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-2xl transition-all"
            >
              ✕
            </motion.button>

            {/* Modal Info Banner */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none w-full px-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-pink-300 font-bold mb-1">Live Interactive Preview</p>
              <h4 className="text-white text-base sm:text-lg font-serif italic">Tap the card to test its transition</h4>
            </div>

            {/* Live Invitation Rendering */}
            <div className="w-full max-w-lg h-[80vh] sm:h-[85vh] rounded-3xl bg-stone-950 border border-stone-800/80 shadow-2xl relative flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none">
              <div className="scale-[0.8] sm:scale-100 flex items-center justify-center w-full h-full">
                <AnimatedInvitation 
                  wedding={{
                    partner_one: formData.brideName || 'Bride',
                    partner_two: formData.groomName || 'Groom',
                    wedding_date: formData.date || new Date().toISOString().split('T')[0],
                    location: formData.location || 'The White Garden, Cairo',
                    location_url: formData.locationUrl || null,
                    theme: `${formData.theme}:${previewStyle}`,
                    type: formData.type || 'wedding',
                    message: formData.message || 'We are so excited to celebrate our love story with you!',
                    image_one_url: null,
                    image_two_url: null,
                    resolved_location_url: formData.locationUrl || null,
                  }}
                  theme={WEDDING_THEMES[formData.theme] || WEDDING_THEMES.minimal}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}