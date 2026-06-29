import type { Criterion, ProgressionRule } from '../types';

export const painCriteria: Criterion[] = [
  {
    situation: 'Dor durante o treino',
    signal: '0-2 / 10',
    decision: 'Pode manter',
    observation: 'Se aumentar, reduza intensidade.',
  },
  {
    situation: 'Dor durante o treino',
    signal: '3-4 / 10',
    decision: 'Reduzir',
    observation: 'Menos força, menos tempo ou parar o exercício.',
  },
  {
    situation: 'Dor durante o treino',
    signal: '5+ / 10',
    decision: 'Parar',
    observation: 'Interrompa e procure orientação profissional.',
  },
];

export const progressionRules: ProgressionRule[] = [
  {
    situation: 'Dia seguinte ao treino',
    signal: 'Sem piora',
    decision: 'Pode progredir',
    observation: 'Critério importante para iniciar Semana 3.',
  },
  {
    situation: 'Dia seguinte ao treino',
    signal: 'Piorou',
    decision: 'Não progredir',
    observation: 'Volte para isometria leve por mais uma semana.',
  },
  {
    situation: 'Semana 3',
    signal: 'Dor controlada (0-2)',
    decision: 'Transição leve permitida',
    observation: 'Sem afundo e sem amplitude grande.',
  },
];
