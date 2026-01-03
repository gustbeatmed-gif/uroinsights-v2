
import React, { useState, useEffect } from 'react';
import { User } from './types';
import { dbService } from './services/db';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Questions } from './pages/Questions';
import { Admin } from './pages/Admin';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { SimuladosPage } from './pages/SimuladosPage';
import { ProgressoPage } from './pages/ProgressoPage';
import { PremiumCheckout } from './pages/PremiumCheckout';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ContactPage } from './pages/ContactPage';

const App: React.FC = () => {
  // Função auxiliar para obter o usuário inicial do localStorage de forma síncrona
  const getInitialUser = (): User | null => {
    const savedUser = localStorage.getItem('uroinsights_user');
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      // Verifica se o usuário ainda existe no banco de dados (localStorage db)
      return dbService.getUsers().find(u => u.id === parsed.id) || null;
    } catch (e) {
      localStorage.removeItem('uroinsights_user');
      return null;
    }
  };

  const initialUser = getInitialUser();

  // Estados inicializados com base na sessão existente para evitar flicker
  const [user, setUser] = useState<User | null>(initialUser);
  const [page, setPage] = useState<string>(
    initialUser 
      ? (initialUser.role === 'admin' ? 'admin' : 'dashboard') 
      : 'landing'
  );
  const [pageParams, setPageParams] = useState<any>(null);

  // Efeito para manter o banco de dados e a sessão em sincronia se houver mudanças externas
  useEffect(() => {
    const syncUser = () => {
      const freshUser = getInitialUser();
      if (JSON.stringify(freshUser) !== JSON.stringify(user)) {
        setUser(freshUser);
        if (!freshUser && !['landing', 'login', 'signup', 'terms', 'privacy', 'contact'].includes(page)) {
          setPage('landing');
        }
      }
    };

    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, [user, page]);

  const handleNavigate = (newPage: string, params: any = null) => {
    setPage(newPage);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('uroinsights_user', JSON.stringify(loggedUser));
    setPage(loggedUser.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('uroinsights_user');
    setPage('landing');
    setPageParams(null);
  };

  const handlePremiumSuccess = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('uroinsights_user', JSON.stringify(updatedUser));
    setPage('dashboard');
  };

  const handleXPUpdate = (amount: number, themeId?: number, activityTitle?: string) => {
    if (!user) return;
    const updated = dbService.addXP(user.id, amount, themeId, activityTitle);
    if (updated) {
      setUser({ ...updated });
      localStorage.setItem('uroinsights_user', JSON.stringify(updated));
    }
  };

  const renderPage = () => {
    const isPublicPage = ['landing', 'login', 'signup', 'terms', 'privacy', 'contact'].includes(page);
    
    // Fallback de proteção para páginas privadas
    if (!isPublicPage && !user) {
      return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
    }

    switch (page) {
      case 'landing': return <Landing onNavigate={handleNavigate} />;
      case 'login': return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'signup': return <Signup onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'terms': return <TermsPage onNavigate={handleNavigate} />;
      case 'privacy': return <PrivacyPage onNavigate={handleNavigate} />;
      case 'contact': return <ContactPage onNavigate={handleNavigate} />;
      case 'dashboard': return user ? <Dashboard user={user} onNavigate={handleNavigate} /> : null;
      case 'questions': return user ? <Questions user={user} themeId={pageParams?.themeId} onNavigate={handleNavigate} onXPUpdate={handleXPUpdate} /> : null;
      case 'flashcards': return user ? <FlashcardsPage user={user} onNavigate={handleNavigate} onXPUpdate={handleXPUpdate} /> : null;
      case 'simulados': return user ? <SimuladosPage user={user} onNavigate={handleNavigate} onXPUpdate={handleXPUpdate} /> : null;
      case 'progresso': return user ? <ProgressoPage user={user} onNavigate={handleNavigate} /> : null;
      case 'admin': return <Admin user={user} onNavigate={handleNavigate} />;
      case 'premium-checkout': return user ? <PremiumCheckout user={user} onSuccess={handlePremiumSuccess} onCancel={() => setPage('dashboard')} /> : null;
      default: return <Landing onNavigate={handleNavigate} />;
    }
  };

  const showSidebar = user && !['landing', 'login', 'signup', 'premium-checkout', 'admin', 'terms', 'privacy', 'contact'].includes(page);
  const showTopBar = user && !['landing', 'login', 'signup', 'premium-checkout', 'terms', 'privacy', 'contact'].includes(page);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {showSidebar && user && (
        <Sidebar 
          activePage={page} 
          onNavigate={handleNavigate} 
          userProgress={dbService.getUserProgress(user.id)}
          activeParams={pageParams}
        />
      )}
      <main className="flex-1 flex flex-col min-w-0">
        {showTopBar && user && <TopBar user={user} onLogout={handleLogout} />}
        <div className="flex-1 overflow-x-hidden">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
