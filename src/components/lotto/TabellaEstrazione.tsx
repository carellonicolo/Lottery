import { RUOTE, type Ruota } from '@/lib/lotto/types';
import type { RisultatoEstrazione } from '@/lib/lotto/types';
import { cn } from '@/lib/utils';
import { COLORI_RUOTE } from './colori-ruote';

interface TabellaEstrazioneProps {
  estrazione: RisultatoEstrazione;
  numeriGiocati: number[];
  ruoteGiocate: Ruota[];
  isAnimating?: boolean;
}

export function TabellaEstrazione({ estrazione, numeriGiocati, ruoteGiocate, isAnimating }: TabellaEstrazioneProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-lotto-salmon to-[hsl(15_50%_40%)] text-white" role="row">
            <th className="text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider">Ruota</th>
            {[1, 2, 3, 4, 5].map(i => (
              <th key={i} className="text-center py-1.5 px-1 text-[10px] font-bold">{i}°</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RUOTE.map((ruota, rIdx) => {
            const numeri = estrazione[ruota] || [];
            const isEmpty = numeri.length === 0;
            const isGiocata = ruoteGiocate.includes(ruota);
            const hsl = COLORI_RUOTE[ruota];
            return (
              <tr key={ruota} className={cn(
                'border-b border-lotto-salmon/20 transition-colors',
                isGiocata && 'bg-lotto-peach/50 hover:bg-lotto-peach/70',
                rIdx % 2 === 0 && !isGiocata && 'bg-surface/30',
                !isGiocata && 'hover:bg-lotto-peach/20'
              )}>
                <td className="py-1 px-2 font-bold text-[10px] uppercase tracking-wide"
                    style={{ color: `hsl(${hsl})` }}>
                  {isGiocata && '▸ '}{ruota}
                </td>
                {isEmpty
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <td key={idx} className="text-center py-1 px-1">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold text-muted-foreground/30">
                          —
                        </span>
                      </td>
                    ))
                  : numeri.map((n, idx) => {
                      const indovinato = numeriGiocati.includes(n) && isGiocata;
                      return (
                        <td key={idx} className="text-center py-1 px-1">
                          <span className={cn(
                            "inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold tabular-nums tracking-wide",
                            indovinato
                              ? 'bg-lotto-green text-white scale-110 shadow-md'
                              : isGiocata
                                ? 'bg-surface border border-lotto-salmon/40 text-foreground'
                                : 'text-muted-foreground',
                            isAnimating && 'animate-scale-in'
                          )}
                          style={{
                            ...(isAnimating ? { animationDelay: `${(rIdx * 5 + idx) * 50}ms`, animationFillMode: 'both' } : {}),
                            ...(indovinato ? { animation: 'gold-ring 1.5s ease-in-out infinite' } : {})
                          }}
                          >
                            {n}
                          </span>
                        </td>
                      );
                    })
                }
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}