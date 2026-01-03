
import React, { useState } from 'react';
import { User, NewsItem } from '../types';
import { dbService } from '../services/db';
import { THEMES, LEVEL_CONFIG, getLevelFromXp } from '../constants';
import { XPBar } from '../components/XPBar';

interface DashboardProps {
  user: User;
  onNavigate: (page: string, params?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const news = dbService.getNews(user);
  const progress = dbService.getUserProgress(user.id);
  const activities = dbService.getActivities(user.id).slice(0, 4);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  const totalQuestionsDone = progress.reduce((acc, p) => acc + p.questionsCompleted, 0);
  const averageProgress = progress.length > 0 
    ? Math.round(progress.reduce((acc, p) => acc + (p.questionsCompleted / 50 * 100), 0) / THEMES.length) 
    : 0;

  const currentLevelInfo = getLevelFromXp(user.xp);

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'question': return <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
      case 'level': return <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
      case 'subscription': return <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">💎</div>;
      default: return null;
    }
  };

  const rawFirstName = (user?.name || 'Usuário').split(' ')[0];
  const firstName = rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1).toLowerCase();

  return (
    <div className="p-8 pt-6 max-w-7xl mx-auto animate-in fade-in duration-700 min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="bg-[#1d4ed8] rounded-2xl p-10 mb-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-center">
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight mb-2">
              Bem-vindo, {firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg font-bold opacity-90">
              {currentLevelInfo.name} {currentLevelInfo.icon}
            </p>
          </div>
          
          {user.subscriptionStatus === 'free' && (
            <button 
              onClick={() => onNavigate('premium-checkout')}
              className="mt-6 md:mt-0 px-8 py-4 bg-amber-400 text-blue-900 rounded-2xl font-black text-sm shadow-xl hover:bg-amber-300 transform active:scale-95 transition-all z-10"
            >
              SEJA PREMIUM AGORA 🚀
            </button>
          )}
          
          <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 translate-x-32"></div>
        </div>

        {/* Bloco de Progresso e Estatísticas */}
        <div className="flex flex-col gap-6 mb-12">
          {/* Card de Evolução (Full Width no Grid Superior) */}
          <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-3 text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z" strokeWidth="2"/><path d="M12 11a1 1 0 100-2 1 1 0 000 2z" strokeWidth="2"/><path d="M12 7a5 5 0 100 10 5 5 0 000-10z" strokeWidth="2"/></svg>
                <span className="text-sm font-black uppercase tracking-widest">Sua Evolução na UI Academy</span>
              </div>
              <div className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-widest flex items-center gap-2">
                <span>🌟</span> {user.subscriptionStatus === 'premium' ? 'Membro Premium' : 'Free User'}
              </div>
            </div>
            
            <XPBar xp={user.xp} />
          </div>

          {/* Cards de Métricas Lado a Lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/40 border-2 border-emerald-100 p-8 rounded-[2rem] shadow-sm flex flex-col items-start transition-all hover:scale-[1.02] group">
              <div className="flex items-center gap-3 text-emerald-600 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-sm font-black uppercase tracking-widest">XP Total Acumulado</span>
              </div>
              <div className="text-6xl font-black text-emerald-800 mb-2">{user.xp}</div>
              <div className="text-sm text-emerald-600 font-bold">Experiência vitalícia</div>
            </div>

            <div className="bg-purple-50/40 border-2 border-purple-100 p-8 rounded-[2rem] shadow-sm flex flex-col items-start transition-all hover:scale-[1.02] group">
              <div className="flex items-center gap-3 text-purple-600 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Estudos Realizados</span>
              </div>
              <div className="text-6xl font-black text-purple-800 mb-2">{totalQuestionsDone}</div>
              <div className="text-sm text-purple-600 font-bold">Questões respondidas</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
               <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Atalhos de Aprendizado</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button onClick={() => onNavigate('simulados')} className="p-8 bg-slate-50 rounded-[2rem] flex items-center gap-5 hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-100">
                     <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">📚</div>
                     <div className="text-left">
                        <div className="font-black text-xl text-slate-800">Simulados</div>
                        <div className="text-xs text-slate-500 font-bold mt-1">Pratique como na prova real</div>
                     </div>
                  </button>
                  <button onClick={() => onNavigate('flashcards')} className="p-8 bg-slate-50 rounded-[2rem] flex items-center gap-5 hover:bg-amber-50 transition-all border-2 border-transparent hover:border-amber-100">
                     <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl">🧠</div>
                     <div className="text-left">
                        <div className="font-black text-xl text-slate-800">Flashcards</div>
                        <div className="text-xs text-slate-500 font-bold mt-1">Memorização espaçada SM2</div>
                     </div>
                  </button>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Atualizações Recentes</h2>
              <div className="space-y-10">
                {news.map((item) => {
                  const theme = THEMES.find(t => t.id === item.themeId);
                  return (
                    <div key={item.id} onClick={() => setSelectedNews(item)} className="relative pl-8 border-l-4 transition-all hover:translate-x-1 cursor-pointer group" style={{ borderColor: theme?.color || '#e2e8f0' }}>
                      <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight group-hover:text-blue-700">{item.title}</h3>
                      <p className="text-slate-500 text-sm mb-4 font-medium line-clamp-2">{(item.summary || item.content || '').substring(0, 150)}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase border" style={{ borderColor: `${theme?.color}40`, color: theme?.color, backgroundColor: `${theme?.color}10` }}>
                          <span>{theme?.icon}</span>
                          <span>{theme?.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-10">
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h2 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-tight">Atividade Recente</h2>
                <div className="space-y-6">
                   {activities.map(activity => (
                     <div key={activity.id} className="flex gap-4 items-center">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <div className="text-sm font-black text-slate-900">{activity.title}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{activity.subtitle}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-10 border-t border-slate-100 flex flex-col items-center">
         <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">&copy; 2025 UroInsights Academy</p>
         <button 
           onClick={() => onNavigate('admin')}
           className="px-8 py-3 bg-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 transition-all shadow-sm"
         >
           Painel de Administração 🔒
         </button>
      </footer>

      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedNews(null)}></div>
           <div className="relative bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[3rem] shadow-2xl p-12">
              <h2 className="text-3xl font-black text-slate-900 mb-6">{selectedNews.title}</h2>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">{selectedNews.content || selectedNews.summary}</p>
              <div className="mt-12 flex justify-end">
                 <button onClick={() => setSelectedNews(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm">Fechar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
