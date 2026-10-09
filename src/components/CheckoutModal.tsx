import React, { useEffect, useState } from 'react';
import { X, ArrowRight, Check, ShoppingBag, FlaskConical, CreditCard, QrCode } from 'lucide-react';
import { CartItem, Order, UserAccount } from '../types';
import { money } from '../lib/catalog';
import { useDialog } from '../hooks/useDialog';
interface Props { isOpen:boolean;onClose:()=>void;items:CartItem[];user?:UserAccount;onOrderCompleted:(order:Order)=>void; }
export const CheckoutModal=({isOpen,onClose,items,user,onOrderCompleted}:Props)=>{
 const dialog=useDialog(isOpen,onClose);const [name,setName]=useState('');const [email,setEmail]=useState('');const [method,setMethod]=useState<'PIX'|'CREDIT_CARD'>('PIX');const [order,setOrder]=useState<Order|null>(null);
 useEffect(()=>{if(isOpen){setOrder(null);setName(user?.isLoggedIn?user.name:'');setEmail(user?.isLoggedIn?user.email:'');}},[isOpen]);
 if(!isOpen)return null;
 const total=items.reduce((sum,it)=>sum+it.product.price*it.quantity,0);
 const submit=(e:React.FormEvent)=>{e.preventDefault();if(!items.length)return;
  const next:Order={id:`DEMO-${Date.now().toString(36).toUpperCase()}`,isDemo:true,customerName:name.trim(),customerEmail:email.trim(),paymentMethod:method,total,status:'PENDING',createdAt:new Date().toISOString(),items:items.map(it=>({productId:it.product.id,productName:it.product.name,quantity:it.quantity,price:it.product.price,deliveredKeys:[]}))};
  setOrder(next);onOrderCompleted(next);
 };
 return <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="checkout-title" tabIndex={-1} className="shop-dialog-backdrop" onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="checkout-panel"><div className="checkout-header"><span><ShoppingBag size={18}/><h2 id="checkout-title">{order?'Pedido de demonstração':'Revise seu pedido'}</h2></span><button className="icon-button" onClick={onClose} aria-label="Fechar checkout"><X size={21}/></button></div>
 {order?<div className="checkout-success"><span className="checkout-check"><Check size={32}/></span><span className="eyebrow">PRÉVIA CONCLUÍDA</span><h3>Você testou o próximo play.</h3><p>O pedido <strong>{order.id}</strong> foi salvo neste navegador. Nenhuma cobrança foi realizada e nenhuma chave real foi emitida.</p><button className="button button-primary" onClick={onClose}>Continuar explorando <ArrowRight size={17}/></button></div>:<form onSubmit={submit} className="checkout-form"><div className="demo-notice"><FlaskConical size={20}/><p><strong>Checkout em demonstração</strong><span>O projeto ainda não possui um meio de pagamento conectado. Este fluxo serve apenas para testar a experiência.</span></p></div><div className="checkout-summary">{items.map(it=><div key={it.product.id}><span>{it.quantity}× {it.product.name}</span><strong>{money(it.product.price*it.quantity)}</strong></div>)}</div><div className="checkout-total"><span>Total da demonstração</span><strong>{money(total)}</strong></div>
 <label>Nome<input autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="Como podemos chamar você?"/></label><label>E-mail<input autoComplete="email" type="email" required maxLength={200} value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></label><fieldset><legend>Forma de pagamento (prévia)</legend><div className="checkout-methods"><button type="button" className={method==='PIX'?'selected':''} aria-pressed={method==='PIX'} onClick={()=>setMethod('PIX')}><QrCode size={19}/> Pix</button><button type="button" className={method==='CREDIT_CARD'?'selected':''} aria-pressed={method==='CREDIT_CARD'} onClick={()=>setMethod('CREDIT_CARD')}><CreditCard size={19}/> Cartão</button></div><small>Nenhum dado de cartão ou código de Pix é solicitado neste teste.</small></fieldset><button type="submit" disabled={!items.length} className="button button-primary">Criar pedido de teste <ArrowRight size={17}/></button></form>}
 </div></div>;
};
