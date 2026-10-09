import React, { useRef } from 'react';
import { ShoppingBag, Check, Heart, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { ProductArtwork } from './ProductArtwork';
import { money } from '../lib/catalog';
export interface ProductCardProps {
  product: Product; onOpenDetails: (p: Product) => void; onAddToCart: (p: Product) => void;
  isAddedToCart?: boolean; favorite?: boolean; onToggleFavorite?: (id: string) => void;
}
export const ProductCard = ({ product, onOpenDetails, onAddToCart, isAddedToCart=false, favorite=false, onToggleFavorite }: ProductCardProps) => {
  const card = useRef<HTMLElement>(null);
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if(e.pointerType!=='mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r=e.currentTarget.getBoundingClientRect();
    card.current?.style.setProperty('--rx',`${-(e.clientY-r.top-r.height/2)/r.height*5}deg`);
    card.current?.style.setProperty('--ry',`${(e.clientX-r.left-r.width/2)/r.width*6}deg`);
  };
  const reset = () => { card.current?.style.setProperty('--rx','0deg');card.current?.style.setProperty('--ry','0deg'); };
  return <article ref={card} className={`product-card ${product.isSoldOut?'product-unavailable':''}`} onPointerMove={tilt} onPointerLeave={reset}>
    <div className="product-image-wrap">
      <button className="product-image-button" onClick={() => onOpenDetails(product)} aria-label={`Ver detalhes de ${product.name}`}><ProductArtwork productId={product.id} productName={product.name} category={product.category} accentColor={product.accentColor}/><span className="artwork-open"><ArrowUpRight size={22}/></span></button>
      <span className={`product-label ${product.isSoldOut?'unavailable-label':''}`}>{product.isSoldOut?'Esgotado':product.category==='ASSINATURAS'?'ASSINATURA':product.category==='KEYS'?'STEAM KEY':'PC · DIGITAL'}</span>
      {onToggleFavorite && <button className={`favorite-button ${favorite?'is-favorite':''}`} aria-label={`${favorite?'Remover':'Adicionar'} ${product.name} ${favorite?'dos':'aos'} favoritos`} aria-pressed={favorite} onClick={() => onToggleFavorite(product.id)}><Heart size={16} fill={favorite?'currentColor':'none'}/></button>}
    </div>
    <div className="product-info"><span className="product-category">{product.category==='ASSINATURAS'?'ENTRETENIMENTO':product.category==='KEYS'?'ATIVAÇÃO NA STEAM':'SUA PRÓXIMA AVENTURA'}</span>
      <h3><button onClick={() => onOpenDetails(product)}>{product.name}</button></h3>
      <div className="product-price-row"><div><small>A partir de</small><strong>{money(product.price)}</strong></div><button className={`add-cart-button ${isAddedToCart?'in-cart':''}`} disabled={product.isSoldOut} onClick={() => onAddToCart(product)} aria-label={`Adicionar ${product.name} ao carrinho`}>{isAddedToCart?<Check size={18}/>:<ShoppingBag size={18}/>}</button></div>
      <button className="product-details-link" onClick={() => onOpenDetails(product)}>Ver detalhes e ativação <ArrowUpRight size={13}/></button>
    </div>
  </article>;
};
