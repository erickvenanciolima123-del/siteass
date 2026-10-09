import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, Compass, Headphones, MousePointer2, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { CategoryId, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { Hero } from './Hero';
import { Catalog } from './Catalog';
import { Token3D } from './BrandIcon';
import { money } from '../lib/catalog';
const GamingPlayground=lazy(()=>import('./GamingPlayground'));
interface Props { searchQuery:string; onClearSearch:()=>void; onNavigateCategory:(id:CategoryId)=>void; onOpenDiscord:()=>void; onOpenDetails:(p:Product)=>void; onAddToCart:(p:Product)=>void; cartProductIds:string[]; }
const faqs=[
 ['Como recebo meu produto?','Os produtos são digitais. Consulte os detalhes e o guia de ativação na página de cada item. O tipo de acesso e as instruções variam conforme o produto escolhido.'],
 ['Qual a diferença entre uma key e um acesso?','Uma key é um código de ativação. Alguns produtos do catálogo oferecem dados de acesso ou modo offline, conforme descrito no anúncio. Confira essa informação antes de escolher.'],
 ['Onde acompanho meus pedidos?','Abra “Meus pedidos” no menu superior. Pedidos vinculados à sua conta ficam disponíveis no painel, junto com as informações de cada item.'],
 ['Como falo com o suporte?','Use o botão “Fale com a gente” no topo ou entre na nossa comunidade pelo botão abaixo. Os canais disponíveis aparecem na janela de atendimento.']
];
export function Storefront(p:Props){
 const [ready,setReady]=useState(false);const area=useRef<HTMLDivElement>(null);
 useEffect(()=>{const obs=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setReady(true);obs.disconnect();}},{rootMargin:'250px'});if(area.current)obs.observe(area.current);return()=>obs.disconnect();},[]);
 return <main id="main-content" tabIndex={-1}>
  {!p.searchQuery && <Hero onExploreCatalog={()=>document.getElementById('catalog-section')?.scrollIntoView({behavior:'smooth'})} onOpenDiscord={p.onOpenDiscord}/>}
  <div className="shell">
   {!p.searchQuery&&<section className="quick-categories" aria-label="Explore por categoria">
    <button onClick={()=>p.onNavigateCategory('KEYS')}><Token3D kind="steam" tone="silver"/><span><small>EXPANDA SUA BIBLIOTECA</small><strong>Steam Keys</strong></span><ArrowUpRight/></button>
    <button onClick={()=>p.onNavigateCategory('DESTAQUES')}><Token3D kind="controller"/><span><small>PRONTO PARA O PRÓXIMO NÍVEL?</small><strong>Jogos para PC</strong></span><ArrowUpRight/></button>
    <button onClick={()=>p.onNavigateCategory('ASSINATURAS')}><Token3D kind="play" tone="purple"/><span><small>DÊ PLAY NO SEU TEMPO LIVRE</small><strong>Assinaturas</strong></span><ArrowUpRight/></button>
   </section>}
   <Catalog query={p.searchQuery} onClearSearch={p.onClearSearch} onOpenDetails={p.onOpenDetails} onAddToCart={p.onAddToCart} cartProductIds={p.cartProductIds}/>
   {!p.searchQuery&&<>
    <section className="collections section-space" aria-labelledby="collections-title"><div className="section-heading"><div><span className="eyebrow">CADA JOGO, UM NOVO MUNDO</span><h2 id="collections-title">Qual vai ser a sua aventura?</h2></div><Compass size={24}/></div>
      <div className="collection-grid"><button className="collection-card worlds" onClick={()=>p.onNavigateCategory('ACAO_AVENTURA')}><img src="/assets/collection-worlds.webp" alt="Viajante em uma ponte diante de ruínas de fantasia e um eclipse dourado" width="1920" height="1072" loading="lazy"/><div className="collection-copy"><span className="eyebrow">EXPLORE ALÉM DO MAPA</span><h3>Mundos que<br/>valem a jornada.</h3><span>Ação e aventura <ArrowUpRight size={17}/></span></div><span className="collection-number">01 / EXPLORE</span></button>
      <button className="collection-card speed" onClick={()=>{const game=PRODUCTS.find(x=>x.id==='destaque-forza-5');if(game)p.onOpenDetails(game);}}><img src="/assets/collection-speed.webp" alt="Carro esportivo em uma avenida futurista com neon violeta" width="1920" height="1072" loading="lazy"/><div className="collection-copy"><span className="eyebrow">SINTA CADA CURVA</span><h3>Sua próxima<br/>dose de adrenalina.</h3><span>Conheça Forza Horizon 5 <ArrowUpRight size={17}/></span></div><span className="collection-number">02 / ACCELERATE</span></button></div>
      <p className="art-note">Artes conceituais das coleções. Confira as capas e os detalhes de cada jogo no catálogo.</p>
    </section>
    <section id="playground" className="playground-section section-space" aria-labelledby="playground-title"><div className="playground-copy"><span className="eyebrow"><Sparkles size={13}/> UM POUCO MAIS DE PLAY</span><h2 id="playground-title">Seu universo gamer.<br/><span>Em outra dimensão.</span></h2><p>Gire, descubra e explore. Uma coleção de objetos feita para quem tem o jogo no DNA.</p><div className="playground-note"><MousePointer2 size={18}/><span>Arraste para girar.<br/><small>Escolha um objeto e veja de perto.</small></span></div><button className="text-link" onClick={()=>p.onNavigateCategory('KEYS')}>Descobrir Steam Keys <ArrowUpRight size={17}/></button></div><div ref={area} className="playground-frame">{ready?<Suspense fallback={<div className="scene-fallback"><Token3D kind="controller"/><span>Preparando sua coleção...</span></div>}><GamingPlayground/></Suspense>:<div className="scene-fallback"><Token3D kind="steam" tone="silver"/></div>}</div></section>
    <section className="subscription-section section-space" aria-labelledby="subscriptions-title"><div className="section-heading"><div><span className="eyebrow">PAUSA NO JOGO. PLAY NO RESTO.</span><h2 id="subscriptions-title">Seu entretenimento, completo.</h2></div><button className="text-link" onClick={()=>p.onNavigateCategory('ASSINATURAS')}>Ver assinaturas <ArrowUpRight size={16}/></button></div><div className="subscription-grid">{['sub-netflix','sub-spotify','sub-youtube-premium','sub-disney-plus'].map(id=>PRODUCTS.find(p=>p.id===id)).filter((p):p is Product=>!!p).map(product=><button key={product.id} className={`subscription-item ${product.id}`} onClick={()=>p.onOpenDetails(product)}><span className="subscription-monogram" style={{color:product.accentColor}}>{product.id==='sub-netflix'?'N':product.id==='sub-spotify'?'≋':product.id==='sub-youtube-premium'?'▶':'D+'}</span><span><strong>{product.name}</strong><small>{product.isSoldOut?'Consulte disponibilidade':`A partir de ${money(product.price)}`}</small></span><ArrowUpRight size={18}/></button>)}</div></section>
    <section className="how-it-works section-space"><div><span className="eyebrow">DO CATÁLOGO AO SEU SETUP</span><h2>Simples. Como dar play.</h2></div><div className="steps-grid">{[{icon:ShoppingBag,title:'Escolha seu próximo jogo',text:'Explore as categorias e confira os detalhes do produto.'},{icon:PackageCheck,title:'Organize seu pedido',text:'Adicione ao carrinho e acompanhe tudo pela sua conta.'},{icon:Headphones,title:'Conte com a comunidade',text:'Tire suas dúvidas e encontre sua próxima aventura.'}].map((step,i)=><div key={step.title} className="how-step"><span className="step-number">0{i+1}</span><step.icon size={22}/><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></section>
    <section className="faq-section section-space" aria-labelledby="faq-title"><div><span className="eyebrow">ANTES DO PRÓXIMO PLAY</span><h2 id="faq-title">Alguma dúvida?</h2><p>A gente te ajuda a escolher.</p></div><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<ChevronDown size={18}/></summary><p>{a}</p></details>)}</div></section>
    <section className="community-banner"><div className="community-tokens"><Token3D kind="controller" tone="purple"/><Token3D kind="bolt" tone="silver"/></div><div><span className="eyebrow">O MELHOR DO JOGO É COMPARTILHAR.</span><h2>O próximo squad começa aqui.</h2><p>Novidades, suporte e gente que fala a sua língua.</p></div><button className="button button-primary" onClick={p.onOpenDiscord}>Entrar na comunidade <ArrowRight size={18}/></button></section>
   </>}
  </div>
 </main>;
}
