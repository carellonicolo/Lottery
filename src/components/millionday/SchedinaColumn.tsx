import React, { memo } from 'react';
import { type ColumnSelection } from '@/lib/millionday/millionday';

interface SchedinaColumnProps {
  index: number;
  column: ColumnSelection;
  onChange: (col: ColumnSelection) => void;
  matchedBase: number[];
  matchedExtra: number[];
  disabled?: boolean;
}

// Grid del Lotto MillionDAY: la prima riga ha solo i numeri 1-5 sulla destra,
// il resto è impaginato come una vera schedina (5 numeri + gap + 5 numeri).
// Estratto FUORI dal componente per non rialloccarlo ad ogni render.
const GRID_ROWS: ReadonlyArray<ReadonlyArray<number | null>> = [
  [null, null, null, null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
  [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  [46, 47, 48, 49, 50, 51, 52, 53, 54, 55],
];

const SchedinaColumnImpl: React.FC<SchedinaColumnProps> = ({
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

  const renderCell = (num: number | null, rowIdx: number, colIdx: number) => {
    if (num === null) {
      return <div key={`empty-${rowIdx}-${colIdx}`} style={{ width: '100%', aspectRatio: '1' }} />;
    }

    const isSelected = column.numbers.includes(num);
    const isMatchedBase = matchedBase.includes(num);
    const isMatchedExtra = matchedExtra.includes(num);
    const isLocked = column.numbers.length >= 5 && !isSelected;

    let bg = '#ffffff';
    let color = '#0e3a5c';
    let border = '1px solid #5BB0CC';
    let content: React.ReactNode = num;
    let extra: React.CSSProperties = {};

    if (isMatchedBase) {
      bg = 'linear-gradient(135deg, #FF8F00, #E65100)';
      color = '#ffffff';
      border = '2px solid #BF360C';
      extra = { boxShadow: '0 2px 8px rgba(230,81,0,0.6)', transform: 'scale(1.05)', zIndex: 10 };
    } else if (isMatchedExtra) {
      bg = 'linear-gradient(135deg, #00BCD4, #00838F)';
      color = '#ffffff';
      border = '2px solid #004D5A';
      extra = { boxShadow: '0 2px 8px rgba(0,131,143,0.6)', transform: 'scale(1.05)', zIndex: 10 };
    } else if (isSelected) {
      // Real ticket style: pen X mark over the number (number still readable)
      content = (
        <span style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%' }}>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0e3a5c', fontWeight: 700 }}>
            {num}
          </span>
          <svg
            viewBox="0 0 24 24"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <path
              d="M4 4 L20 20 M20 4 L4 20"
              stroke="#0a1a2c"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.88"
            />
          </svg>
        </span>
      );
    }

    if (disabled && !isSelected && !isMatchedBase && !isMatchedExtra) {
      extra = { ...extra, opacity: 0.55 };
    } else if (isLocked && !disabled) {
      extra = { ...extra, opacity: 0.45 };
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
          background: bg,
          color,
          border,
          borderRadius: '2px',
          fontSize: 'clamp(10px, 1.6vw, 14px)',
          fontWeight: 800,
          fontFamily: "'Arial Narrow', 'Arial', sans-serif",
          cursor: disabled || isLocked ? 'not-allowed' : 'pointer',
          transition: 'all 0.12s ease',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          ...extra,
        }}
      >
        {content}
      </button>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        background: '#7FCFE3',
        backgroundImage: `
          repeating-linear-gradient(-45deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 8px),
          linear-gradient(180deg, #6FC7DE 0%, #87D4E6 100%)
        `,
        border: '2px solid #1F8FAA',
        borderRadius: '10px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.4)',
        overflow: 'hidden',
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {/* GIOCATA label - thin bar */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0098B8 0%, #006E85 100%)',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 900,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          borderBottom: '1px solid #00566A',
        }}
      >
        <span>GIOCATA {index + 1}</span>
        <span style={{ fontSize: '9px', opacity: 0.95, fontWeight: 700 }}>
          {column.numbers.length}/5
        </span>
      </div>

      {/* Header band - "SCEGLI 5 NUMERI al costo di 1€" */}
      <div
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #E8F6FB 100%)',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(31,143,170,0.4)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 900,
              color: '#0e3a5c',
              letterSpacing: '0.5px',
              lineHeight: 1,
              fontFamily: "'Arial Black', 'Arial', sans-serif",
            }}
          >
            SCEGLI 5 NUMERI
          </div>
          <div style={{ fontSize: '9px', color: '#0e3a5c', marginTop: '2px', fontWeight: 600 }}>
            al costo di 1€
          </div>
        </div>
        <button
          onClick={handleRandom}
          disabled={disabled}
          style={{
            background: 'linear-gradient(135deg, #FFC107, #FF9800)',
            color: '#fff',
            border: '1px solid #E65100',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '9px',
            fontWeight: 800,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            fontFamily: "'Arial Black', sans-serif",
            textShadow: '0 1px 1px rgba(0,0,0,0.2)',
          }}
        >
          ✦ Casuale
        </button>
      </div>

      {/* Numbers Grid */}
      <div style={{ padding: '8px 8px 6px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {GRID_ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr) 6px repeat(5, 1fr)',
                gap: '3px',
                alignItems: 'center',
              }}
            >
              {row.slice(0, 5).map((num, colIdx) => renderCell(num, rowIdx, colIdx))}
              <div />
              {row.slice(5).map((num, colIdx) => renderCell(num, rowIdx, colIdx + 5))}
            </div>
          ))}
        </div>
      </div>

      {/* "NOVITÀ" / Extra MillionDay strip - matches the real ticket */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #E0F4FA 100%)',
          borderTop: '1px dashed #1F8FAA',
          padding: '8px 10px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        {/* NOVITÀ ribbon */}
        <div
          style={{
            position: 'absolute',
            top: '-9px',
            right: '10px',
            background: 'linear-gradient(135deg, #FFD600, #FFAB00)',
            color: '#BF360C',
            fontSize: '8px',
            fontWeight: 900,
            padding: '2px 8px',
            borderRadius: '3px',
            letterSpacing: '0.5px',
            border: '1px solid #FF6F00',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            textTransform: 'uppercase',
            fontFamily: "'Arial Black', sans-serif",
          }}
        >
          NOVITÀ
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          {/* Extra MillionDay logo */}
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <span
              style={{
                fontWeight: 900,
                fontSize: '15px',
                color: '#E65100',
                fontFamily: "'Arial Black', sans-serif",
                fontStyle: 'italic',
                lineHeight: 1,
                letterSpacing: '-0.5px',
              }}
            >
              extra
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: '9px',
                color: '#006E85',
                letterSpacing: '0.3px',
                lineHeight: 1.1,
                marginTop: '1px',
              }}
            >
              MillionDay
            </span>
          </div>

          <div
            style={{
              fontSize: '9px',
              color: '#0e3a5c',
              lineHeight: 1.2,
              fontWeight: 600,
              flex: 1,
              minWidth: 0,
            }}
          >
            Barrando la casella giochi <strong>1€</strong> su EXTRA MillionDay
          </div>
        </div>

        {/* Checkbox */}
        <button
          onClick={() => !disabled && onChange({ ...column, isExtra: !column.isExtra })}
          disabled={disabled}
          aria-label={`Aggiungi Extra MillionDay alla colonna ${index + 1}`}
          aria-pressed={column.isExtra}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '3px',
            border: '2px solid #006E85',
            background: column.isExtra ? '#fff' : '#fff',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s ease',
            position: 'relative',
            padding: 0,
          }}
        >
          {column.isExtra && (
            <svg viewBox="0 0 24 24" width="22" height="22" style={{ pointerEvents: 'none' }}>
              <path
                d="M4 4 L20 20 M20 4 L4 20"
                stroke="#1a1a1a"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Bottom info: "5 NUMERI ESTRATTI DAI 50 RIMANENTI" */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0098B8 0%, #006E85 100%)',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff',
          fontSize: '9px',
          fontWeight: 800,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        <span>5 NUMERI ESTRATTI DAI 50 RIMANENTI</span>
        <span style={{ fontWeight: 900, fontFamily: "'Arial Black', sans-serif" }}>
          €{(1 + (column.isExtra ? 1 : 0)).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

/**
 * Memoizzato: 110 bottoni di griglia significano re-render costosi quando il parent
 * cambia stato per un'altra colonna. Confronto shallow su props basta.
 */
const SchedinaColumn = memo(SchedinaColumnImpl);
export default SchedinaColumn;
