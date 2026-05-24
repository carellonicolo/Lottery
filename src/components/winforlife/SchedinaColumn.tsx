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

const NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

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
    let newNumbers: number[];
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

  const handleRandom = () => {
    if (disabled) return;
    const pool = Array.from({ length: 20 }, (_, i) => i + 1);
    for (let i = 0; i < 10; i++) {
      const j = i + Math.floor(Math.random() * (20 - i));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const numbers = pool.slice(0, 10).sort((a, b) => a - b);
    const numerone = Math.floor(Math.random() * 20) + 1;
    onChange({ ...column, numbers, numerone });
  };

  const isNumbersComplete = column.numbers.length === 10;
  const isComplete = isNumbersComplete && column.numerone !== null;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        border: '1.5px solid #007A3D',
        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {/* === COLUMN HEADER === */}
      <div
        style={{
          background: 'linear-gradient(180deg, #00A859 0%, #007A3D 100%)',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #FFD600',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#FFD600',
              color: '#007A3D',
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
            {column.numbers.length}/10 + {column.numerone ? '1' : '0'}/1
          </span>
        </div>

        <button
          onClick={handleRandom}
          disabled={disabled}
          style={{
            background: '#fff',
            color: '#007A3D',
            border: '1px solid #FFD600',
            borderRadius: '4px',
            padding: '3px 9px',
            fontSize: '10px',
            fontWeight: 900,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            fontFamily: "'Arial', sans-serif",
          }}
        >
          ✦ Quick Pick
        </button>
      </div>

      {/* === MAIN NUMBERS SECTION === */}
      <div
        style={{
          background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)',
          padding: '10px 12px',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 900,
            color: '#007A3D',
            letterSpacing: '0.3px',
            marginBottom: '8px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>► Scegli 10 numeri da 1 a 20</span>
          <span
            style={{
              background: column.numbers.length === 10 ? '#E30613' : '#fff',
              color: column.numbers.length === 10 ? '#fff' : '#007A3D',
              border: '1.5px solid #007A3D',
              borderRadius: '12px',
              padding: '1px 8px',
              fontSize: '10px',
              fontWeight: 900,
            }}
          >
            {column.numbers.length}/10
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '6px',
          }}
        >
          {NUMBERS.map((num) => {
            const isSelected = column.numbers.includes(num);
            const isMatched = matchedNumbers.includes(num);
            const isLocked = isNumbersComplete && !isSelected;

            let bg = '#FFFFFF';
            let color = '#00753F';
            let border = '2px solid #00A859';
            let extraStyle: React.CSSProperties = {};

            if (isMatched) {
              bg = 'linear-gradient(135deg, #FFD600, #FFA000)';
              color = '#7B1FA2';
              border = '2px solid #E30613';
              extraStyle = {
                boxShadow: '0 0 0 3px #fff, 0 4px 10px rgba(227,6,19,0.5)',
                transform: 'scale(1.1)',
                zIndex: 10,
              };
            } else if (isSelected) {
              bg = 'linear-gradient(135deg, #FF1744, #C00018)';
              color = '#fff';
              border = '2px solid #8B0000';
              extraStyle = {
                boxShadow: '0 2px 6px rgba(192,0,24,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
              };
            }

            if (disabled && !isSelected && !isMatched) {
              extraStyle = { ...extraStyle, opacity: 0.55 };
            } else if (isLocked && !disabled) {
              extraStyle = { ...extraStyle, opacity: 0.45 };
            }

            return (
              <button
                key={`num-${num}`}
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
                  fontSize: 'clamp(13px, 2vw, 17px)',
                  fontWeight: 900,
                  fontFamily: "'Arial', sans-serif",
                  cursor: disabled || isLocked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  ...extraStyle,
                }}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* === NUMERONE SECTION === */}
      <div
        style={{
          background: 'linear-gradient(180deg, #FFFDE7 0%, #FFF59D 100%)',
          padding: '10px 12px',
          borderTop: '2px dashed #FFA000',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 900,
            color: '#E65100',
            letterSpacing: '0.3px',
            marginBottom: '8px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>★ Scegli il NUMERONE</span>
          <span
            style={{
              background: column.numerone ? '#E30613' : '#fff',
              color: column.numerone ? '#fff' : '#E65100',
              border: '1.5px solid #E65100',
              borderRadius: '12px',
              padding: '1px 8px',
              fontSize: '10px',
              fontWeight: 900,
            }}
          >
            {column.numerone ? '1' : '0'}/1
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '4px',
          }}
        >
          {NUMBERS.map((num) => {
            const isSelected = column.numerone === num;
            const isMatched = isSelected && numeroneMatch;
            const isLocked = column.numerone !== null && !isSelected;

            let bg = '#FFFFFF';
            let color = '#E65100';
            let border = '2px solid #FFA000';
            let extraStyle: React.CSSProperties = {};

            if (isMatched) {
              bg = 'linear-gradient(135deg, #FFD600, #FF9100)';
              color = '#7B1FA2';
              border = '2px solid #E30613';
              extraStyle = {
                boxShadow: '0 0 0 3px #fff, 0 4px 10px rgba(227,6,19,0.6)',
                transform: 'scale(1.15)',
                zIndex: 10,
              };
            } else if (isSelected) {
              bg = 'linear-gradient(135deg, #FFD600, #FFA000)';
              color = '#8B0000';
              border = '2px solid #E65100';
              extraStyle = {
                boxShadow: '0 2px 6px rgba(255,109,0,0.45), inset 0 1px 0 rgba(255,255,255,0.4)',
                transform: 'scale(1.08)',
              };
            }

            if (disabled && !isSelected && !isMatched) {
              extraStyle = { ...extraStyle, opacity: 0.55 };
            } else if (isLocked && !disabled) {
              extraStyle = { ...extraStyle, opacity: 0.5 };
            }

            return (
              <button
                key={`numone-${num}`}
                onClick={() => toggleNumerone(num)}
                disabled={disabled || isLocked}
                aria-label={`Numerone ${num}${isSelected ? ', selezionato' : ''}`}
                aria-pressed={isSelected}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: bg,
                  color,
                  border,
                  fontSize: 'clamp(10px, 1.5vw, 13px)',
                  fontWeight: 900,
                  fontFamily: "'Arial', sans-serif",
                  cursor: disabled || isLocked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...extraStyle,
                }}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* === BET / COST SECTION === */}
      <div
        style={{
          background: 'linear-gradient(180deg, #007A3D 0%, #005C2E 100%)',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              color: '#FFD600',
              fontWeight: 900,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Scegli giocata:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2].map((b) => (
              <button
                key={b}
                onClick={() => !disabled && onChange({ ...column, bet: b as 1 | 2 })}
                disabled={disabled}
                aria-label={`Punta ${b} euro`}
                aria-pressed={column.bet === b}
                style={{
                  background: column.bet === b ? '#FFD600' : 'transparent',
                  color: column.bet === b ? '#005C2E' : '#fff',
                  border: column.bet === b ? '2px solid #FFA000' : '2px solid #fff',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                  fontFamily: "'Arial Black', sans-serif",
                }}
              >
                {b}€
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            color: isComplete ? '#FFD600' : '#fff',
            fontWeight: 900,
            fontSize: '13px',
            fontFamily: "'Arial Black', sans-serif",
            letterSpacing: '0.5px',
          }}
        >
          {isComplete ? `€${column.bet.toFixed(2)}` : '— incompleta —'}
        </div>
      </div>
    </div>
  );
};

export default SchedinaColumn;
