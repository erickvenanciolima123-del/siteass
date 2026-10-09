import { useDialog } from '../hooks/useDialog';
import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
}) => {
  const dialog = useDialog(isOpen, onClose);
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Meu carrinho" tabIndex={-1} className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0c1018] border-l border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#080a0f]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-display">Meu Carrinho</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </span>
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

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Seu carrinho está vazio</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                Explore nosso catálogo de chaves Steam, assinaturas de streaming e jogos com entrega automática.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-all"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 rounded-2xl bg-[#111624] border border-white/10 flex items-center gap-3 relative group"
              >
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate max-w-[200px]" title={item.product.name}>
                      {item.product.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                    R$ {item.product.price.toFixed(2).replace('.', ',')} un.
                  </p>

                  {/* Quantity selector */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 rounded hover:bg-white/10 text-slate-300"
                        title="Diminuir"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        disabled={item.quantity >= item.product.stockCount}
                        className="p-1 rounded hover:bg-white/10 text-slate-300"
                        title="Aumentar"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-white font-mono">
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#080a0f] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tipo de produto</span>
              <span className="text-emerald-400 font-semibold">Digital</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-white">Subtotal</span>
              <span className="text-xl font-black text-white font-mono">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClearCart}
                className="p-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Limpar Carrinho"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onProceedCheckout}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
