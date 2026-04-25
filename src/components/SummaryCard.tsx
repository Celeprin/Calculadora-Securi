import React from 'react';
import { TrendingUp, Save } from 'lucide-react';
import { CalculationResult } from '../types';

interface SummaryCardProps {
  currentResult: CalculationResult;
  formatCurrency: (val: number) => string;
  handleSave: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ currentResult, formatCurrency, handleSave }) => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden sticky top-24">
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <TrendingUp className="w-20 h-20 rotate-12" />
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Faturamento Final Estimado</p>
        <div className="text-4xl font-mono font-bold tracking-tighter relative z-10">{formatCurrency(currentResult.valorFinal)}</div>
        
        <div className="mt-6 flex justify-between text-xs border-t border-slate-800 pt-4 relative z-10">
          <span className="text-slate-500 font-semibold uppercase">Mensal Base</span>
          <span className="font-mono text-slate-300">{formatCurrency(currentResult.totalMensal)}</span>
        </div>
        <div className="mt-3 flex justify-between text-xs relative z-10">
          <span className="text-slate-500 font-semibold uppercase">Total Pro-Rata</span>
          <span className="font-mono text-indigo-400">+{formatCurrency(currentResult.valorProRata)}</span>
        </div>
      </div>

      <div className="p-8 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-1 border-b border-slate-100 mb-2">Detalhamento do Cálculo</h3>
        
        <div className="space-y-2.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 font-semibold uppercase">Preço Cond.</span>
            <span className="font-mono font-bold text-slate-700">{formatCurrency(currentResult.precoCond)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 font-semibold uppercase">Preço Câm.</span>
            <span className="font-mono font-bold text-slate-700">{formatCurrency(currentResult.precoCam)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 font-semibold uppercase">Preço Un.</span>
            <span className="font-mono font-bold text-slate-700">{formatCurrency(currentResult.precoUn)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 font-semibold uppercase">Preço Disp.</span>
            <span className="font-mono font-bold text-slate-700">{formatCurrency(currentResult.precoDisp)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 font-semibold uppercase">Total Grav.</span>
            <span className="font-mono font-bold text-slate-700">{formatCurrency(currentResult.totalGrav)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 font-semibold uppercase">Total VOIP</span>
            <span className="font-mono font-bold text-slate-700">{formatCurrency(currentResult.totalVOIP)}</span>
          </div>
          <div className="flex justify-between text-[11px] pb-2 border-b border-slate-50">
            <span className="text-slate-500 font-semibold uppercase">Total Estac.</span>
            <span className="font-mono font-bold text-slate-700">{formatCurrency(currentResult.totalEstac)}</span>
          </div>

          <div className="flex justify-between text-xs font-black text-indigo-700 bg-indigo-50/50 px-3 py-2 rounded-xl mb-4 border border-indigo-100/50">
            <span>SUBTOTAL</span>
            <span className="font-mono">{formatCurrency(currentResult.totalMensal)}</span>
          </div>

          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 font-semibold uppercase">Valor Pro-Rata</span>
            <span className="font-mono font-bold text-indigo-500">+{formatCurrency(currentResult.valorProRata)}</span>
          </div>

          <div className="flex justify-between text-xs font-black border-t border-slate-100 pt-3 text-slate-900 uppercase tracking-tighter">
            <span>Valor Final</span>
            <span className="font-mono">{formatCurrency(currentResult.valorFinal)}</span>
          </div>
        </div>
        
        <div className="pt-6 mt-2">
           <button 
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 text-white font-bold text-xs bg-indigo-600 py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
           >
             <Save className="w-4 h-4" />
             SALVAR NO HISTÓRICO
           </button>
        </div>
      </div>
    </section>
  );
};
