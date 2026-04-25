import React from 'react';
import { History, Building2, Calendar, Pencil, Trash2, Search, Download } from 'lucide-react';
import { CalculationResult } from '../types';
import { motion } from 'motion/react';
import { exportToCSV } from '../lib/export';

interface HistoryTabProps {
  history: CalculationResult[];
  filteredHistory: CalculationResult[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  deleteHistory: (id: string) => void;
  editHistory: (item: CalculationResult) => void;
  formatCurrency: (val: number) => string;
  setActiveTab: (v: 'calc' | 'config' | 'history') => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  history,
  filteredHistory,
  searchTerm,
  setSearchTerm,
  deleteHistory,
  editHistory,
  formatCurrency,
  setActiveTab
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Histórico de Fechamento</h2>
          <p className="text-sm text-slate-500">
            {history.length === 0 
              ? 'Nenhum cálculo registrado' 
              : `Mostrando ${filteredHistory.length} de ${history.length} cálculos`}
          </p>
        </div>
        
        {history.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Pesquisar por nome ou data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            <button 
              onClick={() => exportToCSV(filteredHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-900 transition-all whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              EXPORTAR CSV
            </button>
          </div>
        )}
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
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-slate-300">
          <Search className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg font-bold text-slate-400">Nenhum resultado para "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 text-indigo-600 font-bold hover:underline"
          >
            Limpar Busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((item) => (
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
                      onClick={() => editHistory(item)}
                      className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteHistory(item.id)}
                      className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
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
    </div>
  );
};
