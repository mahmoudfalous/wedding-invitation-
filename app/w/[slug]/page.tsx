// app/w/[slug]/page.tsx
import { notFound } from 'next/navigation';
import AnimatedInvitation from './AnimatedInvitation';
import { supabase } from "@/app/lib/supabase";
import { WEDDING_THEMES } from "@/app/constants/themes";
import { Metadata } from 'next';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ anim?: string }>;
}

// 🌟 NEW: This generates a beautiful preview card when shared on WhatsApp!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  const { data: wedding } = await supabase
    .from('weddings')
    .select('partner_one, partner_two, wedding_date, location, image_one_url, type')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!wedding) return { title: 'Invitation' };

  const formattedDate = new Date(wedding.wedding_date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  
  const ogImage = wedding.image_one_url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop';
  const eventType = wedding.type === 'engagement' ? 'Engagement' : 'Wedding';

  return {
    title: `${wedding.partner_one} & ${wedding.partner_two} - ${eventType} Invitation`,
    description: `Join us on ${formattedDate} in ${wedding.location} to celebrate our special day!`,
    keywords: ['wedding', 'engagement', 'invitation', wedding.partner_one, wedding.partner_two, wedding.location, 'digital invitation'],
    openGraph: {
      title: `${wedding.partner_one} & ${wedding.partner_two} are getting ${wedding.type === 'engagement' ? 'engaged' : 'married'}!`,
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
      title: `${wedding.partner_one} & ${wedding.partner_two}'s ${eventType}`,
      description: `Join us on ${formattedDate} in ${wedding.location}.`,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://foreverinvites.com/w/${resolvedParams.slug}`,
    }
  };
}

async function resolveShortenedUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  if (!url.includes('maps.app.goo.gl') && !url.includes('goo.gl/maps')) {
    return url;
  }
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });
    if (response.url) {
      return response.url;
    }
  } catch (error) {
    console.error('Failed to resolve shortened map URL:', error);
  }
  return url;
}

// Your exact page component below!
export default async function WeddingInvitationPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { data: wedding, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (error || !wedding) {
    notFound();
  }

  // Resolve shortened map URL on the server-side
  const resolvedLocationUrl = await resolveShortenedUrl(wedding.location_url);

  // Allow dynamic query parameter override for easy live previewing
  const themeField = resolvedSearchParams?.anim 
    ? `${(wedding.theme || '').split(':')[0]}:${resolvedSearchParams.anim}` 
    : wedding.theme;

  const weddingWithResolvedUrl = {
    ...wedding,
    theme: themeField,
    resolved_location_url: resolvedLocationUrl
  };

  const [themeKey] = (themeField || '').split(':');
  const theme = WEDDING_THEMES[themeKey] || WEDDING_THEMES.minimal;

  // Render our highly-animated client component
  return <AnimatedInvitation wedding={weddingWithResolvedUrl} theme={theme} />;
}