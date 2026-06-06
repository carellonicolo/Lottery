import { binomial, formatCurrency, formatNumber } from '@/lib/shared/math';
import { drawUnique } from '@/lib/shared/random';

export { binomial, formatCurrency, formatNumber };

export interface ColumnSelection {
  numbers: number[]; // 5 numbers from 1-55
  isExtra: boolean; // Did they pay for Extra?
}

export interface ExtractionResult {
  baseNumbers: number[]; // 5 numbers
  extraNumbers: number[]; // 5 numbers drawn from the remaining 50
}

export interface MatchResult {
  columnIndex: number;
  matchedBase: number[];
  matchedExtra: number[];
  categoryBase: WinCategory | null;
  categoryExtra: WinCategory | null;
  prizeBase: number;
  prizeExtra: number;
  totalPrize: number;
}

export type WinCategory = '5' | '4' | '3' | '2';

export const WIN_CATEGORIES: { category: WinCategory; description: string; matches: number }[] = [
  { category: '5', description: '5 numeri', matches: 5 },
  { category: '4', description: '4 numeri', matches: 4 },
  { category: '3', description: '3 numeri', matches: 3 },
  { category: '2', description: '2 numeri', matches: 2 },
];

export const AVERAGE_PRIZES_BASE: Record<WinCategory, number> = {
  '5': 1_000_000,
  '4': 1_000,
  '3': 50,
  '2': 2,
};

export const AVERAGE_PRIZES_EXTRA: Record<WinCategory, number> = {
  '5': 100_000,
  '4': 1_000,
  '3': 100,
  '2': 4,
};

export const TICKET_COST_BASE = 1;
export const TICKET_COST_EXTRA = 1;

export function calculateProbabilityBase(category: WinCategory): { probability: number; oneIn: number } {
  const totalCombinations = binomial(55, 5);
  let favorable = 0;
  
  switch (category) {
    case '5': favorable = binomial(5, 5) * binomial(50, 0); break;
    case '4': favorable = binomial(5, 4) * binomial(50, 1); break;
    case '3': favorable = binomial(5, 3) * binomial(50, 2); break;
    case '2': favorable = binomial(5, 2) * binomial(50, 3); break;
  }
  
  const prob = favorable / totalCombinations;
  return { probability: prob, oneIn: Math.round(1 / prob) };
}

// La probabilità dell'Extra (assoluta) è matematicamente identica
export const calculateProbabilityExtra = calculateProbabilityBase;

export function generateExtraction(): ExtractionResult {
  // 10 estrazioni uniche: i primi 5 sono i base, i successivi 5 sono Extra (dai 50 rimanenti).
  const drawn = drawUnique(55, 10);
  return {
    baseNumbers: drawn.slice(0, 5).sort((a, b) => a - b),
    extraNumbers: drawn.slice(5, 10).sort((a, b) => a - b),
  };
}

export function checkMatches(column: ColumnSelection, extraction: ExtractionResult, columnIndex = 0): MatchResult {
  const matchedBase = column.numbers.filter(n => extraction.baseNumbers.includes(n));
  let categoryBase: WinCategory | null = null;
  if (matchedBase.length === 5) categoryBase = '5';
  else if (matchedBase.length === 4) categoryBase = '4';
  else if (matchedBase.length === 3) categoryBase = '3';
  else if (matchedBase.length === 2) categoryBase = '2';

  const prizeBase = categoryBase ? AVERAGE_PRIZES_BASE[categoryBase] : 0;

  let matchedExtra: number[] = [];
  let categoryExtra: WinCategory | null = null;
  let prizeExtra = 0;

  if (column.isExtra) {
    matchedExtra = column.numbers.filter(n => extraction.extraNumbers.includes(n));
    if (matchedExtra.length === 5) categoryExtra = '5';
    else if (matchedExtra.length === 4) categoryExtra = '4';
    else if (matchedExtra.length === 3) categoryExtra = '3';
    else if (matchedExtra.length === 2) categoryExtra = '2';
    
    prizeExtra = categoryExtra ? AVERAGE_PRIZES_EXTRA[categoryExtra] : 0;
  }

  return {
    columnIndex,
    matchedBase,
    matchedExtra,
    categoryBase,
    categoryExtra,
    prizeBase,
    prizeExtra,
    totalPrize: prizeBase + prizeExtra
  };
}

export interface SimulationResult {
  totalExtractions: number;
  totalSpent: number;
  totalWon: number;
  winsByCategoryBase: Record<WinCategory, number>;
  winsByCategoryExtra: Record<WinCategory, number>;
}

export function runSimulation(columns: ColumnSelection[], numExtractions: number): SimulationResult {
  const winsByCategoryBase: Record<WinCategory, number> = { '5': 0, '4': 0, '3': 0, '2': 0 };
  const winsByCategoryExtra: Record<WinCategory, number> = { '5': 0, '4': 0, '3': 0, '2': 0 };
  
  let totalWon = 0;
  let totalSpent = 0;
  
  const costPerDraw = columns.reduce((acc, col) => acc + TICKET_COST_BASE + (col.isExtra ? TICKET_COST_EXTRA : 0), 0);
  totalSpent = costPerDraw * numExtractions;

  for (let i = 0; i < numExtractions; i++) {
    const ext = generateExtraction();
    const baseSet = new Set(ext.baseNumbers);
    const extraSet = new Set(ext.extraNumbers);
    
    for (const col of columns) {
      let matchBaseCount = 0;
      let matchExtraCount = 0;
      
      for (const n of col.numbers) {
        if (baseSet.has(n)) matchBaseCount++;
        else if (col.isExtra && extraSet.has(n)) matchExtraCount++;
      }
      
      let catBase: WinCategory | null = null;
      if (matchBaseCount === 5) catBase = '5';
      else if (matchBaseCount === 4) catBase = '4';
      else if (matchBaseCount === 3) catBase = '3';
      else if (matchBaseCount === 2) catBase = '2';
      
      if (catBase) {
        winsByCategoryBase[catBase]++;
        totalWon += AVERAGE_PRIZES_BASE[catBase];
      }
      
      if (col.isExtra) {
        let catExtra: WinCategory | null = null;
        if (matchExtraCount === 5) catExtra = '5';
        else if (matchExtraCount === 4) catExtra = '4';
        else if (matchExtraCount === 3) catExtra = '3';
        else if (matchExtraCount === 2) catExtra = '2';
        
        if (catExtra) {
          winsByCategoryExtra[catExtra]++;
          totalWon += AVERAGE_PRIZES_EXTRA[catExtra];
        }
      }
    }
  }

  return { totalExtractions: numExtractions, totalSpent, totalWon, winsByCategoryBase, winsByCategoryExtra };
}
