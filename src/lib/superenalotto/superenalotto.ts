// SuperEnalotto game logic and probability calculations
import { binomial, factorial, formatCurrency, formatNumber } from '@/lib/shared/math';
import { drawUniqueSorted, drawOne } from '@/lib/shared/random';

// Re-export shared utils for consumers
export { binomial, factorial, formatCurrency, formatNumber };

export interface ColumnSelection {
  numbers: number[]; // 6 numbers from 1-90
  superstar?: number | null; // optional SuperStar number 1-90
}

export interface ExtractionResult {
  numbers: number[]; // 6 main numbers
  jolly: number;
  superstar: number; // 1-90
}

export interface MatchResult {
  columnIndex: number;
  matched: number[];
  jollyMatch: boolean;
  superstarMatch: boolean;
  category: WinCategory | null;
  prize: number;
  /** Premio extra per SuperStar (incluso in `prize`). Esposto per UI. */
  superstarPrize: number;
}

export type WinCategory = '6' | '5+1' | '5' | '4' | '3' | '2';

export const WIN_CATEGORIES: { category: WinCategory; description: string; matches: number; needsJolly: boolean }[] = [
  { category: '6', description: '6 numeri', matches: 6, needsJolly: false },
  { category: '5+1', description: '5 numeri + Jolly', matches: 5, needsJolly: true },
  { category: '5', description: '5 numeri', matches: 5, needsJolly: false },
  { category: '4', description: '4 numeri', matches: 4, needsJolly: false },
  { category: '3', description: '3 numeri', matches: 3, needsJolly: false },
  { category: '2', description: '2 numeri', matches: 2, needsJolly: false },
];

// Average prizes (approximate, based on typical jackpot distributions)
// Quote medie ufficiali (fonte: superenalotto.it)
export const AVERAGE_PRIZES: Record<WinCategory, number> = {
  '6': 100_000_000,
  '5+1': 620_000,
  '5': 32_000,
  '4': 300,
  '3': 25,
  '2': 5,
};

/**
 * Premi SuperStar per categoria. Conforme al regolamento Sisal vigente:
 * la SuperStar costa €0,50 in più per colonna e, se centrata, MOLTIPLICA il premio.
 * Per semplicità qui sommiamo un importo extra fisso indicativo.
 *
 * Cat. 6+SS è virtualmente irrealizzabile (jackpot già max); le altre seguono
 * approssimativamente le quote storiche dichiarate da Sisal.
 */
export const SUPERSTAR_PRIZES: Record<WinCategory | 'none', number> = {
  '6': 0, // jackpot già ai limiti; SS irrilevante in pratica
  '5+1': 1_000_000,
  '5': 25_000,
  '4': 25_000,
  '3': 3_000,
  '2': 100,
  none: 5, // solo SuperStar (nessun match principale)
};

export const TICKET_COST = 1; // €1 per colonna base
export const SUPERSTAR_COST = 0.5; // +€0,50 se attivata

// Calculate probability for each win category
export function calculateProbability(category: WinCategory): { probability: number; oneIn: number } {
  const totalCombinations = binomial(90, 6); // C(90,6)

  switch (category) {
    case '6': {
      // All 6 numbers match: C(6,6) * C(84,0) / C(90,6)
      const favorable = binomial(6, 6) * binomial(84, 0);
      const prob = favorable / totalCombinations;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
    case '5+1': {
      // 5 of 6 match + jolly (from remaining 84): C(6,5) * 1 / (C(90,6) * 84)
      // More accurately: probability of getting 5 right AND jolly
      const prob5 = (binomial(6, 5) * binomial(84, 1)) / totalCombinations;
      // Jolly is 1 of the 84 remaining numbers, we matched one of them
      const prob = prob5 / 84;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
    case '5': {
      const favorable = binomial(6, 5) * binomial(84, 1);
      const prob = favorable / totalCombinations;
      // Subtract 5+1 probability
      const prob51 = calculateProbability('5+1').probability;
      const adjProb = prob - prob51;
      return { probability: adjProb, oneIn: Math.round(1 / adjProb) };
    }
    case '4': {
      const favorable = binomial(6, 4) * binomial(84, 2);
      const prob = favorable / totalCombinations;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
    case '3': {
      const favorable = binomial(6, 3) * binomial(84, 3);
      const prob = favorable / totalCombinations;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
    case '2': {
      const favorable = binomial(6, 2) * binomial(84, 4);
      const prob = favorable / totalCombinations;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
  }
}

// Generate a random extraction.
// Fisher-Yates parziale: 6 main + Jolly dai restanti 84, SuperStar indipendente da 1-90.
export function generateExtraction(): ExtractionResult {
  const drawn = drawUniqueSorted(90, 7); // 6 main + 1 jolly tutti distinti
  return {
    numbers: drawn.slice(0, 6).sort((a, b) => a - b),
    jolly: drawn[6],
    superstar: drawOne(90),
  };
}

// Check matches for a column
export function checkMatches(column: ColumnSelection, extraction: ExtractionResult, columnIndex = 0): MatchResult {
  const mainSet = new Set(extraction.numbers);
  const matched = column.numbers.filter((n) => mainSet.has(n));
  const jollyMatch = column.numbers.includes(extraction.jolly);
  const superstarMatch = column.superstar != null && column.superstar === extraction.superstar;

  let category: WinCategory | null = null;
  if (matched.length === 6) category = '6';
  else if (matched.length === 5 && jollyMatch) category = '5+1';
  else if (matched.length === 5) category = '5';
  else if (matched.length === 4) category = '4';
  else if (matched.length === 3) category = '3';
  else if (matched.length === 2) category = '2';

  const basePrize = category ? AVERAGE_PRIZES[category] : 0;
  // Premio SuperStar: somma fissa per categoria, oppure premio "consolation" se nessun match principale.
  let superstarPrize = 0;
  if (superstarMatch) {
    superstarPrize = category ? SUPERSTAR_PRIZES[category] : SUPERSTAR_PRIZES.none;
  }

  return { columnIndex, matched, jollyMatch, superstarMatch, category, prize: basePrize + superstarPrize, superstarPrize };
}

// Run fast simulation
export interface SimulationResult {
  totalExtractions: number;
  totalSpent: number;
  totalWon: number;
  winsByCategory: Record<WinCategory, number>;
}

export function runSimulation(columns: ColumnSelection[], numExtractions: number): SimulationResult {
  const winsByCategory: Record<WinCategory, number> = {
    '6': 0, '5+1': 0, '5': 0, '4': 0, '3': 0, '2': 0,
  };
  let totalWon = 0;
  const ssCols = columns.filter((c) => c.superstar != null).length;
  const totalSpent = numExtractions * (columns.length * TICKET_COST + ssCols * SUPERSTAR_COST);

  for (let i = 0; i < numExtractions; i++) {
    const extraction = generateExtraction();
    const numSet = new Set(extraction.numbers);
    for (const col of columns) {
      let matchCount = 0;
      for (const n of col.numbers) if (numSet.has(n)) matchCount++;
      const jollyMatch = col.numbers.includes(extraction.jolly);
      const ssMatch = col.superstar != null && col.superstar === extraction.superstar;

      let category: WinCategory | null = null;
      if (matchCount === 6) category = '6';
      else if (matchCount === 5 && jollyMatch) category = '5+1';
      else if (matchCount === 5) category = '5';
      else if (matchCount === 4) category = '4';
      else if (matchCount === 3) category = '3';
      else if (matchCount === 2) category = '2';

      if (category) {
        winsByCategory[category]++;
        totalWon += AVERAGE_PRIZES[category];
      }
      if (ssMatch) {
        totalWon += category ? SUPERSTAR_PRIZES[category] : SUPERSTAR_PRIZES.none;
      }
    }
  }

  return { totalExtractions: numExtractions, totalSpent, totalWon, winsByCategory };
}

