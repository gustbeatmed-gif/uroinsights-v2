
import React, { useState, useEffect, useRef } from 'react';
import { User, Question, NewsItem, Flashcard, FlashcardDeck, Simulado, Difficulty } from '../types';
import { THEMES, SUBTHEMES_BY_THEME } from '../constants';
import { dbService } from '../services/db';

interface AdminProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

type EditorTab = 'questoes' | 'flashcards' | 'simulados' | 'atualizacoes';

export const Admin: React.FC<AdminProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('questoes');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fileInputQuestion = useRef<HTMLInputElement>(null);
  const fileInputFront = useRef<HTMLInputElement>(null);
  const fileInputBack = useRef<HTMLInputElement>(null);

  // Estados dos Formulários
  const [qForm, setQForm] = useState<Partial<Question>>({ 
    themeId: 1, subtheme: '', difficulty: 'moderado', xpReward: 15, correctOption: 'A', isPremium: true,
    title: '', statement: '', explanation: '', optionA: '', optionB: '', optionC: '', optionD: '', imageUrl: ''
  });
  const [fForm, setFForm] = useState<Partial<Flashcard>>({ 
    xpReward: 5, front: '', back: '', deckId: 1, subtheme: '', frontImageUrl: '', backImageUrl: '' 
  });
  const [sForm, setSForm] = useState<Partial<Simulado>>({ 
    title: '', durationMinutes: 60, isPremium: true, themeId: 1, questionIds: []
  });
  const [nForm, setNForm] = useState<Partial<NewsItem>>({ 
    themeId: 1, isPremium: true, title: '', content: '', summary: '', isFixed: false
  });
  
  // Filtros de Listagem
  const [qListTheme, setQListTheme] = useState<number>(1);
  const [fListDeck, setFListDeck] = useState<number>(1);

  const authorizedEmails = ['urochamps@gmail.com', 'uroinsights@gmail.com'];

  useEffect(() => {
    if (!user || !authorizedEmails.includes(user.email)) {
      alert('Acesso restrito ao Painel do Editor.');
      onNavigate('dashboard');
    }
  }, [user, onNavigate]);

  if (!user || !authorizedEmails.includes(user.email)) return null;

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  const resetForms = () => {
    setEditingId(null);
    setQForm({ themeId: 1, subtheme: '', difficulty: 'moderado', xpReward: 15, correctOption: 'A', isPremium: true, title: '', statement: '', explanation: '', optionA: '', optionB: '', optionC: '', optionD: '', imageUrl: '' });
    setFForm({ xpReward: 5, front: '', back: '', deckId: 1, subtheme: '', frontImageUrl: '', backImageUrl: '' });
    setSForm({ title: '', durationMinutes: 60, isPremium: true, themeId: 1, questionIds: [] });
    setNForm({ themeId: 1, isPremium: true, title: '', content: '', summary: '', isFixed: false });
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    const xpRewards: Record<Difficulty, number> = { 'fácil': 10, 'moderado': 15, 'difícil': 20, 'hard': 25, 'desafio': 30 };
    setQForm({ ...qForm, difficulty: diff, xpReward: xpRewards[diff] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string, formType: 'q' | 'f') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Arquivo muito grande. Limite de 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (formType === 'q') {
          setQForm(prev => ({ ...prev, [field]: reader.result as string }));
        } else {
          setFForm(prev => ({ ...prev, [field]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qForm.subtheme) return alert("Selecione um subtema.");
    if (editingId) dbService.updateQuestion(editingId, qForm);
    else dbService.addQuestion(qForm as Omit<Question, 'id'>);
    alert(editingId ? 'Questão atualizada!' : 'Nova questão cadastrada!');
    resetForms();
    refresh();
  };

  const handleSaveFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fForm.subtheme) return alert("Selecione um subtema.");
    if (editingId) dbService.updateFlashcard(editingId, fForm);
    else dbService.addFlashcard(fForm as Omit<Flashcard, 'id'>);
    alert(editingId ? 'Flashcard atualizado!' : 'Novo flashcard cadastrado!');
    resetForms();
    refresh();
  };

  const handleSaveSimulado = (e: React.FormEvent) => {
    e.preventDefault();
    const ids = typeof sForm.questionIds === 'string' 
      ? (sForm.questionIds as string).split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
      : sForm.questionIds;
    
    const data = { ...sForm, questionIds: ids || [], authorId: undefined };
    if (editingId) dbService.updateSimulado(editingId, data as Partial<Simulado>);
    else dbService.addSimulado(data as Omit<Simulado, 'id'>);
    alert('Simulado salvo!');
    resetForms();
    refresh();
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) dbService.updateNews(editingId, nForm);
    else dbService.addNews(nForm as Omit<NewsItem, 'id' | 'createdAt'>);
    alert('Notícia publicada/atualizada!');
    resetForms();
    refresh();
  };

  const editItem = (type: EditorTab, item: any) => {
    setEditingId(item.id);
    switch(type) {
      case 'questoes': setQForm(item); break;
      case 'flashcards': setFForm(item); break;
      case 'simulados': setSForm({ ...item, questionIds: (item.questionIds?.join(', ') || '') as any }); break;
      case 'atualizacoes': setNForm(item); break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = (type: EditorTab, id: number) => {
    if (!confirm('Tem certeza que deseja excluir permanentemente este item?')) return;
    switch(type) {
      case 'questoes': dbService.deleteQuestion(id); break;
      case 'flashcards': dbService.deleteFlashcard(id); break;
      case 'simulados': dbService.deleteSimulado(id); break;
      case 'atualizacoes': dbService.deleteNews(id); break;
    }
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-['Inter'] pb-20">
      <header className="bg-slate-900 py-6 px-8 flex justify-between items-center text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white">UI</div>
          <div>
            <h1 className="font-black text-lg tracking-tight uppercase leading-none">Painel Editor</h1>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">UroInsights Academy</p>
          </div>
        </div>
        <button onClick={() => onNavigate('dashboard')} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Sair do Painel</button>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <TabButton active={activeTab === 'questoes'} onClick={() => { setActiveTab('questoes'); resetForms(); }} icon="📝" label="Questões" />
          <TabButton active={activeTab === 'flashcards'} onClick={() => { setActiveTab('flashcards'); resetForms(); }} icon="🧠" label="Flashcards" />
          <TabButton active={activeTab === 'simulados'} onClick={() => { setActiveTab('simulados'); resetForms(); }} icon="🧩" label="Simulados" />
          <TabButton active={activeTab === 'atualizacoes'} onClick={() => { setActiveTab('atualizacoes'); resetForms(); }} icon="📰" label="Notícias" />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden p-10">
          
          {/* ABA QUESTÕES */}
          {activeTab === 'questoes' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{editingId ? '📝 Editando Questão' : '➕ Nova Questão'}</h2>
                {editingId && <button onClick={resetForms} className="text-xs font-bold text-red-500 uppercase tracking-widest">Cancelar Edição</button>}
              </div>
              <form onSubmit={handleSaveQuestion} className="space-y-6 mb-16">
                <AdminInput label="Título de Referência" value={qForm.title || ''} onChange={v => setQForm({...qForm, title: v})} placeholder="Ex: VUP Básica Nível 1" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminSelect label="Tema Principal" value={qForm.themeId || 1} options={THEMES.map(t => ({id: t.id, name: t.name}))} onChange={v => setQForm({...qForm, themeId: parseInt(v), subtheme: ''})} />
                  <AdminSelect label="Subtema Específico" value={qForm.subtheme || ''} options={(SUBTHEMES_BY_THEME[qForm.themeId || 1] || []).map(s => ({id: s, name: s}))} onChange={v => setQForm({...qForm, subtheme: v})} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="md:col-span-2">
                    <AdminTextarea label="Enunciado da Questão" value={qForm.statement || ''} onChange={v => setQForm({...qForm, statement: v})} />
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <AdminInput label="URL da Imagem (Opcional)" value={qForm.imageUrl || ''} onChange={v => setQForm({...qForm, imageUrl: v})} placeholder="https://..." />
                    <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Ou Upload:</label>
                       <input ref={fileInputQuestion} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'imageUrl', 'q')} className="text-xs text-slate-500" />
                    </div>
                    {qForm.imageUrl && (
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border border-slate-200">
                        <img src={qForm.imageUrl} alt="Preview Questão" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => setQForm({...qForm, imageUrl: ''})} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-[8px] font-bold">X</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <AdminInput label="Alternativa A" value={qForm.optionA || ''} onChange={v => setQForm({...qForm, optionA: v})} />
                  <AdminInput label="Alternativa B" value={qForm.optionB || ''} onChange={v => setQForm({...qForm, optionB: v})} />
                  <AdminInput label="Alternativa C" value={qForm.optionC || ''} onChange={v => setQForm({...qForm, optionC: v})} />
                  <AdminInput label="Alternativa D" value={qForm.optionD || ''} onChange={v => setQForm({...qForm, optionD: v})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <AdminSelect label="Opção Correta" value={qForm.correctOption || 'A'} options={['A','B','C','D'].map(o => ({id: o, name: o}))} onChange={v => setQForm({...qForm, correctOption: v as any})} />
                   <AdminSelect label="Dificuldade do Card" value={qForm.difficulty || 'moderado'} options={['fácil','moderado','difícil','hard','desafio'].map(d => ({id: d, name: d}))} onChange={v => handleDifficultyChange(v as any)} />
                </div>
                <AdminTextarea label="Explicação / Gabarito Comentado" value={qForm.explanation || ''} onChange={v => setQForm({...qForm, explanation: v})} />
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <input type="checkbox" checked={qForm.isPremium} onChange={e => setQForm({...qForm, isPremium: e.target.checked})} className="w-5 h-5" />
                  <span className="text-sm font-bold text-amber-800">Conteúdo Premium (Apenas assinantes)</span>
                </div>
                <button type="submit" className={`w-full py-6 rounded-2xl font-black text-xl shadow-xl transition-all ${editingId ? 'bg-blue-600' : 'bg-slate-900'} text-white`}>
                  {editingId ? 'ATUALIZAR QUESTÃO' : 'CADASTRAR QUESTÃO'}
                </button>
              </form>

              <div className="border-t pt-10">
                 <h3 className="font-black text-xl mb-6 text-slate-800">Banco de Dados de Questões</h3>
                 <div className="bg-slate-50 p-6 rounded-3xl mb-8 flex gap-6 border border-slate-100">
                    <div className="flex-1">
                       <AdminSelect label="Filtrar por Tema" value={qListTheme} options={THEMES.map(t => ({id: t.id, name: t.name}))} onChange={v => setQListTheme(parseInt(v))} />
                    </div>
                 </div>

                 <div className="space-y-3">
                    {dbService.getQuestions().filter(q => q.themeId === qListTheme).map(q => (
                      <div key={q.id} className="p-5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group hover:border-blue-200 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-400">ID: {q.id}</span>
                           {q.imageUrl && <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0"><img src={q.imageUrl} className="w-full h-full object-cover" /></div>}
                           <div>
                              <div className="font-bold text-slate-800">{q.title}</div>
                              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{q.subtheme} • {q.difficulty}</div>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => editItem('questoes', q)} className="px-4 py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-xl text-xs font-black transition-all">Editar</button>
                           <button onClick={() => deleteItem('questoes', q.id)} className="px-4 py-2 bg-slate-50 hover:bg-red-50 text-red-500 rounded-xl text-xs font-black transition-all">Excluir</button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* ABA FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">{editingId ? '🧠 Editando Flashcard' : '➕ Novo Flashcard'}</h2>
              <form onSubmit={handleSaveFlashcard} className="space-y-6 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminSelect label="Escolha o Deck (Tema)" value={fForm.deckId || 1} options={dbService.getDecks().map(d => ({id: d.id, name: d.name}))} onChange={v => setFForm({...fForm, deckId: parseInt(v), subtheme: ''})} />
                  <AdminSelect label="Subtema do Card" value={fForm.subtheme || ''} options={(SUBTHEMES_BY_THEME[dbService.getDecks().find(d => d.id === (fForm.deckId || 1))?.themeId || 1] || []).map(s => ({id: s, name: s}))} onChange={v => setFForm({...fForm, subtheme: v})} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <AdminTextarea label="Frente (Pergunta)" value={fForm.front || ''} onChange={v => setFForm({...fForm, front: v})} />
                    <AdminInput label="URL Imagem Frente" value={fForm.frontImageUrl || ''} onChange={v => setFForm({...fForm, frontImageUrl: v})} placeholder="https://..." />
                    <input ref={fileInputFront} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'frontImageUrl', 'f')} className="text-xs" />
                    {fForm.frontImageUrl && <img src={fForm.frontImageUrl} className="w-full h-32 object-contain border rounded-xl bg-white" />}
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <AdminTextarea label="Verso (Resposta)" value={fForm.back || ''} onChange={v => setFForm({...fForm, back: v})} />
                    <AdminInput label="URL Imagem Verso" value={fForm.backImageUrl || ''} onChange={v => setFForm({...fForm, backImageUrl: v})} placeholder="https://..." />
                    <input ref={fileInputBack} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'backImageUrl', 'f')} className="text-xs" />
                    {fForm.backImageUrl && <img src={fForm.backImageUrl} className="w-full h-32 object-contain border rounded-xl bg-white" />}
                  </div>
                </div>

                <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black text-xl rounded-2xl shadow-xl transition-all">
                  {editingId ? 'ATUALIZAR FLASHCARD' : 'CADASTRAR FLASHCARD'}
                </button>
              </form>

              <div className="border-t pt-10">
                 <h3 className="font-black text-xl mb-6 text-slate-800">Flashcards Disponíveis</h3>
                 <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
                    <AdminSelect label="Filtrar por Deck" value={fListDeck} options={dbService.getDecks().map(d => ({id: d.id, name: d.name}))} onChange={v => setFListDeck(parseInt(v))} />
                 </div>
                 <div className="space-y-3">
                    {dbService.getFlashcards(fListDeck).map(f => (
                      <div key={f.id} className="p-5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group shadow-sm">
                        <div className="flex-1 mr-6 flex items-center gap-4">
                           {f.frontImageUrl && <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0"><img src={f.frontImageUrl} className="w-full h-full object-cover" /></div>}
                           <div>
                              <div className="text-[10px] font-black text-blue-500 uppercase mb-1">{f.subtheme}</div>
                              <div className="font-bold text-slate-800 line-clamp-1">{f.front}</div>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => editItem('flashcards', f)} className="px-4 py-2 bg-slate-50 text-blue-600 rounded-xl text-xs font-black transition-all">Editar</button>
                           <button onClick={() => deleteItem('flashcards', f.id)} className="px-4 py-2 bg-slate-50 text-red-500 rounded-xl text-xs font-black transition-all">Excluir</button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* ABA SIMULADOS */}
          {activeTab === 'simulados' && (
            <div className="animate-in fade-in duration-500">
               <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">{editingId ? '🧩 Editando Simulado' : '➕ Novo Simulado Oficial'}</h2>
               <form onSubmit={handleSaveSimulado} className="space-y-6 mb-16">
                 <AdminInput label="Nome do Simulado" value={sForm.title || ''} onChange={v => setSForm({...sForm, title: v})} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AdminSelect label="Tema Base" value={sForm.themeId || 1} options={[...THEMES.map(t => ({id: t.id, name: t.name})), {id: 99, name: '🎲 Aleatório'}]} onChange={v => setSForm({...sForm, themeId: parseInt(v)})} />
                    <AdminInput label="Duração Estimada (min)" value={String(sForm.durationMinutes || 60)} onChange={v => setSForm({...sForm, durationMinutes: parseInt(v)})} />
                 </div>
                 <AdminInput label="IDs das Questões (Ex: 1, 15, 23)" value={String(sForm.questionIds || '')} onChange={e => setSForm({...sForm, questionIds: e as any})} />
                 <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black text-xl rounded-2xl shadow-xl transition-all">SALVAR SIMULADO</button>
               </form>
               <div className="border-t pt-10">
                  <h3 className="font-black text-xl mb-8 text-slate-800">Simulados Oficiais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {dbService.getAdminSimulados().map(s => (
                        <div key={s.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col gap-5 shadow-sm">
                           <h4 className="font-black text-slate-800 text-xl tracking-tight leading-none">{s.title}</h4>
                           <div className="flex gap-2">
                              <button onClick={() => editItem('simulados', s)} className="flex-1 py-3 bg-white text-blue-600 rounded-xl font-black">Editar</button>
                              <button onClick={() => deleteItem('simulados', s.id)} className="flex-1 py-3 bg-white text-red-500 rounded-xl font-black">Excluir</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* ABA NOTÍCIAS */}
          {activeTab === 'atualizacoes' && (
            <div className="animate-in fade-in duration-500">
               <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">{editingId ? '📰 Editando Notícia' : '➕ Publicar Atualização'}</h2>
               <form onSubmit={handleSaveNews} className="space-y-6 mb-16">
                 <AdminInput label="Título da Notícia" value={nForm.title || ''} onChange={v => setNForm({...nForm, title: v})} />
                 <AdminTextarea label="Resumo" value={nForm.summary || ''} onChange={v => setNForm({...nForm, summary: v})} />
                 <AdminTextarea label="Conteúdo" value={nForm.content || ''} onChange={v => setNForm({...nForm, content: v})} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AdminSelect label="Tema Principal" value={nForm.themeId || 1} options={THEMES.map(t => ({id: t.id, name: t.name}))} onChange={v => setNForm({...nForm, themeId: parseInt(v)})} />
                    <div className="flex flex-col gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" checked={nForm.isFixed} onChange={e => setNForm({...nForm, isFixed: e.target.checked})} className="w-5 h-5" />
                        <span className="text-sm font-bold text-slate-700">Fixar no topo do Feed</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" checked={nForm.isPremium} onChange={e => setNForm({...nForm, isPremium: e.target.checked})} className="w-5 h-5" />
                        <span className="text-sm font-bold text-slate-700">Notícia exclusiva Premium</span>
                      </label>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black text-xl rounded-2xl shadow-xl transition-all">PUBLICAR NO FEED</button>
               </form>
               <div className="border-t pt-10">
                  <h3 className="font-black text-xl mb-8 text-slate-800">Notícias Publicadas</h3>
                  <div className="space-y-4">
                     {dbService.getNews(user).map(n => (
                        <div key={n.id} className="p-6 bg-white border border-slate-100 rounded-3xl flex justify-between items-center group shadow-sm">
                           <h4 className="font-bold text-slate-800">{n.title}</h4>
                           <div className="flex gap-2">
                              <button onClick={() => editItem('atualizacoes', n)} className="px-4 py-2 bg-slate-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Editar</button>
                              <button onClick={() => deleteItem('atualizacoes', n.id)} className="px-4 py-2 bg-slate-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Excluir</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button onClick={onClick} className={`px-8 py-4 rounded-[1.5rem] flex items-center gap-3 font-black text-sm transition-all border-2 ${active ? 'bg-slate-900 border-slate-900 text-white shadow-xl transform -translate-y-1' : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-100'}`}>
    <span className="text-xl">{icon}</span> {label}
  </button>
);

const AdminInput = ({ label, value, onChange, placeholder = '' }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl transition-all font-bold text-slate-800 outline-none shadow-sm" />
  </div>
);

const AdminSelect = ({ label, value, options, onChange }: { label: string, value: string | number, options: {id: string | number, name: string}[], onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl transition-all font-bold text-slate-800 outline-none shadow-sm appearance-none cursor-pointer">
      <option value="">Selecione...</option>
      {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  </div>
);

const AdminTextarea = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] h-40 transition-all font-bold text-slate-800 outline-none shadow-sm resize-none" />
  </div>
);
