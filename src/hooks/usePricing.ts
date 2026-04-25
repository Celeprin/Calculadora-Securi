import { useState, useEffect, useMemo } from 'react';
import { BasePrices, CalculationResult, DEFAULT_BASE_PRICES } from '../types';

export function usePricing() {
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
    basePrices, daysInMonth, precoCondInput
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

  const editHistory = (item: CalculationResult) => {
    setNome(item.nomeCondominio);
    setDataCompetencia(item.dataCriacao);
    setPrecoCondInput(item.precoCond);
    setQtdCamAtivas(item.qtdCamAtivas);
    setUnAtivas(item.unAtivas);
    setDispAtivos(item.dispAtivos);
    setGravacao(item.gravacao);
    setTotalRamais(item.totalRamais);
    setEstac(item.estacionamento);
    setAtivo(item.ativo);
    setDiasProRata(item.diasProRata);
  };

  const resetToDefaults = () => {
    if (confirm('Tem certeza que deseja restaurar os preços padrão? Isso afetará todos os novos cálculos.')) {
      setBasePrices(DEFAULT_BASE_PRICES);
    }
  };

  return {
    basePrices, setBasePrices,
    history, setHistory,
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
    currentResult,
    handleSave,
    deleteHistory,
    editHistory,
    resetToDefaults
  };
}
