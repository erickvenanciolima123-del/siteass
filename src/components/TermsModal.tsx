import { useDialog } from '../hooks/useDialog';
import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, title }) => {
  const dialog = useDialog(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Termos e informações" tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0c1018] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#080b12]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-display">{title}</h2>
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

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Garantia e Segurança Abravanel Shop</p>
              <p className="text-[11px] text-slate-400">Todos os pedidos são processados com criptografia e entrega automática.</p>
            </div>
          </div>

          <h3 className="font-bold text-white text-sm">1. Entrega e Prazos</h3>
          <p>
            A entrega das chaves digitais e credenciais é 100% automatizada e ocorre imediatamente após a confirmação do pagamento via PIX ou Cartão de Crédito. Os dados ficam disponíveis no painel "Minhas Compras" e também enviados para o e-mail informado.
          </p>

          <h3 className="font-bold text-white text-sm">2. Garantia de Funcionamento e Reposição</h3>
          <p>
            Todas as chaves da Steam e acessos a serviços de streaming possuem garantia total de funcionamento. Caso ocorra qualquer inconsistência ou chave inválida, nosso suporte via Discord ou WhatsApp efetua a reposição imediata mediante apresentação do recibo do pedido.
          </p>

          <h3 className="font-bold text-white text-sm">3. Responsabilidades do Usuário</h3>
          <p>
            O cliente é responsável por manter seus dados e e-mail corretos no momento da compra. Recomendamos a ativação imediata das chaves na plataforma oficial (Steam, Netflix, Max, etc.).
          </p>

          <h3 className="font-bold text-white text-sm">4. Política de Reembolso</h3>
          <p>
            Produtos digitais entregues e ativados com sucesso não são passíveis de devolução. Em casos de indisponibilidade comprovada sem reposição possível em 24h, o estorno total via Pix é realizado prontamente.
          </p>
        </div>

        <div className="p-4 border-t border-white/10 bg-[#080b12] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
