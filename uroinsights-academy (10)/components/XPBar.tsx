
import React from 'react';
import { LEVEL_CONFIG } from '../constants';

interface XPBarProps {
  xp: number;
}

export const XPBar: React.FC<XPBarProps> = ({ xp }) => {
  const currentLevelInfo = LEVEL_CONFIG.find(l => xp >= l.minXp && xp <= l.maxXp) || LEVEL_CONFIG[LEVEL_CONFIG.length - 1];
  const nextLevelInfo = LEVEL_CONFIG.find(l => l.level === currentLevelInfo.level + 1) || null;
  
  // Cálculo de progresso dentro do nível atual
  let progress = 100;
  if (nextLevelInfo) {
    const range = currentLevelInfo.maxXp - currentLevelInfo.minXp + 1;
    const progressInLevel = xp - currentLevelInfo.minXp;
    progress = (progressInLevel / range) * 100;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-sm">{currentLevelInfo.icon}</span>
          <div className="flex flex-col">
            <span className="text-xs font-black text-blue-900 uppercase tracking-widest">Nível {currentLevelInfo.level}</span>
            <span className="text-[10px] font-bold text-slate-400">{currentLevelInfo.name}</span>
          </div>
        </div>
        
        {nextLevelInfo && (
          <div className="flex items-center gap-2 text-right">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Próximo</span>
              <span className="text-[10px] font-bold text-slate-300">{nextLevelInfo.name}</span>
            </div>
            <span className="text-2xl opacity-40 grayscale">{nextLevelInfo.icon}</span>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner border border-slate-200/50">
          <div 
            className="bg-gradient-to-r from-blue-600 via-blue-400 to-amber-400 h-full transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          >
            <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-bar-stripes_1s_linear_infinite]"></div>
          </div>
        </div>
        
        {/* Marcadores de ícone na barra (Jornada) */}
        <div className="flex justify-between mt-2 px-1">
          <span className="text-[10px] font-black text-blue-600">{currentLevelInfo.minXp} XP</span>
          <span className="text-[10px] font-black text-slate-400">{xp} / {nextLevelInfo ? nextLevelInfo.minXp : 'MAX'} XP</span>
          {nextLevelInfo && <span className="text-[10px] font-black text-slate-300">{nextLevelInfo.minXp} XP</span>}
        </div>

        {/* Ícone de jornada Central */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-100 scale-75 md:scale-90">
           <span className="text-xs font-bold">{currentLevelInfo.icon}</span>
           <span className="text-[10px] font-black text-slate-300">→</span>
           <span className="text-xs font-bold opacity-50">{nextLevelInfo?.icon || '⭐'}</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress-bar-stripes {
          from { background-position: 0 0; }
          to { background-position: 20px 0; }
        }
      `}} />
    </div>
  );
};
