import React, { useEffect, useRef, useState } from 'react';
import { Search, ShoppingBag, Headphones, UserRound, ArrowUpRight, X, Menu, Package, Command } from 'lucide-react';
import { UserAccount, Product, CategoryId } from '../types';
import { Logo, BrandIcon } from './BrandIcon';
import { categoryLabels } from '../lib/catalog';
interface HeaderProps {
  searchQuery: string; onSearchChange: (q: string) => void; cartCount: number;
  onOpenCart: () => void; onOpenSocials: () => void; onOpenAccount: () => void;
  onOpenOrders: () => void; user: UserAccount; onNavigateHome?: () => void;
  onNavigateCategory?: (category: CategoryId) => void; activeCategory?: CategoryId;
  products?: Product[]; onSelectProduct?: (p: Product) => void; onAddToCart?: (p: Product) => void;
}
export const Header: React.FC<HeaderProps> = (p) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); search.current?.focus(); }
      if (e.key === 'Escape') { setMenuOpen(false); search.current?.blur(); }
    };
    document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key);
  }, []);
  const navigate = (id: CategoryId) => { setMenuOpen(false); p.onNavigateCategory?.(id); };
  return <>
    <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
    <div className="announcement"><span><span className="status-dot"/> Seu próximo jogo começa aqui.</span><button onClick={() => navigate('ALL')}>Explore o catálogo <ArrowUpRight size={13}/></button></div>
    <header className="site-header">
      <div className="shell header-main">
        <button className="logo-button" onClick={() => { setMenuOpen(false); p.onNavigateHome?.(); }} aria-label="Abravanel Shop — início"><Logo/></button>
        <form className="header-search" role="search" onSubmit={e => { e.preventDefault(); document.getElementById('catalog-section')?.scrollIntoView({behavior:'smooth'}); search.current?.blur(); }}>
          <Search size={18}/><input ref={search} type="search" value={p.searchQuery} onChange={e => p.onSearchChange(e.target.value)} placeholder="Encontre seu próximo jogo..." aria-label="Buscar jogos, keys e assinaturas"/>
          {p.searchQuery ? <button type="button" aria-label="Limpar busca" onClick={() => p.onSearchChange('')}><X size={16}/></button> : <kbd><Command size={11}/> K</kbd>}
        </form>
        <div className="header-actions">
          <button className="support-button" onClick={p.onOpenSocials}><Headphones size={20}/><span>Precisa de ajuda?<strong>Fale com a gente</strong></span></button><span className="header-divider"/>
          <button className="icon-button account-button" onClick={p.onOpenAccount} aria-label={p.user.isLoggedIn ? 'Minha conta' : 'Entrar na conta'}><UserRound size={20}/></button>
          <button className="cart-button" onClick={p.onOpenCart} aria-label={`Abrir carrinho, ${p.cartCount} itens`}><ShoppingBag size={19}/><span className="cart-label">Carrinho</span><span className="cart-count">{p.cartCount}</span></button>
          <button className="icon-button mobile-menu-button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21}/> : <Menu size={21}/>}</button>
        </div>
      </div>
      <nav className="shell header-nav" aria-label="Navegação principal"><div>
        <button className={!p.activeCategory ? 'nav-active' : ''} onClick={p.onNavigateHome}>Início</button>
        <button onClick={() => navigate('KEYS')} className={p.activeCategory==='KEYS' ? 'nav-active' : ''}><BrandIcon kind="steam"/> Steam Keys</button>
        <button onClick={() => navigate('DESTAQUES')} className={p.activeCategory==='DESTAQUES' ? 'nav-active' : ''}>Jogos para PC <span className="tiny-badge">HOT</span></button>
        <button onClick={() => navigate('ASSINATURAS')} className={p.activeCategory==='ASSINATURAS' ? 'nav-active' : ''}>Assinaturas</button>
        <button onClick={() => navigate('ALL')} className={p.activeCategory==='ALL' ? 'nav-active' : ''}>Todo o catálogo</button>
      </div><button className="nav-orders" onClick={p.onOpenOrders}><Package size={15}/> Meus pedidos <ArrowUpRight size={13}/></button></nav>
      {menuOpen && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Menu mobile">
        <button onClick={() => { setMenuOpen(false); p.onNavigateHome?.(); }}>Início</button>
        {(['ALL','KEYS','DESTAQUES','ASSINATURAS','ACAO_AVENTURA'] as CategoryId[]).map(id => <button key={id} onClick={() => navigate(id)}>{categoryLabels[id]} <ArrowUpRight size={16}/></button>)}
        <button onClick={() => {setMenuOpen(false);p.onOpenOrders();}}>Meus pedidos</button><button onClick={() => {setMenuOpen(false);p.onOpenSocials();}}>Suporte</button>
      </nav>}
    </header>
  </>;
};
