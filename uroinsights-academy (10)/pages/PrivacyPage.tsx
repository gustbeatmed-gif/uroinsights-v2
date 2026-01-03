
import React from 'react';
import { Logo } from '../components/Logo';

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
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
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Política de Privacidade</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="font-bold text-lg text-slate-900">
            Compromisso com sua Privacidade e Segurança de Dados.
          </p>
          
          <p>
            Política de Privacidade do UroInsights Academy, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018), Lei nº 14.133/2021 (Licitações) e Marco Civil da Internet. Encaramos a privacidade como prioridade, processando dados minimamente para educação urológica.
          </p>

          <p className="font-black text-blue-600">DPO: uroinsights@gmail.com.</p>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">1. Dados Coletados</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Pessoais:</strong> Nome, email, senha (bcrypt), dados PagSeguro (CPF para faturamento).</li>
              <li><strong>Uso:</strong> Progresso (XP, acertos), IP, dispositivo (analytics).</li>
              <li><strong>Sensíveis:</strong> Nenhum; conteúdo médico anônimo.</li>
            </ul>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">2. Finalidades</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cadastro/login.</li>
              <li>Assinaturas/pagamentos.</li>
              <li>Personalização (progresso premium).</li>
              <li>Emails educacionais (opt-out).</li>
              <li>Conformidade fiscal/auditoria.</li>
            </ul>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">3. Base Legal</h2>
            <p>Consentimento (cadastro), execução contrato (premium), legítimo interesse (analytics), obrigação legal (faturamento).</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">4. Compartilhamento</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>PagSeguro (pagamentos).</li>
              <li>Supabase/Hostinger (hospedagem segura).</li>
              <li>Autoridades (ordem judicial).</li>
            </ul>
            <p className="font-black">Não vendemos ou alugamos seus dados.</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">5. Armazenamento e Segurança</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Até 1 ano pós-assinatura ou prazo legal.</li>
              <li>SSL, firewalls, backups criptografados.</li>
              <li>Incidentes: notificação ANPD/Usuário em 72h (Res. ANPD nº 15/2024).</li>
            </ul>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">6. Direitos do Titular (Art. 18 LGPD)</h2>
            <p>Acesse, corrija, anonimze, delete, portabilidade, revogação consentimento via <strong>uroinsights@gmail.com</strong>. Resposta em 15 dias.</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">7. Cookies e Tecnologias</h2>
            <p>Essenciais (login), funcionais (progresso), analytics (Google Analytics - anonimato). Rejeite via navegador.</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">8. Transferência Internacional</h2>
            <p>Supabase (EUA/Europa) com cláusulas contratuais padrão (adequação ANPD).</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">9. Menores e Terceiros</h2>
            <p>Não para &lt;18 sem responsável. Links externos: responsabilidade própria.</p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">10. Alterações</h2>
            <p>Publicadas nesta seção; recomendamos monitorar periodicamente.</p>
            <p className="text-sm text-slate-400 mt-10">Atualização: 01/01/2026.</p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
           <button 
             onClick={() => onNavigate('landing')}
             className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all"
           >
             Entendido
           </button>
        </div>
      </main>
    </div>
  );
};
