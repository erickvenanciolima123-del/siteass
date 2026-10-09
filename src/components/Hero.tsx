import React from 'react';
import { ArrowRight, ArrowUpRight, MousePointer2, ShieldCheck, Zap, Headphones } from 'lucide-react';
import { Token3D } from './BrandIcon';
export const Hero = ({ onExploreCatalog, onOpenDiscord }: { onExploreCatalog: () => void; onOpenDiscord: () => void }) => <section className="hero-section" aria-labelledby="hero-title">
  <div className="shell"><div className="hero-surface">
    <img className="hero-art" src="/assets/hero-controller.webp" width="1920" height="1072" alt="Controle futurista com detalhes verdes, chave e cristais flutuantes" fetchPriority="high"/>
    <div className="hero-shade"/>
    <div className="hero-copy"><span className="eyebrow"><span className="status-dot"/> DÊ PLAY NO SEU PRÓXIMO UNIVERSO</span>
      <h1 id="hero-title">Menos limites.<br/>Mais <span>game.</span></h1>
      <p>Grandes jogos, novas histórias e suas assinaturas favoritas. Tudo em um só lugar.</p>
      <div className="hero-actions"><button className="button button-primary" onClick={onExploreCatalog}>Explorar catálogo <ArrowRight size={18}/></button><button className="hero-community" onClick={onOpenDiscord}>Nossa comunidade <ArrowUpRight size={16}/></button></div>
      <div className="hero-footnote"><span className="mini-line"/> JOGOS · STEAM KEYS · ASSINATURAS</div>
    </div>
    <div className="hero-token"><Token3D kind="steam" tone="silver"/><span>Seu universo.<br/><strong>Em expansão.</strong></span></div>
    <a className="hero-3d-link" href="#playground"><MousePointer2 size={14}/> Explore em 3D <ArrowUpRight size={14}/></a>
    <div className="hero-index"><span>01</span> / PLAY WITHOUT LIMITS</div>
  </div>
  <div className="benefits-row">
    <div><Zap/><span><strong>Entrega digital</strong><small>Direto para sua próxima aventura</small></span></div>
    <div><ShieldCheck/><span><strong>Compre com clareza</strong><small>Detalhes de ativação em cada produto</small></span></div>
    <div><Headphones/><span><strong>Suporte de verdade</strong><small>Conte com a nossa comunidade</small></span></div>
    <span className="benefits-signature">FEITO PARA QUEM JOGA <span>↗</span></span>
  </div></div>
</section>;
