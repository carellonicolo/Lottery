import React from 'react';
import { type ColumnSelection } from '@/lib/millionday/millionday';

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

  const handleRandom = () => {
    if (disabled) return;
    const pool = Array.from({ length: 55 }, (_, i) => i + 1);
    for (let i = 0; i < 5; i++) {
      const j = i + Math.floor(Math.random() * (55 - i));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    onChange({ ...column, numbers: pool.slice(0, 5).sort((a, b) => a - b) });
  };

  const isComplete = column.numbers.length === 5;

  // Build grid rows matching the real ticket:
  // Row 0: 5 empty cells + numbers 1-5  (right half only)
  // Row 1: 6-10 | 11-15
  // Row 2: 16-20 | 21-25
  // Row 3: 26-30 | 31-35
  // Row 4: 36-40 | 41-45
  // Row 5: 46-50 | 51-55
  const gridRows: (number | null)[][] = [
    [null, null, null, null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    [46, 47, 48, 49, 50, 51, 52, 53, 54, 55],
  ];

  const renderCell = (num: number | null, rowIdx: number, colIdx: number) => {
    if (num === null) {
      return <div key={`empty-${rowIdx}-${colIdx}`} className="w-full aspect-square" />;
    }

    const isSelected = column.numbers.includes(num);
    const isMatchedBase = matchedBase.includes(num);
    const isMatchedExtra = matchedExtra.includes(num);

    let cellStyle: React.CSSProperties = {
      width: '100%',
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 700,
      borderRadius: '3px',
      border: '1px solid #a8d8ea',
      cursor: disabled || (column.numbers.length >= 5 && !isSelected) ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s ease',
      fontFamily: "'Arial', sans-serif",
      background: '#ffffff',
      color: '#1a3a5c',
    };

    if (isMatchedBase) {
      cellStyle = {
        ...cellStyle,
        background: 'linear-gradient(135deg, #FF8F00, #F57C00)',
        color: '#fff',
        border: '2px solid #E65100',
        transform: 'scale(1.08)',
        boxShadow: '0 2px 8px rgba(245,124,0,0.5)',
        zIndex: 10,
      };
    } else if (isMatchedExtra) {
      cellStyle = {
        ...cellStyle,
        background: 'linear-gradient(135deg, #00BCD4, #0097A7)',
        color: '#fff',
        border: '2px solid #006064',
        transform: 'scale(1.08)',
        boxShadow: '0 2px 8px rgba(0,188,212,0.5)',
        zIndex: 10,
      };
    } else if (isSelected) {
      cellStyle = {
        ...cellStyle,
        background: 'linear-gradient(135deg, #FFA726, #FB8C00)',
        color: '#fff',
        border: '2px solid #E65100',
        boxShadow: '0 1px 4px rgba(245,124,0,0.3)',
      };
    }

    if (disabled && !isSelected && !isMatchedBase && !isMatchedExtra) {
      cellStyle.opacity = 0.5;
    } else if (column.numbers.length >= 5 && !isSelected && !disabled) {
      cellStyle.opacity = 0.4;
    }

    return (
      <button
        key={num}
        onClick={() => toggleNumber(num)}
        disabled={disabled || (column.numbers.length >= 5 && !isSelected)}
        style={cellStyle}
      >
        {num}
      </button>
    );
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #4FC3F7 0%, #81D4FA 40%, #B3E5FC 100%)',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '2px solid #29B6F6',
      boxShadow: isComplete ? '0 4px 20px rgba(79,195,247,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
    }}>
      {/* GIOCATA Header - Orange bar like real ticket */}
      <div style={{
        background: 'linear-gradient(135deg, #FF9800, #F57C00)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          color: '#fff',
          fontWeight: 900,
          fontSize: '13px',
          letterSpacing: '1px',
          fontFamily: "'Arial Black', 'Arial', sans-serif",
          textTransform: 'uppercase',
        }}>
          GIOCATA {index + 1}
        </span>
        <span style={{
          color: '#fff',
          fontSize: '11px',
          fontWeight: 600,
          opacity: 0.9,
        }}>
          {column.numbers.length}/5
        </span>
      </div>

      {/* Numbers Grid */}
      <div style={{ padding: '8px 10px 6px' }}>
        <p style={{
          color: '#1a3a5c',
          fontSize: '9px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '6px',
          textAlign: 'center',
        }}>
          Scegli 5 numeri
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {gridRows.map((row, rowIdx) => (
            <div key={rowIdx} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr) 4px repeat(5, 1fr)',
              gap: '2px',
              alignItems: 'center',
            }}>
              {row.slice(0, 5).map((num, colIdx) => renderCell(num, rowIdx, colIdx))}
              {/* Visual separator between left and right halves */}
              <div />
              {row.slice(5).map((num, colIdx) => renderCell(num, rowIdx, colIdx + 5))}
            </div>
          ))}
        </div>
      </div>

      {/* Random Button */}
      <div style={{ padding: '4px 10px 8px', textAlign: 'right' }}>
        <button
          onClick={handleRandom}
          disabled={disabled}
          style={{
            background: 'linear-gradient(135deg, #FFB74D, #FF9800)',
            color: '#fff',
            border: '1px solid #F57C00',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '9px',
            fontWeight: 800,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            fontFamily: "'Arial', sans-serif",
          }}
        >
          5 Numeri Casuali
        </button>
      </div>

      {/* Extra MillionDAY Section */}
      <div style={{
        background: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)',
        borderTop: '2px dashed #4DD0E1',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => !disabled && onChange({ ...column, isExtra: !column.isExtra })}
            disabled={disabled}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '3px',
              border: '2px solid #00838F',
              background: column.isExtra ? '#00838F' : '#fff',
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            {column.isExtra && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
            }}>
              <span style={{
                fontWeight: 900,
                fontSize: '14px',
                color: '#FF6F00',
                fontFamily: "'Arial Black', sans-serif",
                fontStyle: 'italic',
              }}>
                extra
              </span>
              <span style={{
                fontWeight: 700,
                fontSize: '10px',
                color: '#00838F',
                letterSpacing: '0.5px',
              }}>
                MillionDay
              </span>
            </div>
            <span style={{
              fontSize: '8px',
              color: '#00695C',
              fontWeight: 600,
            }}>
              5 numeri estratti dai 50 rimanenti
            </span>
          </div>
        </div>
        
        <div style={{
          textAlign: 'right',
          fontSize: '10px',
          fontWeight: 700,
          color: '#1a3a5c',
          whiteSpace: 'nowrap',
        }}>
          €{(1 + (column.isExtra ? 1 : 0)).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default SchedinaColumn;
