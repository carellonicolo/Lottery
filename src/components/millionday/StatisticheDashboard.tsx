import React from 'react';
import { type ExtractionResult, type MatchResult } from '@/lib/millionday/millionday';
import { formatCurrency } from '@/lib/shared/math';

export interface GameRecord {
  id: number;
  extraction: ExtractionResult;
  results: MatchResult[];
  totalWon: number;
  cost: number;
}

interface StatisticheDashboardProps {
  history: GameRecord[];
}

const StatisticheDashboard: React.FC<StatisticheDashboardProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nessuna giocata effettuata in questa sessione.</p>
        <p className="text-xs mt-2">Gioca una schedina per vedere le statistiche.</p>
      </div>
    );
  }

  const totalSpent = history.reduce((sum, g) => sum + g.cost, 0);
  const totalWon = history.reduce((sum, g) => sum + g.totalWon, 0);
  const ROI = totalSpent > 0 ? ((totalWon - totalSpent) / totalSpent) * 100 : 0;
  
  const winsCount = history.filter(h => h.totalWon > 0).length;
  const winRate = (winsCount / history.length) * 100;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card p-3 rounded-xl border">
          <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Totale Speso</div>
          <div className="text-lg font-bold text-destructive">{formatCurrency(totalSpent)}</div>
        </div>
        <div className="bg-card p-3 rounded-xl border">
          <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Totale Vinto</div>
          <div className="text-lg font-bold text-green-500">{formatCurrency(totalWon)}</div>
        </div>
        <div className="bg-card p-3 rounded-xl border">
          <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Ritorno (ROI)</div>
          <div className={`text-lg font-bold ${ROI >= 0 ? 'text-green-500' : 'text-destructive'}`}>
            {ROI > 0 ? '+' : ''}{ROI.toFixed(1)}%
          </div>
        </div>
        <div className="bg-card p-3 rounded-xl border">
          <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Win Rate</div>
          <div className="text-lg font-bold text-primary">{winRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* History Table */}
      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Ultime Giocate</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-secondary-foreground text-[10px] uppercase font-bold">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Estr. Base</th>
                <th className="px-3 py-2">Estr. Extra</th>
                <th className="px-3 py-2 text-right">Vincita</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {[...history].reverse().slice(0, 10).map((game) => (
                <tr key={game.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">#{game.id}</td>
                  <td className="px-3 py-2 font-mono text-xs font-bold text-primary">
                    {game.extraction.baseNumbers.join(' - ')}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs font-bold text-accent">
                    {game.extraction.extraNumbers.join(' - ')}
                  </td>
                  <td className={`px-3 py-2 text-right font-bold ${game.totalWon > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {game.totalWon > 0 ? `+${formatCurrency(game.totalWon)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length > 10 && (
            <div className="text-center p-2 text-xs text-muted-foreground bg-secondary/20">
              Visualizzando le ultime 10 giocate su {history.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticheDashboard;
