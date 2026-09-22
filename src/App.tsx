import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DateSelector } from './components/DateSelector';
import { ProgressCard } from './components/ProgressCard';
import { NannyDashboard } from './components/NannyDashboard';
import { ParentsDashboard } from './components/ParentsDashboard';
import { HistoryReportsView } from './components/HistoryReportsView';
import { SettingsView } from './components/SettingsView';
import { BottomNavBar } from './components/BottomNavBar';
import { Check } from 'lucide-react';

const MainScreen: React.FC = () => {
  const { role, activeTab, toastMessage } = useApp();

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-screen pb-24 shadow-lg bg-[#FAF8F5]">
      {/* Top Header */}
      <Header />

      {/* Main Content Body */}
      <main className="px-4 pt-2.5 space-y-3 flex-1">
        {activeTab === 'rotina' && (
          <>
            <DateSelector />
            <ProgressCard />
            {role === 'baba' ? <NannyDashboard /> : <ParentsDashboard />}
          </>
        )}

        {activeTab === 'historico' && <HistoryReportsView />}

        {activeTab === 'ajustes' && <SettingsView />}
      </main>

      {/* Toast feedback toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#81F3E5] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}
