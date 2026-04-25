/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Settings, 
  History, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  TrendingUp,
  Building2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BasePrices, CalculationResult, DEFAULT_BASE_PRICES } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'config' | 'history'>('calc');
  const [basePrices, setBasePrices] = useState<BasePrices>(() => {
    const saved = localStorage.getItem('securi_base_prices');
    return saved ? JSON.parse(saved) : DEFAULT_BASE_PRICES;
  });
  const [history, setHistory] = useState<CalculationResult[]>(() => {
    const saved = localStorage.getItem('securi_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculation Form State
  const [nome, setNome] = useState('');
  const [dataCompetencia, setDataCompetencia] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [precoCondInput, setPrecoCondInput] = useState<number>(basePrices.condominio);
  const [qtdCamAtivas, setQtdCamAtivas] = useState<number>(0);
  const [unAtivas, setUnAtivas] = useState<number>(0);
  const [dispAtivos, setDispAtivos] = useState<number>(0);
  const [gravacao, setGravacao] = useState<boolean>(true);
  const [totalRamais, setTotalRamais] = useState<number>(0);
  const [estac, setEstac] = useState<boolean>(false);
  const [ativo, setAtivo] = useState<boolean>(true);
  const [diasProRata, setDiasProRata] = useState<number>(0);

  // Persistence
  useEffect(() => {
    localStorage.setItem('securi_base_prices', JSON.stringify(basePrices));
  }, [basePrices]);

  useEffect(() => {
    localStorage.setItem('securi_history', JSON.stringify(history));
  }, [history]);

  // Sync Preço Cond when base price changes
  useEffect(() => {
    setPrecoCondInput(basePrices.condominio);
  }, [basePrices.condominio]);

  // Helper for Days in Month
  const daysInMonth = useMemo(() => {
    if (!dataCompetencia) return 30;
    const [year, month] = dataCompetencia.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  }, [dataCompetencia]);

  // Main Calculation Logic
  const currentResult: CalculationResult = useMemo(() => {
    const camExtras = Math.max(0, qtdCamAtivas - basePrices.baseCameras);
    const precoCam = camExtras * basePrices.cameraExtra;

    const unExtras = Math.max(0, unAtivas - basePrices.baseUnidades);
    const precoUn = unExtras * basePrices.unidadeExtra;

    const dispExtras = Math.max(0, dispAtivos - basePrices.baseDispositivos);
    const precoDisp = dispExtras * basePrices.dispositivoExtra;

    const totalGrav = gravacao ? basePrices.gravacaoCond * qtdCamAtivas : 0;
    
    // Total VOIP = MÍNIMO(Total Ramais*preco base VOIP Unidade;preco base VOIP Condo:)
    const totalVOIP = Math.min(totalRamais * basePrices.voipUnidade, basePrices.voipCondo);

    const totalEstac = estac ? basePrices.estacionamento : 0;

    const totalMensal = ativo 
      ? precoCondInput + precoCam + precoUn + precoDisp + totalGrav + totalVOIP + totalEstac 
      : 0;

    const valorProRata = diasProRata > 0 
      ? (totalMensal / daysInMonth) * diasProRata 
      : 0;

    const valorFinal = totalMensal + valorProRata;

    return {
      id: crypto.randomUUID(),
      nomeCondominio: nome,
      dataCriacao: dataCompetencia,
      precoCond: precoCondInput,
      qtdCamAtivas,
      baseCam: basePrices.baseCameras,
      unAtivas,
      baseUn: basePrices.baseUnidades,
      dispAtivos,
      baseDisp: basePrices.baseDispositivos,
      gravacao,
      totalRamais,
      estacionamento: estac,
      ativo,
      diasProRata,
      camExtras,
      precoCam,
      unExtras,
      precoUn,
      dispExtras,
      precoDisp,
      totalGrav,
      totalVOIP,
      totalEstac,
      totalMensal,
      valorProRata,
      valorFinal,
      timestamp: Date.now()
    };
  }, [
    nome, dataCompetencia, precoCondInput, qtdCamAtivas, unAtivas, 
    dispAtivos, gravacao, totalRamais, estac, ativo, diasProRata, 
    basePrices, daysInMonth
  ]);

  const handleSave = () => {
    if (!nome) {
      alert('Por favor, informe o nome do condomínio.');
      return;
    }
    setHistory(prev => [currentResult, ...prev]);
    // Reset form selectively
    setNome('');
    setQtdCamAtivas(0);
    setUnAtivas(0);
    setDispAtivos(0);
    setTotalRamais(0);
    setDiasProRata(0);
    alert('Cálculo salvo com sucesso!');
  };

  const deleteHistory = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'calc' && (
            <motion.div 
              key="calc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
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
              <div className="lg:col-span-4 space-y-6">
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

                  <div className="p-8 space-y-5">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-3 border-b border-slate-100 mb-2">Detalhamento do Cálculo</h3>
                    
                    <div className="flex justify-between items-start group">
                      <div className="text-xs">
                        <p className="font-bold text-slate-700">Câmeras Extra ({currentResult.camExtras})</p>
                        <p className="text-slate-400">({currentResult.qtdCamAtivas} Ativ - {currentResult.baseCam} Base) × {formatCurrency(basePrices.cameraExtra)}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800">{formatCurrency(currentResult.precoCam)}</span>
                    </div>

                    <div className="flex justify-between items-start group">
                      <div className="text-xs">
                        <p className="font-bold text-slate-700">Unidades Extra ({currentResult.unExtras})</p>
                        <p className="text-slate-400">Excedente Base × {formatCurrency(basePrices.unidadeExtra)}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800">{formatCurrency(currentResult.precoUn)}</span>
                    </div>

                    {currentResult.totalGrav > 0 && (
                      <div className="flex justify-between items-start">
                        <div className="text-xs">
                          <p className="font-bold text-slate-700">Serviço de Gravação</p>
                          <p className="text-slate-400">{currentResult.qtdCamAtivas} Câms × {formatCurrency(basePrices.gravacaoCond)}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-800">{formatCurrency(currentResult.totalGrav)}</span>
                      </div>
                    )}

                    {currentResult.totalVOIP > 0 && (
                      <div className="flex justify-between items-start">
                        <div className="text-xs">
                          <p className="font-bold text-slate-700">VOIP Condo / Unid.</p>
                          <p className="text-slate-400">Taxa mínima por ramal</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-800">{formatCurrency(currentResult.totalVOIP)}</span>
                      </div>
                    )}

                    {currentResult.totalEstac > 0 && (
                      <div className="flex justify-between items-start">
                        <div className="text-xs">
                          <p className="font-bold text-slate-700">Estacionamento</p>
                          <p className="text-slate-400">Taxa base fixa mensal</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-800">{formatCurrency(currentResult.totalEstac)}</span>
                      </div>
                    )}
                    
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
              </div>
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div 
              key="config"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              <aside className="md:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
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
                    { label: 'VOIP Limite', key: 'voipCondo', type: 'currency' },
                    { label: 'Estacionamento', key: 'estacionamento', type: 'currency' },
                    { label: 'Qtd Base Câms', key: 'baseCameras', type: 'number' },
                    { label: 'Qtd Base Unid.', key: 'baseUnidades', type: 'number' },
                    { label: 'Qtd Base Disp.', key: 'baseDispositivos', type: 'number' },
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
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-5xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Histórico de Fechamento</h2>
                  <p className="text-sm text-slate-500">Últimos {history.length} cálculos registrados</p>
                </div>
                <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-lg shadow-indigo-100 shadow-sm transition-all hover:scale-105 cursor-default">
                  Base 2026-01
                </div>
              </div>

              {history.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                  <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <History className="w-12 h-12 opacity-50" />
                  </div>
                  <p className="text-lg font-bold text-slate-400">Nenhum cálculo encontrado</p>
                  <p className="text-sm mt-1 mb-6 text-slate-300">Comece fazendo uma simulação na calculadora.</p>
                  <button 
                    onClick={() => setActiveTab('calc')}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-all"
                  >
                    Abrir Calculadora
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {history.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      className={`group bg-white p-1 rounded-2xl border transition-all hover:shadow-xl hover:shadow-slate-200/50 ${item.ativo ? 'border-slate-200' : 'border-red-100 opacity-80'}`}
                    >
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${item.ativo ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Building2 className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-slate-800 tracking-tight">{item.nomeCondominio}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                <Calendar className="w-3.5 h-3.5" /> {item.dataCriacao}
                              </span>
                              <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${item.ativo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {item.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 pl-4 md:border-l border-slate-100">
                          <div className="text-right">
                             <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Total Liquidado</p>
                             <p className="text-3xl font-mono font-bold text-slate-900 tracking-tighter">{formatCurrency(item.valorFinal)}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={() => deleteHistory(item.id)}
                              className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Excluir"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                            <button 
                              className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              title="Exportar"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mx-5 mb-5 p-4 bg-slate-50 rounded-xl grid grid-cols-3 sm:grid-cols-6 gap-x-4 gap-y-4 text-center">
                          <div className="space-y-0.5">
                            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Câmeras</span>
                            <span className="text-xs font-mono font-bold text-slate-600 underline decoration-indigo-200 decoration-2">{item.qtdCamAtivas}</span>
                          </div>
                          <div className="space-y-0.5 border-l border-slate-200 hidden sm:block">
                            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Unidades</span>
                            <span className="text-xs font-mono font-bold text-slate-600">{item.unAtivas}</span>
                          </div>
                          <div className="space-y-0.5 border-l border-slate-200 hidden sm:block">
                            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Ramais</span>
                            <span className="text-xs font-mono font-bold text-slate-600">{item.totalRamais}</span>
                          </div>
                          <div className="space-y-0.5 border-l border-slate-200">
                            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Gravação</span>
                            <span className={`text-[10px] font-bold ${item.gravacao ? 'text-indigo-600' : 'text-slate-400'}`}>{item.gravacao ? 'ATIVO' : 'NÃO'}</span>
                          </div>
                          <div className="space-y-0.5 border-l border-slate-200">
                            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Mensal</span>
                            <span className="text-xs font-mono font-bold text-slate-600">{formatCurrency(item.totalMensal)}</span>
                          </div>
                          <div className="space-y-0.5 border-l border-slate-200">
                            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Pro-Rata</span>
                            <span className="text-xs font-mono font-bold text-indigo-500">{formatCurrency(item.valorProRata)}</span>
                          </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[11px] font-semibold uppercase tracking-widest">
        <p>&copy; 2026 Securi Soluções em Segurança</p>
        <div className="flex gap-6">
          <span className="hover:text-indigo-500 transition-colors cursor-pointer">Termos de Uso</span>
          <span className="hover:text-indigo-500 transition-colors cursor-pointer">Privacidade</span>
          <span className="text-slate-300">Versão 2.4.1-stable</span>
        </div>
      </footer>
    </div>
  );
}
