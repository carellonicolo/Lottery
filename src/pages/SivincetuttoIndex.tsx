import React, { useState, useCallback, useRef, Suspense } from 'react';
import { useExtractionAnimation } from '@/hooks/use-extraction-animation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import Schedina from '@/components/sivincetutto/Schedina';
import Estrazione from '@/components/sivincetutto/Estrazione';
import ProbabilitaPanel from '@/components/sivincetutto/ProbabilitaPanel';
import RegoleModal from '@/components/sivincetutto/RegoleModal';
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
} from '@/lib/sivincetutto/sivincetutto';

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

const SivincetuttoIndex: React.FC = () => {
  const [columns, setColumns] = useState<ColumnSelection[]>(() =>
    normalizeColumns(Array.from({ length: PANEL_COUNT }, EMPTY_COL)),
  );
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [matchedByColumn, setMatchedByColumn] = useState<number[][]>([]);
  const [lastResults, setLastResults] = useState<string | null>(null);
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
    const ext = generateExtraction();
    setExtraction(ext);

    runAnimation({
      totalSteps: NUMBERS_DRAWN,
      intervalMs: 400,
      finalDelayMs: 500,
      onComplete: () => {
        const results: MatchResult[] = safe.map((col, idx) =>
          col.numbers.length !== NUMBERS_TO_PICK
            ? { columnIndex: idx, matchedNumbers: [], category: null, prize: 0 }
            : checkMatches(col, ext, idx),
        );

        setMatchedByColumn(results.map((r) => r.matchedNumbers));

        const totalWon = results.reduce((sum, r) => sum + r.prize, 0);
        const cost = filled.length * TICKET_COST;

        const winMsgs = results
          .filter((r) => r.prize > 0)
          .map((r) => `Colonna ${r.columnIndex + 1}: Punti ${r.category} (${formatCurrency(r.prize)})`);

        setLastResults(
          winMsgs.length > 0
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
    <div className="theme-sivincetutto min-h-screen">
      <main className="min-h-screen pb-12 relative overflow-hidden">
        <GlobalDisclaimerModal />
        <div className="fixed inset-0 -z-10"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, hsl(20 60% 14%) 0%, hsl(20 50% 8%) 70%)',
          }}
        />
        <div className="fixed inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, hsl(45 100% 51% / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(15 90% 55% / 0.15) 0%, transparent 50%)',
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
            <span className="block text-lg sm:text-2xl font-medium tracking-widest mt-1" style={{ color: '#fff' }}>
              SI VINCE <span style={{ color: '#FFD600' }}>TUTTO</span>
            </span>
          </h1>
          <p className="text-sm mt-3 text-muted-foreground max-w-md mx-auto">
            Strumento didattico per lo studio della probabilità ipergeometrica.
          </p>
        </header>

        <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-6">
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
                background: 'hsl(20 30% 14% / 0.6)',
                border: '1px solid hsl(20 30% 24% / 0.5)',
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
                      background: lastResults.includes('🎉')
                        ? 'linear-gradient(135deg, hsl(45 100% 51% / 0.15), hsl(45 100% 51% / 0.05))'
                        : 'hsl(20 30% 20% / 0.5)',
                      color: lastResults.includes('🎉') ? 'hsl(45 100% 65%)' : 'hsl(15 20% 75%)',
                      border: `1px solid ${
                        lastResults.includes('🎉')
                          ? 'hsl(45 100% 51% / 0.3)'
                          : 'hsl(20 30% 30% / 0.5)'
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
                  <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Caricamento…</div>}>
                    <ProbabilitaPanel />
                  </Suspense>
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
                    Scegli <strong>12 numeri</strong> da 1 a 90 per ogni colonna (costo €5).
                    L'estrazione settimanale sorteggia <strong>6 numeri</strong>; vinci se ne indovini almeno 2.
                  </p>
                  <p>
                    Categorie di vincita: Punti 6 (jackpot), Punti 5, Punti 4, Punti 3 e Punti 2.
                    Il 100% del montepremi viene sempre distribuito. Se nessuno fa Punti 6, l'importo
                    viene ripartito tra le categorie inferiori.
                  </p>
                  <p>
                    Estrazione: ogni <strong>mercoledì alle 20:00</strong>.
                  </p>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <LegalFooter gameName="SiVinceTutto" rightsHolder="Sisal S.p.A." variant="dark" />
      </main>
    </div>
  );
};

export default SivincetuttoIndex;
