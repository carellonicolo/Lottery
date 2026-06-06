import { binomial, formatCurrency, formatNumber } from '@/lib/shared/math';
import { drawUniqueSorted, drawOne } from '@/lib/shared/random';

export { binomial, formatCurrency, formatNumber };

export interface ColumnSelection {
  numbers: number[]; // 10 numbers from 1-20
  numerone: number | null; // 1 number from 1-20
  bet: 1 | 2; // 1€ or 2€
}

export interface ExtractionResult {
  numbers: number[]; // 10 numbers
  numerone: number; // 1 number
}

export type WinCategory = 
  | '10+1' | '10' | '9+1' | '9' | '8+1' | '8' | '7+1' | '7'
  | '0+1' | '0' | '1+1' | '1' | '2+1' | '2' | '3+1' | '3';

export interface MatchResult {
  columnIndex: number;
  matchedNumbers: number[];
  numeroneMatch: boolean;
  category: WinCategory | null;
  prize: number;
}

export const AVERAGE_PRIZES: Record<WinCategory, number> = {
  '10+1': 720_000, '0+1': 720_000,
  '10': 10_000,    '0': 10_000,
  '9+1': 100,      '1+1': 100,
  '9': 40,         '1': 40,
  '8+1': 10,       '2+1': 10,
  '8': 2,          '2': 2,
  '7+1': 2,        '3+1': 2,
  '7': 2,          '3': 2, // Spesso il premio di consolazione è 2€ per coprire il costo
};

// Calcola probabilità esatta usando l'ipergeometrica
export function calculateProbability(matches: number, numeroneMatched: boolean): { probability: number; oneIn: number } {
  // Combinazioni totali: scegliere 10 numeri da 20
  const totalCombinations = binomial(20, 10);
  
  // Favorevoli: scegliere 'matches' tra i 10 vincenti, e i restanti tra i 10 perdenti
  const favorable = binomial(10, matches) * binomial(10, 10 - matches);
  
  let prob = favorable / totalCombinations;
  
  // Moltiplichiamo per la probabilità del Numerone (1/20 o 19/20)
  if (numeroneMatched) {
    prob = prob * (1 / 20);
  } else {
    prob = prob * (19 / 20);
  }
  
  return { probability: prob, oneIn: prob > 0 ? Math.round(1 / prob) : 0 };
}

export function generateExtraction(): ExtractionResult {
  // 10 numeri estratti su 20 + 1 Numerone indipendente (può coincidere con i main).
  return {
    numbers: drawUniqueSorted(20, 10),
    numerone: drawOne(20),
  };
}

export function checkMatches(column: ColumnSelection, extraction: ExtractionResult, columnIndex = 0): MatchResult {
  const matchedNumbers = column.numbers.filter(n => extraction.numbers.includes(n));
  const count = matchedNumbers.length;
  const numeroneMatch = column.numerone === extraction.numerone;

  let category: WinCategory | null = null;
  const bet = column.bet;

  // Categorie valide per 1€
  if (count === 10) category = numeroneMatch ? '10+1' : '10';
  else if (count === 9) category = numeroneMatch ? '9+1' : '9';
  else if (count === 8) category = numeroneMatch ? '8+1' : '8';
  else if (count === 7) category = numeroneMatch ? '7+1' : '7';
  
  // Categorie esclusive per 2€
  if (bet === 2) {
    if (count === 0) category = numeroneMatch ? '0+1' : '0';
    else if (count === 1) category = numeroneMatch ? '1+1' : '1';
    else if (count === 2) category = numeroneMatch ? '2+1' : '2';
    else if (count === 3) category = numeroneMatch ? '3+1' : '3';
  }

  const prize = category ? AVERAGE_PRIZES[category] : 0;

  return {
    columnIndex,
    matchedNumbers,
    numeroneMatch,
    category,
    prize
  };
}

export interface SimulationResult {
  totalExtractions: number;
  totalSpent: number;
  totalWon: number;
  winsByCategory: Record<string, number>;
}

export function runSimulation(columns: ColumnSelection[], numExtractions: number): SimulationResult {
  const winsByCategory: Record<string, number> = {};
  
  let totalWon = 0;
  let totalSpent = 0;
  
  const costPerDraw = columns.reduce((acc, col) => acc + col.bet, 0);
  totalSpent = costPerDraw * numExtractions;

  for (let i = 0; i < numExtractions; i++) {
    const ext = generateExtraction();
    const baseSet = new Set(ext.numbers);
    
    for (const col of columns) {
      let count = 0;
      for (const n of col.numbers) {
        if (baseSet.has(n)) count++;
      }
      const numeroneMatch = col.numerone === ext.numerone;
      
      let cat: WinCategory | null = null;
      if (count === 10) cat = numeroneMatch ? '10+1' : '10';
      else if (count === 9) cat = numeroneMatch ? '9+1' : '9';
      else if (count === 8) cat = numeroneMatch ? '8+1' : '8';
      else if (count === 7) cat = numeroneMatch ? '7+1' : '7';
      else if (col.bet === 2) {
        if (count === 0) cat = numeroneMatch ? '0+1' : '0';
        else if (count === 1) cat = numeroneMatch ? '1+1' : '1';
        else if (count === 2) cat = numeroneMatch ? '2+1' : '2';
        else if (count === 3) cat = numeroneMatch ? '3+1' : '3';
      }
      
      if (cat) {
        winsByCategory[cat] = (winsByCategory[cat] || 0) + 1;
        totalWon += AVERAGE_PRIZES[cat];
      }
    }
  }

  return { totalExtractions: numExtractions, totalSpent, totalWon, winsByCategory };
}
