
import React, { useState, useEffect } from 'react';
import { User, Simulado, Question } from '../types';
import { dbService } from '../services/db';
import { THEMES } from '../constants';

interface SimuladosPageProps {
  user: User;
  onNavigate: (page: string, params?: any) => void;
  onXPUpdate: (amount: number, themeId?: number, title?: string) => void;
}

type ViewMode = 'list' | 'test' | 'results' | 'review';

export const SimuladosPage: React.FC<SimuladosPageProps> = ({ user, onNavigate, onXPUpdate }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeSimulado, setActiveSimulado] = useState<Simulado | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(30);

  // Lista apenas simulados acessíveis (Oficiais + Criados por ele)
  const availableSimulados = dbService.getSimulados(user.id);

  useEffect(() => {
    let interval: any;
    if (activeSimulado && viewMode === 'test' && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSimulado, viewMode, remainingSeconds]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startSimulado = (s: Simulado) => {
    setActiveSimulado(s);
    setUserAnswers({});
    const totalSecs = s.questionIds.length * 3 * 60; 
    setRemainingSeconds(totalSecs);
    setViewMode('test');
  };

  const buildAndStart = () => {
    if (selectedThemes.length === 0) return alert("Selecione ao menos um tema.");
    
    const allQs = dbService.getQuestions(user);
    const pool = allQs.filter(q => selectedThemes.includes(99) || selectedThemes.includes(q.themeId));
    
    if (pool.length === 0) return alert("Nenhuma questão encontrada.");

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, questionCount).map(q => q.id);

    const customSimulado: Simulado = {
      id: Date.now(),
      title: `Simulado Personalizado (${questionCount} questões)`,
      questionIds: selectedIds,
      durationMinutes: questionCount * 3,
      isPremium: true,
      authorId: user.id // Marca como simulado do aluno
    };

    if (confirm("Deseja salvar este simulado em sua lista para fazer depois?")) {
      dbService.addSimulado(customSimulado);
      alert("Simulado salvo em sua lista!");
    }
    
    startSimulado(customSimulado);
  };

  const toggleTheme = (id: number) => {
    setSelectedThemes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleAnswerChange = (qid: number, option: string) => {
    setUserAnswers(prev => ({ ...prev, [qid]: option }));
  };

  const handleFinish = () => {
    if (viewMode !== 'test') return;
    if (Object.keys(userAnswers).length < (activeSimulado?.questionIds.length || 0)) {
      if (!confirm("Existem questões sem resposta. Finalizar mesmo assim?")) return;
    }
    setViewMode('results');
    const correctCount = calculateScore();
    const pct = (correctCount / (activeSimulado?.questionIds.length || 1)) * 100;
    onXPUpdate(pct >= 50 ? 50 : 10, activeSimulado?.themeId, `Simulado: ${activeSimulado?.title}`);
  };

  const calculateScore = () => {
    if (!activeSimulado) return 0;
    let score = 0;
    activeSimulado.questionIds.forEach(qid => {
      const q = dbService.getQuestions().find(x => x.id === qid);
      if (q && userAnswers[qid] === q.correctOption) score++;
    });
    return score;
  };

  const handleDeletePersonal = (id: number) => {
    if (confirm("Excluir este simulado personalizado?")) {
      dbService.deleteSimulado(id);
      window.location.reload();
    }
  };

  const score = calculateScore();
  const total = activeSimulado?.questionIds.length || 0;
  const percentage = Math.round((score / total) * 100) || 0;

  if (viewMode === 'test' || viewMode === 'review') {
    return (
      <div className="p-8 max-w-4xl mx-auto pb-32">
        <div className="flex justify-between items-center mb-8 sticky top-20 bg-slate-50/90 backdrop-blur-md py-4 z-30">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{activeSimulado?.title}</h1>
            <p className="text-slate-500 font-bold text-sm">{viewMode === 'review' ? 'Revisão Comentada' : `Progresso: ${Object.keys(userAnswers).length} / ${total}`}</p>
          </div>
          {viewMode === 'test' && (
            <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-mono text-2xl shadow-xl border-b-4 border-blue-600">
              {formatTime(remainingSeconds)}
            </div>
          )}
        </div>

        <div className="space-y-10">
           {activeSimulado?.questionIds.map((qid, idx) => {
             const q = dbService.getQuestions().find(x => x.id === qid);
             if (!q) return null;
             const isCorrect = userAnswers[qid] === q.correctOption;
             const showResult = viewMode === 'review';
             return (
               <div key={qid} className={`bg-white p-10 rounded-[2.5rem] border-2 shadow-sm ${showResult ? (isCorrect ? 'border-emerald-100' : 'border-red-100') : 'border-slate-50'}`}>
                  <h3 className="text-xl font-bold mb-8 leading-relaxed text-slate-800">{q.statement}</h3>
                  <div className="space-y-4">
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <label key={opt} className={`flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                        showResult && q.correctOption === opt ? 'bg-emerald-50 border-emerald-500' : (userAnswers[qid] === opt ? 'bg-blue-50 border-blue-500' : 'border-slate-100')
                      }`}>
                        <input type="radio" className="hidden" disabled={showResult} checked={userAnswers[qid] === opt} onChange={() => handleAnswerChange(qid, opt)} />
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${userAnswers[qid] === opt ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{opt}</span>
                        <span className="text-lg font-bold">{q[`option${opt}` as keyof Question]}</span>
                      </label>
                    ))}
                  </div>
                  {showResult && <div className="mt-8 p-6 bg-slate-50 rounded-2xl text-sm font-medium text-slate-600 border border-slate-100">{q.explanation}</div>}
               </div>
             );
           })}
        </div>
        {viewMode === 'test' && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-40">
            <button onClick={handleFinish} className="w-full py-6 bg-blue-900 text-white rounded-[2rem] font-black text-xl shadow-2xl">Finalizar Simulado</button>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'results') {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-[4rem] p-16 shadow-2xl border border-slate-100">
          <div className="text-7xl mb-8">📊</div>
          <h2 className="text-4xl font-black text-slate-900 mb-8">Resultado</h2>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-emerald-50 p-10 rounded-[3rem] border-2 border-emerald-100">
               <div className="text-6xl font-black text-emerald-600">{score}/{total}</div>
               <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mt-2">Acertos</div>
            </div>
            <div className="bg-blue-50 p-10 rounded-[3rem] border-2 border-blue-100">
               <div className="text-6xl font-black text-blue-900">{percentage}%</div>
               <div className="text-xs font-black uppercase tracking-widest text-blue-400 mt-2">Aproveitamento</div>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setViewMode('review')} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black">Revisar Erros</button>
            <button onClick={() => setViewMode('list')} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black">Voltar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 pb-20">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Simulados UroInsights</h1>
        <p className="text-slate-500 font-bold mt-2">Pratique com simulados oficiais ou monte o seu personalizado.</p>
      </div>

      {/* Builder */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-10">
          <h2 className="text-2xl font-black tracking-tight text-slate-800">Montar Novo Simulado</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...THEMES, { id: 99, name: 'Aleatório', icon: '🎲' }].map(t => (
              <button key={t.id} onClick={() => toggleTheme(t.id)} className={`py-4 px-4 rounded-2xl text-sm font-black border-2 transition-all flex items-center justify-center gap-3 ${selectedThemes.includes(t.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                <span>{t.icon}</span> {t.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[15, 30, 60, 90].map(n => (
              <button key={n} onClick={() => setQuestionCount(n)} className={`p-4 rounded-2xl border-2 font-black ${questionCount === n ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                {n} Q
              </button>
            ))}
          </div>
          <button onClick={buildAndStart} className="w-full py-6 bg-blue-900 text-white rounded-[2rem] font-black text-xl shadow-xl transform active:scale-95 transition-all">🚀 Gerar e Iniciar Simulado</button>
        </div>
      </div>

      {/* Grid Simulados (Oficiais e Salvos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {availableSimulados.map(s => (
          <div key={s.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-xl">
            <div className="flex justify-between items-start mb-8">
              <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${s.authorId ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {s.authorId ? 'Meu Simulado' : 'Oficial UI'}
              </span>
              {s.authorId && <button onClick={() => handleDeletePersonal(s.id)} className="text-red-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest">Excluir</button>}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight">{s.title}</h3>
            <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">
               <span>⏱️ {s.questionIds.length * 3} min</span>
               <span>📄 {s.questionIds.length} questões</span>
            </div>
            <button onClick={() => startSimulado(s)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95">Iniciar</button>
          </div>
        ))}
      </div>
    </div>
  );
};
