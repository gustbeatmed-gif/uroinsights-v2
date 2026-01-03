
import React, { useState } from 'react';
import { dbService } from '../services/db';
import { User } from '../types';
import { Logo } from '../components/Logo';

interface SignupProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ onLogin, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = dbService.registerUser(email, name, password);
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col animate-in fade-in duration-700 overflow-x-hidden">
      <header className="w-full flex justify-center pt-8 pb-4">
        <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => onNavigate('landing')}>
          <Logo size="md" className="group-hover:scale-110 transition-transform duration-500" />
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">UroInsights</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1">Academy</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Elementos Decorativos de Fundo (Blur) */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-amber-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
          
          {/* Lado Esquerdo: Composição Visual Gamificada */}
          <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative group w-full max-w-lg mb-16">
              
              {/* Badges de Gamificação Flutuantes */}
              <div className="absolute -top-10 -right-6 bg-gradient-to-r from-amber-400 to-orange-500 text-blue-900 px-8 py-4 rounded-[2rem] font-black text-sm shadow-[0_20px_40px_rgba(251,191,36,0.4)] z-30 animate-bounce cursor-default">
                +100 XP 🪙
              </div>
              <div className="absolute -bottom-10 -left-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-[2rem] font-black text-sm shadow-[0_20px_40px_rgba(37,99,235,0.4)] z-30 cursor-default">
                NÍVEL 1 🚀
              </div>

              {/* Ícones de Estudo Flutuantes (Representação Gamificada) */}
              <div className="absolute top-1/4 -left-12 w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-3xl animate-pulse z-20 border border-slate-50">
                🧠
              </div>
              <div className="absolute bottom-1/4 -right-12 w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-3xl animate-pulse delay-700 z-20 border border-slate-50">
                🎯
              </div>
              <div className="absolute top-[-20px] left-1/4 w-14 h-14 bg-emerald-500 text-white rounded-2xl shadow-xl flex items-center justify-center text-xl animate-bounce delay-300 z-20">
                ✓
              </div>
              
              {/* Container da Imagem Central - Estilo Digital Learning */}
              <div className="w-full aspect-square rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.12)] border-[12px] border-white transform lg:-rotate-3 group-hover:rotate-0 group-hover:scale-[1.03] transition-all duration-1000 ease-out bg-slate-900">
                <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop" 
                  alt="UroInsights Academy - Estudo Gamificado" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                />
                {/* Overlay de Gradiente para dar profundidade */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent z-20"></div>
                
                {/* Elementos de Interface Simulados sobre a imagem */}
                <div className="absolute bottom-12 left-12 right-12 z-30">
                   <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                      <div className="h-full w-2/3 bg-amber-400"></div>
                   </div>
                   <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-3">Progresso da Lição: 65%</p>
                </div>
              </div>
            </div>
            
            <div className="max-w-md px-4 lg:px-0">
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.85]">
                Estudo Eficiente <br />
                <span className="text-blue-600">com Resultados 🚀</span>
              </h2>
              <p className="text-xl text-slate-500 font-bold mb-0 leading-relaxed">
                Transforme seu aprendizado em um <span className="text-slate-900 font-black underline decoration-blue-500 decoration-4">jogo de alta performance</span> médica.
              </p>
            </div>
          </div>

          {/* Lado Direito: Formulário de Cadastro */}
          <div className="w-full lg:w-[40%] max-w-md bg-white p-12 lg:p-16 rounded-[4rem] shadow-[0_60px_120px_rgba(0,0,0,0.07)] border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="mb-12 text-center lg:text-left relative z-10">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Bem-vindo(a)</h3>
              <p className="text-slate-400 font-bold text-sm">Crie seu perfil e comece a ganhar XP.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl transition-all font-bold text-slate-800 outline-none shadow-sm"
                  placeholder="Dr. Nome de Exemplo"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">E-mail Profissional</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl transition-all font-bold text-slate-800 outline-none shadow-sm"
                  placeholder="doutor@uroinsights.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Senha Secreta</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl transition-all font-bold text-slate-800 outline-none shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-6 mt-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Perfil Academy
              </button>
            </form>

            <div className="mt-12 text-center relative z-10 pt-8 border-t border-slate-50">
              <p className="text-slate-400 font-bold text-sm">
                Já possui acesso? <button onClick={() => onNavigate('login')} className="text-blue-600 font-black hover:underline ml-1">Fazer login</button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-12 text-center opacity-40">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">&copy; 2025 UroInsights Academy</p>
      </footer>
    </div>
  );
};
