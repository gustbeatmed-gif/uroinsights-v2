
import React from 'react';
import { Logo } from '../components/Logo';

interface LandingProps {
  onNavigate: (page: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-['Inter']">
      {/* Cabeçalho com Logo e Texto Aumentados */}
      <nav className="max-w-7xl mx-auto px-6 py-10 w-full flex justify-between items-center relative z-20">
        <div className="flex items-center gap-6 cursor-pointer" onClick={() => onNavigate('landing')}>
          <Logo size="md" />
          <div className="flex flex-col">
            <span className="text-4xl font-black tracking-tighter text-[#1e293b] leading-none uppercase">UroInsights</span>
            <span className="text-sm font-black text-blue-600 uppercase tracking-[0.5em] mt-2">Academy</span>
          </div>
        </div>
        <div className="flex gap-6">
          <button onClick={() => onNavigate('login')} className="px-6 py-3 font-black text-[#64748b] hover:text-[#1e293b] transition-colors uppercase text-sm tracking-widest">Login</button>
          <button onClick={() => onNavigate('signup')} className="px-10 py-4 bg-[#1d4ed8] text-white rounded-2xl font-black shadow-2xl shadow-blue-200 hover:bg-[#1e40af] transition-all transform hover:scale-105 active:scale-95">Cadastrar</button>
        </div>
      </nav>

      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-32">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-7xl md:text-9xl font-black text-[#1e293b] leading-[0.85] tracking-tighter mb-10">
            Aprenda <span className="text-[#2563eb]">Urologia</span> <br />
            com a UroInsights
          </h1>
          <p className="text-xl md:text-3xl text-[#64748b] max-w-3xl mx-auto mb-16 leading-relaxed font-bold">
            Plataforma completa para estudar Urologia com questões, flashcards, simulados e sistema de progressão gamificado
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20 w-full max-w-xl">
            <button 
              onClick={() => onNavigate('signup')} 
              className="flex-1 px-12 py-7 bg-[#1d4ed8] text-white rounded-[2.5rem] text-2xl font-black shadow-2xl shadow-blue-200 hover:bg-[#1e40af] transition-all transform active:scale-95"
            >
              Começar Agora
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="flex-1 px-12 py-7 bg-white text-[#1e293b] border-2 border-slate-100 rounded-[2.5rem] text-2xl font-black hover:bg-slate-50 transition-all shadow-lg active:scale-95"
            >
              Fazer Login
            </button>
          </div>

          {/* Logo Gigante 30% maior abaixo dos botões conforme solicitado */}
          <div className="mt-4 animate-in zoom-in fade-in duration-1000">
            <Logo size="xl" className="drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Seção de Planos */}
      <section id="planos" className="py-32 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase">Planos Academy Premium</h2>
          <p className="text-slate-500 font-bold text-xl mb-20">Acelere seu conhecimento com acesso total.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Free */}
            <div className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 flex flex-col text-left">
              <h3 className="text-3xl font-black mb-4">Gratuito</h3>
              <div className="text-5xl font-black text-slate-400 mb-10">R$ 0</div>
              <ul className="space-y-5 mb-12 text-slate-500 font-bold text-lg flex-1">
                <li className="flex items-center gap-3">✓ 10% do conteúdo</li>
                <li className="flex items-center gap-3">✓ Questões básicas</li>
                <li className="flex items-center gap-3">✓ Flashcards essenciais</li>
                <li className="flex items-center gap-3 opacity-30">✕ Simulados Premium</li>
              </ul>
              <button onClick={() => onNavigate('signup')} className="w-full py-5 bg-slate-200 text-slate-600 rounded-3xl font-black text-lg hover:bg-slate-300 transition-all">Começar Grátis</button>
            </div>

            {/* Premium Anual */}
            <div className="p-12 bg-blue-900 rounded-[3.5rem] border-4 border-amber-400 flex flex-col text-left text-white shadow-2xl scale-105 relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-blue-900 px-8 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg">MAIS POPULAR</div>
              <h3 className="text-3xl font-black mb-4">Premium Anual</h3>
              <div className="text-6xl font-black mb-4 tracking-tighter">R$ 750</div>
              <div className="text-lg font-bold text-blue-200 mb-10">Equivale a R$ 62,50/mês</div>
              <ul className="space-y-5 mb-12 text-blue-50 font-bold text-lg flex-1">
                <li className="flex items-center gap-3">✓ 100% do conteúdo liberado</li>
                <li className="flex items-center gap-3">✓ +1.000 questões comentadas</li>
                <li className="flex items-center gap-3">✓ Decks ilimitados (SM2)</li>
                <li className="flex items-center gap-3">✓ Suporte via WhatsApp</li>
              </ul>
              <button onClick={() => onNavigate('signup')} className="w-full py-6 bg-amber-400 text-blue-900 rounded-3xl font-black text-xl hover:bg-amber-300 shadow-xl transform active:scale-95 transition-all">Assinar Agora 💎</button>
            </div>

            {/* Premium Mensal */}
            <div className="p-12 bg-white rounded-[3.5rem] border border-slate-100 flex flex-col text-left shadow-2xl">
              <h3 className="text-3xl font-black mb-4">Premium Mensal</h3>
              <div className="text-5xl font-black text-slate-800 mb-10">R$ 69,90</div>
              <ul className="space-y-5 mb-12 text-slate-500 font-bold text-lg flex-1">
                <li className="flex items-center gap-3">✓ Acesso total mensal</li>
                <li className="flex items-center gap-3">✓ Renovação automática</li>
                <li className="flex items-center gap-3">✓ Sem fidelidade</li>
              </ul>
              <button onClick={() => onNavigate('signup')} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg hover:bg-blue-700 transition-all">Assinar Mensal</button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer com botão de Admin no final conforme solicitado */}
      <footer className="py-24 bg-slate-900 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex flex-col items-center gap-4 mb-12">
            <Logo size="md" className="grayscale opacity-50 brightness-200" />
            <span className="font-black text-white text-3xl tracking-tighter uppercase">UroInsights Academy</span>
          </div>
          
          <div className="flex gap-10 mb-12 text-slate-500 font-bold text-sm uppercase tracking-widest">
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Termos</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacidade</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contato</button>
          </div>

          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mb-16">
            &copy; 2025 UroInsights. Todos os direitos reservados.
          </p>

          <div className="pt-12 border-t border-slate-800 w-full max-w-lg">
            <button 
              onClick={() => onNavigate('admin')} 
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-sm hover:bg-white hover:text-slate-900 transition-all uppercase tracking-[0.3em] shadow-lg"
            >
              Acesso Restrito Admin 🔒
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
