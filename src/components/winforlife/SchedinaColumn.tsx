import React from 'react';
import { type ColumnSelection } from '@/lib/winforlife/winforlife';

interface SchedinaColumnProps {
  index: number;
  column: ColumnSelection;
  onChange: (col: ColumnSelection) => void;
  matchedNumbers: number[];
  numeroneMatch: boolean;
  disabled?: boolean;
}

const SchedinaColumn: React.FC<SchedinaColumnProps> = ({
  index,
  column,
  onChange,
  matchedNumbers,
  numeroneMatch,
  disabled,
}) => {
  const toggleNumber = (num: number) => {
    if (disabled) return;
    const isSelected = column.numbers.includes(num);
    let newNumbers = [];
    if (isSelected) {
      newNumbers = column.numbers.filter((n) => n !== num);
    } else {
      if (column.numbers.length >= 10) return;
      newNumbers = [...column.numbers, num].sort((a, b) => a - b);
    }
    onChange({ ...column, numbers: newNumbers });
  };

  const toggleNumerone = (num: number) => {
    if (disabled) return;
    onChange({ ...column, numerone: column.numerone === num ? null : num });
  };

  const isNumbersComplete = column.numbers.length === 10;
  const isComplete = isNumbersComplete && column.numerone !== null;

  return (
    <div className={`p-3 sm:p-4 rounded-xl border transition-all ${
      isComplete ? 'bg-background shadow-inner border-primary/40' : 'bg-background/50 border-border'
    }`}>
      {/* Header and Cost Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {column.numbers.length}/10 Num. + {column.numerone ? '1' : '0'}/1 Num.
          </span>
        </div>
        
        {/* Real-life like Bet Selector */}
        <div className="flex bg-secondary/50 rounded-lg p-1 border border-border">
          <button
            onClick={() => !disabled && onChange({ ...column, bet: 1 })}
            disabled={disabled}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              column.bet === 1 
                ? 'bg-background text-foreground shadow-sm border border-border/50' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            1€
          </button>
          <button
            onClick={() => !disabled && onChange({ ...column, bet: 2 })}
            disabled={disabled}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              column.bet === 2 
                ? 'bg-background text-foreground shadow-sm border border-border/50' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            2€
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Pannello 10 Numeri (Verde) */}
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -z-10" />
          <h4 className="text-[10px] font-bold text-primary uppercase mb-2">Scegli 10 Numeri</h4>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
              const isSelected = column.numbers.includes(num);
              const isMatched = matchedNumbers.includes(num);

              let btnClass = "w-full aspect-square rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 border-2 ";

              if (isMatched) {
                btnClass += "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-110 z-10";
              } else if (isSelected) {
                btnClass += "bg-primary/20 text-primary border-primary/50";
              } else {
                btnClass += "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground";
              }

              if (disabled && !isSelected && !isMatched) {
                btnClass += " opacity-50 cursor-not-allowed";
              } else if (isNumbersComplete && !isSelected && !disabled) {
                btnClass += " opacity-40 cursor-not-allowed";
              }

              return (
                <button
                  key={`num-${num}`}
                  onClick={() => toggleNumber(num)}
                  disabled={disabled || (isNumbersComplete && !isSelected)}
                  className={btnClass}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pannello Numerone (Rosso/Arancione) */}
        <div className="bg-accent/5 rounded-xl border border-accent/20 p-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-full -z-10" />
          <h4 className="text-[10px] font-bold text-accent uppercase mb-2">Scegli il Numerone</h4>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
              const isSelected = column.numerone === num;
              const isMatched = isSelected && numeroneMatch;

              let btnClass = "w-full aspect-square rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 border-2 ";

              if (isMatched) {
                btnClass += "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/30 scale-110 z-10";
              } else if (isSelected) {
                btnClass += "bg-accent/20 text-accent border-accent/50";
              } else {
                btnClass += "bg-background text-muted-foreground border-border hover:border-accent/40 hover:text-foreground";
              }

              if (disabled && !isSelected && !isMatched) {
                btnClass += " opacity-50 cursor-not-allowed";
              } else if (column.numerone !== null && !isSelected && !disabled) {
                btnClass += " opacity-40 cursor-not-allowed";
              }

              return (
                <button
                  key={`numone-${num}`}
                  onClick={() => toggleNumerone(num)}
                  disabled={disabled || (column.numerone !== null && !isSelected)}
                  className={btnClass}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-4 text-[10px] sm:text-xs text-muted-foreground flex justify-between items-center bg-secondary/30 px-3 py-2 rounded-lg">
        <span>Costo totale: <strong className="text-foreground">€{column.bet.toFixed(2)}</strong></span>
        {isComplete && <span className="text-primary font-bold uppercase tracking-wider">Completa</span>}
      </div>
    </div>
  );
};

export default SchedinaColumn;
