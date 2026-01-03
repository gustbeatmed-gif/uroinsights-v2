
import React from 'react';
import { THEMES } from '../constants';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string, params?: any) => void;
  userProgress: any[];
  activeParams?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, userProgress, activeParams }) => {
  const mainMenu = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'progresso', name: 'Meu Progresso', icon: '📈' },
  ];

  const tools = [
    { id: 'flashcards', name: 'Flashcards', icon: '🧠' },
    { id: 'simulados', name: 'Simulados', icon: '🎯' },
  ];

  const currentThemeId = activeParams?.themeId;

  return (
    <aside className="w-72 bg-white h-screen border-r border-slate-100 hidden md:flex flex-col sticky top-0 shadow-sm z-50">
      <div className="flex flex-col h-full overflow-y-auto custom-scrollbar py-6">
        
        {/* Menu Principal */}
        <div className="px-6 mb-8">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Principal</h2>
          <nav className="space-y-1">
            {mainMenu.map((item) => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activePage === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Ferramentas */}
        <div className="px-6 mb-8">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Ferramentas</h2>
          <nav className="space-y-1">
            {tools.map((item) => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activePage === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Uro Temas */}
        <div className="px-4">
          <h2 className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Uro Temas</h2>
          <div className="space-y-1">
            {THEMES.map((theme) => {
              const prog = userProgress.find(p => p.themeId === theme.id);
              const percent = prog ? Math.min(Math.round((prog.questionsCompleted / 50) * 100), 100) : 0;
              const xp = prog ? prog.xpEarned : 0;
              const isActive = activePage === 'questions' && Number(currentThemeId) === Number(theme.id);
              
              return (
                <button 
                  key={theme.id}
                  onClick={() => onNavigate('questions', { themeId: theme.id })}
                  className={`w-full group px-3 py-4 rounded-2xl flex flex-col gap-2 transition-all border-2 ${
                    isActive ? 'bg-white border-blue-500 shadow-sm' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{theme.icon}</span>
                      <span className="text-xs font-bold text-slate-700">{theme.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 text-left">{xp} XP</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto px-6 pt-6 border-t border-slate-50">
          <button 
            onClick={() => onNavigate('login')}
            className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl w-full transition-all"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </aside>
  );
};
