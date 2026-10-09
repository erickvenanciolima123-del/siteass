import React, { useState } from 'react';
import { Token3D } from './BrandIcon';
import coverSources from '../../docs/cover-sources.json';
const covers = new Set(coverSources.filter(s => s.saved).map(s => s.id));
interface ProductArtworkProps { productId: string; productName: string; category: string; accentColor?: string; className?: string; }
export const ProductArtwork = ({productId, productName, category, accentColor='#42efaa', className=''}: ProductArtworkProps) => {
  const [failed, setFailed] = useState(false);
  if(covers.has(productId) && !failed) return <div className={`product-artwork cover-artwork ${className}`}><img src={`/assets/${productId}.webp`} alt={`Capa de ${productName}`} loading="lazy" decoding="async" width="480" height="720" onError={() => setFailed(true)}/></div>;
  const isKey=category==='KEYS';
  return <div className={`product-artwork designed-artwork ${className}`} style={{'--art-accent':accentColor} as React.CSSProperties}>
    <div className="artwork-grid"/><span className="artwork-edition">{isKey?'STEAM COLLECTION':category==='ASSINATURAS'?'DIGITAL PASS':'GAME COLLECTION'}</span>
    <Token3D kind={isKey?'steam':category==='ASSINATURAS'?'play':'controller'} tone={productId.includes('platina')?'purple':productId.includes('ruby')?'ruby':'green'}/>
    <strong>{isKey?productName.replace(/Steam Key /,''):productName}</strong><span className="artwork-fineprint">ABRAVANEL / DIGITAL EXPERIENCE</span>
  </div>;
};
