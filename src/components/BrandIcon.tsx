import React from 'react';

export type IconKind = 'steam' | 'controller' | 'cube' | 'key' | 'play' | 'bolt';

export function BrandIcon({ kind = 'steam', className = '' }: { kind?: IconKind; className?: string }) {
  return <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    {kind === 'steam' && <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="44" cy="20" r="12"/><circle cx="44" cy="20" r="6.5"/>
      <circle cx="20" cy="44" r="9"/><path d="m27 48 20-15M17 35l15-16M4 34l18 7a4 4 0 0 1-3 7L3 41"/>
    </g>}
    {kind === 'controller' && <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 18h22c8 0 12 10 14 23 2 13-7 15-13 7l-6-6H26l-6 6C14 56 5 54 7 41c2-13 6-23 14-23Z"/>
      <path d="M18 29v12m-6-6h12"/><circle cx="43" cy="29" r="2" fill="currentColor"/><circle cx="50" cy="36" r="2" fill="currentColor"/>
    </g>}
    {kind === 'cube' && <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round"><path d="m32 5 26 15v28L32 62 6 48V20Z"/><path d="m6 20 26 15 26-15M32 35v27M19 12l26 15M45 12 19 27"/><path d="m7 29 13 7v10l12 7m26-24-13 7v10l-13 7"/></g>}
    {kind === 'key' && <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><circle cx="23" cy="22" r="14"/><circle cx="23" cy="22" r="3"/><path d="m33 32 23 23m-9-9 6-6m-14-2 6-6"/></g>}
    {kind === 'play' && <><rect x="8" y="12" width="48" height="38" rx="12" stroke="currentColor" strokeWidth="4"/><path d="m27 23 15 9-15 9Z" fill="currentColor"/></>}
    {kind === 'bolt' && <path d="M36 4 11 36h19l-3 24 26-34H34Z" fill="currentColor"/>}
  </svg>;
}

export function Token3D({ kind, tone = 'green', className = '' }: { kind: IconKind; tone?: string; className?: string }) {
  return <span className={`token-3d token-${tone} ${className}`} aria-hidden="true">
    <span className="token-edge"/><span className="token-face"><BrandIcon kind={kind}/></span>
  </span>;
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return <span className="brand-logo"><span className="brand-symbol"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m6 25 9-19h5l7 19h-7l-2-6-3 6H6Z" fill="currentColor"/><path d="m7 16 10-3-3 6Z" fill="#092117"/></svg></span>{!compact && <span>abravanel<span className="brand-shop">.shop</span></span>}</span>;
}
