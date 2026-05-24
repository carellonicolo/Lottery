import React from 'react';
import { type ColumnSelection } from '@/lib/winforlife/winforlife';
import SchedinaColumn from './SchedinaColumn';

interface SchedinaProps {
  columns: ColumnSelection[];
  onColumnsChange: (columns: ColumnSelection[]) => void;
  onPlay: () => void;
  matchedByColumn: { matchedNumbers: number[]; numeroneMatch: boolean }[];
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
    onColumnsChange(columns.map((c) => ({ ...c, numbers: [], numerone: null, bet: 2 })));
  };

  const handleRandomAll = () => {
    const next = columns.map((c) => {
      const pool = Array.from({ length: 20 }, (_, i) => i + 1);
      for (let i = 0; i < 10; i++) {
        const j = i + Math.floor(Math.random() * (20 - i));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return {
        ...c,
        numbers: pool.slice(0, 10).sort((a, b) => a - b),
        numerone: Math.floor(Math.random() * 20) + 1,
      };
    });
    onColumnsChange(next);
  };

  const isColumnComplete = (c: ColumnSelection) =>
    c.numbers.length === 10 && c.numerone !== null;
  const filledColumns = columns.filter(isColumnComplete);
  const totalCost = columns.reduce(
    (sum, col) => (isColumnComplete(col) ? sum + col.bet : sum),
    0,
  );

  return (
    <div className="flex flex-col items-center">
      {/* === TICKET CONTAINER === */}
      <div
        className="w-full overflow-hidden"
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          boxShadow:
            '0 12px 40px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.05)',
          border: '2px solid #007A3D',
          fontFamily: "'Arial', sans-serif",
        }}
      >
        {/* === GREEN HEADER WITH LOGO === */}
        <div
          style={{
            background: 'linear-gradient(180deg, #00A859 0%, #007A3D 60%, #005C2E 100%)',
            padding: '14px 16px 10px',
            position: 'relative',
            borderBottom: '3px solid #FFD600',
          }}
        >
          {/* "Gioco della Rendita" pill - top right */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '12px',
              background: '#fff',
              color: '#E30613',
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '12px',
              border: '1.5px solid #E30613',
              fontFamily: "'Arial Black', sans-serif",
              fontStyle: 'italic',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            ★ Gioco della Rendita
          </div>

          {/* === MAIN LOGO ROW === */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '14px',
              marginTop: '14px',
            }}
          >
            {/* Win for LIFE! logo */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Arial', sans-serif",
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontSize: 'clamp(20px, 3.5vw, 30px)',
                  color: '#fff',
                  lineHeight: 1,
                  textShadow: '1px 2px 0 #005C2E, 2px 3px 6px rgba(0,0,0,0.3)',
                  letterSpacing: '-0.5px',
                }}
              >
                Win
              </span>
              <span
                style={{
                  fontFamily: "'Arial', sans-serif",
                  fontWeight: 700,
                  fontStyle: 'italic',
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  color: '#fff',
                  lineHeight: 1,
                  textShadow: '1px 1px 0 #005C2E',
                }}
              >
                for
              </span>
              <span
                style={{
                  fontFamily: "'Arial Black', 'Arial', sans-serif",
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontSize: 'clamp(28px, 4.5vw, 40px)',
                  color: '#FFD600',
                  lineHeight: 1,
                  textShadow: '2px 3px 0 #C00018, 3px 4px 8px rgba(0,0,0,0.3)',
                  letterSpacing: '-1px',
                  position: 'relative',
                }}
              >
                LIFE
                <span
                  style={{
                    color: '#E30613',
                    fontFamily: "'Arial Black', sans-serif",
                    fontStyle: 'normal',
                  }}
                >
                  !
                </span>
              </span>
            </div>

            {/* CLASSICO badge */}
            <span
              style={{
                color: '#fff',
                fontFamily: "'Arial', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(11px, 1.4vw, 14px)',
                letterSpacing: '4px',
                paddingBottom: '4px',
                textShadow: '1px 1px 0 #005C2E',
              }}
            >
              CLASSICO
            </span>
          </div>

          {/* Prize claim */}
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <span
              style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 'clamp(10px, 1.3vw, 12px)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Vinci fino a
            </span>
            <span
              style={{
                background: '#FFD600',
                color: '#C00018',
                fontWeight: 900,
                fontFamily: "'Arial Black', sans-serif",
                fontSize: 'clamp(16px, 2.5vw, 22px)',
                padding: '2px 10px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              3.000 €
            </span>
            <span
              style={{
                color: '#fff',
                fontWeight: 800,
                fontSize: 'clamp(10px, 1.3vw, 13px)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              al mese per 20 anni
            </span>
          </div>

          <div
            style={{
              marginTop: '4px',
              color: '#FFD600',
              fontSize: '10px',
              fontWeight: 700,
              fontStyle: 'italic',
              opacity: 0.9,
            }}
          >
            (Questa è una DEMO didattica)
          </div>
        </div>

        {/* === TAB BAR === */}
        <div
          style={{
            background: '#005C2E',
            display: 'flex',
            padding: '0 12px',
            borderBottom: '2px solid #007A3D',
          }}
        >
          <div
            style={{
              padding: '8px 18px',
              background: '#fff',
              color: '#007A3D',
              fontWeight: 900,
              fontSize: '11px',
              letterSpacing: '0.5px',
              borderTopLeftRadius: '6px',
              borderTopRightRadius: '6px',
              marginTop: '4px',
            }}
          >
            SCHEDINA
          </div>
          <div
            style={{
              padding: '8px 18px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.5px',
              opacity: 0.55,
            }}
          >
            QUICK PICK
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              padding: '8px 12px',
              color: '#FFD600',
              fontWeight: 800,
              fontSize: '10px',
              letterSpacing: '0.3px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ⓘ Help
          </div>
        </div>

        {/* === GLOBAL ACTION BAR === */}
        <div
          style={{
            background: '#F1F8E9',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            borderBottom: '1px solid #C8E6C9',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#007A3D',
              letterSpacing: '0.3px',
            }}
          >
            {filledColumns.length}/{columns.length} COLONNE COMPILATE
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleRandomAll}
              disabled={disabled}
              style={{
                background: 'linear-gradient(180deg, #FFD600, #FFA000)',
                color: '#C00018',
                border: '1px solid #E65100',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: 900,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                textTransform: 'uppercase',
                fontFamily: "'Arial Black', sans-serif",
                letterSpacing: '0.3px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }}
            >
              ✦ Tutto Quick Pick
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

        {/* === COLUMNS GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3" style={{ background: '#F1F8E9' }}>
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

        {/* === BOTTOM FOOTER === */}
        <div
          style={{
            background: 'linear-gradient(180deg, #007A3D 0%, #005C2E 100%)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            borderTop: '2px solid #FFD600',
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
              ⏰ ESTRAZIONI OGNI ORA
            </div>
            <div>Concorso simulato · Versione DEMO</div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
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

      {/* === GIOCA BUTTON === */}
      <button
        onClick={onPlay}
        disabled={disabled || filledColumns.length === 0}
        className="mt-5 transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        style={{
          padding: '14px 48px',
          borderRadius: '12px',
          background:
            filledColumns.length > 0
              ? 'linear-gradient(180deg, #00C853 0%, #00A859 50%, #007A3D 100%)'
              : '#999',
          color: '#fff',
          border: filledColumns.length > 0 ? '2px solid #005C2E' : '2px solid #777',
          fontFamily: "'Arial Black', Impact, sans-serif",
          fontSize: '18px',
          fontWeight: 900,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          textShadow: '1px 2px 4px rgba(0,0,0,0.4)',
          boxShadow:
            filledColumns.length > 0
              ? '0 6px 20px rgba(0,122,61,0.5), inset 0 1px 0 rgba(255,255,255,0.4)'
              : 'none',
          cursor: disabled || filledColumns.length === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {disabled ? '⏳ Estrazione...' : '▶ GIOCA'}
      </button>
    </div>
  );
};

export default Schedina;
