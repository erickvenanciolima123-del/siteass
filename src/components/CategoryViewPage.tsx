import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Product, CategoryId } from '../types';
import { Catalog } from './Catalog';
import { categoryLabels } from '../lib/catalog';
interface Props { initialCategory:CategoryId;products:Product[];onOpenDetails:(p:Product)=>void;onAddToCart:(p:Product)=>void;cartProductIds:string[];onBackToHome:()=>void; }
export const CategoryViewPage=(p:Props)=><main id="main-content" tabIndex={-1} className="shell full-catalog"><div className="catalog-breadcrumb"><button onClick={p.onBackToHome}><ArrowLeft size={14}/> Início</button><ChevronRight size={14}/><span>{categoryLabels[p.initialCategory]}</span></div><Catalog key={p.initialCategory} {...p} full/></main>;
