import React from 'react';
import { Calculator, History, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: 'calc' | 'config' | 'history';
  setActiveTab: (tab: 'calc' | 'config' | 'history') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex bg-slate-100 p-1 rounded-xl">
      <button 
        onClick={() => setActiveTab('calc')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'calc' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Calculator className="w-4 h-4" />
        <span className="hidden sm:inline">Calculadora</span>
      </button>
      <button 
        onClick={() => setActiveTab('history')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <History className="w-4 h-4" />
        <span className="hidden sm:inline">Histórico</span>
      </button>
      <button 
        onClick={() => setActiveTab('config')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'config' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Manutenção</span>
      </button>
    </nav>
  );
};
