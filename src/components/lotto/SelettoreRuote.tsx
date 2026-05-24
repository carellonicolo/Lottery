import { cn } from '@/lib/utils';
import { RUOTE, type Ruota } from '@/lib/lotto/types';

interface SelettoreRuoteProps {
  ruoteSelezionate: Ruota[];
  onToggle: (r: Ruota) => void;
  onToggleTutte: () => void;
  disabled?: boolean;
}

export function SelettoreRuote({ ruoteSelezionate, onToggle, onToggleTutte, disabled }: SelettoreRuoteProps) {
  const tutteSelezionate = ruoteSelezionate.length === RUOTE.length;
  return (
    <div className="flex flex-col gap-[1px] sm:gap-[2px]">
      {RUOTE.map(ruota => {
        const sel = ruoteSelezionate.includes(ruota);
        return (
          <div key={ruota} className="ruota-row py-[1px] sm:py-0.5">
            <button
              disabled={disabled}
              onClick={() => onToggle(ruota)}
              aria-label={`Seleziona ruota ${ruota}`}
              aria-pressed={sel}
              className={cn(
                'w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-lotto-salmon flex-shrink-0 transition-all',
                sel ? 'bg-lotto-orange' : 'bg-surface',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            />
            <span className={cn(
              'text-[7px] sm:text-[9px] font-bold uppercase leading-none whitespace-nowrap',
              sel ? 'text-lotto-orange' : 'text-foreground/70'
            )}>
              {ruota === 'Nazionale' ? 'NAZ.' : ruota.toUpperCase()}
            </span>
          </div>
        );
      })}
      <div className="ruota-row mt-0.5 sm:mt-1 pt-0.5 sm:pt-1 border-t border-lotto-salmon/30">
        <button
          disabled={disabled}
          onClick={onToggleTutte}
          aria-label="Seleziona tutte le ruote"
          aria-pressed={tutteSelezionate}
          className={cn(
            'w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-lotto-salmon flex-shrink-0 transition-all',
            tutteSelezionate ? 'bg-lotto-orange' : 'bg-surface',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <span className={cn(
          'text-[7px] sm:text-[9px] font-bold uppercase leading-none',
          tutteSelezionate ? 'text-lotto-orange' : 'text-foreground/70'
        )}>
          TUTTE
        </span>
      </div>
    </div>
  );
}

