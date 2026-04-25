/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CalculatorTab } from './components/CalculatorTab';
import { MaintenanceTab } from './components/MaintenanceTab';
import { HistoryTab } from './components/HistoryTab';
import { usePricing } from './hooks/usePricing';
import { CalculationResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'config' | 'history'>('calc');
  const pricing = usePricing();

  const handleEditHistory = (item: CalculationResult) => {
    pricing.editHistory(item);
    setActiveTab('calc');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'calc' && (
            <motion.div 
              key="calc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CalculatorTab 
                {...pricing}
                formatCurrency={formatCurrency}
              />
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div 
              key="config"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <MaintenanceTab 
                basePrices={pricing.basePrices}
                setBasePrices={pricing.setBasePrices}
                formatCurrency={formatCurrency}
                resetToDefaults={pricing.resetToDefaults}
              />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <HistoryTab 
                history={pricing.history}
                filteredHistory={pricing.filteredHistory}
                searchTerm={pricing.searchTerm}
                setSearchTerm={pricing.setSearchTerm}
                deleteHistory={pricing.deleteHistory}
                editHistory={handleEditHistory}
                formatCurrency={formatCurrency}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[11px] font-semibold uppercase tracking-widest">
        <p>&copy; 2026 Securi Soluções em Segurança</p>
        <div className="flex gap-6">
          <span className="hover:text-indigo-500 transition-colors cursor-pointer">Termos de Uso</span>
          <span className="hover:text-indigo-500 transition-colors cursor-pointer">Privacidade</span>
          <span className="text-slate-300">Versão 2.5.0-stable</span>
        </div>
      </footer>
    </div>
  );
}
