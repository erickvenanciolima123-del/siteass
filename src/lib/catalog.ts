import { CategoryId, Product } from '../types';

export const categoryLabels: Record<CategoryId, string> = { ALL: 'Todos', KEYS: 'Steam Keys', ASSINATURAS: 'Assinaturas', DESTAQUES: 'Destaques', ACAO_AVENTURA: 'Ação e aventura', VIRAIS: 'Digitais' };
export const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const matchesSearch = (p: Product, query: string) => normalize(`${p.name} ${p.category} ${p.description} ${categoryLabels[p.category]}`).includes(normalize(query.trim()));
