import React from 'react';
import { type ColumnSelection } from '@/lib/millionday/millionday';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SchedinaColumnProps {
  index: number;
  column: ColumnSelection;
  onChange: (col: ColumnSelection) => void;
  matchedBase: number[];
  matchedExtra: number[];
  disabled?: boolean;
}

const SchedinaColumn: React.FC<SchedinaColumnProps> = ({
  index,
  column,
  onChange,
  matchedBase,
  matchedExtra,
  disabled,
}) => {
  const toggleNumber = (num: number) => {
    if (disabled) return;
    const isSelected = column.numbers.includes(num);
    let newNumbers = [];
    if (isSelected) {
      newNumbers = column.numbers.filter((n) => n !== num);
    } else {
      if (column.numbers.length >= 5) return;
      newNumbers = [...column.numbers, num].sort((a, b) => a - b);
    }
    onChange({ ...column, numbers: newNumbers });
  };

  const isComplete = column.numbers.length === 5;

  return (
    <div className={`p-3 sm:p-4 rounded-xl border transition-all ${
      isComplete ? 'bg-primary/5 border-primary/30 shadow-inner' : 'bg-background/50 border-border'
    }`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {column.numbers.length}/5 Numeri
          </span>
        </div>
        
        {/* Toggle Extra MillionDAY */}
        <div className="flex items-center gap-2">
           <Label htmlFor={`extra-toggle-${index}`} className="text-[10px] sm:text-xs font-bold text-accent uppercase">
             + EXTRA
           </Label>
           <Switch
             id={`extra-toggle-${index}`}
             checked={column.isExtra}
             onCheckedChange={(checked) => onChange({ ...column, isExtra: checked })}
             disabled={disabled}
             className="data-[state=checked]:bg-accent"
           />
        </div>
      </div>

      <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
        {Array.from({ length: 55 }, (_, i) => i + 1).map((num) => {
          const isSelected = column.numbers.includes(num);
          const isMatchedBase = matchedBase.includes(num);
          const isMatchedExtra = matchedExtra.includes(num);

          let btnClass = "w-full aspect-square rounded flex items-center justify-center text-[10px] sm:text-xs font-medium transition-all duration-200 border ";

          if (isMatchedBase) {
            btnClass += "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-110 z-10 font-bold";
          } else if (isMatchedExtra) {
            btnClass += "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/30 scale-110 z-10 font-bold";
          } else if (isSelected) {
            btnClass += "bg-primary/20 text-primary border-primary/50 font-bold";
          } else {
            btnClass += "bg-background/80 text-muted-foreground border-border hover:bg-secondary hover:text-foreground";
          }

          if (disabled && !isSelected && !isMatchedBase && !isMatchedExtra) {
            btnClass += " opacity-50 cursor-not-allowed";
          } else if (column.numbers.length >= 5 && !isSelected && !disabled) {
            btnClass += " opacity-40 cursor-not-allowed";
          }

          return (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              disabled={disabled || (column.numbers.length >= 5 && !isSelected)}
              className={btnClass}
            >
              {num}
            </button>
          );
        })}
      </div>
      
      {/* Footer Info */}
      <div className="mt-3 text-[10px] sm:text-xs text-muted-foreground flex justify-between">
        <span>Costo colonna: <strong className="text-foreground">€{(1 + (column.isExtra ? 1 : 0)).toFixed(2)}</strong></span>
        {isComplete && <span className="text-primary font-semibold">Completa</span>}
      </div>
    </div>
  );
};

export default SchedinaColumn;
