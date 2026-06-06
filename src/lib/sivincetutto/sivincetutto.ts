import { binomial, formatCurrency, formatNumber } from '@/lib/shared/math';
import { drawUniqueSorted } from '@/lib/shared/random';

export { binomial, formatCurrency, formatNumber };

// === Costanti di gioco (regolamento ufficiale Sisal / ADM) ===
export const NUMBERS_TO_PICK = 12 as const;
export const NUMBERS_DRAWN = 6 as const;
export const NUMBER_RANGE_MAX = 90 as const;
export const TICKET_COST = 5 as const; // €5 per combinazione

export interface ColumnSelection {
  numbers: number[]; // esattamente 12 numeri da 1 a 90
}

export interface ExtractionResult {
  numbers: number[]; // 6 numeri estratti da 1 a 90
}

export type WinCategory = '6' | '5' | '4' | '3' | '2';

export interface MatchResult {
  columnIndex: number;
  matchedNumbers: number[];
  category: WinCategory | null;
  prize: number;
}

// Premi medi indicativi (in euro). Nel gioco reale variano in base
// al montepremi e al numero di vincitori dell'estrazione. Questi valori
// sono medie storiche utilizzate per stime didattiche.
export const AVERAGE_PRIZES: Record<WinCategory, number> = {
  '6': 350_000, // jackpot variabile, media storica indicativa
  '5': 1_500,
  '4': 100,
  '3': 15,
  '2': 5,
};

/**
 * Probabilità ipergeometrica: il giocatore ha 12 numeri tra 90; vengono
 * estratti 6 numeri. Match = quanti dei 12 del giocatore sono fra i 6 estratti.
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
  if (count === 6) category = '6';
  else if (count === 5) category = '5';
  else if (count === 4) category = '4';
  else if (count === 3) category = '3';
  else if (count === 2) category = '2';
  const prize = category ? AVERAGE_PRIZES[category] : 0;
  return { columnIndex, matchedNumbers, category, prize };
}
