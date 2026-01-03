
import React, { useState } from 'react';
import { User, Flashcard, FlashcardDeck } from '../types';
import { dbService } from '../services/db';
import { THEMES, SUBTHEMES_BY_THEME } from '../constants';

interface FlashcardsPageProps {
  user: User;
  onNavigate: (page: string, params?: any) => void;
  onXPUpdate: (amount: number, themeId?: number, title?: string) => void;
}

type SessionStats = {
  errei: number;
  dificil: number;
  bom: number;
  facil: number;
};

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({ user, onNavigate, onXPUpdate }) => {
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedSubthemes, setSelectedSubthemes] = useState<string[]>([]);
  const [cardLimit, setCardLimit] = useState<number>(20);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState<SessionStats>({ errei: 0, dificil: 0, bom: 0, facil: 0 });
  
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const decks = dbService.getDecks();
  const currentDeck = decks.find(d => d.id === selectedDeckId);
  const currentCard = sessionCards[currentIndex];

  const handleSelectDeck = (deckId: number) => {
    setSelectedDeckId(deckId);
    setSelectedSubthemes([]);
    setCardLimit(20);
    setIsConfiguring(true);
    setShowResults(false);
    setStats({ errei: 0, dificil: 0, bom: 0, facil: 0 });
  };

  const handleToggleSubtheme = (sub: string) => {
    setSelectedSubthemes(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleStartSession = () => {
    if (selectedSubthemes.length === 0) {
      alert("Selecione pelo menos um subtema.");
      return;
    }

    const allCards = dbService.getFlashcards(selectedDeckId!);
    const filtered = allCards.filter(c => selectedSubthemes.includes(c.subtheme));
    
    if (filtered.length === 0) {
      alert("Nenhum flashcard encontrado para os subtemas selecionados.");
      return;
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setSessionCards(shuffled.slice(0, cardLimit));
    
    setIsConfiguring(false);
    setShowResults(false);
    setCurrentIndex(0);
    setFlipped(false);
    setStats({ errei: 0, dificil: 0, bom: 0, facil: 0 });
  };

  const handleFlip = () => {
    if (!currentCard) return;
    setFlipped(!flipped);
  };
  
  const handleRating = (rating: 'errei' | 'dificil' | 'bom' | 'facil') => {
    // Calcular XP baseado no rating
    let xpGain = 0;
    switch(rating) {
      case 'facil': xpGain = 5; break;
      case 'bom': xpGain = 4; break;
      case 'dificil': xpGain = 2; break;
      default: xpGain = 1;
    }

    setStats(prev => ({ ...prev, [rating]: prev[rating] + 1 }));
    onXPUpdate(xpGain, currentDeck?.themeId, `Flashcard: ${currentDeck?.name}`);
    
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  // Lógica de sugestão de repetição
  const getRepetitionAdvice = () => {
    const total = sessionCards.length || 1;
    const difficultRatio = (stats.errei + stats.dificil) / total;

    if (difficultRatio > 0.4) {
      return {
        time: "Amanhã (24h)",
        message: "O conteúdo ainda está desafiador. Revisar amanhã ajudará a fixar as conexões neurais.",
        urgency: "high",
        questions: 15
      };
    } else if (difficultRatio > 0.15) {
      return {
        time: "Em 3 dias",
        message: "Bom desempenho! Uma revisão curta em 3 dias garantirá que você não esqueça os detalhes.",
        urgency: "medium",
        questions: 10
      };
    } else {
      return {
        time: "Em 7 dias",
        message: "Excelente! Você dominou a maioria dos cards. Agende a próxima revisão para daqui a uma semana.",
        urgency: "low",
        questions: 5
      };
    }
  };

  // 1. Tela de Resultados/Estatísticas
  if (showResults) {
    const advice = getRepetitionAdvice();
    const total = sessionCards.length;
    return (
      <div className="p-8 max-w-4xl mx-auto animate-in zoom-in duration-500">
        <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
          <header className="text-center mb-12">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Sessão Concluída!</h2>
            <p className="text-slate-500 font-bold">Confira seu desempenho em {currentDeck?.name}</p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
              <div className="text-red-500 font-black text-2xl mb-1">{stats.errei}</div>
              <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">Errei</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 text-center">
              <div className="text-orange-500 font-black text-2xl mb-1">{stats.dificil}</div>
              <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Difícil</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
              <div className="text-blue-500 font-black text-2xl mb-1">{stats.bom}</div>
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Bom</div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
              <div className="text-emerald-500 font-black text-2xl mb-1">{stats.facil}</div>
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Fácil</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 mb-10 text-left">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-2xl">⏳</span> Sugestão de Repetição Espaçada
            </h3>
            <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className={`px-8 py-6 rounded-3xl text-center min-w-[160px] shadow-sm border-2 ${
                 advice.urgency === 'high' ? 'bg-red-50 border-red-200 text-red-700' :
                 advice.urgency === 'medium' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                 'bg-emerald-50 border-emerald-200 text-emerald-700'
               }`}>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1">Próxima Revisão</div>
                  <div className="text-2xl font-black">{advice.time}</div>
               </div>
               <div className="flex-1">
                  <p className="text-slate-600 font-medium leading-relaxed mb-6">{advice.message}</p>
                  <div className="bg-white/60 p-5 rounded-2xl border border-white flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reforço Recomendado</div>
                      <div className="font-bold text-slate-800">{advice.questions} Questões de {currentDeck?.name}</div>
                    </div>
                    <button 
                      onClick={() => onNavigate('questions', { themeId: currentDeck?.themeId })}
                      className="px-6 py-3 bg-blue-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all"
                    >
                      Ir para Questões
                    </button>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => { setSelectedDeckId(null); setShowResults(false); }}
              className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl"
            >
              Voltar aos Decks
            </button>
            <button 
              onClick={handleStartSession}
              className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl"
            >
              Refazer Estes Cards
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Lista de Decks
  if (!selectedDeckId) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <span className="text-4xl">🧠</span> Flashcards
          </h1>
          <p className="text-slate-500 font-medium mt-1">Otimize sua memória com revisão espaçada.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {decks.map(deck => {
            const theme = THEMES.find(t => t.id === deck.themeId);
            const cardsInDeck = dbService.getFlashcards(deck.id);
            return (
              <div 
                key={deck.id} 
                onClick={() => handleSelectDeck(deck.id)}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    {theme?.icon || '📚'}
                  </div>
                  <span className="bg-slate-50 px-3 py-1 rounded-lg text-xs font-bold text-slate-400 border border-slate-100">
                    {cardsInDeck.length} cards
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">{deck.name}</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{deck.description}</p>
                <div className="mt-auto">
                   {theme && (
                     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border" style={{ color: theme.color, borderColor: theme.color, backgroundColor: `${theme.color}10` }}>
                       {theme.icon} {theme.name}
                     </span>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Configuração do Deck Selecionado
  if (isConfiguring) {
    const subthemes = SUBTHEMES_BY_THEME[currentDeck?.themeId || 0] || [];
    return (
      <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
        <button onClick={() => setSelectedDeckId(null)} className="mb-6 text-slate-500 font-bold flex items-center gap-2 hover:text-slate-900">
          ← Voltar para Decks
        </button>

        <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100">
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl">{THEMES.find(t => t.id === currentDeck?.themeId)?.icon}</span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Estudar {currentDeck?.name}</h1>
            </div>
            <p className="text-slate-500 font-bold">Configure sua sessão de flashcards.</p>
          </header>

          <div className="space-y-12">
            {/* Seleção de Subtemas */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Escolha os Subtemas:</label>
              <div className="flex flex-wrap gap-3">
                {subthemes.map(sub => (
                  <button
                    key={sub}
                    onClick={() => handleToggleSubtheme(sub)}
                    className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                      selectedSubthemes.includes(sub)
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-blue-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Quantidade */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quantidade de Flashcards:</label>
              <div className="grid grid-cols-5 gap-3">
                {[20, 40, 60, 80, 100].map(n => (
                  <button
                    key={n}
                    onClick={() => setCardLimit(n)}
                    className={`py-5 rounded-2xl text-xl font-black transition-all border-2 ${
                      cardLimit === n 
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-md' 
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleStartSession}
              className="w-full py-6 bg-blue-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-800 transition-all transform active:scale-95"
            >
              🚀 Iniciar Revisão
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Sessão de Estudo
  const progress = Math.round(((currentIndex + 1) / sessionCards.length) * 100);

  return (
    <div className="p-8 max-w-4xl mx-auto h-screen flex flex-col animate-in fade-in duration-300">
      <div className="mb-8 flex flex-col gap-6">
        <button 
          onClick={() => setIsConfiguring(true)} 
          className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold text-sm transition-colors group"
        >
           <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
           Configurações
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{currentDeck?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[10px] font-black uppercase text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md">{currentCard?.subtheme}</span>
               <span className="text-slate-500 font-medium text-sm">Card {currentIndex + 1} de {sessionCards.length}</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
           <div className="bg-slate-900 h-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] perspective-1000">
        <div 
          onClick={handleFlip}
          className={`relative w-full h-full cursor-pointer transition-all duration-700 preserve-3d ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
        >
          {/* FRENTE */}
          <div className="absolute inset-0 bg-white border border-slate-100 rounded-[2rem] shadow-lg flex flex-col items-center justify-center p-12 text-center backface-hidden overflow-hidden">
            {currentCard?.frontImageUrl && (
              <div className="mb-6 max-h-[50%] w-full flex items-center justify-center overflow-hidden rounded-2xl">
                 <img src={currentCard.frontImageUrl} alt="Imagem Frente" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <h2 className={`${currentCard?.frontImageUrl ? 'text-2xl' : 'text-4xl'} font-bold text-slate-800 leading-tight max-w-2xl`}>{currentCard?.front}</h2>
            <div className="absolute bottom-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
               Clique para revelar a resposta 🔍
            </div>
          </div>
          
          {/* VERSO */}
          <div 
            className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-[2rem] shadow-lg flex flex-col items-center justify-center p-12 text-center backface-hidden overflow-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {currentCard?.backImageUrl && (
              <div className="mb-6 max-h-[50%] w-full flex items-center justify-center overflow-hidden rounded-2xl">
                 <img src={currentCard.backImageUrl} alt="Imagem Verso" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <h2 className={`${currentCard?.backImageUrl ? 'text-2xl' : 'text-3xl'} font-bold text-slate-800 leading-relaxed max-w-2xl`}>{currentCard?.back}</h2>
            <div className="absolute bottom-12 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em]">
               Como foi seu desempenho? ⚡
            </div>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 animate-in slide-in-from-bottom duration-500">
          <button onClick={() => handleRating('errei')} className="p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-red-200 text-center font-bold text-red-500 transition-all shadow-sm hover:shadow-md">Errei</button>
          <button onClick={() => handleRating('dificil')} className="p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-orange-200 text-center font-bold text-orange-500 transition-all shadow-sm hover:shadow-md">Difícil</button>
          <button onClick={() => handleRating('bom')} className="p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-blue-200 text-center font-bold text-blue-500 transition-all shadow-sm hover:shadow-md">Bom</button>
          <button onClick={() => handleRating('facil')} className="p-6 bg-emerald-500 text-white rounded-3xl hover:bg-emerald-600 text-center font-bold shadow-lg transition-all transform active:scale-95">Fácil</button>
        </div>
      )}
    </div>
  );
};
