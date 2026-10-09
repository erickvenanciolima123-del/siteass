import { useEffect, useRef } from 'react';
const stack: symbol[]=[];let previousOverflow='';
export function useDialog(open:boolean,onClose:()=>void){
 const ref=useRef<HTMLDivElement>(null);const close=useRef(onClose);close.current=onClose;
 useEffect(()=>{
  if(!open)return;const id=Symbol('dialog');const lastFocus=document.activeElement as HTMLElement|null;
  if(!stack.length){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}stack.push(id);
  const focusables=()=>Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]')||[]).filter(x=>x.getClientRects().length>0);
  const frame=requestAnimationFrame(()=>{(focusables()[0]||ref.current)?.focus();});
  const key=(e:KeyboardEvent)=>{if(stack.at(-1)!==id)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close.current();}if(e.key==='Tab'){const nodes=focusables(),first=nodes[0],last=nodes.at(-1);if(!first){e.preventDefault();ref.current?.focus();return;}if(e.shiftKey&&(document.activeElement===first||document.activeElement===ref.current)){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
  document.addEventListener('keydown',key,true);
  return()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',key,true);const index=stack.indexOf(id);if(index>=0)stack.splice(index,1);if(!stack.length)document.body.style.overflow=previousOverflow;if(lastFocus?.isConnected)lastFocus.focus();};
 },[open]);
 return ref;
}
