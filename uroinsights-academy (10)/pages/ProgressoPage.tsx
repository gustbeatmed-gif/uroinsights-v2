
import React from 'react';
import { User } from '../types';
import { dbService } from '../services/db';
import { THEMES, getLevelFromXp, LEVEL_CONFIG } from '../constants';
import { XPBar } from '../components/XPBar';

interface ProgressoPageProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const ProgressoPage: React.FC<ProgressoPageProps> = ({ user }) => {
  const userProgress = dbService.getUserProgress(user.id);
  const currentLevelInfo = getLevelFromXp(user.xp);
  
  const totalQuestions = userProgress.reduce((acc, p) => acc + p.questionsCompleted, 0);
  const activeThemesCount = userProgress.length;
  const averageProgress = userProgress.length > 0 
    ? Math.round(userProgress.reduce((acc, p) => acc + (p.questionsCompleted / 50 * 100), 0) / THEMES.length) 
    : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <h1 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Desempenho na UI Academy</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 md:col-span-2">
           <h2 className="text-lg font-black text-slate-800 mb-10 uppercase tracking-tight">Sua Evolução de Nível</h2>
           <XPBar xp={user.xp} />
           
           <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">XP Total</div>
                 <div className="text-3xl font-black text-blue-900">{user.xp}</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Respostas</div>
                 <div className="text-3xl font-black text-emerald-600">{totalQuestions}</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Progresso</div>
                 <div className="text-3xl font-black text-amber-500">{averageProgress}%</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temas</div>
                 <div className="text-3xl font-black text-indigo-600">{activeThemesCount}</div>
              </div>
           </div>
        </div>

        {/* Card do Avatar de Nível Atualizado */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] p-10 rounded-[3rem] text-white shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-1000"></div>
           <div className="text-8xl mb-6 drop-shadow-2xl scale-110 group-hover:scale-125 transition-transform duration-500">
              {currentLevelInfo.icon}
           </div>
           <h3 className="text-3xl font-black mb-2 tracking-tighter">Nível {user.level}</h3>
           <p className="text-blue-200 font-black uppercase text-xs tracking-[0.2em] mb-8">
              {currentLevelInfo.name}
           </p>
           
           <div className="text-[10px] bg-white/10 px-6 py-3 rounded-full font-black uppercase tracking-[0.2em] border border-white/20 backdrop-blur-sm">
              {user.xp < 500000 ? 'Rumo ao Supremo!' : 'Olimpo Alcançado!'}
           </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Tabela de Hierarquia</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
           {LEVEL_CONFIG.map(l => (
             <div key={l.level} className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center text-center ${user.level >= l.level ? 'bg-white border-blue-500 shadow-md' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                <span className="text-2xl mb-2">{l.icon}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Lvl {l.level}</span>
                <span className="text-[10px] font-bold text-slate-700 leading-tight">{l.name}</span>
             </div>
           ))}
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Uro Temas Detalhados</h2>
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tema</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progresso</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">XP Acumulado</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
             {THEMES.map(theme => {
               const prog = userProgress.find(p => p.themeId === theme.id);
               const percent = prog ? Math.min(Math.round((prog.questionsCompleted / 50) * 100), 100) : 0;
               return (
                 <tr key={theme.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: theme.color }}></div>
                        <span className="font-black text-slate-800 text-lg tracking-tight">{theme.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                          <div className="w-40 bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                             <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${percent}%`, backgroundColor: theme.color }}></div>
                          </div>
                          <span className="text-sm font-black text-slate-400">{percent}%</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 font-black text-slate-600 text-lg">{prog?.xpEarned || 0} XP</td>
                    <td className="px-10 py-8 text-right">
                       <span className={`text-3xl ${percent >= 100 ? 'grayscale-0 opacity-100 animate-bounce' : 'grayscale opacity-20'}`}>🎖️</span>
                    </td>
                 </tr>
               );
             })}
           </tbody>
        </table>
      </div>
    </div>
  );
};
