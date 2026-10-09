import React, { lazy, Suspense } from 'react';
import { Token3D } from './BrandIcon';
const GamingPlayground=lazy(()=>import('./GamingPlayground'));
interface Props { productName:string;category:string;accentColor?:string; }
export const ThreeProductViewer=({productName}:Props)=><div className="rounded-xl border border-white/10 bg-[#0e1c14] p-4"><Suspense fallback={<div className="flex h-64 items-center justify-center"><Token3D kind="steam"/></div>}><GamingPlayground/></Suspense><p className="mt-3 text-center text-[10px] text-slate-400">Coleção 3D ilustrativa · {productName}</p></div>;
