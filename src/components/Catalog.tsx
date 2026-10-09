import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, Heart, Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { CategoryId, Product } from '../types';
import { ProductCard } from './ProductCard';
import { categoryLabels, matchesSearch } from '../lib/catalog';
import { PRODUCTS } from '../data/products';
const featuredIds=['destaque-rdr2','destaque-gta5','destaque-forza-5','destaque-spiderman-miles','destaque-re4','destaque-hollow-knight'];
export interface CatalogProps { products?:Product[]; query?:string; onClearSearch?:()=>void; initialCategory?:CategoryId; onOpenDetails:(p:Product)=>void; onAddToCart:(p:Product)=>void; cartProductIds:string[]; full?:boolean; }
export function Catalog({products=PRODUCTS,query='',onClearSearch,initialCategory='ALL',onOpenDetails,onAddToCart,cartProductIds,full=false}:CatalogProps){
 const [category,setCategory]=useState(initialCategory); const [sort,setSort]=useState('featured'); const [available,setAvailable]=useState(false); const [onlyFavorites,setOnlyFavorites]=useState(false); const [limit,setLimit]=useState(full?18:6);
 const [favorites,setFavorites]=useState<string[]>(()=>{try{const x=JSON.parse(localStorage.getItem('abravanel_favorites')||'[]');return Array.isArray(x)?x.filter(id=>typeof id==='string'):[];}catch{return [];}});
 useEffect(()=>{setCategory(initialCategory);},[initialCategory]);
 useEffect(()=>{setLimit(full?18:6);},[category,query,sort,available,onlyFavorites,full]);
 const toggleFavorite=(id:string)=>setFavorites(prev=>{const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];try{localStorage.setItem('abravanel_favorites',JSON.stringify(next));}catch{}return next;});
 const filtered=useMemo(()=>{
  const list=products.filter(p=>(category==='ALL'||p.category===category)&&(!query||matchesSearch(p,query))&&(!available||!p.isSoldOut)&&(!onlyFavorites||favorites.includes(p.id)));
  return list.sort((a,b)=>sort==='price-low'?a.price-b.price:sort==='price-high'?b.price-a.price:sort==='name'?a.name.localeCompare(b.name,'pt-BR'):(featuredIds.includes(a.id)?featuredIds.indexOf(a.id):-1)===-1?(featuredIds.includes(b.id)?1:Number(a.isSoldOut)-Number(b.isSoldOut)):(featuredIds.includes(b.id)?featuredIds.indexOf(a.id)-featuredIds.indexOf(b.id):-1));
 },[products,category,query,available,onlyFavorites,favorites,sort]);
 const reset=()=>{setCategory('ALL');setSort('featured');setAvailable(false);setOnlyFavorites(false);onClearSearch?.();};
 return <section id="catalog-section" className="catalog-section section-space" aria-labelledby="catalog-title">
  <div className="section-heading"><div><span className="eyebrow">{query?'ENCONTRE SEU FAVORITO':full?'EXPLORE O CATÁLOGO':'SELEÇÃO ABRAVANEL'}</span><h2 id="catalog-title">{query?`Resultados para “${query}”`:full?(category==='ALL'?'Um universo de possibilidades.':categoryLabels[category]):'Seu próximo favorito está aqui.'}</h2></div><span className="catalog-total" aria-live="polite">{filtered.length} produtos <ArrowUpRight size={16}/></span></div>
  <div className="catalog-toolbar"><div className="category-tabs" role="group" aria-label="Categorias do catálogo">
    {(['ALL','DESTAQUES','KEYS','ASSINATURAS','ACAO_AVENTURA','VIRAIS'] as CategoryId[]).map(id=><button key={id} aria-pressed={category===id} className={category===id?'active':''} onClick={()=>setCategory(id)}>{categoryLabels[id]}</button>)}
  </div><div className="catalog-sort"><SlidersHorizontal size={15}/><select aria-label="Ordenar produtos" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Em destaque</option><option value="price-low">Menor preço</option><option value="price-high">Maior preço</option><option value="name">Nome: A a Z</option></select></div></div>
  <div className="catalog-options"><label><input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)}/> Somente disponíveis</label><button className={onlyFavorites?'favorites-active':''} aria-pressed={onlyFavorites} onClick={()=>setOnlyFavorites(!onlyFavorites)}><Heart size={14} fill={onlyFavorites?'currentColor':'none'}/> Favoritos <span>{favorites.length}</span></button>{query&&<button onClick={onClearSearch}><X size={14}/> Limpar busca</button>}</div>
  {filtered.length ? <><div className="product-grid">{filtered.slice(0,limit).map(p=><ProductCard key={p.id} product={p} onOpenDetails={onOpenDetails} onAddToCart={onAddToCart} isAddedToCart={cartProductIds.includes(p.id)} favorite={favorites.includes(p.id)} onToggleFavorite={toggleFavorite}/>)}</div>
  {limit<filtered.length&&<div className="catalog-more"><button className="button button-secondary" onClick={()=>setLimit(n=>n+12)}>Explorar mais produtos <ArrowDown size={16}/></button><span>Mostrando {Math.min(limit,filtered.length)} de {filtered.length}</span></div>}</>:
   <div className="catalog-empty"><Search size={32}/><h3>{onlyFavorites?'Sua seleção começa aqui.':'Ainda não encontramos esse produto.'}</h3><p>{onlyFavorites?'Toque no coração dos produtos para guardar seus favoritos.':'Tente outro nome ou ajuste os filtros da sua busca.'}</p><button className="button button-secondary" onClick={reset}><RotateCcw size={16}/> Limpar filtros</button></div>}
 </section>;
}
