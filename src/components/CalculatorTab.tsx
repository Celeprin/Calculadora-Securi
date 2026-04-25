import React from 'react';
import { Building2, Calendar } from 'lucide-react';
import { BasePrices, CalculationResult } from '../types';
import { SummaryCard } from './SummaryCard';

interface CalculatorTabProps {
  nome: string;
  setNome: (v: string) => void;
  dataCompetencia: string;
  setDataCompetencia: (v: string) => void;
  precoCondInput: number;
  setPrecoCondInput: (v: number) => void;
  qtdCamAtivas: number;
  setQtdCamAtivas: (v: number) => void;
  unAtivas: number;
  setUnAtivas: (v: number) => void;
  dispAtivos: number;
  setDispAtivos: (v: number) => void;
  gravacao: boolean;
  setGravacao: (v: boolean) => void;
  totalRamais: number;
  setTotalRamais: (v: number) => void;
  estac: boolean;
  setEstac: (v: boolean) => void;
  ativo: boolean;
  setAtivo: (v: boolean) => void;
  diasProRata: number;
  setDiasProRata: (v: number) => void;
  basePrices: BasePrices;
  currentResult: CalculationResult;
  formatCurrency: (val: number) => string;
  handleSave: () => void;
}

export const CalculatorTab: React.FC<CalculatorTabProps> = ({
  nome, setNome,
  dataCompetencia, setDataCompetencia,
  precoCondInput, setPrecoCondInput,
  qtdCamAtivas, setQtdCamAtivas,
  unAtivas, setUnAtivas,
  dispAtivos, setDispAtivos,
  gravacao, setGravacao,
  totalRamais, setTotalRamais,
  estac, setEstac,
  ativo, setAtivo,
  diasProRata, setDiasProRata,
  basePrices,
  currentResult,
  formatCurrency,
  handleSave
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form Section */}
      <div className="lg:col-span-8 space-y-6">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Identificação e Período
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nome do Condomínio</label>
              <input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Residencial Bela Vista"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" /> Data de Criação
              </label>
              <input 
                type="month" 
                value={dataCompetencia}
                onChange={(e) => setDataCompetencia(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Preço Base Cond.</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">R$</span>
                <input 
                  type="number" 
                  value={precoCondInput}
                  onChange={(e) => setPrecoCondInput(Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-mono transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Infraestrutura e Serviços</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 col-span-2">
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Câm. Ativas</label>
                  <input 
                    type="number" 
                    value={qtdCamAtivas}
                    onChange={(e) => setQtdCamAtivas(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                  />
                  <p className="text-[10px] text-slate-400">Base: {basePrices.baseCameras} unid.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Unid. Ativas</label>
                  <input 
                    type="number" 
                    value={unAtivas}
                    onChange={(e) => setUnAtivas(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Disp. Ativos</label>
                  <input 
                    type="number" 
                    value={dispAtivos}
                    onChange={(e) => setDispAtivos(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Total Ramais</label>
                  <input 
                    type="number" 
                    value={totalRamais}
                    onChange={(e) => setTotalRamais(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Dias Pro-Rata</label>
                  <input 
                    type="number" 
                    value={diasProRata}
                    onChange={(e) => setDiasProRata(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                  />
                </div>
                <div className="flex items-end pb-3">
                   <label className="flex items-center gap-2 cursor-pointer group">
                     <input 
                        type="checkbox" 
                        checked={ativo}
                        onChange={(e) => setAtivo(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded bg-slate-100 border-slate-200 focus:ring-indigo-500"
                      />
                     <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Contrato Ativo</span>
                   </label>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Serviços Adicionais</p>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-1 ${gravacao ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={gravacao}
                      onChange={(e) => setGravacao(e.target.checked)}
                    />
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${gravacao ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Gravação</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-1 ${estac ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={estac}
                      onChange={(e) => setEstac(e.target.checked)}
                    />
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${estac ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Estacionamento</span>
                </label>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed italic">
                Os cálculos de serviços extras utilizam as taxas base configuradas na aba de manutenção.
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Resumo Section */}
      <div className="lg:col-span-4">
        <SummaryCard 
          currentResult={currentResult}
          formatCurrency={formatCurrency}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
};
