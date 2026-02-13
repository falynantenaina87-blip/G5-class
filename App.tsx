import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import AnnouncementsScreen from './components/AnnouncementsScreen';
import FlashcardScreen from './components/FlashcardScreen';
import ScheduleScreen from './components/ScheduleScreen';
import HomeworkScreen from './components/HomeworkScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import { Tab } from './types';
import { AppProvider, useApp } from './contexts/AppContext';

// Petit composant Toast local
const ToastNotification: React.FC = () => {
    const { toast } = useApp();
    if (!toast) return null;

    const isError = toast.type === 'error';

    return (
        <div className={`
            fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[60] 
            px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-fade-in
            ${isError ? 'bg-red-600 text-white' : 'bg-ink-black text-white'}
        `}>
            <span className="material-symbols-outlined text-[20px]">
                {isError ? 'error_outline' : 'check_circle'}
            </span>
            <span className="font-medium text-sm">{toast.message}</span>
        </div>
    );
};

// Composant de chargement initial
const LoadingScreen: React.FC = () => (
    <div className="h-screen w-full flex items-center justify-center bg-rice-paper">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-imperial-red border-t-transparent rounded-full animate-spin"></div>
            <div className="font-calligraphy text-2xl text-ink-black animate-pulse">G5 Class</div>
        </div>
    </div>
);

const MainLayout: React.FC = () => {
  const { user, isLoading } = useApp();
  const [currentTab, setCurrentTab] = useState<Tab>('announcements'); 

  // AUTH GUARD :
  // 1. Si chargement session -> Loading
  if (isLoading) return <LoadingScreen />;

  // 2. Si pas d'utilisateur -> Login Screen (Bloquant)
  if (!user) {
      return (
          <>
            <LoginScreen />
            <ToastNotification />
          </>
      );
  }

  // 3. Si utilisateur connecté -> Interface Principale
  // Note: Les droits Admin sont déjà vérifiés et stockés dans user.role par le Context lors du chargement.

  const renderContent = () => {
    switch (currentTab) {
      case 'announcements': return <AnnouncementsScreen />;
      case 'flashcard': return <FlashcardScreen />;
      case 'schedule': return <ScheduleScreen />;
      case 'homework': return <HomeworkScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <AnnouncementsScreen />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-rice-paper">
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
      
      <ToastNotification />
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <MainLayout />
        </AppProvider>
    );
};

export default App;