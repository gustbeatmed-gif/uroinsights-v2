
import { Theme } from './types';

export const THEMES: Theme[] = [
  { id: 1, name: 'Uropediatria', color: '#3B82F6', icon: '👶' },
  { id: 2, name: 'Urologia Geral', color: '#10B981', icon: '🩺' },
  { id: 3, name: 'Uroneurologia', color: '#8B5CF6', icon: '🧠' },
  { id: 4, name: 'Uroginecologia', color: '#F59E0B', icon: '👩' },
  { id: 5, name: 'Uro Oncologia', color: '#EF4444', icon: '🎯' },
  { id: 6, name: 'Litíase', color: '#06B6D4', icon: '💎' },
  { id: 7, name: 'Transplante Renal', color: '#EC4899', icon: '🏥' },
  { id: 8, name: 'Andrologia e Medicina Sexual', color: '#4F46E5', icon: '♂️' },
  { id: 9, name: 'Uro Reconstrutora', color: '#0D9488', icon: '🛠️' },
];

export const SUBTHEMES_BY_THEME: Record<number, string[]> = {
  1: ['Embriologia', 'Anomalias Congênitas TGU Alto', 'Anomalias Uretrais', 'Anomalias Testiculares', 'Extrofia Vesical', 'Outras Anomalias Genitais', 'Anomalias Congênitas TGU Baixo', 'Bexiga Neurogênica', 'Litíase Infantil', 'Oncologia Infantil', 'Miscelânea'],
  2: ['Radiologia Genitourinária', 'Anatomia Cirúrgica', 'Fisiologia Renal', 'ITU', 'TB Genitourinária', 'Trauma', 'Princípios Laparoscopia/robótica', 'ISTs', 'Síndromes Genitourinárias', 'Urgências', 'Miscelânea Geral'],
  3: ['Neurofisiologia da Micção', 'Bexiga Hiperativa', 'Urodinâmica', 'Disfunções Neurogênicas', 'HPB'],
  4: ['Incontinência Urinária', 'Prolapsos de Órgãos Pélvicos', 'Massas Vaginais e Divertículo Uretral'],
  5: ['Próstata', 'Adrenal/Retroperitônio', 'Bexiga', 'Urotelial Alto', 'Rim', 'Testículo', 'Pênis', 'Uretra'],
  6: ['Etiopatogenia', 'LECO', 'Percutânea', 'Ureteroscopia'],
  7: ['Doador/Receptor', 'Cirurgia', 'Rejeição e Imunossupressores', 'Tx Infantil'],
  8: ['Infertilidade Masculina', 'Doença de Peyronie', 'Priapismo', 'Disfunção Erétil', 'DAEM'],
  9: ['Estenose de Uretra', 'Estenose de JUP e Ureter', 'Fístulas Urinárias', 'Genitoplastia em Transsexuais', 'IU Masculina']
};

export const LEVEL_CONFIG = [
  { level: 1, minXp: 0, maxXp: 499, name: 'Iniciante Curioso', icon: '🥚' },
  { level: 2, minXp: 500, maxXp: 1999, name: 'Iniciante Esperto', icon: '🥚🥚' },
  { level: 3, minXp: 2000, maxXp: 4999, name: 'Jovem Residente', icon: '🐣' },
  { level: 4, minXp: 5000, maxXp: 9999, name: 'Residente Galinho', icon: '🐔' },
  { level: 5, minXp: 10000, maxXp: 14599, name: 'Residente Bronze', icon: '🥉' },
  { level: 6, minXp: 14600, maxXp: 29999, name: 'Especialista Prata', icon: '🥈' },
  { level: 7, minXp: 30000, maxXp: 49999, name: 'Mestre da Urologia', icon: '🥇' },
  { level: 8, minXp: 50000, maxXp: 79999, name: 'Doutor da Urologia', icon: '🎓' },
  { level: 9, minXp: 80000, maxXp: 99999, name: 'Mago da Urologia', icon: '🧙‍♂️' },
  { level: 10, minXp: 100000, maxXp: 499999, name: 'Nível Olímpo', icon: '🏛️👑' },
  { level: 11, minXp: 500000, maxXp: Infinity, name: 'UroInsighter Supremo', icon: '🏆⭐' },
];

export const getLevelFromXp = (xp: number) => {
  return LEVEL_CONFIG.find(l => xp >= l.minXp && xp <= l.maxXp) || LEVEL_CONFIG[LEVEL_CONFIG.length - 1];
};

export const PRIMARY_COLOR = '#1E3A8A';
export const SUCCESS_COLOR = '#10B981';
