import React from 'react';

export function TattooMotif({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 150" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* Center core (Clitoris/Heart motif) */}
      <path d="M100 40 C 100 40, 85 25, 100 15 C 115 25, 100 40, 100 40 Z" fill="currentColor" opacity="0.8" />
      
      {/* Main heart/wings (Womb outline) */}
      <path d="M100 40 C 60 10, 20 40, 40 80 C 60 120, 100 140, 100 140 C 100 140, 140 120, 160 80 C 180 40, 140 10, 100 40" />
      
      {/* Inner swirls (Ovaries/Fallopian tubes motif) */}
      <path d="M100 60 C 70 40, 50 60, 60 90 C 70 110, 90 100, 100 80" />
      <path d="M100 60 C 130 40, 150 60, 140 90 C 130 110, 110 100, 100 80" />
      
      {/* Bottom tails (Dripping/Trailing motif) */}
      <path d="M100 140 C 90 160, 60 150, 50 130" />
      <path d="M100 140 C 110 160, 140 150, 150 130" />
      
      {/* Top accents (Horns/Succubus motif) */}
      <path d="M80 20 C 60 5, 30 15, 20 35" />
      <path d="M120 20 C 140 5, 170 15, 180 35" />
      
      {/* Extra seductive details */}
      <circle cx="100" cy="80" r="3" fill="currentColor" />
      <circle cx="60" cy="90" r="1.5" fill="currentColor" />
      <circle cx="140" cy="90" r="1.5" fill="currentColor" />
    </svg>
  );
}
