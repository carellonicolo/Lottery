import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook condiviso che gestisce l'animazione "rivela i numeri uno per uno" presente in
 * tutti i simulatori. Garantisce il cleanup dei timer all'unmount (evitando warning
 * "setState on unmounted component" e memory leak) e blocca chiamate concorrenti.
 *
 * Uso:
 *   const { isAnimating, revealedCount, run } = useExtractionAnimation();
 *   run({ totalSteps: 6, intervalMs: 400, finalDelayMs: 500, onComplete: () => { ... } });
 */
export function useExtractionAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const cancel = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup completo all'unmount per evitare setState fuori dal lifecycle.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancel();
    };
  }, [cancel]);

  const reset = useCallback(() => {
    cancel();
    if (!mountedRef.current) return;
    setIsAnimating(false);
    setRevealedCount(0);
  }, [cancel]);

  const run = useCallback(
    ({
      totalSteps,
      intervalMs = 400,
      finalDelayMs = 500,
      onTick,
      onComplete,
    }: {
      totalSteps: number;
      intervalMs?: number;
      finalDelayMs?: number;
      onTick?: (step: number) => void;
      onComplete: () => void;
    }) => {
      cancel();
      if (!mountedRef.current) return;
      setIsAnimating(true);
      setRevealedCount(0);

      let step = 0;
      intervalRef.current = setInterval(() => {
        step++;
        if (!mountedRef.current) {
          cancel();
          return;
        }
        setRevealedCount(step);
        onTick?.(step);
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);

        if (step >= totalSteps) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          timeoutRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            onComplete();
            setIsAnimating(false);
          }, finalDelayMs);
        }
      }, intervalMs);
    },
    [cancel],
  );

  return { isAnimating, revealedCount, run, reset, cancel };
}
