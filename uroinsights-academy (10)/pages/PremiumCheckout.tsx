
import React, { useState } from 'react';
import { User } from '../types';
import { dbService } from '../services/db';
import { Logo } from '../components/Logo';

interface CheckoutProps {
  user: User;
  onSuccess: (updatedUser: User) => void;
  onCancel: () => void;
}

export const PremiumCheckout: React.FC<CheckoutProps> = ({ user, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'anual' | 'mensal'>('anual');

  const handleCheckout = () => {
    setLoading(true);
    // Simula processamento PagSeguro
    setTimeout(() => {
      const updatedUser = dbService.upgradeToPremium(user.id, selectedPlan);
      onSuccess(updatedUser!);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Info Col */}
        <div className="p-12 md:p-16 bg-blue-900 text-white flex flex-col justify-center">
          <div className="mb-10 flex flex-col items-center md:items-start gap-4">
            <Logo size="md" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white leading-none uppercase">UroInsights</span>
              <span className="text-[8px] font-black text-amber-400 uppercase tracking-[0.5em] mt-2">Academy</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter mb-6 leading-tight">Escolha sua jornada para a aprovação</h1>
          <p className="text-blue-100 text-lg font-bold opacity-80 mb-10 leading-relaxed">Assine agora e tenha acesso imediato a mais de 1.000 questões premium por 1 ano completo.</p>
          
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center">✓</span>
              Banco completo de Uropediatria a Oncologia
            </li>
            <li className="flex items-center gap-3 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center">✓</span>
              Decks de memorização avançada (SM2)
            </li>
            <li className="flex items-center gap-3 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center">✓</span>
              Simulados modo prova ilimitados
            </li>
          </ul>

          <div className="mt-auto pt-8 border-t border-blue-800 flex items-center gap-3 opacity-60">
             <div className="text-[10px] font-black uppercase tracking-widest">Pagamento Seguro via PagSeguro Connect</div>
          </div>
        </div>

        {/* Form Col */}
        <div className="p-12 md:p-16 flex flex-col justify-center">
           <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Finalizar Assinatura</h2>
           
           <div className="space-y-4 mb-10">
              <button 
                onClick={() => setSelectedPlan('anual')}
                className={`w-full p-6 rounded-[2rem] border-2 transition-all text-left flex justify-between items-center ${
                  selectedPlan === 'anual' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-100'
                }`}
              >
                 <div>
                    <div className="font-black text-lg text-slate-800">Plano Anual 💎</div>
                    <div className="text-xs text-slate-400 font-bold">Acesso por 365 dias</div>
                 </div>
                 <div className="text-right">
                    <div className="font-black text-2xl text-blue-600">R$ 750</div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase">12% de Desconto</div>
                 </div>
              </button>

              <button 
                onClick={() => setSelectedPlan('mensal')}
                className={`w-full p-6 rounded-[2rem] border-2 transition-all text-left flex justify-between items-center ${
                  selectedPlan === 'mensal' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-100'
                }`}
              >
                 <div>
                    <div className="font-black text-lg text-slate-800">Plano Mensal</div>
                    <div className="text-xs text-slate-400 font-bold">Renovação recorrente</div>
                 </div>
                 <div className="text-right">
                    <div className="font-black text-2xl text-slate-800">R$ 69,90</div>
                 </div>
              </button>
           </div>

           <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">💳</div>
                 <div className="text-sm font-bold text-slate-500">Cartão de Crédito (Simulado)</div>
              </div>
              
              <button 
                disabled={loading}
                onClick={handleCheckout}
                className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Confirmar Pagamento</>
                )}
              </button>

              <button onClick={onCancel} className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">Cancelar e voltar</button>
           </div>
        </div>
      </div>
    </div>
  );
};
