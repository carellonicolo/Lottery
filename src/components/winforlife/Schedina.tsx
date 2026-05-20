import React from 'react';
import { type ColumnSelection } from '@/lib/winforlife/winforlife';
import SchedinaColumn from './SchedinaColumn';

interface SchedinaProps {
  columns: ColumnSelection[];
  onColumnsChange: (columns: ColumnSelection[]) => void;
  onPlay: () => void;
  matchedByColumn: { matchedNumbers: number[], numeroneMatch: boolean }[];
  disabled?: boolean;
}

const Schedina: React.FC<SchedinaProps> = ({
  columns,
  onColumnsChange,
  onPlay,
  matchedByColumn,
  disabled,
}) => {
  const updateColumn = (index: number, newCol: ColumnSelection) => {
    const next = [...columns];
    next[index] = newCol;
    onColumnsChange(next);
  };

  const handleClearAll = () => {
    onColumnsChange(columns.map(c => ({ ...c, numbers: [], numerone: null, bet: 2 })));
  };

  const handleRandomAll = () => {
    const next = columns.map(c => {
      const numbers: number[] = [];
      const pool = Array.from({ length: 20 }, (_, i) => i + 1);
      for (let i = 0; i < 10; i++) {
        const j = i + Math.floor(Math.random() * (20 - i));
        [pool[i], pool[j]] = [pool[j], pool[i]];
        numbers.push(pool[i]);
      }
      return { 
        ...c, 
        numbers: numbers.sort((a, b) => a - b),
        numerone: Math.floor(Math.random() * 20) + 1,
      };
    });
    onColumnsChange(next);
  };

  const isColumnComplete = (c: ColumnSelection) => c.numbers.length === 10 && c.numerone !== null;
  const filledColumns = columns.filter(isColumnComplete);
  const totalCost = columns.reduce((sum, col) => isColumnComplete(col) ? sum + col.bet : sum, 0);

  return (
    <div className="glass-card glow-primary overflow-hidden">
      <div className="bg-primary/20 border-b border-primary/20 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold">W</span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-primary">Win for Life</h2>
            <p className="text-xs sm:text-sm text-primary/80">Scegli 10 numeri + 1 Numerone</p>
          </div>
        </div>

        <div className="flex w-full sm:w-auto justify-between sm:justify-end gap-2">
          <button
            onClick={handleRandomAll}
            disabled={disabled}
            className="flex-1 sm:flex-none text-xs px-3 py-2 rounded-lg font-semibold bg-secondary/80 border border-border hover:bg-secondary transition-colors"
          >
            Casuale Tutto
          </button>
          <button
            onClick={handleClearAll}
            disabled={disabled}
            className="flex-1 sm:flex-none text-xs px-3 py-2 rounded-lg font-semibold bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
          >
            Svuota Tutto
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5">
        {columns.map((col, idx) => (
          <SchedinaColumn
            key={idx}
            index={idx}
            column={col}
            onChange={(newCol) => updateColumn(idx, newCol)}
            matchedNumbers={matchedByColumn[idx]?.matchedNumbers || []}
            numeroneMatch={matchedByColumn[idx]?.numeroneMatch || false}
            disabled={disabled}
          />
        ))}
      </div>

      <div className="bg-secondary/40 border-t border-border px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-center sm:text-left">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Colonne
            </div>
            <div className="text-2xl font-bold font-mono">
              {filledColumns.length}
              <span className="text-muted-foreground text-lg">/2</span>
            </div>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="text-center sm:text-left">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Costo
            </div>
            <div className="text-2xl font-bold font-mono text-primary">
              €{totalCost.toFixed(2)}
            </div>
          </div>
        </div>

        <button
          onClick={onPlay}
          disabled={disabled || filledColumns.length === 0}
          className="w-full sm:w-auto text-sm sm:text-base px-8 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          {disabled ? 'Estrazione in corso...' : 'GIOCA ORA'}
        </button>
      </div>
    </div>
  );
};

export default Schedina;
