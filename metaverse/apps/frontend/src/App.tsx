import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ArenaPage } from './pages/Arena';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);

  // Check URL query params on mount for direct game links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spaceIdParam = params.get('spaceId');
    if (spaceIdParam) {
      setActiveSpaceId(spaceIdParam);
    }
  }, []);

  // Update URL search query whenever activeSpaceId changes
  const handleEnterSpace = (spaceId: string) => {
    setActiveSpaceId(spaceId);
    const url = new URL(window.location.href);
    url.searchParams.set('spaceId', spaceId);
    window.history.pushState({}, '', url.toString());
  };

  const handleExitSpace = () => {
    setActiveSpaceId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('spaceId');
    window.history.pushState({}, '', url.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-meta-bg flex flex-col items-center justify-center text-meta-muted font-mono">
        <div className="w-14 h-14 mc-slot mb-4 flex items-center justify-center">
          <div className="w-10 h-10 bg-[#3B7A23] border-t-2 border-l-2 border-[#559E37] border-r-2 border-b-2 border-r-[#1C420D] border-b-[#1C420D] flex items-center justify-center">
            <span className="font-extrabold text-xl text-white mc-text">M</span>
          </div>
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-[#4DEDF3] mb-2" />
        <span className="text-xs font-bold tracking-widest text-[#55FF55] uppercase mc-text">
          Loading Minecraftverse...
        </span>
      </div>
    );
  }

  // Not logged in: Show Authentication flow
  if (!user) {
    if (authView === 'signup') {
      return <Signup onNavigateToSignin={() => setAuthView('signin')} />;
    }
    return <Signin onNavigateToSignup={() => setAuthView('signup')} />;
  }

  // Active space arena
  if (activeSpaceId) {
    return (
      <ArenaPage
        spaceId={activeSpaceId}
        onExit={handleExitSpace}
      />
    );
  }

  // Main Dashboard
  return (
    <Dashboard
      onEnterSpace={handleEnterSpace}
    />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
