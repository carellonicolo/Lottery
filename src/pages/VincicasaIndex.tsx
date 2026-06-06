import React, { useState, useCallback, useRef } from 'react';
import { useExtractionAnimation } from '@/hooks/use-extraction-animation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, ArrowLeft, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import Schedina from '@/components/vincicasa/Schedina';
import Estrazione from '@/components/vincicasa/Estrazione';
import ProbabilitaPanel from '@/components/vincicasa/ProbabilitaPanel';
import RegoleModal from '@/components/vincicasa/RegoleModal';
import { GlobalDisclaimerModal } from '@/components/shared/GlobalDisclaimerModal';
import { LegalFooter } from '@/components/shared/LegalFooter';

import {
  type ColumnSelection,
  type ExtractionResult,
  type MatchResult,
  generateExtraction,
  checkMatches,
  formatCurrency,
  NUMBERS_TO_PICK,
  NUMBERS_DRAWN,
  TICKET_COST,
} from '@/lib/vincicasa/vincicasa';

const PANEL_COUNT = 4;
const EMPTY_COL = (): ColumnSelection => ({ numbers: [] });

const normalizeColumns = (cols: ColumnSelection[]): ColumnSelection[] => {
  const safe: ColumnSelection[] = cols.slice(0, PANEL_COUNT).map((c) => ({
    numbers: (c.numbers || []).slice(0, NUMBERS_TO_PICK),
  }));
  while (safe.length < PANEL_COUNT) safe.push(EMPTY_COL());
  return safe;
};

interface GameRecord {
  id: number;
  extraction: ExtractionResult;
  results: MatchResult[];
  totalWon: number;
  cost: number;
}

const VincicasaIndex: React.FC = () => {
  const [columns, setColumns] = useState<ColumnSelection[]>(() =>
    normalizeColumns(Array.from({ length: PANEL_COUNT }, EMPTY_COL)),
  );
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [matchedByColumn, setMatchedByColumn] = useState<number[][]>([]);
  const [lastResults, setLastResults] = useState<string | null>(null);
  const [houseWon, setHouseWon] = useState(false);
  const [, setGameHistory] = useState<GameRecord[]>([]);
  const gameIdRef = useRef(0);

  const { isAnimating, revealedCount, run: runAnimation } = useExtractionAnimation();

  const handlePlay = useCallback(() => {
    if (isAnimating) return;
    const safe = normalizeColumns(columns);
    const filled = safe.filter((c) => c.numbers.length === NUMBERS_TO_PICK);
    if (filled.length === 0) return;

    setMatchedByColumn([]);
    setLastResults(null);
    setHouseWon(false);
    const ext = generateExtraction();
    setExtraction(ext);

    runAnimation({
      totalSteps: NUMBERS_DRAWN,
      intervalMs: 400,
      finalDelayMs: 500,
      onComplete: () => {
        const results: MatchResult[] = safe.map((col, idx) =>
          col.numbers.length !== NUMBERS_TO_PICK
            ? { columnIndex: idx, matchedNumbers: [], category: null, prize: 0, isHouseWin: false }
            : checkMatches(col, ext, idx),
        );

        setMatchedByColumn(results.map((r) => r.matchedNumbers));

        const totalWon = results.reduce((sum, r) => sum + r.prize, 0);
        const cost = filled.length * TICKET_COST;
        const won5 = results.some((r) => r.isHouseWin);
        setHouseWon(won5);

        const winMsgs = results
          .filter((r) => r.prize > 0)
          .map((r) => {
            if (r.isHouseWin) return `Pannello ${r.columnIndex + 1}: 🏠 CASA + €200.000!`;
            return `Pannello ${r.columnIndex + 1}: Punti ${r.category} (${formatCurrency(r.prize)})`;
          });

        setLastResults(
          won5
            ? `🏠🎉 HAI VINTO LA CASA! ${winMsgs.join(' | ')}`
            : winMsgs.length > 0
              ? `🎉 ${winMsgs.join(' | ')} · Vincita: ${formatCurrency(totalWon)}`
              : '😔 Nessuna vincita questa volta.',
        );

        gameIdRef.current++;
        setGameHistory((prev) => [
          ...prev,
          { id: gameIdRef.current, extraction: ext, results, totalWon, cost },
        ]);
      },
    });
  }, [columns, isAnimating, runAnimation]);

  return (
    <div className="theme-vincicasa min-h-screen">
      <main className="min-h-screen pb-12 relative overflow-hidden">
        <GlobalDisclaimerModal />
        <div className="fixed inset-0 -z-10"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, hsl(190 60% 14%) 0%, hsl(190 50% 7%) 70%)',
          }}
        />
        <div className="fixed inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, hsl(45 100% 51% / 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(187 100% 42% / 0.18) 0%, transparent 50%)',
          }}
        />

        <header className="text-center pt-8 pb-6 px-4 relative">
          <Link
            to="/"
            className="absolute left-4 top-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="absolute right-4 top-8">
            <RegoleModal />
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              color: '#FFD600',
            }}
          >
            SIMULATORE
            <span className="block text-lg sm:text-2xl font-medium tracking-widest mt-1 flex items-center justify-center gap-2" style={{ color: '#fff' }}>
              <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" /> VINCI <span style={{ color: '#FFD600' }}>CASA</span>
            </span>
          </h1>
          <p className="text-sm mt-3 text-muted-foreground max-w-md mx-auto">
            Strumento didattico per studiare la probabilità di una lotteria a 40 numeri.
          </p>
        </header>

        <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-6">
          <Schedina
            columns={columns}
            onColumnsChange={(next) => setColumns(normalizeColumns(next))}
            onPlay={handlePlay}
            matchedByColumn={matchedByColumn}
            disabled={isAnimating}
          />

          {extraction && (
            <div className="rounded-2xl p-5 backdrop-blur-xl"
              style={{
                background: 'hsl(190 30% 14% / 0.6)',
                border: '1px solid hsl(190 30% 24% / 0.5)',
              }}
            >
              <Estrazione
                extraction={extraction}
                isAnimating={isAnimating}
                revealedCount={revealedCount}
              />
              {lastResults && !isAnimating && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div
                    role="status"
                    aria-live="polite"
                    className="text-center text-sm font-bold p-4 rounded-xl shadow-lg"
                    style={{
                      background: houseWon
                        ? 'linear-gradient(135deg, hsl(45 100% 51% / 0.25), hsl(15 90% 55% / 0.15))'
                        : lastResults.includes('🎉')
                          ? 'linear-gradient(135deg, hsl(45 100% 51% / 0.15), hsl(45 100% 51% / 0.05))'
                          : 'hsl(190 30% 20% / 0.5)',
                      color: houseWon
                        ? '#FFE082'
                        : lastResults.includes('🎉')
                          ? 'hsl(45 100% 65%)'
                          : 'hsl(190 20% 75%)',
                      border: `1px solid ${
                        houseWon
                          ? 'hsl(45 100% 51% / 0.5)'
                          : lastResults.includes('🎉')
                            ? 'hsl(45 100% 51% / 0.3)'
                            : 'hsl(190 30% 30% / 0.5)'
                      }`,
                    }}
                  >
                    {lastResults}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setExtraction(null);
                        setMatchedByColumn([]);
                        setLastResults(null);
                        setRevealedCount(0);
                        setHouseWon(false);
                      }}
                      className="text-xs px-5 py-2.5 rounded-xl font-bold bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" /> Nuova Partita
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-xs sm:text-sm py-3 px-4 rounded-xl font-bold bg-secondary/80 backdrop-blur-md border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
                  📊 Probabilità
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] p-0 border-border bg-background">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-secondary/30">
                  <DialogTitle className="text-xl font-bold">📊 Probabilità di vincita</DialogTitle>
                </DialogHeader>
                <ScrollArea className="px-6 py-6 max-h-[calc(90vh-80px)]">
                  <ProbabilitaPanel />
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-xs sm:text-sm py-3 px-4 rounded-xl font-bold bg-secondary/80 backdrop-blur-md border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
                  📜 Come si gioca
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] p-0 border-border bg-background">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-secondary/30">
                  <DialogTitle className="text-xl font-bold">📜 Regole del gioco</DialogTitle>
                </DialogHeader>
                <ScrollArea className="px-6 py-6 max-h-[calc(90vh-80px)] text-sm leading-relaxed space-y-3">
                  <p>
                    Scegli <strong>5 numeri</strong> da 1 a 40 per ogni pannello (costo €2).
                    L'estrazione sorteggia <strong>5 numeri</strong>. Vinci se ne indovini almeno 2.
                  </p>
                  <p>
                    <strong>Categorie</strong>: Punti 5 → casa €200.000 + €200.000 contanti.
                    Punti 4 → €200. Punti 3 → €20. Punti 2 → €2,60.
                  </p>
                  <p>
                    Estrazione: tutti i giorni alle <strong>20:00</strong>.
                  </p>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <LegalFooter gameName="VinciCasa" rightsHolder="Sisal S.p.A." variant="dark" />
      </main>
    </div>
  );
};

export default VincicasaIndex;
