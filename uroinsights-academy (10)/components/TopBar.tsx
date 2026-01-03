
import React from 'react';
import { Logo } from './Logo';
import { User } from '../types';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onLogout }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-8 sticky top-0 z-[40] shadow-sm">
      <div className="flex items-center gap-3">
        {/* Logo reduzida para a barra superior */}
        <div className="scale-50 origin-left">
          <Logo size="sm" />
        </div>
        <div className="flex flex-col -ml-4">
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">UroInsights</span>
          <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.4em] mt-0.5">Academy</span>
        </div>
      </div>
      
      {/* Elemento informativo à direita: Usuário e Logout */}
      <div className="ml-auto flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-black text-slate-800 tracking-tight leading-none truncate max-w-[150px] md:max-w-[250px]">
            {user.name}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {user.email}
          </span>
        </div>
        
        <div className="h-8 w-[1px] bg-slate-100"></div>
        
        <button 
          onClick={onLogout}
          className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group shadow-sm flex items-center justify-center"
          title="Sair da conta"
        >
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};
