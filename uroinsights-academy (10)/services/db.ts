
import { User, Question, Theme, Flashcard, FlashcardDeck, Simulado, NewsItem, UserProgress, RecentActivity } from '../types';
import { THEMES, getLevelFromXp } from '../constants';

const STORAGE_KEY = 'uroinsights_db_v3';

interface DB {
  users: User[];
  questions: Question[];
  decks: FlashcardDeck[];
  flashcards: Flashcard[];
  simulados: Simulado[];
  news: NewsItem[];
  userProgress: Record<number, UserProgress[]>;
  activities: RecentActivity[];
}

const INITIAL_QUESTIONS: Question[] = [
  { id: 1, themeId: 1, subtheme: 'Anomalias Uretrais', title: 'VUP Básica', statement: 'Qual o sinal clássico da VUP na uretrocistografia?', optionA: 'Uretra anterior estreita', optionB: 'Dilatação da uretra posterior', optionC: 'Bexiga pequena', optionD: 'Ureterocele', correctOption: 'B', explanation: 'A obstrução causa dilatação proximal à válvula.', difficulty: 'fácil', xpReward: 10, isPremium: false, tags: 'pediatria, obstrução' },
  { id: 2, themeId: 2, subtheme: 'HPB', title: 'HPB Sintomas', statement: 'Qual a escala padrão para sintomas prostáticos?', optionA: 'Gleason', optionB: 'IPSS', optionC: 'TNW', optionD: 'Fuhrman', correctOption: 'B', explanation: 'IPSS é o International Prostate Symptom Score.', difficulty: 'fácil', xpReward: 10, isPremium: false, tags: 'próstata, hpb' }
];

const INITIAL_DB: DB = {
  users: [
    { id: 1, email: 'urochamps@gmail.com', name: 'Administrador UroInsights', password: 'mattox17', xp: 450, level: 1, role: 'admin', subscriptionStatus: 'premium' }
  ],
  questions: INITIAL_QUESTIONS,
  decks: THEMES.map(theme => ({
    id: theme.id,
    themeId: theme.id,
    name: `Deck de ${theme.name}`,
    description: `Flashcards focados em ${theme.name}`,
    isPremium: false
  })),
  flashcards: [
    { id: 1, deckId: 1, subtheme: 'Embriologia', front: 'Qual a causa mais comum de hidronefrose pré-natal?', back: 'Obstrução da JUP', xpReward: 5 }
  ],
  simulados: [
    { id: 1, title: 'Simulado Geral #1', themeId: 2, questionIds: [1, 2], durationMinutes: 10, isPremium: false }
  ],
  news: [
    { id: 1, title: 'Olá Sou Teste (fixado)', url: '#', summary: 'Resumo do teste', content: 'Esse teste está válido na página oficial', themeId: 2, createdAt: new Date().toISOString(), isPremium: false, isFixed: true }
  ],
  userProgress: {},
  activities: []
};

class DatabaseService {
  private db: DB;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.db = saved ? JSON.parse(saved) : INITIAL_DB;
    
    THEMES.forEach(theme => {
      const exists = this.db.decks.find(d => d.themeId === theme.id);
      if (!exists) {
        this.db.decks.push({
          id: theme.id,
          themeId: theme.id,
          name: `Deck de ${theme.name}`,
          description: `Flashcards focados em ${theme.name}`,
          isPremium: false
        });
      }
    });
    this.save();
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
  }

  // Auth & User
  getUsers() { return this.db.users; }
  
  registerUser(email: string, name: string, password?: string) {
    const newUser: User = { id: Date.now(), email, name, password, xp: 0, level: 1, role: 'user', subscriptionStatus: 'free' };
    this.db.users.push(newUser);
    this.save();
    return newUser;
  }

  upgradeToPremium(userId: number, plan: 'mensal' | 'anual') {
    const user = this.db.users.find(u => u.id === userId);
    if (user) {
      user.subscriptionStatus = 'premium';
      user.subscriptionPlan = plan;
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + (plan === 'anual' ? 1 : 0));
      user.subscriptionEndDate = endDate.toISOString();
      this.save();
    }
    return user;
  }

  addXP(userId: number, amount: number, themeId?: number, activityTitle?: string) {
    const user = this.db.users.find(u => u.id === userId);
    if (!user) return null;
    const oldLevel = user.level;
    user.xp += amount;
    
    // Novo cálculo de nível baseado na tabela dinâmica
    const levelInfo = getLevelFromXp(user.xp);
    user.level = levelInfo.level;
    
    if (themeId) {
      if (!this.db.userProgress[userId]) this.db.userProgress[userId] = [];
      let prog = this.db.userProgress[userId].find(p => p.themeId === themeId);
      if (!prog) {
        prog = { themeId, questionsCompleted: 0, xpEarned: 0 };
        this.db.userProgress[userId].push(prog);
      }
      prog.xpEarned += amount;
      if (amount >= 10) prog.questionsCompleted += 1;
    }
    this.db.activities.push({ id: Date.now(), userId, type: user.level > oldLevel ? 'level' : 'question', title: activityTitle || 'Atividade', subtitle: `+${amount} XP`, timestamp: new Date().toISOString() });
    this.save();
    return user;
  }

  // Restante do DatabaseService permanece igual...
  getQuestions(user?: User) { if (user?.role === 'admin' || user?.subscriptionStatus === 'premium') return this.db.questions; return this.db.questions.filter(q => !q.isPremium); }
  addQuestion(q: Omit<Question, 'id'>) { const newQ = { ...q, id: Date.now() }; this.db.questions.unshift(newQ); this.save(); return newQ; }
  updateQuestion(id: number, q: Partial<Question>) { const idx = this.db.questions.findIndex(x => x.id === id); if (idx !== -1) { this.db.questions[idx] = { ...this.db.questions[idx], ...q }; this.save(); } }
  deleteQuestion(id: number) { this.db.questions = this.db.questions.filter(q => q.id !== id); this.save(); }
  getDecks() { return this.db.decks; }
  getFlashcards(deckId: number) { return this.db.flashcards.filter(f => f.deckId === deckId); }
  addFlashcard(f: Omit<Flashcard, 'id'>) { const newF = { ...f, id: Date.now() }; this.db.flashcards.unshift(newF); this.save(); return newF; }
  updateFlashcard(id: number, f: Partial<Flashcard>) { const idx = this.db.flashcards.findIndex(x => x.id === id); if (idx !== -1) { this.db.flashcards[idx] = { ...this.db.flashcards[idx], ...f }; this.save(); } }
  deleteFlashcard(id: number) { this.db.flashcards = this.db.flashcards.filter(f => f.id !== id); this.save(); }
  getSimulados(userId?: number) { if (userId) { return this.db.simulados.filter(s => s.authorId === userId || !s.authorId); } return this.db.simulados; }
  getAdminSimulados() { return this.db.simulados.filter(s => !s.authorId); }
  addSimulado(s: Omit<Simulado, 'id'>) { const newS = { ...s, id: Date.now() }; this.db.simulados.unshift(newS); this.save(); return newS; }
  updateSimulado(id: number, s: Partial<Simulado>) { const idx = this.db.simulados.findIndex(x => x.id === id); if (idx !== -1) { this.db.simulados[idx] = { ...this.db.simulados[idx], ...s }; this.save(); } }
  deleteSimulado(id: number) { this.db.simulados = this.db.simulados.filter(s => s.id !== id); this.save(); }
  getNews(user?: User) { const sorted = [...this.db.news].sort((a,b) => (b.isFixed ? 1 : 0) - (a.isFixed ? 1 : 0)); if (user?.role === 'admin' || user?.subscriptionStatus === 'premium') return sorted; return sorted.filter(n => !n.isPremium); }
  addNews(n: Omit<NewsItem, 'id' | 'createdAt'>) { const newN = { ...n, id: Date.now(), createdAt: new Date().toISOString() }; this.db.news.unshift(newN); this.save(); return newN; }
  updateNews(id: number, n: Partial<NewsItem>) { const idx = this.db.news.findIndex(x => x.id === id); if (idx !== -1) { this.db.news[idx] = { ...this.db.news[idx], ...n }; this.save(); } }
  deleteNews(id: number) { this.db.news = this.db.news.filter(n => n.id !== id); this.save(); }
  getActivities(userId: number) { return this.db.activities.filter(a => a.userId === userId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); }
  getUserProgress(userId: number) { return this.db.userProgress[userId] || []; }
}

export const dbService = new DatabaseService();
