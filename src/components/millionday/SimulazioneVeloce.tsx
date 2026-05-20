import React, { useState } from 'react';
import { type ColumnSelection, runSimulation, type SimulationResult, WIN_CATEGORIES } from '@/lib/millionday/millionday';
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

  const validColumns = columns.filter(c => c.numbers.length === 5);
  const totalCostPerDraw = validColumns.reduce((sum, col) => sum + 1 + (col.isExtra ? 1 : 0), 0);

  if (validColumns.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground border border-dashed rounded-xl">
        <p>Devi compilare almeno una colonna completa da 5 numeri per avviare la simulazione.</p>
      </div>
    );
  }

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
              {WIN_CATEGORIES.map(cat => {
                const winsBase = result.winsByCategoryBase[cat.category];
                const winsExtra = result.winsByCategoryExtra[cat.category];
                if (winsBase === 0 && winsExtra === 0) return null;
                
                return (
                  <div key={cat.category} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-primary">Punteggio {cat.description}</span>
                    </div>
                    <div className="text-right">
                      {winsBase > 0 && <div className="text-sm">Base: <span className="font-bold">{formatNumber(winsBase)}</span> volte</div>}
                      {winsExtra > 0 && <div className="text-sm">Extra: <span className="font-bold text-accent">{formatNumber(winsExtra)}</span> volte</div>}
                    </div>
                  </div>
                );
              })}
              
              {Object.values(result.winsByCategoryBase).every(v => v === 0) && 
               Object.values(result.winsByCategoryExtra).every(v => v === 0) && (
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
