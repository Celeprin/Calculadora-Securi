/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BasePrices {
  condominio: number;
  cameraExtra: number;
  unidadeExtra: number;
  dispositivoExtra: number;
  gravacaoCond: number;
  gravacaoExtra: number;
  voipUnidade: number;
  voipCondo: number;
  voipCondoExtra: number;
  estacionamento: number;
  baseCameras: number;
  baseUnidades: number;
  baseDispositivos: number;
}

export interface CalculationResult {
  id: string;
  nomeCondominio: string;
  dataCriacao: string;
  
  // Inputs
  precoCond: number;
  qtdCamAtivas: number;
  baseCam: number;
  unAtivas: number;
  baseUn: number;
  dispAtivos: number;
  baseDisp: number;
  gravacao: boolean;
  totalRamais: number;
  estacionamento: boolean;
  ativo: boolean;
  diasProRata: number;

  // Calculated values
  camExtras: number;
  precoCam: number;
  unExtras: number;
  precoUn: number;
  dispExtras: number;
  precoDisp: number;
  totalGrav: number;
  totalVOIP: number;
  totalEstac: number;
  totalMensal: number;
  valorProRata: number;
  valorFinal: number;
  
  timestamp: number;
}

export const DEFAULT_BASE_PRICES: BasePrices = {
  condominio: 280.00,
  cameraExtra: 15.00,
  unidadeExtra: 0.50,
  dispositivoExtra: 11.30,
  gravacaoCond: 18.00,
  gravacaoExtra: 0.22,
  voipUnidade: 20.00,
  voipCondo: 80.00,
  voipCondoExtra: 1.25,
  estacionamento: 420.00,
  baseCameras: 8,
  baseUnidades: 100,
  baseDispositivos: 0,
};
