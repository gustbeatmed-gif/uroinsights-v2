
export interface Theme {
  id: number;
  name: string;
  color: string;
  icon?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  xp: number;
  level: number;
  role: 'user' | 'admin';
  subscriptionStatus: 'free' | 'premium';
  subscriptionPlan?: 'mensal' | 'anual';
  subscriptionEndDate?: string;
}

export type Difficulty = 'fácil' | 'moderado' | 'difícil' | 'hard' | 'desafio';

export interface Question {
  id: number;
  themeId: number;
  subtheme: string;
  title: string;
  statement: string;
  imageUrl?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: Difficulty;
  xpReward: number;
  isPremium: boolean;
  tags?: string;
}

export interface Flashcard {
  id: number;
  deckId: number;
  subtheme: string;
  front: string;
  frontImageUrl?: string;
  back: string;
  backImageUrl?: string;
  xpReward: number;
}

export interface FlashcardDeck {
  id: number;
  themeId: number;
  name: string;
  description: string;
  isPremium: boolean;
}

export interface Simulado {
  id: number;
  title: string;
  themeId?: number;
  questionIds: number[];
  durationMinutes: number;
  isPremium: boolean;
  authorId?: number; // Se nulo, é um simulado oficial do admin
}

export interface NewsItem {
  id: number;
  title: string;
  url: string;
  summary: string;
  content: string;
  themeId: number;
  createdAt: string;
  isPremium: boolean;
  isFixed?: boolean;
}

export interface UserProgress {
  themeId: number;
  questionsCompleted: number;
  xpEarned: number;
}

export interface RecentActivity {
  id: number;
  userId: number;
  type: 'question' | 'level' | 'simulado' | 'streak' | 'subscription';
  title: string;
  subtitle: string;
  xpGain?: number;
  timestamp: string;
}
