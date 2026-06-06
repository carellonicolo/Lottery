import { binomial, formatCurrency, formatNumber } from '@/lib/shared/math';
import { drawUniqueSorted } from '@/lib/shared/random';

export { binomial, formatCurrency, formatNumber };

// === Costanti di gioco (regolamento ufficiale Sisal / ADM) ===
export const NUMBERS_TO_PICK = 5 as const;
export const NUMBERS_DRAWN = 5 as const;
export const NUMBER_RANGE_MAX = 40 as const;
export const TICKET_COST = 2 as const; // €2 per combinazione

export interface ColumnSelection {
  numbers: number[]; // esattamente 5 numeri da 1 a 40
}

export interface ExtractionResult {
  numbers: number[]; // 5 numeri estratti da 1 a 40
}

export type WinCategory = '5' | '4' | '3' | '2';

export interface MatchResult {
  columnIndex: number;
  matchedNumbers: number[];
  category: WinCategory | null;
  prize: number;
  /** true se 5/5: prima categoria con premio "casa + 200.000€" */
  isHouseWin: boolean;
}

// Premi fissi conformi al regolamento ufficiale. Il primo premio è simbolizzato
// dal valore di mercato dichiarato (casa €200.000 + €200.000 cash = €400.000).
export const AVERAGE_PRIZES: Record<WinCategory, number> = {
  '5': 400_000, // casa €200.000 + €200.000 cash (valore complessivo)
  '4': 200,
  '3': 20,
  '2': 2.6,
};

export const HOUSE_VALUE = 200_000;
export const CASH_BONUS = 200_000;

/**
 * Probabilità ipergeometrica: il giocatore ha 5 numeri tra 40; vengono
 * estratti 5 numeri. Match = quanti dei 5 del giocatore sono tra i 5 estratti.
 */
export function calculateProbability(matches: number): { probability: number; oneIn: number } {
  if (matches < 0 || matches > NUMBERS_DRAWN) return { probability: 0, oneIn: 0 };
  const favorable = binomial(NUMBERS_TO_PICK, matches) * binomial(NUMBER_RANGE_MAX - NUMBERS_TO_PICK, NUMBERS_DRAWN - matches);
  const total = binomial(NUMBER_RANGE_MAX, NUMBERS_DRAWN);
  const probability = favorable / total;
  return { probability, oneIn: probability > 0 ? Math.round(1 / probability) : 0 };
}

/** Probabilità di vincere almeno un premio (match >= 2). */
export function calculateWinProbability(): { probability: number; oneIn: number } {
  let p = 0;
  for (let k = 2; k <= NUMBERS_DRAWN; k++) p += calculateProbability(k).probability;
  return { probability: p, oneIn: p > 0 ? Math.round(1 / p) : 0 };
}

export function generateExtraction(): ExtractionResult {
  return { numbers: drawUniqueSorted(NUMBER_RANGE_MAX, NUMBERS_DRAWN) };
}

export function checkMatches(column: ColumnSelection, extraction: ExtractionResult, columnIndex = 0): MatchResult {
  const matchedNumbers = column.numbers.filter((n) => extraction.numbers.includes(n));
  const count = matchedNumbers.length;
  let category: WinCategory | null = null;
  if (count === 5) category = '5';
  else if (count === 4) category = '4';
  else if (count === 3) category = '3';
  else if (count === 2) category = '2';
  const prize = category ? AVERAGE_PRIZES[category] : 0;
  return { columnIndex, matchedNumbers, category, prize, isHouseWin: count === 5 };
}
