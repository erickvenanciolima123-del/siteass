import { useDialog } from '../hooks/useDialog';
import React, { useState } from 'react';
import {
  X,
  Zap,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Sparkles,
  Check,
  Info,
  Star,
  MessageSquare,
  Edit3,
  Lock,
  LogIn,
} from 'lucide-react';
import { Product, UserAccount, Review } from '../types';
import { ThreeProductViewer } from './ThreeProductViewer';
import { ProductArtwork } from './ProductArtwork';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onDirectCheckout: (product: Product) => void;
  isAddedToCart: boolean;
  user: UserAccount;
  reviews: Review[];
  hasPurchased: boolean;
  onOpenReviewModal: (product: Product, existingReview?: Review | null) => void;
  onOpenAccountModal?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
  isAddedToCart,
  user,
  reviews,
  hasPurchased,
  onOpenReviewModal,
  onOpenAccountModal,
}) => {
  const [viewMode, setViewMode] = useState<'3D' | 'ART'>('ART');
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'REVIEWS'>('DETAILS');

  const dialog = useDialog(!!product, onClose);
  if (!product) return null;

  // Filter reviews for this product
  const productReviews = reviews.filter(
    (r) =>
      r.productId === product.id ||
      r.productName?.toLowerCase() === product.name.toLowerCase()
  );

  // User's own review if already submitted
  const userExistingReview = user.isLoggedIn
    ? productReviews.find((r) => r.userId === user.uid)
    : null;

  // Calculate dynamic rating
  const avgRating =
    productReviews.length > 0
      ? productReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / productReviews.length
      : product.rating || 5.0;

  return (
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Detalhes do produto" tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#0d111a] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header with Tabs */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#080b12]/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                {product.category.replace('_', ' ')}
              </span>
            </div>

            {/* Quick Rating pill in header */}
            <button
              type="button"
              onClick={() => setActiveTab('REVIEWS')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{avgRating.toFixed(1)}</span>
              <span className="text-amber-400/70 text-[10px]">({productReviews.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switching Tab Pills */}
            <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('DETAILS')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'DETAILS'
                    ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Detalhes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('REVIEWS')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'REVIEWS'
                    ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${activeTab === 'REVIEWS' ? 'fill-black' : 'fill-amber-400 text-amber-400'}`} />
                <span>Avaliações ({productReviews.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
            aria-label="Fechar janela"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Switchable between DETAILS and REVIEWS */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'DETAILS' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Visual Column: Switchable between 3D Viewer and Art */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Visualização do Item:</span>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/50 border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('3D')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        viewMode === '3D' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Modelo 3D
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('ART')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        viewMode === 'ART' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Capa Digital
                    </button>
                  </div>
                </div>

                {viewMode === '3D' ? (
                  <ThreeProductViewer
                    productName={product.name}
                    category={product.category}
                    accentColor={product.accentColor}
                  />
                ) : (
                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/40 p-2">
                    <ProductArtwork
                      productId={product.id}
                      productName={product.name}
                      category={product.category}
                      accentColor={product.accentColor}
                    />
                  </div>
                )}

                {/* Delivery and Stock Guarantee */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-mono">Envio</p>
                      <p className="font-semibold text-white">Automático 24/7</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-mono">Garantia</p>
                      <p className="font-semibold text-white">Reposição Total</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Column */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-black border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-mono uppercase block">Valor Especial</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      À vista no PIX ou Cartão em até 12x
                    </span>
                  </div>

                  {product.isSoldOut ? (
                    <span className="px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      Esgotado
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                      Disponível ({product.stockCount} un)
                    </span>
                  )}
                </div>

                {/* Key Features List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    O que está incluso:
                  </span>
                  <ul className="space-y-1.5">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Activation Guide */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1">
                    <Info className="w-3.5 h-3.5 text-sky-400" />
                    <span>Como Ativar:</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {product.activationGuide}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* REVIEWS TAB */
            <div className="space-y-6">
              {/* Header Score Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-3xl bg-gradient-to-br from-[#121826] to-[#0a0e17] border border-white/10">
                <div className="text-center sm:text-left flex flex-col justify-center sm:border-r sm:border-white/10 sm:pr-4">
                  <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">
                    Média de Avaliações
                  </span>
                  <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-1">
                    <span className="text-4xl font-black text-white font-mono">{avgRating.toFixed(1)}</span>
                    <span className="text-slate-500 text-sm font-mono">/ 5.0</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(avgRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    Com base em {productReviews.length} {productReviews.length === 1 ? 'avaliação' : 'avaliações'}
                  </span>
                </div>

                <div className="sm:col-span-2 flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-bold">Avaliações 100% Autênticas & Verificadas</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Apenas clientes que compraram e resgataram este produto têm permissão de publicar avaliações na plataforma com persistência no Firestore.
                  </p>
                </div>
              </div>

              {/* Review Call-to-action Banner based on User Status & Purchase */}
              <div className="p-4 rounded-2xl border transition-all">
                {user.isLoggedIn ? (
                  hasPurchased ? (
                    userExistingReview ? (
                      /* User already reviewed this product */
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                            <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-300">
                                Você já avaliou este produto!
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                                {userExistingReview.rating} ★
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1 italic">
                              "{userExistingReview.comment}"
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenReviewModal(product, userExistingReview)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar Avaliação</span>
                        </button>
                      </div>
                    ) : (
                      /* User purchased but hasn't reviewed yet */
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white flex items-center gap-2">
                              <span>Compra Verificada em sua Conta!</span>
                              <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
                                Liberado
                              </span>
                            </h4>
                            <p className="text-xs text-slate-300 mt-0.5">
                              Você adquiriu este produto! Compartilhe sua opinião sobre o produto e ajude outros compradores.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenReviewModal(product, null)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto shrink-0"
                        >
                          <Star className="w-4 h-4 fill-black" />
                          <span>Deixar Avaliação</span>
                        </button>
                      </div>
                    )
                  ) : (
                    /* User is logged in but hasn't bought this item */
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-white/10 p-4 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center shrink-0">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            Avaliação restrita para compradores
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Apenas clientes que compraram este produto podem publicar uma avaliação verificada.
                          </p>
                        </div>
                      </div>

                      {!product.isSoldOut && (
                        <button
                          type="button"
                          onClick={() => {
                            onDirectCheckout(product);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all self-start sm:self-auto shrink-0"
                        >
                          Comprar agora por R$ {product.price.toFixed(2).replace('.', ',')}
                        </button>
                      )}
                    </div>
                  )
                ) : (
                  /* User is not logged in */
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111726] border border-white/10 p-4 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <LogIn className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          Já comprou este item? Conecte sua conta
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Faça login com o Google para validar suas compras e deixar sua avaliação com estrelas.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenAccountModal) {
                          onOpenAccountModal();
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all self-start sm:self-auto shrink-0"
                    >
                      Fazer Login
                    </button>
                  </div>
                )}
              </div>

              {/* List of Verified Reviews for this product */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Todas as Avaliações ({productReviews.length})</span>
                  </h4>
                </div>

                {productReviews.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <Star className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-bold text-white">Nenhuma avaliação ainda</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Seja o primeiro a comprar e deixar sua avaliação para este produto!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productReviews.map((rev) => {
                      const isCurrentUserReview = user.isLoggedIn && rev.userId === user.uid;
                      return (
                        <div
                          key={rev.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isCurrentUserReview
                              ? 'bg-emerald-950/20 border-emerald-500/40'
                              : 'bg-black/40 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {rev.authorPhoto ? (
                                <img
                                  src={rev.authorPhoto}
                                  alt={rev.authorName}
                                  className="w-8 h-8 rounded-full border border-white/10 object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-white/10">
                                  {rev.authorInitial || rev.authorName?.charAt(0) || 'U'}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white">
                                    {rev.authorName}
                                  </span>
                                  {isCurrentUserReview && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                      Você
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Compra Verificada</span>
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500 block">
                                  {rev.date}
                                </span>
                              </div>
                            </div>

                            {/* Stars rating */}
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= rev.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                            "{rev.comment}"
                          </p>

                          {isCurrentUserReview && (
                            <div className="mt-3 pt-2 border-t border-emerald-500/20 flex justify-end">
                              <button
                                type="button"
                                onClick={() => onOpenReviewModal(product, rev)}
                                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Editar sua avaliação</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#080b12]/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Continuar Navegando
            </button>
            {activeTab === 'DETAILS' && (
              <button
                type="button"
                onClick={() => setActiveTab('REVIEWS')}
                className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Ver Avaliações ({productReviews.length})</span>
              </button>
            )}
          </div>

          {!product.isSoldOut && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  isAddedToCart
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAddedToCart ? 'No Carrinho' : 'Adicionar ao Carrinho'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onDirectCheckout(product);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>Comprar Agora</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
