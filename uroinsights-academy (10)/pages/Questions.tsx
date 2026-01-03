
import React, { useState, useEffect } from 'react';
import { User, Question, Difficulty } from '../types';
import { THEMES, SUBTHEMES_BY_THEME } from '../constants';
import { dbService } from '../services/db';

interface QuestionsProps {
  user: User;
  themeId?: number;
  onNavigate: (page: string, params?: any) => void;
  onXPUpdate: (amount: number, themeId?: number, title?: string) => void;
}

export const Questions: React.FC<QuestionsProps> = ({ user, themeId, onNavigate, onXPUpdate }) => {
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(themeId || null);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  
  // Filtros
  const [diffFilters, setDiffFilters] = useState<Difficulty[]>([]);
  const [selectedSubthemes, setSelectedSubthemes] = useState<string[]>([]);
  const [questionsLimit, setQuestionsLimit] = useState<number>(10);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (themeId) {
      setSelectedThemeId(themeId);
      setIsConfiguring(true);
      setActiveQuestion(null);
      setDiffFilters([]);
      setSelectedSubthemes([]);
      setQuestionsLimit(10);
    }
  }, [themeId]);

  const activeTheme = THEMES.find(t => t.id === selectedThemeId);
  const availableSubthemes = selectedThemeId ? SUBTHEMES_BY_THEME[selectedThemeId] || [] : [];

  const handleToggleSubtheme = (sub: string) => {
    setSelectedSubthemes(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const startSession = () => {
    const allQuestions = dbService.getQuestions(user);
    
    // Filtragem progressiva
    let filtered = allQuestions.filter(q => 
      selectedThemeId ? q.themeId === selectedThemeId : true
    );

    if (selectedSubthemes.length > 0) {
      filtered = filtered.filter(q => selectedSubthemes.includes(q.subtheme));
    }

    if (diffFilters.length > 0) {
      filtered = filtered.filter(q => diffFilters.includes(q.difficulty));
    }

    if (filtered.length === 0) {
      alert("Nenhuma questão encontrada com estes filtros.");
      return;
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setSessionQuestions(shuffled.slice(0, questionsLimit));
    setIsConfiguring(false);
  };

  const getDifficultyBadge = (diff: Difficulty, xp: number) => {
    switch (diff) {
      case 'moderado': 
        return <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Moderado +{xp} XP</span>;
      case 'difícil':
        return <span className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Difícil +{xp} XP</span>;
      case 'hard':
        return <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Hard +{xp} XP</span>;
      case 'desafio':
        return <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5">🃏 Desafio +{xp} XP</span>;
      default:
        return <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Fácil +{xp} XP</span>;
    }
  };

  const handleSelectOption = (option: string) => {
    if (showExplanation) return;
    setSelectedOption(option);
  };

  const handleRevealAnswer = () => {
    if (!selectedOption || !activeQuestion) return;
    
    const isCorrect = selectedOption === activeQuestion.correctOption;
    setAnsweredCorrectly(isCorrect);
    setShowExplanation(true);
    
    if (isCorrect) {
      onXPUpdate(activeQuestion.xpReward, activeQuestion.themeId, activeQuestion.title);
    }
  };

  const nextQuestion = () => {
    setActiveQuestion(null);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnsweredCorrectly(null);
  };

  if (isConfiguring && selectedThemeId) {
    return (
      <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative z-10">
            <header className="mb-10">
               <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl">{activeTheme?.icon}</span>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Estudar {activeTheme?.name}</h1>
               </div>
               <p className="text-slate-500 font-bold">Configure sua sessão de prática.</p>
            </header>

            <div className="space-y-10">
              {/* Filtro Subtemas */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Escolha os Subtemas:</label>
                <div className="flex flex-wrap gap-2">
                  {availableSubthemes.map(sub => (
                    <button
                      key={sub}
                      onClick={() => handleToggleSubtheme(sub)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        selectedSubthemes.includes(sub) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                  {availableSubthemes.length === 0 && <p className="text-slate-300 font-bold italic">Nenhum subtema cadastrado.</p>}
                </div>
              </div>

              {/* Filtro Dificuldade */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Selecione as Dificuldades:</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {(['fácil', 'moderado', 'difícil', 'hard', 'desafio'] as Difficulty[]).map(d => (
                    <button
                      key={d}
                      onClick={() => setDiffFilters(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        diffFilters.includes(d) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      {d === 'desafio' ? '🃏 ' : ''}{d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro Quantidade */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Número de Questões:</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {[10, 20, 30, 45, 60, 90].map(n => (
                    <button
                      key={n}
                      onClick={() => setQuestionsLimit(n)}
                      className={`py-4 rounded-2xl text-lg font-black transition-all border-2 ${
                        questionsLimit === n ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={startSession}
                className="w-full py-6 bg-blue-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-800 transition-all transform active:scale-95 mt-4"
              >
                🚀 Iniciar Estudo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeQuestion) {
    return (
      <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
        <button onClick={() => setActiveQuestion(null)} className="mb-6 text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold text-sm">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
           Voltar para a lista
        </button>
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 bg-slate-50/50">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3">
                {getDifficultyBadge(activeQuestion.difficulty, activeQuestion.xpReward)}
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">{activeQuestion.subtheme}</span>
              </div>
            </div>

            {/* Renderização da Imagem da Questão */}
            {activeQuestion.imageUrl && (
              <div className="mb-8 w-full max-h-[400px] flex items-center justify-center bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-4">
                <img src={activeQuestion.imageUrl} alt="Imagem da Questão" className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-slate-900 leading-relaxed">
              {activeQuestion.statement}
            </h2>
          </div>

          <div className="p-10 space-y-4">
            {[
              { id: 'A', text: activeQuestion.optionA },
              { id: 'B', text: activeQuestion.optionB },
              { id: 'C', text: activeQuestion.optionC },
              { id: 'D', text: activeQuestion.optionD },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={showExplanation}
                className={`w-full p-6 text-left rounded-2xl border-2 transition-all flex gap-5 ${
                  selectedOption === opt.id 
                    ? (showExplanation ? (opt.id === activeQuestion.correctOption ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50') : 'border-blue-600 bg-blue-50')
                    : (showExplanation && opt.id === activeQuestion.correctOption ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 shadow-sm')
                }`}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 transition-all ${
                  selectedOption === opt.id
                    ? (showExplanation ? (opt.id === activeQuestion.correctOption ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white') : 'bg-blue-600 text-white')
                    : (showExplanation && opt.id === activeQuestion.correctOption ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600')
                }`}>
                  {opt.id}
                </span>
                <span className="text-slate-800 font-semibold text-lg leading-snug">{opt.text}</span>
              </button>
            ))}
          </div>

          {selectedOption && !showExplanation && (
            <div className="p-10 pt-0">
               <button 
                 onClick={handleRevealAnswer}
                 className="w-full py-5 bg-blue-900 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-blue-800 transition-all transform hover:scale-[1.02] active:scale-95"
               >
                 Ver Resposta 🔍
               </button>
            </div>
          )}

          {showExplanation && (
            <div className={`p-10 animate-in slide-in-from-bottom duration-500 ${answeredCorrectly ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${answeredCorrectly ? 'bg-emerald-200 text-emerald-700' : 'bg-red-200 text-red-700'}`}>
                  {answeredCorrectly ? '✓' : '✕'}
                </div>
                <span className={`text-lg font-black uppercase tracking-widest ${answeredCorrectly ? 'text-emerald-700' : 'text-red-700'}`}>
                  {answeredCorrectly ? 'Resposta Correta!' : 'Resposta Incorreta'}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm">
                <h3 className="font-black text-slate-800 mb-3 text-lg uppercase tracking-tight">Comentário da Questão:</h3>
                <p className="text-slate-700 leading-relaxed font-medium">{activeQuestion.explanation}</p>
              </div>
              <button onClick={nextQuestion} className="mt-8 w-full py-5 bg-blue-900 text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">Concluir e Voltar</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col min-h-screen animate-in fade-in duration-700">
      <div className="flex-1">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{activeTheme?.icon || '📚'}</span>
              <h1 className="text-4xl font-bold text-slate-900">{activeTheme?.name || 'Praticar Questões'}</h1>
            </div>
            <p className="text-slate-500 font-medium">Praticando com as configurações selecionadas.</p>
          </div>
          <button onClick={() => setIsConfiguring(true)} className="px-5 py-2.5 bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-300 transition-all">⚙️ Alterar Filtros</button>
        </header>

        <div className="space-y-6 mb-20">
          {sessionQuestions.length === 0 ? (
            <div className="bg-white p-12 rounded-[3rem] text-center border border-slate-100">
               <div className="text-5xl mb-4">🔍</div>
               <h3 className="text-xl font-black text-slate-800 mb-2">Nenhuma questão encontrada</h3>
               <p className="text-slate-400 font-bold">Tente alterar os filtros de dificuldade ou subtemas para este tema.</p>
            </div>
          ) : (
            sessionQuestions.map((q) => (
              <div key={q.id} className={`bg-white p-8 rounded-[2rem] border shadow-sm hover:shadow-md transition-all relative overflow-hidden group ${q.isPremium ? 'border-amber-100' : 'border-slate-100'}`}>
                {q.isPremium && <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-400 text-blue-900 font-black text-[10px] uppercase tracking-widest rounded-bl-2xl">PREMIUM</div>}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-slate-800 pr-20">{q.title}</h3>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{q.subtheme}</span>
                  </div>
                  <div className="flex gap-2">
                    {getDifficultyBadge(q.difficulty, q.xpReward)}
                  </div>
                </div>
                <p className="text-slate-600 mb-8 line-clamp-2 leading-relaxed font-medium">
                  {q.isPremium && user.subscriptionStatus === 'free' ? 'Conteúdo restrito para membros Premium.' : q.statement}
                </p>
                <button 
                  onClick={() => {
                    if (q.isPremium && user.subscriptionStatus === 'free') {
                       onNavigate('premium-checkout');
                    } else {
                       setActiveQuestion(q);
                    }
                  }}
                  className={`px-8 py-3 rounded-xl font-bold text-sm transition-colors ${
                    q.isPremium && user.subscriptionStatus === 'free' 
                    ? 'bg-amber-400 text-blue-900' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {q.isPremium && user.subscriptionStatus === 'free' ? 'Liberar com Premium 💎' : 'Responder Questão'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
