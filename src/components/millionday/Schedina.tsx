import React from 'react';
import { type ColumnSelection } from '@/lib/millionday/millionday';
import SchedinaColumn from './SchedinaColumn';

interface SchedinaProps {
  columns: ColumnSelection[];
  onColumnsChange: (columns: ColumnSelection[]) => void;
  onPlay: () => void;
  matchedByColumnBase: number[][];
  matchedByColumnExtra: number[][];
  disabled?: boolean;
}

const Schedina: React.FC<SchedinaProps> = ({
  columns,
  onColumnsChange,
  onPlay,
  matchedByColumnBase,
  matchedByColumnExtra,
  disabled,
}) => {
  const updateColumn = (index: number, newCol: ColumnSelection) => {
    const next = [...columns];
    next[index] = newCol;
    onColumnsChange(next);
  };

  const handleClearAll = () => {
    onColumnsChange(columns.map((c) => ({ ...c, numbers: [] })));
  };

  const handleRandomAll = () => {
    const next = columns.map((c) => {
      const numbers: number[] = [];
      const pool = Array.from({ length: 55 }, (_, i) => i + 1);
      for (let i = 0; i < 5; i++) {
        const j = i + Math.floor(Math.random() * (55 - i));
        [pool[i], pool[j]] = [pool[j], pool[i]];
        numbers.push(pool[i]);
      }
      return { ...c, numbers: numbers.sort((a, b) => a - b) };
    });
    onColumnsChange(next);
  };

  const filledColumns = columns.filter((c) => c.numbers.length === 5);
  const totalCost = columns.reduce((sum, col) => {
    if (col.numbers.length === 5) {
      return sum + 1 + (col.isExtra ? 1 : 0);
    }
    return sum;
  }, 0);

  return (
    <div className="flex flex-col items-center">
      {/* === TICKET CONTAINER === */}
      <div
        className="w-full overflow-hidden"
        style={{
          background: '#7FCFE3',
          backgroundImage: `
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 10px),
            linear-gradient(180deg, #6FC7DE 0%, #87D4E6 100%)
          `,
          borderRadius: '14px',
          boxShadow:
            '0 12px 40px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.5)',
          border: '2px solid #1F8FAA',
          fontFamily: "'Arial', sans-serif",
        }}
      >
        {/* === HEADER: MillionDAY Logo + Extra Logo === */}
        <div
          style={{
            padding: '14px 16px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            borderBottom: '2px solid rgba(31,143,170,0.4)',
            position: 'relative',
          }}
        >
          {/* MillionDAY logo */}
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '2px',
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "'Arial Black', 'Arial', sans-serif",
                  fontSize: 'clamp(22px, 4vw, 34px)',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: '#ffffff',
                  textShadow: '1px 2px 0 #006E85, 2px 3px 6px rgba(0,0,0,0.2)',
                  letterSpacing: '-1px',
                }}
              >
                Million
              </span>
              <span
                style={{
                  fontFamily: "'Arial Black', 'Arial', sans-serif",
                  fontSize: 'clamp(22px, 4vw, 34px)',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: '#FFD600',
                  textShadow: '1px 2px 0 #BF360C, 2px 3px 6px rgba(0,0,0,0.25)',
                  letterSpacing: '-1px',
                }}
              >
                DAY
              </span>
            </div>
            {/* Yellow underline curve */}
            <div
              style={{
                marginTop: '2px',
                height: '4px',
                width: '95%',
                background: 'linear-gradient(90deg, #FFD600 0%, #FF9800 60%, #FFD600 100%)',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            />
            <div
              style={{
                marginTop: '6px',
                fontSize: 'clamp(10px, 1.3vw, 13px)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textShadow: '1px 1px 2px rgba(0,0,0,0.25)',
              }}
            >
              Il milione che vorrei
            </div>
          </div>

          {/* Extra MillionDay logo on the right */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-4px',
                background: 'linear-gradient(135deg, #FFD600, #FFAB00)',
                color: '#BF360C',
                fontSize: '9px',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: '3px',
                letterSpacing: '0.5px',
                border: '1px solid #FF6F00',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                textTransform: 'uppercase',
                fontFamily: "'Arial Black', sans-serif",
                transform: 'rotate(6deg)',
                zIndex: 2,
              }}
            >
              NOVITÀ
            </div>
            <div
              style={{
                background: '#ffffff',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', lineHeight: 1 }}>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: 'clamp(16px, 2.5vw, 22px)',
                    color: '#E65100',
                    fontFamily: "'Arial Black', sans-serif",
                    fontStyle: 'italic',
                    letterSpacing: '-0.5px',
                  }}
                >
                  extra
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 'clamp(10px, 1.4vw, 13px)',
                    color: '#006E85',
                    letterSpacing: '0.3px',
                  }}
                >
                  MillionDay
                </span>
              </div>
              <span
                style={{
                  fontSize: 'clamp(7px, 1vw, 9px)',
                  color: '#006E85',
                  fontWeight: 700,
                  marginTop: '2px',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                }}
              >
                La seconda possibilità<br />per i tuoi numeri
              </span>
            </div>
          </div>
        </div>

        {/* === GLOBAL ACTIONS BAR === */}
        <div
          style={{
            background: 'rgba(255,255,255,0.45)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            borderBottom: '1px solid rgba(31,143,170,0.3)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#0e3a5c', letterSpacing: '0.3px' }}>
            {filledColumns.length}/4 GIOCATE COMPILATE
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleRandomAll}
              disabled={disabled}
              style={{
                background: 'linear-gradient(135deg, #FFC107, #FF9800)',
                color: '#fff',
                border: '1px solid #E65100',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: 800,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                textTransform: 'uppercase',
                fontFamily: "'Arial Black', sans-serif",
                letterSpacing: '0.3px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }}
            >
              ✦ Tutto Casuale
            </button>
            <button
              onClick={handleClearAll}
              disabled={disabled}
              style={{
                background: '#fff',
                color: '#C62828',
                border: '1px solid #C62828',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: 800,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                textTransform: 'uppercase',
                fontFamily: "'Arial Black', sans-serif",
                letterSpacing: '0.3px',
              }}
            >
              ✕ Svuota
            </button>
          </div>
        </div>

        {/* === GIOCATE PANELS === */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3"
        >
          {columns.map((col, idx) => (
            <SchedinaColumn
              key={idx}
              index={idx}
              column={col}
              onChange={(newCol) => updateColumn(idx, newCol)}
              matchedBase={matchedByColumnBase[idx] || []}
              matchedExtra={matchedByColumnExtra[idx] || []}
              disabled={disabled}
            />
          ))}
        </div>

        {/* === BOTTOM TICKET FOOTER === */}
        <div
          style={{
            background: 'linear-gradient(180deg, #0098B8 0%, #006E85 100%)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            borderTop: '2px solid #00566A',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              lineHeight: 1.3,
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#FFD600' }}>
              ⏰ NUOVO ORARIO!
            </div>
            <div>Estrazione tutti i giorni alle 20:30</div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.18)',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              fontWeight: 900,
              fontSize: '13px',
              fontFamily: "'Arial Black', sans-serif",
              letterSpacing: '0.5px',
            }}
          >
            TOTALE: <span style={{ color: '#FFD600' }}>€{totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* === GIOCA BUTTON (outside the ticket, like a separate action) === */}
      <button
        onClick={onPlay}
        disabled={disabled || filledColumns.length === 0}
        className="mt-5 transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        style={{
          padding: '14px 48px',
          borderRadius: '12px',
          background:
            filledColumns.length > 0
              ? 'linear-gradient(180deg, #FFC107 0%, #FF9800 50%, #E65100 100%)'
              : '#999',
          color: '#fff',
          border: filledColumns.length > 0 ? '2px solid #BF360C' : '2px solid #777',
          fontFamily: "'Arial Black', Impact, sans-serif",
          fontSize: '18px',
          fontWeight: 900,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textShadow: '1px 2px 4px rgba(0,0,0,0.4)',
          boxShadow:
            filledColumns.length > 0
              ? '0 6px 20px rgba(230,81,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)'
              : 'none',
          cursor: disabled || filledColumns.length === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {disabled ? '⏳ Estrazione...' : '▶ GIOCA ORA'}
      </button>
    </div>
  );
};

export default Schedina;
