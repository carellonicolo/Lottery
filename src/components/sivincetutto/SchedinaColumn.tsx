import React, { memo } from 'react';
import { type ColumnSelection, NUMBERS_TO_PICK, NUMBER_RANGE_MAX } from '@/lib/sivincetutto/sivincetutto';

interface SchedinaColumnProps {
  index: number;
  column: ColumnSelection;
  onChange: (col: ColumnSelection) => void;
  matchedNumbers: number[];
  disabled?: boolean;
}

const NUMBERS = Array.from({ length: NUMBER_RANGE_MAX }, (_, i) => i + 1);

const SchedinaColumnImpl: React.FC<SchedinaColumnProps> = ({
  index,
  column,
  onChange,
  matchedNumbers,
  disabled,
}) => {
  const toggleNumber = (num: number) => {
    if (disabled) return;
    const isSelected = column.numbers.includes(num);
    let newNumbers: number[];
    if (isSelected) {
      newNumbers = column.numbers.filter((n) => n !== num);
    } else {
      if (column.numbers.length >= NUMBERS_TO_PICK) return;
      newNumbers = [...column.numbers, num].sort((a, b) => a - b);
    }
    onChange({ numbers: newNumbers });
  };

  const handleRandom = () => {
    if (disabled) return;
    const pool = Array.from({ length: NUMBER_RANGE_MAX }, (_, i) => i + 1);
    for (let i = 0; i < NUMBERS_TO_PICK; i++) {
      const j = i + Math.floor(Math.random() * (NUMBER_RANGE_MAX - i));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    onChange({ numbers: pool.slice(0, NUMBERS_TO_PICK).sort((a, b) => a - b) });
  };

  const handleClear = () => {
    if (disabled) return;
    onChange({ numbers: [] });
  };

  const isComplete = column.numbers.length === NUMBERS_TO_PICK;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        border: '2px solid #E65100',
        overflow: 'hidden',
        fontFamily: "'Arial', sans-serif",
        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
      }}
    >
      {/* Column header */}
      <div
        style={{
          background: 'linear-gradient(180deg, #FF6F00 0%, #E65100 100%)',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff',
          borderBottom: '2px solid #FFD600',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#FFD600',
              color: '#BF360C',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 900,
              letterSpacing: '0.5px',
            }}
          >
            COLONNA {index + 1}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.95 }}>
            {column.numbers.length}/{NUMBERS_TO_PICK}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleRandom}
            disabled={disabled}
            style={{
              background: '#fff',
              color: '#BF360C',
              border: '1px solid #FFD600',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '9px',
              fontWeight: 900,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              textTransform: 'uppercase',
              fontFamily: "'Arial', sans-serif",
            }}
          >
            ✦ Casuale
          </button>
          <button
            onClick={handleClear}
            disabled={disabled || column.numbers.length === 0}
            style={{
              background: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '9px',
              fontWeight: 800,
              cursor: disabled || column.numbers.length === 0 ? 'not-allowed' : 'pointer',
              opacity: disabled || column.numbers.length === 0 ? 0.4 : 1,
              textTransform: 'uppercase',
            }}
          >
            ✕ Pulisci
          </button>
        </div>
      </div>

      {/* Numbers grid */}
      <div style={{ padding: '8px', background: 'linear-gradient(180deg, #FFE0B2 0%, #FFCC80 100%)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(15, 1fr)',
            gap: '3px',
          }}
        >
          {NUMBERS.map((num) => {
            const isSelected = column.numbers.includes(num);
            const isMatched = matchedNumbers.includes(num);
            const isLocked = column.numbers.length >= NUMBERS_TO_PICK && !isSelected;

            let bg = '#FFFFFF';
            let color = '#BF360C';
            let border = '1.5px solid #E65100';
            let extra: React.CSSProperties = {};

            if (isMatched) {
              bg = 'linear-gradient(135deg, #FFD600, #FF6F00)';
              color = '#1A237E';
              border = '2px solid #BF360C';
              extra = {
                boxShadow: '0 0 0 2px #fff, 0 3px 8px rgba(255,109,0,0.6)',
                transform: 'scale(1.1)',
                zIndex: 10,
              };
            } else if (isSelected) {
              bg = 'linear-gradient(135deg, #FF1744, #C00018)';
              color = '#fff';
              border = '2px solid #8B0000';
              extra = {
                boxShadow: '0 2px 4px rgba(192,0,24,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
              };
            }

            if (disabled && !isSelected && !isMatched) {
              extra = { ...extra, opacity: 0.6 };
            } else if (isLocked && !disabled) {
              extra = { ...extra, opacity: 0.5 };
            }

            return (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                disabled={disabled || isLocked}
                aria-label={`Numero ${num}${isSelected ? ', selezionato' : ''}`}
                aria-pressed={isSelected}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: bg,
                  color,
                  border,
                  fontSize: 'clamp(8px, 1.2vw, 11px)',
                  fontWeight: 900,
                  fontFamily: "'Arial', sans-serif",
                  cursor: disabled || isLocked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.12s ease',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...extra,
                }}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer cost */}
      <div
        style={{
          background: 'linear-gradient(180deg, #BF360C 0%, #8B2C0A 100%)',
          color: '#fff',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.5px',
        }}
      >
        <span style={{ textTransform: 'uppercase' }}>
          {isComplete ? '✓ Colonna completa' : `Mancano ${NUMBERS_TO_PICK - column.numbers.length} numeri`}
        </span>
        <span style={{ color: '#FFD600', fontFamily: "'Arial Black', sans-serif", fontSize: '13px' }}>
          {isComplete ? '€5,00' : '—'}
        </span>
      </div>
    </div>
  );
};

export default SchedinaColumn;
