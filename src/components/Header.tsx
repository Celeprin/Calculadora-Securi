import React from 'react';
import { Calculator } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-sm shadow-indigo-200">
            <Calculator className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Securi <span className="text-indigo-600">Fechamento</span>
          </h1>
        </div>
        <div className="hidden sm:block">
           <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm">
            Portal Administrativo
          </div>
        </div>
      </div>
    </header>
  );
};
