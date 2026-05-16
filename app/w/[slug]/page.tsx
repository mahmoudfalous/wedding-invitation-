// app/w/[slug]/page.tsx
import { notFound } from 'next/navigation';
import AnimatedInvitation from './AnimatedInvitation';
import { supabase } from "@/app/lib/supabase";
import { WEDDING_THEMES } from "@/app/constants/themes";
import { Metadata } from 'next';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

// 🌟 NEW: This generates a beautiful preview card when shared on WhatsApp!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  const { data: wedding } = await supabase
    .from('weddings')
    .select('partner_one, partner_two, wedding_date, location, image_one_url')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!wedding) return { title: 'Wedding Invitation' };

  const formattedDate = new Date(wedding.wedding_date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  
  const ogImage = wedding.image_one_url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop';

  return {
    title: `${wedding.partner_one} & ${wedding.partner_two} - Wedding Invitation`,
    description: `Join us on ${formattedDate} in ${wedding.location} to celebrate our special day!`,
    keywords: ['wedding', 'invitation', wedding.partner_one, wedding.partner_two, wedding.location, 'digital invitation', 'wedding website'],
    openGraph: {
      title: `${wedding.partner_one} & ${wedding.partner_two} are getting married!`,
      description: `Join us on ${formattedDate} in ${wedding.location}. We can't wait to celebrate with you!`,
      type: 'website',
      siteName: 'ForeverInvites',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${wedding.partner_one} & ${wedding.partner_two}`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${wedding.partner_one} & ${wedding.partner_two}'s Wedding`,
      description: `Join us on ${formattedDate} in ${wedding.location}.`,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://foreverinvites.com/w/${resolvedParams.slug}`,
    }
  };
}

// Your exact page component below!
export default async function WeddingInvitationPage({ params }: Props) {
  const resolvedParams = await params;

  const { data: wedding, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (error || !wedding) {
    notFound();
  }

  const theme = WEDDING_THEMES[wedding.theme] || WEDDING_THEMES.minimal;

  // Render our highly-animated client component
  return <AnimatedInvitation wedding={wedding} theme={theme} />;
}