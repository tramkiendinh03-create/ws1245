import React from 'react';

export function LilyMotif({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* Center Lily Core */}
      <path d="M100 100 C 100 100, 95 80, 100 70 C 105 80, 100 100, 100 100 Z" fill="currentColor" opacity="0.6" />
      
      {/* Main Lily Petals (Top) */}
      <path d="M100 100 C 80 60, 60 40, 100 20 C 140 40, 120 60, 100 100" />
      
      {/* Side Petals */}
      <path d="M100 100 C 60 90, 30 100, 20 140 C 60 130, 80 120, 100 100" />
      <path d="M100 100 C 140 90, 170 100, 180 140 C 140 130, 120 120, 100 100" />
      
      {/* Bottom Swirls (Vines/Tribal) */}
      <path d="M100 100 C 90 140, 60 160, 50 180 C 40 160, 70 150, 80 130" />
      <path d="M100 100 C 110 140, 140 160, 150 180 C 160 160, 130 150, 120 130" />
      
      {/* Inner Stamens */}
      <path d="M100 100 Q 90 70, 85 60" />
      <circle cx="85" cy="60" r="2" fill="currentColor" />
      
      <path d="M100 100 Q 110 70, 115 60" />
      <circle cx="115" cy="60" r="2" fill="currentColor" />
      
      <path d="M100 100 Q 100 65, 100 50" />
      <circle cx="100" cy="50" r="2.5" fill="currentColor" />

      {/* Decorative Dots */}
      <circle cx="100" cy="140" r="1.5" fill="currentColor" />
      <circle cx="100" cy="160" r="1" fill="currentColor" />
      <circle cx="100" cy="180" r="0.5" fill="currentColor" />
    </svg>
  );
}
