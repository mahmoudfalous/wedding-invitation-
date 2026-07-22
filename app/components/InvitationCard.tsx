'use client';

import React, { forwardRef } from 'react';
import { WEDDING_THEMES, ThemeConfig } from '@/app/constants/themes';

export interface InvitationCardProps {
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  location: string;
  locationDetails?: string;
  type?: 'wedding' | 'engagement' | string;
  imageOneUrl?: string | null;
  imageTwoUrl?: string | null;
  themeKey?: string;
  className?: string;
}

export const InvitationCard = forwardRef<HTMLDivElement, InvitationCardProps>(({
  partnerOne,
  partnerTwo,
  weddingDate,
  location,
  locationDetails,
  type = 'wedding',
  imageOneUrl,
  imageTwoUrl,
  themeKey = 'minimal',
  className = '',
}, ref) => {
  const cleanThemeKey = (themeKey || 'minimal').split(':')[0];
  const theme: ThemeConfig = WEDDING_THEMES[cleanThemeKey] || WEDDING_THEMES.minimal;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Special Day';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const isEngagement = type === 'engagement';
  const hasImages = Boolean(imageOneUrl || imageTwoUrl);

  return (
    <div
      ref={ref}
      id="invitation-card-export"
      className={`relative w-full max-w-full sm:max-w-[500px] mx-auto overflow-hidden rounded-3xl border-2 shadow-2xl p-6 sm:p-10 flex flex-col justify-between items-center text-center transition-all ${theme.bg} ${theme.text} ${theme.border} ${className}`}
      style={{ aspectRatio: '3/4.6', minHeight: '640px' }}
    >
      {/* Outer Luxury Double Frame */}
      <div className={`absolute inset-3 rounded-2xl border ${theme.border} opacity-40 pointer-events-none`} />
      <div className={`absolute inset-4 rounded-xl border ${theme.border} opacity-20 pointer-events-none`} />

      {/* Decorative Elegant Corner Elements */}
      <div className={`absolute top-6 left-6 text-xs opacity-60 font-serif tracking-widest ${theme.accent}`}>✦</div>
      <div className={`absolute top-6 right-6 text-xs opacity-60 font-serif tracking-widest ${theme.accent}`}>✦</div>
      <div className={`absolute bottom-6 left-6 text-xs opacity-60 font-serif tracking-widest ${theme.accent}`}>✦</div>
      <div className={`absolute bottom-6 right-6 text-xs opacity-60 font-serif tracking-widest ${theme.accent}`}>✦</div>

      {/* Subtle Luxury Flourish Background Crest */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-9xl font-serif pointer-events-none select-none">
        ❦
      </div>

      {/* Card Header Section */}
      <div className="z-10 mt-3 flex flex-col items-center gap-1.5 w-full">
        <span className={`text-[10px] sm:text-[11px] tracking-[0.35em] uppercase font-medium ${theme.accent}`}>
          {isEngagement ? 'TOGETHER WITH THEIR FAMILIES' : 'PLEASE JOIN US TO CELEBRATE'}
        </span>
        <h3 className={`text-xs sm:text-sm tracking-[0.3em] uppercase font-light opacity-90 ${theme.fontBody}`}>
          {isEngagement ? 'THE ENGAGEMENT OF' : 'THE WEDDING OF'}
        </h3>
        <div className="flex items-center gap-2 my-1 opacity-40">
          <span className={`w-8 h-[1px] ${theme.border} bg-current`} />
          <span className="text-[10px]">❖</span>
          <span className={`w-8 h-[1px] ${theme.border} bg-current`} />
        </div>
      </div>

      {/* Couple Names Section */}
      <div className="z-10 my-auto flex flex-col items-center justify-center w-full px-2">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight font-serif ${theme.fontTitle}`}>
          {partnerOne || 'Bride'}
        </h1>
        
        <div className="my-3 flex items-center justify-center gap-4">
          <span className={`w-10 h-[1px] ${theme.border} bg-current opacity-30`} />
          <span className={`text-xl sm:text-2xl font-serif italic ${theme.accent}`}>&</span>
          <span className={`w-10 h-[1px] ${theme.border} bg-current opacity-30`} />
        </div>

        <h1 className={`text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight font-serif ${theme.fontTitle}`}>
          {partnerTwo || 'Groom'}
        </h1>

        {/* Attached Photos Gallery */}
        {hasImages && (
          <div className="mt-6 flex justify-center items-center gap-4 z-10">
            {imageOneUrl && (
              <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 shadow-xl p-0.5 ${theme.border} ${theme.cardBg}`}>
                {/* eslint-disable-next-html-element-suppress */}
                <img
                  src={imageOneUrl}
                  alt={partnerOne}
                  className="w-full h-full object-cover rounded-full"
                  crossOrigin="anonymous"
                />
              </div>
            )}
            {imageTwoUrl && (
              <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 shadow-xl p-0.5 ${theme.border} ${theme.cardBg}`}>
                {/* eslint-disable-next-html-element-suppress */}
                <img
                  src={imageTwoUrl}
                  alt={partnerTwo}
                  className="w-full h-full object-cover rounded-full"
                  crossOrigin="anonymous"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date, Time & Location Footer Details */}
      <div className={`z-10 mb-2 w-full pt-5 border-t opacity-95 ${theme.border} flex flex-col items-center gap-2`}>
        {/* Date */}
        <div className={`text-sm sm:text-base tracking-[0.15em] uppercase font-medium ${theme.fontBody}`}>
          {formatDate(weddingDate)}
        </div>

        {/* Time - Clean 8:00 PM without emojis */}
        <div className="flex items-center justify-center gap-3 text-xs sm:text-sm tracking-[0.25em] font-semibold uppercase">
          <span className={`px-4 py-1 rounded-full border ${theme.border} ${theme.cardBg} ${theme.accent} shadow-sm`}>
            8:00 PM
          </span>
        </div>

        {/* Venue / Location */}
        {location && (
          <div className="mt-2 flex flex-col items-center space-y-0.5">
            <span className={`text-[10px] uppercase tracking-[0.3em] opacity-80 ${theme.accent}`}>
              LOCATION & VENUE
            </span>
            <span className={`text-sm sm:text-base font-serif font-medium ${theme.fontBody}`}>
              {location}
            </span>
            {locationDetails && (
              <span className="text-xs opacity-75 max-w-[300px] line-clamp-1">
                {locationDetails}
              </span>
            )}
          </div>
        )}

        <div className={`text-[9px] tracking-[0.3em] uppercase opacity-40 mt-4 ${theme.fontBody}`}>
          FOREVER INVITES • SAVE THE DATE
        </div>
      </div>
    </div>
  );
});

InvitationCard.displayName = 'InvitationCard';

export default InvitationCard;
