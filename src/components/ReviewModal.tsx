import { useDialog } from '../hooks/useDialog';
import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Check, Sparkles, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { UserAccount, Review } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    category?: string;
    accentColor?: string;
  } | null;
  user: UserAccount;
  existingReview?: Review | null;
  onSubmitReview: (reviewData: {
    productId: string;
    productName: string;
    rating: number;
    comment: string;
    reviewId?: string;
  }) => Promise<void>;
  onDeleteReview?: (reviewId: string) => Promise<void>;
}

const RATING_LABELS: Record<number, { text: string; color: string }> = {
  1: { text: 'Péssimo - Muito insatisfeito', color: 'text-rose-400' },
  2: { text: 'Ruim - Precisa melhorar', color: 'text-orange-400' },
  3: { text: 'Razoável - Entregou o básico', color: 'text-amber-400' },
  4: { text: 'Muito Bom - Recomendo!', color: 'text-lime-400' },
  5: { text: 'Excelente! - Perfeito, recomendo 100%', color: 'text-emerald-400' },
};

const SUGGESTED_TAGS = [
  '⚡ Entrega em segundos',
  '🛡️ Chave funcionou 100%',
  '💬 Suporte atencioso',
  '💰 Melhor preço do mercado',
  '🎮 Jogo ativado na Steam sem erro',
  '⭐ Atendimento nota 10',
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  user,
  existingReview,
  onSubmitReview,
  onDeleteReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if editing an existing review
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);
      setComment(existingReview.comment || '');
    } else {
      setRating(5);
      setComment('');
    }
    setErrorMessage(null);
  }, [existingReview, isOpen]);

  const dialog = useDialog(isOpen && !!product, onClose);
  if (!isOpen || !product) return null;

  const activeRating = hoverRating || rating;

  const handleAddTag = (tag: string) => {
    if (comment.includes(tag)) return;
    setComment((prev) => (prev ? `${prev}. ${tag}` : tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage('Por favor, escreva um breve comentário sobre sua experiência.');
      return;
    }
    if (comment.trim().length < 5) {
      setErrorMessage('O comentário deve ter no mínimo 5 caracteres.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSubmitReview({
        productId: product.id,
        productName: product.name,
        rating,
        comment: comment.trim(),
        reviewId: existingReview?.id,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar avaliação.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview?.id || !onDeleteReview) return;
    const confirm = window.confirm('Tem certeza que deseja excluir sua avaliação?');
    if (!confirm) return;

    try {
      setIsDeleting(true);
      await onDeleteReview(existingReview.id);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir avaliação.';
      setErrorMessage(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Avaliar produto" tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-8 rounded-3xl bg-[#0c1018] border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#080b12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-display">
                {existingReview ? 'Editar Avaliação' : 'Avaliar Produto Comprado'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Compartilhe sua opinião sobre este produto
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product preview banner */}
        <div className="p-4 bg-[#111726] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-emerald-400 font-bold text-sm">
              🎮
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">{product.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-400">
                  Compra Verificada em sua conta
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Interactive Star Rating Selector */}
          <div className="space-y-2 text-center bg-black/40 p-4 rounded-2xl border border-white/5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Sua Nota para o Produto
            </label>

            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = starValue <= activeRating;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                    aria-label={`Nota ${starValue} de 5`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className={`text-xs font-bold transition-colors ${RATING_LABELS[activeRating]?.color}`}>
              {RATING_LABELS[activeRating]?.text}
            </p>
          </div>

          {/* User Reviewer Identity */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-emerald-500/50 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400">
                Sua avaliação será salva no Firestore com seu perfil
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              VERIFICADO
            </span>
          </div>

          {/* Quick tags */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Sugestões rápidas de elogio (clique para adicionar):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment text area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="review-comment" className="text-slate-300 font-semibold">
                Seu Comentário Detalhado
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {comment.length}/500 caracteres
              </span>
            </div>
            <textarea
              id="review-comment"
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua compra, a rapidez da entrega, facilidade de ativação ou atendimento..."
              className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            {existingReview ? (
              <button
                type="button"
                disabled={isDeleting || isSubmitting}
                onClick={handleDelete}
                className="px-3 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{existingReview ? 'Atualizar Avaliação' : 'Publicar Avaliação'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
