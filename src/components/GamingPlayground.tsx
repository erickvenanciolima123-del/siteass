import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Pause, Play, RotateCcw, Move } from 'lucide-react';
import { BrandIcon, IconKind, Token3D } from './BrandIcon';

const items:{id:IconKind;name:string}[]=[{id:'steam',name:'Steam'},{id:'controller',name:'Controle'},{id:'cube',name:'Voxel'},{id:'key',name:'Key'}];
const buildObject=(kind:IconKind)=>{
 const group=new THREE.Group();
 const dark=new THREE.MeshPhysicalMaterial({color:'#162322',metalness:.55,roughness:.29,clearcoat:1});
 const green=new THREE.MeshPhysicalMaterial({color:'#29e69b',metalness:.38,roughness:.2,clearcoat:1});
 const chrome=new THREE.MeshStandardMaterial({color:'#e8f5ef',metalness:.9,roughness:.22});
 const light=new THREE.MeshStandardMaterial({color:'#ecfff8',metalness:.2,roughness:.3,emissive:'#71ffbe',emissiveIntensity:.12});
 const rubber=new THREE.MeshStandardMaterial({color:'#0b1110',roughness:.8});
 function mesh(geo:THREE.BufferGeometry,mat:THREE.Material,pos:[number,number,number]=[0,0,0]){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);group.add(m);return m;}
 function box(w:number,h:number,d:number,mat:THREE.Material,pos:[number,number,number]){return mesh(new THREE.BoxGeometry(w,h,d),mat,pos);}
 function disk(r:number,d:number,mat:THREE.Material,pos:[number,number,number]){const m=mesh(new THREE.CylinderGeometry(r,r,d,64),mat,pos);m.rotation.x=Math.PI/2;return m;}
 function ring(r:number,tube:number,mat:THREE.Material,pos:[number,number,number]){return mesh(new THREE.TorusGeometry(r,tube,16,64),mat,pos);}
 function link(x1:number,y1:number,x2:number,y2:number,width:number,z:number,mat:THREE.Material){const dx=x2-x1,dy=y2-y1;const m=box(width,Math.hypot(dx,dy),.08,mat,[(x1+x2)/2,(y1+y2)/2,z]);m.rotation.z=-Math.atan2(dx,dy);}
 if(kind==='steam'){
   disk(1.22,.22,chrome,[0,0,0]);disk(1.16,.25,dark,[0,0,.02]);ring(1.11,.026,green,[0,0,.165]);
   ring(.33,.065,light,[.4,.4,.21]);disk(.22,.045,light,[.4,.4,.21]);disk(.16,.055,dark,[.4,.4,.23]);
   link(.36,.04,-.24,-.56,.18,.2,light);link(-.68,-.07,.08,.54,.18,.2,light);
   ring(.22,.05,light,[-.48,-.4,.24]);link(-1.05,-.21,-.5,-.42,.16,.24,light);
   group.rotation.z=-.1;
 }else if(kind==='controller'){
   const shape=new THREE.Shape();shape.moveTo(-.8,.75);shape.bezierCurveTo(-1.45,.9,-1.52,.36,-1.67,-.65);shape.bezierCurveTo(-1.85,-1.35,-1.27,-1.55,-.9,-.95);shape.lineTo(-.55,-.46);shape.quadraticCurveTo(0,-.35,.55,-.46);shape.lineTo(.9,-.95);shape.bezierCurveTo(1.27,-1.55,1.85,-1.35,1.67,-.65);shape.bezierCurveTo(1.52,.36,1.45,.9,.8,.75);shape.closePath();
   const geo=new THREE.ExtrudeGeometry(shape,{depth:.34,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.13,bevelThickness:.11,curveSegments:24});geo.translate(0,.2,-.2);mesh(geo,dark);
   [-1,1].forEach(sign=>{const grip=mesh(new THREE.CapsuleGeometry(.24,.75,8,20),green,[sign*1.25,-.58,.02]);grip.rotation.z=sign*-.3;disk(.29,.08,rubber,[sign*.55,-.16,.35]);disk(.23,.12,dark,[sign*.55,-.16,.43]);ring(.25,.022,green,[sign*.55,-.16,.5]);});
   box(.46,.14,.09,chrome,[-1.02,.55,.39]);box(.14,.46,.095,chrome,[-1.02,.55,.395]);
   [[1.04,.78],[1.27,.55],[1.04,.32],[.81,.55]].forEach(([x,y],i)=>disk(.093,.08,i===2?green:chrome,[x,y,.4]));
   box(.37,.06,.03,green,[0,.56,.38]);disk(.09,.05,chrome,[0,.22,.38]);
   group.scale.setScalar(.77);group.rotation.z=-.12;
 }else if(kind==='cube'){
   const dirt=new THREE.MeshStandardMaterial({color:'#74533b',roughness:.95});box(1.65,1.65,1.65,dirt,[0,0,0]);
   const leaf=[0x59b64a,0x81cb5c,0x3f9239,0x6fc14c].map(color=>new THREE.MeshStandardMaterial({color,roughness:.8}));
   const earth=[0x815e42,0x5b4132,0x9b7451,0x6b4b34].map(color=>new THREE.MeshStandardMaterial({color,roughness:1}));
   const unit=1.65/6;
   for(let x=0;x<6;x++)for(let z=0;z<6;z++)box(unit,.07,unit,leaf[(x*3+z*7)%4],[(x-2.5)*unit,.86,(z-2.5)*unit]);
   for(let side=0;side<4;side++)for(let x=0;x<6;x++)for(let y=0;y<6;y++){
    const mat=y===5||(y===4&&x%3===0)?leaf[(x+y)%4]:earth[(x*3+y*7)%4];
    if(side<2)box(unit,unit,.02,mat,[(x-2.5)*unit,(y-2.5)*unit,side===0?.833:-.833]);
    else box(.02,unit,unit,mat,[side===2?.833:-.833,(y-2.5)*unit,(x-2.5)*unit]);
   }
   group.rotation.set(.32,.62,.03);
 }else{
   ring(.49,.16,chrome,[0,.63,0]);ring(.49,.018,green,[0,.63,.16]);
   box(.22,1.5,.25,chrome,[0,-.55,0]);box(.53,.2,.25,chrome,[.15,-1.16,0]);box(.42,.2,.25,chrome,[.1,-.79,0]);box(.23,.75,.025,green,[0,-.41,.14]);group.rotation.z=-.65;
 }
 // Dispose materials that did not end up on the selected mesh as well.
 group.userData.materials=[dark,green,chrome,light,rubber];
 return group;
};

export default function GamingPlayground(){
 const [kind,setKind]=useState<IconKind>('steam');const [paused,setPaused]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);const [fallback,setFallback]=useState(false);
 const holder=useRef<HTMLDivElement>(null);const pauseRef=useRef(paused);const resetRef=useRef<()=>void>(()=>{});
 useEffect(()=>{pauseRef.current=paused;},[paused]);
 useEffect(()=>{
  const el=holder.current;if(!el)return;setFallback(false);
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{setFallback(true);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(37,1,.1,50);camera.position.set(0,.2,5.8);
  const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xbaffdf,0x283549,2.5));const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-3,4,5);scene.add(key);const rim=new THREE.DirectionalLight(0x42ffaa,3);rim.position.set(3,-1,2);scene.add(rim);
  const object=buildObject(kind);const pivot=new THREE.Group();pivot.add(object);pivot.rotation.set(.12,-.35,0);scene.add(pivot);
  const stage=new THREE.Mesh(new THREE.TorusGeometry(1.75,.018,8,100),new THREE.MeshBasicMaterial({color:0x52ecab,transparent:true,opacity:.15}));stage.rotation.x=-Math.PI/2;stage.position.y=-1.65;scene.add(stage);
  const canvas=renderer.domElement;canvas.setAttribute('aria-label',`${items.find(x=>x.id===kind)?.name} em 3D. Arraste para girar ou use as setas do teclado.`);canvas.setAttribute('role','img');canvas.tabIndex=0;el.appendChild(canvas);
  let frame=0,visible=true,dragging=false,prevX=0,prevY=0,time=0,last=performance.now();
  const draw=()=>renderer.render(scene,camera);
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();draw();};
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(el);
  const visibleObserver=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});visibleObserver.observe(el);
  const animate=(now:number)=>{frame=requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;if(!pauseRef.current&&!dragging){time+=dt;pivot.rotation.y+=dt*.15;pivot.position.y=Math.sin(time*.85)*.055;draw();}};
  frame=requestAnimationFrame(animate);
  const down=(e:PointerEvent)=>{dragging=true;prevX=e.clientX;prevY=e.clientY;canvas.setPointerCapture(e.pointerId);};
  const move=(e:PointerEvent)=>{if(!dragging)return;pivot.rotation.y+=(e.clientX-prevX)*.012;pivot.rotation.x=Math.max(-1.1,Math.min(1.1,pivot.rotation.x+(e.clientY-prevY)*.008));prevX=e.clientX;prevY=e.clientY;draw();};
  const up=()=>{dragging=false;};
  const keyboard=(e:KeyboardEvent)=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();pivot.rotation.y+=e.key==='ArrowRight'?.15:e.key==='ArrowLeft'?-.15:0;pivot.rotation.x+=e.key==='ArrowDown'?.15:e.key==='ArrowUp'?-.15:0;draw();};
  const lost=(e:Event)=>{e.preventDefault();setFallback(true);};
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('keydown',keyboard);canvas.addEventListener('webglcontextlost',lost);
  resetRef.current=()=>{pivot.rotation.set(.12,-.35,0);pivot.position.y=0;draw();};
  resize();
  return()=>{cancelAnimationFrame(frame);sizeObserver.disconnect();visibleObserver.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('keydown',keyboard);canvas.removeEventListener('webglcontextlost',lost);
   const materials=new Set<THREE.Material>(object.userData.materials);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});materials.forEach(m=>m.dispose());env.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();};
 },[kind]);
 return <div className="gaming-playground"><div className="scene-heading"><span><span className="status-dot"/> COLEÇÃO INTERATIVA</span><span>0{items.findIndex(i=>i.id===kind)+1} / 04</span></div>
  <div className="scene-container" ref={holder}>{fallback&&<div className="scene-fallback"><Token3D kind={kind}/><p>Prévia estática neste dispositivo.</p></div>}</div>
  <div className="scene-utility"><span><Move size={13}/> {fallback?'Coleção gamer':'Arraste para explorar'}</span><div><button aria-label={paused?'Ativar rotação automática':'Pausar rotação automática'} onClick={()=>setPaused(!paused)} disabled={fallback}>{paused?<Play size={15}/>:<Pause size={15}/>}</button><button aria-label="Redefinir posição 3D" onClick={()=>resetRef.current()} disabled={fallback}><RotateCcw size={15}/></button></div></div>
  <div className="scene-picker" role="group" aria-label="Escolher objeto 3D">{items.map(item=><button key={item.id} aria-pressed={kind===item.id} className={kind===item.id?'active':''} onClick={()=>setKind(item.id)}><BrandIcon kind={item.id}/>{item.name}</button>)}</div>
 </div>;
}
