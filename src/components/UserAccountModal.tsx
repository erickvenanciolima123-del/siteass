import { useDialog } from '../hooks/useDialog';
import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  Copy,
  Check,
  LogIn,
  LogOut,
  ShieldCheck,
  Key,
  Database,
  Cloud,
  Star,
} from 'lucide-react';
import { UserAccount, Order, Review } from '../types';
import { signInWithGoogle, logOut } from '../services/firestoreService';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'ACCOUNT' | 'ORDERS';
  user: UserAccount;
  onUpdateUser: (user: UserAccount) => void;
  orders: Order[];
  reviews?: Review[];
  onOpenReviewModal?: (product: { id: string; name: string }) => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'ACCOUNT',
  user,
  onUpdateUser,
  orders,
  reviews = [],
  onOpenReviewModal,
}) => {
  const [activeTab, setActiveTab] = useState<'ACCOUNT' | 'ORDERS'>(initialTab);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginDiscord, setLoginDiscord] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  React.useEffect(() => { if (isOpen) setActiveTab(initialTab); }, [isOpen, initialTab]);
  const dialog = useDialog(isOpen, onClose);
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const fbUser = await signInWithGoogle();
      const updatedUser: UserAccount = {
        uid: fbUser.uid,
        name: fbUser.displayName || 'Gamer',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || undefined,
        isLoggedIn: true,
      };
      onUpdateUser(updatedUser);
    } catch (err) {
      console.error(err);
      setAuthError('Não foi possível autenticar com o Google. Tente novamente.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    onUpdateUser({
      name: loginName || loginEmail.split('@')[0],
      email: loginEmail,
      discord: loginDiscord || undefined,
      isLoggedIn: true,
    });
  };

  const handleLogoutClick = async () => {
    try {
      await logOut();
    } catch (err) {
      console.warn('Firebase logout warning:', err);
    }
    onUpdateUser({
      name: 'Visitante',
      email: '',
      isLoggedIn: false,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Conta e pedidos" tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#0c1018] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header Tabs */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#080b12]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('ACCOUNT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ACCOUNT'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Minha Conta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ORDERS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ORDERS'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Minhas Compras ({orders.length})</span>
            </button>
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

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'ACCOUNT' ? (
            <div className="space-y-6">
              {user.isLoggedIn ? (
                /* Logged In Profile */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/20 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/40 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold flex items-center justify-center text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                          {user.name}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                            VERIFICADO
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">{user.email}</p>
                        {user.uid && (
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            ID: {user.uid.slice(0, 14)}...
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Sair da Conta"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cloud Database Connected Banner */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-400">Banco de Dados Ativo</p>
                        <p className="text-slate-400 text-[11px]">
                          Dados sincronizados na nuvem Firestore
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      ONLINE
                    </span>
                  </div>

                  {/* Account Perks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#111624] border border-white/10 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="font-bold text-white">Garantia Ativa</p>
                        <p className="text-slate-400 text-[11px]">Suporte prioritário 24 horas</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#111624] border border-white/10 flex items-center gap-3">
                      <Key className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="font-bold text-white">Histórico Seguro</p>
                        <p className="text-slate-400 text-[11px]">Chaves salvas permanentemente</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Login / Register Form */
                <div className="space-y-4">
                  <div className="text-center max-w-sm mx-auto mb-4">
                    <h3 className="text-lg font-bold text-white font-display">Acesse sua Conta</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Conecte-se com sua conta Google para salvar suas compras, resgatar chaves e manter seus dados protegidos na nuvem.
                    </p>
                  </div>

                  {authError && (
                    <div className="max-w-sm mx-auto p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                      {authError}
                    </div>
                  )}

                  {/* Primary Google Login Button */}
                  <div className="max-w-sm mx-auto">
                    <button
                      type="button"
                      disabled={isLoadingAuth}
                      onClick={handleGoogleSignIn}
                      className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>
                        {isLoadingAuth ? 'Conectando ao Google...' : 'Entrar com Conta Google'}
                      </span>
                    </button>
                  </div>

                  <div className="relative my-4 max-w-sm mx-auto">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-[#0c1018] px-2 text-slate-500 font-mono">
                        ou preencha manualmente
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleManualLogin} className="space-y-3 max-w-sm mx-auto">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Seu Nome ou Nick</label>
                      <input
                        type="text"
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        placeholder="Ex: Erick"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#111624] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">E-mail</label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#111624] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Tag do Discord (Opcional)
                      </label>
                      <input
                        type="text"
                        value={loginDiscord}
                        onChange={(e) => setLoginDiscord(e.target.value)}
                        placeholder="usuario#0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#111624] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#141b2d] hover:bg-[#1a233a] border border-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4 text-emerald-400" />
                      <span>Continuar com e-mail</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            /* Orders History Tab */
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                    <Package className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white">Nenhuma compra realizada ainda</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Seus pedidos aparecerão aqui. Os pedidos de demonstração ficam salvos apenas neste navegador.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-[#111624] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
                      <div>
                        <span className="font-mono font-bold text-white">Pedido #{order.id}</span>
                        <span className="text-slate-500 text-[11px] block">{Number.isNaN(Date.parse(order.createdAt)) ? order.createdAt : new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">
                          {order.isDemo ? 'Demonstração' : order.status === 'PAID' ? 'Entregue' : 'Pendente'}
                        </span>
                        <p className="text-white font-mono font-bold text-sm mt-0.5">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>

                    {/* Order Items & Keys */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => {
                        const existingUserReview = reviews.find(
                          (r) =>
                            (r.productId === item.productId ||
                              r.productName?.toLowerCase() === item.productName?.toLowerCase()) &&
                            r.userId === user.uid
                        );

                        return (
                          <div key={idx} className="space-y-1.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-200">
                                {item.productName} ({item.quantity}x)
                              </p>

                              {onOpenReviewModal && !order.isDemo && order.status === 'PAID' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onOpenReviewModal({
                                      id: item.productId,
                                      name: item.productName,
                                    });
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                                    existingUserReview
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                                  }`}
                                  title={existingUserReview ? 'Editar avaliação' : 'Deixar avaliação'}
                                >
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>
                                    {existingUserReview
                                      ? `Avaliado (${existingUserReview.rating}★)`
                                      : 'Avaliar Produto'}
                                  </span>
                                </button>
                              )}
                            </div>

                          {item.deliveredKeys.map((keyString, kIdx) => (
                            <div
                              key={kIdx}
                              className="p-2 rounded-lg bg-black/60 border border-white/5 flex items-center justify-between text-xs font-mono text-emerald-300"
                            >
                              <span className="truncate select-all mr-2">{keyString}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(keyString)}
                                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white shrink-0 transition-colors"
                                title="Copiar"
                              >
                                {copiedKey === keyString ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
