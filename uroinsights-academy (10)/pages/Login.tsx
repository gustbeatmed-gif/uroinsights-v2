
import React, { useState } from 'react';
import { dbService } from '../services/db';
import { User } from '../types';
import { Logo } from '../components/Logo';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lista de credenciais administrativas
    const admins = [
      { email: 'urochamps@gmail.com', pass: 'mattox17' },
      { email: 'uroinsights@gmail.com', pass: 'bovolon0609' }
    ];

    const adminFound = admins.find(a => a.email === email);

    if (adminFound) {
      if (password === adminFound.pass) {
        let user = dbService.getUsers().find(u => u.email === email);
        if (!user) {
          // Se o admin não existir no banco (primeiro login), registra
          user = dbService.registerUser(email, 'Admin ' + email.split('@')[0], password);
          user.role = 'admin';
          user.subscriptionStatus = 'premium';
        }
        onLogin(user);
        return;
      } else {
        setError('Senha administrativa incorreta.');
        return;
      }
    }

    const user = dbService.getUsers().find(u => u.email === email);
    if (user) {
      if (user.password && user.password !== password) {
        setError('Senha incorreta. Tente novamente.');
        return;
      }
      onLogin(user);
    } else {
      setError('E-mail não cadastrado.');
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-slate-900/80 to-slate-900/90"></div>
      </div>

      <div className="relative z-10 w-full flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center mb-10 text-center">
             <Logo size="xl" className="mb-8" />
             <h1 className="text-4xl font-black text-white tracking-tighter">Login Academy</h1>
             <p className="text-blue-200 mt-2 font-bold opacity-80">Acesse sua jornada urológica.</p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white/10">
             <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-4 bg-red-50 text-red-700 text-sm font-black rounded-2xl border border-red-100">{error}</div>}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-2">E-mail</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-900 transition-all font-bold"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Senha</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-900 transition-all font-bold"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all"
                >
                  Entrar na Plataforma
                </button>
             </form>

             <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                <p className="text-slate-500 font-bold">
                  Novo aqui? <button onClick={() => onNavigate('signup')} className="text-blue-600 font-black hover:underline ml-1">Criar conta</button>
                </p>
             </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button onClick={() => onNavigate('landing')} className="text-xs font-black text-blue-300 uppercase tracking-widest hover:text-white transition-all py-2 px-4 rounded-full border border-blue-300/20">Voltar ao Início</button>
          </div>
        </div>
      </div>
    </div>
  );
};
