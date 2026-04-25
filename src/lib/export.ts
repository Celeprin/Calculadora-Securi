import { CalculationResult } from '../types';

export const exportToCSV = (data: CalculationResult[]) => {
  if (data.length === 0) return;

  const headers = [
    'Condominio', 'Data', 'Preço Cond', 'Cams Ativas', 'Unid Ativas', 
    'Disp Ativos', 'Ramais', 'Gravação', 'Estacionamento', 'Ativo', 
    'Pro-rata (dias)', 'Total Mensal', 'Valor Pro-rata', 'Valor Final'
  ];

  const rows = data.map(item => [
    item.nomeCondominio,
    item.dataCriacao,
    item.precoCond.toFixed(2),
    item.qtdCamAtivas,
    item.unAtivas,
    item.dispAtivos,
    item.totalRamais,
    item.gravacao ? 'Sim' : 'Não',
    item.estacionamento ? 'Sim' : 'Não',
    item.ativo ? 'Sim' : 'Não',
    item.diasProRata,
    item.totalMensal.toFixed(2),
    item.valorProRata.toFixed(2),
    item.valorFinal.toFixed(2)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `securi_fechamento_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
