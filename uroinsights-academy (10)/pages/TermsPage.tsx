
import React from 'react';
import { Logo } from '../components/Logo';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white font-['Inter'] text-slate-700 pb-20">
      <header className="py-10 border-b border-slate-100 mb-12">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('landing')}>
            <Logo size="sm" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 leading-none uppercase">UroInsights</span>
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1">Academy</span>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('landing')}
            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Voltar ao Início
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 leading-relaxed">
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Termos de Uso</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="font-bold text-lg text-slate-900">
            Bem-vindo ao UroInsights Academy ("Plataforma de Ensino").
          </p>
          
          <p>
            Estes Termos de Uso regem o uso dos serviços oferecidos pela UroInsights Academy, plataforma de ensino online especializada em Urologia, desenvolvida por MedInsights Academy. Ao acessar, registrar-se ou utilizar a Plataforma, você ("Usuário") declara ter lido, compreendido e concordado integralmente com estes Termos, incluindo a Política de Privacidade incorporada por referência.
          </p>

          <p>
            Estes Termos são regidos pela legislação brasileira, notadamente o Código Civil (Lei nº 10.406/2002), Código de Defesa do Consumidor (Lei nº 8.078/1990), Marco Civil da Internet (Lei nº 12.965/2014) e Código de Processo Civil (Lei nº 13.105/2015).
          </p>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">1. Descrição dos Serviços</h2>
            <p>A Plataforma oferece conteúdo educacional gamificado em Urologia para estudantes de medicina, residentes e profissionais, incluindo questões, flashcards, simulados, progresso XP/níveis e atualizações baseadas em diretrizes EAU/AUA/Campbell.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Plano Gratuito:</strong> Acesso limitado a cerca de 10% do conteúdo (ex.: 3 questões por tema).</li>
              <li><strong>Plano Premium:</strong> Acesso 100% por 1 ano (Mensal: R$69,90 em até 12x; Anual: R$750).</li>
            </ul>
            <p className="bg-amber-50 p-4 border-l-4 border-amber-400 font-bold text-amber-800 rounded-r-xl">
              Conteúdo é didático e não substitui consulta médica, diagnóstico ou tratamento profissional.
            </p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">2. Cadastro e Contas</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Registro requer dados verdadeiros (nome, email, senha forte).</li>
              <li>Contas gratuitas expiram inatividade 90 dias; premium vinculada a pagamento.</li>
              <li>Proibido: contas falsas, compartilhamento, automação (bots).</li>
              <li>Nós podemos suspender/bloquear por violação sem aviso.</li>
            </ul>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">3. Assinaturas e Pagamentos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pagamentos via PagSeguro/PagBank (Pix, cartão, boleto).</li>
              <li>Renovação automática; cancele via conta ou suporte.</li>
              <li>Sem reembolso após acesso; prorata em cancelamento anual.</li>
              <li>Impostos inclusos; disputas via PagSeguro ou Procon.</li>
            </ul>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">4. Uso Permitido e Proibições</h2>
            <p>Permitido: estudo pessoal, não comercial.</p>
            <p className="font-bold">Proibido:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Copiar/distribuir conteúdo (questões protegidas direitos autorais).</li>
              <li>Engenharia reversa, scraping, overload servidores.</li>
              <li>Conteúdo ofensivo, spam, violação LGPD/Marco Civil.</li>
              <li>Uso comercial sem licença escrita.</li>
            </ul>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">5. Propriedade Intelectual</h2>
            <p>Todo conteúdo é nosso ou licenciado (© 2026 UroInsights Academy). Licença não exclusiva para uso pessoal durante vigência conta.</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">6. Isenção de Responsabilidade</h2>
            <p>Conteúdo baseado evidências, mas sem garantia de exatidão 100%. Usuário isenta por erros médicos/estudo. Não responsabiliza por danos indiretos, lucros cessantes (art. 944 CC).</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">7. Término</h2>
            <p>Podemos terminar acesso por violação. Você pode cancelar assinatura.</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">8. Alterações</h2>
            <p>Atualizações publicadas na Plataforma; uso contínuo implica aceitação.</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">9. Contato</h2>
            <p className="font-bold text-blue-600">uroinsights@gmail.com</p>
            <p className="text-sm text-slate-400 mt-10">Última atualização: 01/01/2026.</p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
           <Logo size="md" className="opacity-20 grayscale" />
           <button 
             onClick={() => onNavigate('landing')}
             className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
           >
             Aceitar e Voltar
           </button>
        </div>
      </main>
    </div>
  );
};
