
import React, { useState } from 'react';
import { Logo } from '../components/Logo';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulando o envio para uroinsights@gmail.com
    setTimeout(() => {
      console.log('Enviando para uroinsights@gmail.com:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] text-slate-700 pb-20">
      <header className="py-10 bg-white border-b border-slate-100 mb-12">
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

      <main className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Entre em Contato</h1>
          <p className="text-slate-500 font-medium">Dúvidas, sugestões ou suporte técnico? Nossa equipe está pronta para ajudar.</p>
        </div>

        {status === 'success' ? (
          <div className="bg-emerald-50 border-2 border-emerald-100 p-12 rounded-[3rem] text-center animate-in zoom-in duration-500">
            <div className="text-6xl mb-6">📩</div>
            <h2 className="text-2xl font-black text-emerald-800 mb-2">Mensagem Enviada!</h2>
            <p className="text-emerald-600 font-bold mb-8">Recebemos seu contato. Responderemos em breve no seu e-mail.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
            >
              Enviar Nova Mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl transition-all font-bold text-slate-800 outline-none"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">E-mail</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl transition-all font-bold text-slate-800 outline-none"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Telefone</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl transition-all font-bold text-slate-800 outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sua Mensagem</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] transition-all font-bold text-slate-800 outline-none resize-none"
                  placeholder="Como podemos ajudar você hoje?"
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-6 bg-blue-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 transform active:scale-95"
            >
              {status === 'loading' ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Enviar Mensagem 🚀'
              )}
            </button>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
              Sua mensagem será enviada para <span className="text-blue-600">uroinsights@gmail.com</span>
            </p>
          </form>
        )}
      </main>
    </div>
  );
};
