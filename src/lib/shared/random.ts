/**
 * Estrae `count` numeri unici da 1..range usando Fisher-Yates parziale (O(count)).
 * Output non ordinato (mantiene l'ordine di estrazione, utile per "primo estratto" ecc.).
 */
export function drawUnique(range: number, count: number): number[] {
  if (count > range) throw new Error(`drawUnique: count ${count} > range ${range}`);
  if (count < 0) return [];
  const pool = Array.from({ length: range }, (_, i) => i + 1);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (range - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/**
 * Variante ordinata di drawUnique. Più comoda quando i numeri vanno mostrati ordinati
 * (Lotto, MillionDAY, SuperEnalotto, ecc.).
 */
export function drawUniqueSorted(range: number, count: number): number[] {
  return drawUnique(range, count).sort((a, b) => a - b);
}

/**
 * Estrae un singolo intero in [1, range].
 */
export function drawOne(range: number): number {
  return Math.floor(Math.random() * range) + 1;
}
