import React from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { BasePrices } from '../types';

interface MaintenanceTabProps {
  basePrices: BasePrices;
  setBasePrices: React.Dispatch<React.SetStateAction<BasePrices>>;
  formatCurrency: (val: number) => string;
  resetToDefaults: () => void;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  basePrices,
  setBasePrices,
  formatCurrency,
  resetToDefaults
}) => {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
      <aside className="md:col-span-4 space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Taxas Atuais</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-xs text-slate-500 font-semibold">Condomínio</span>
              <span className="text-sm font-mono font-bold text-slate-700">{formatCurrency(basePrices.condominio)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-xs text-slate-500 font-semibold">Câmera Extra</span>
              <span className="text-sm font-mono font-bold text-slate-700">{formatCurrency(basePrices.cameraExtra)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-xs text-slate-500 font-semibold">Gravação/Câm</span>
              <span className="text-sm font-mono font-bold text-slate-700">{formatCurrency(basePrices.gravacaoCond)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-xs text-slate-500 font-semibold">VOIP Unid.</span>
              <span className="text-sm font-mono font-bold text-slate-700">{formatCurrency(basePrices.voipUnidade)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-800 font-black uppercase tracking-tighter">Base Isenta</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black">{basePrices.baseCameras} CÂMS</span>
            </div>
          </div>
        </div>

        <button 
          onClick={resetToDefaults}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar Padrões
        </button>
      </aside>

      <section className="md:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Manutenção de Preços</h2>
            <p className="text-sm text-slate-400">Ajuste os valores contratuais globais</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Settings className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {[
            { label: 'Condomínio Base', key: 'condominio', type: 'currency' },
            { label: 'Câmera Extra', key: 'cameraExtra', type: 'currency' },
            { label: 'Unidade Extra', key: 'unidadeExtra', type: 'currency' },
            { label: 'Disp. Extra', key: 'dispositivoExtra', type: 'currency' },
            { label: 'Gravação (Câm)', key: 'gravacaoCond', type: 'currency' },
            { label: 'VOIP Unid.', key: 'voipUnidade', type: 'currency' },
            { label: 'VOIP Unitário', key: 'voipCondo', type: 'currency' },
            { label: 'Estacionamento', key: 'estacionamento', type: 'currency' },
            { label: 'Base Câms', key: 'baseCameras', type: 'number' },
            { label: 'Base Un.', key: 'baseUnidades', type: 'number' },
            { label: 'Base Disp.', key: 'baseDispositivos', type: 'number' },
          ].map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex justify-between">
                {field.label}
                {field.type === 'currency' && <span className="text-indigo-300">R$</span>}
              </label>
              <input 
                type="number" 
                step={field.type === 'currency' ? '0.01' : '1'}
                value={basePrices[field.key as keyof BasePrices]}
                onChange={(e) => setBasePrices(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white outline-none transition-all font-mono text-sm font-bold text-slate-700"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-xs font-semibold text-slate-400">Alterações são persistidas localmente no navegador.</p>
        </div>
      </section>
    </div>
  );
};
