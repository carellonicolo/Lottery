import React, { useState } from 'react';
import { type ColumnSelection, runSimulation, type SimulationResult, type WinCategory } from '@/lib/winforlife/winforlife';
import { formatCurrency, formatNumber } from '@/lib/shared/math';
import { Play, Loader2 } from 'lucide-react';

interface SimulazioneVeloceProps {
  columns: ColumnSelection[];
}

const SimulazioneVeloce: React.FC<SimulazioneVeloceProps> = ({ columns }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = (numRuns: number) => {
    setIsSimulating(true);
    setResult(null);
    
    setTimeout(() => {
      const res = runSimulation(columns, numRuns);
      setResult(res);
      setIsSimulating(false);
    }, 100);
  };

  const isColumnComplete = (c: ColumnSelection) => c.numbers.length === 10 && c.numerone !== null;
  const validColumns = columns.filter(isColumnComplete);
  const totalCostPerDraw = validColumns.reduce((sum, col) => sum + col.bet, 0);

  if (validColumns.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground border border-dashed rounded-xl">
        <p>Devi compilare almeno una colonna completa da 10 numeri + Numerone per avviare la simulazione.</p>
      </div>
    );
  }

  const sortedCategories = Object.keys(result?.winsByCategory || {}).sort((a, b) => {
    // Sort by prize value descending
    const getBaseValue = (c: string) => {
      if (c.includes('10') || c.includes('0')) return 10000;
      if (c.includes('9') || c.includes('1')) return 100;
      if (c.includes('8') || c.includes('2')) return 10;
      return 1;
    };
    return getBaseValue(b) - getBaseValue(a);
  });

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <h4 className="font-bold text-primary mb-2">Simulatore Monte Carlo</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Questa funzione genera migliaia di estrazioni casuali in pochi decimi di secondo, 
          simulando anni di giocate consecutive con le tue attuali {validColumns.length} colonne.
          (Costo per singola estrazione: {formatCurrency(totalCostPerDraw)})
        </p>
        
        <div className="flex flex-wrap gap-2">
          {[1_000, 10_000, 100_000, 365_000].map(num => (
            <button
              key={num}
              onClick={() => handleSimulate(num)}
              disabled={isSimulating}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground border border-border px-4 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
            >
              {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {num === 365_000 ? '1.000 Anni' : formatNumber(num)}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card p-3 rounded-xl border">
              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Spesa Totale</div>
              <div className="text-lg font-bold text-destructive">{formatCurrency(result.totalSpent)}</div>
            </div>
            <div className="bg-card p-3 rounded-xl border">
              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Vincita Totale</div>
              <div className="text-lg font-bold text-green-500">{formatCurrency(result.totalWon)}</div>
            </div>
            <div className="bg-card p-3 rounded-xl border">
              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Ritorno (ROI)</div>
              <div className={`text-lg font-bold ${result.totalWon > result.totalSpent ? 'text-green-500' : 'text-destructive'}`}>
                {(((result.totalWon - result.totalSpent) / result.totalSpent) * 100).toFixed(2)}%
              </div>
            </div>
            <div className="bg-card p-3 rounded-xl border">
              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Estrazioni</div>
              <div className="text-lg font-bold text-primary">{formatNumber(result.totalExtractions)}</div>
            </div>
          </div>

          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="bg-secondary/50 px-4 py-2 border-b">
              <h5 className="font-bold text-sm">Dettaglio Vincite</h5>
            </div>
            <div className="divide-y divide-border">
              {sortedCategories.length > 0 ? (
                sortedCategories.map(cat => (
                  <div key={cat} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className={`font-bold ${cat.includes('+1') ? 'text-accent' : 'text-primary'}`}>
                        Punteggio {cat}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-foreground">{formatNumber(result.winsByCategory[cat])}</span> volte
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  Nessuna vincita registrata in questa simulazione.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulazioneVeloce;
