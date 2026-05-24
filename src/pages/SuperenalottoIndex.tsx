import React, { useState, useCallback, useRef, lazy, Suspense } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import Schedina from '@/components/superenalotto/Schedina';
import Estrazione from '@/components/superenalotto/Estrazione';
import ProbabilitaPanel from '@/components/superenalotto/ProbabilitaPanel';
import { GlobalDisclaimerModal } from '@/components/shared/GlobalDisclaimerModal';
import { type GameRecord } from '@/components/superenalotto/StatisticheDashboard';

const FormuleCombinatorie = lazy(() => import('@/components/superenalotto/FormuleCombinatorie'));
const SimulazioneVeloce = lazy(() => import('@/components/superenalotto/SimulazioneVeloce'));
const StatisticheDashboard = lazy(() => import('@/components/superenalotto/StatisticheDashboard'));
import {
  type ColumnSelection,
  type ExtractionResult,
  generateExtraction,
  checkMatches,
  formatCurrency,
  AVERAGE_PRIZES,
} from '@/lib/superenalotto/superenalotto';

const PANEL_COUNT = 4;
const EMPTY_COL = (): ColumnSelection => ({ numbers: [], superstar: null as number | null });
const normalizeColumns = (cols: ColumnSelection[]): ColumnSelection[] => {
  const safe: ColumnSelection[] = cols.slice(0, PANEL_COUNT).map(c => ({
    numbers: (c.numbers || []).slice(0, 6),
    superstar: c.superstar ?? null,
  } as ColumnSelection));
  while (safe.length < PANEL_COUNT) safe.push(EMPTY_COL());
  return safe;
};

const SuperenalottoIndex: React.FC = () => {
  const [columns, setColumns] = useState<ColumnSelection[]>(() => normalizeColumns(Array.from({ length: PANEL_COUNT }, EMPTY_COL)));
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [matchedByColumn, setMatchedByColumn] = useState<number[][]>([]);
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [lastResults, setLastResults] = useState<string | null>(null);
  const gameIdRef = useRef(0);

  const handlePlay = useCallback(() => {
    const safeColumns = normalizeColumns(columns);
    const filledColumns = safeColumns.filter((c) => c.numbers.length === 6);
    if (filledColumns.length === 0) return;

    setIsAnimating(true);
    setRevealedCount(0);
    setMatchedByColumn([]);
    setLastResults(null);

    const ext = generateExtraction();
    setExtraction(ext);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
      if (count >= 8) {
        clearInterval(interval);
        setTimeout(() => {
          const results = safeColumns.map((col, idx) => {
            if (col.numbers.length !== 6) return { columnIndex: idx, matched: [], jollyMatch: false, superstarMatch: false, category: null, prize: 0 };
            return checkMatches(col, ext, idx);
          });

          const matched = safeColumns.map((col) => {
            if (col.numbers.length !== 6) return [];
            return col.numbers.filter((n) => ext.numbers.includes(n));
          });
          setMatchedByColumn(matched);

          const totalWon = results.reduce((sum, r) => sum + r.prize, 0);
          const cost = filledColumns.length;

          const winMessages = results
            .filter((r) => r.category)
            .map((r) => `Colonna ${r.columnIndex + 1}: ${r.category} (${formatCurrency(r.prize)})`);

          setLastResults(
            winMessages.length > 0
              ? `🎉 ${winMessages.join(' | ')}`
              : '😔 Nessuna vincita questa volta.'
          );

          gameIdRef.current++;
          setGameHistory((prev) => [
            ...prev,
            {
              id: gameIdRef.current,
              extraction: ext,
              results,
              totalWon,
              cost,
            },
          ]);

          setIsAnimating(false);
        }, 500);
      }
    }, 400);
  }, [columns]);

  return (
    <div className="theme-superenalotto min-h-screen">
      <main className="min-h-screen pb-12 relative overflow-hidden">
        <GlobalDisclaimerModal />
        {/* Background */}
        <div className="fixed inset-0 -z-10" style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(225 30% 15%) 0%, hsl(225 25% 8%) 70%)',
        }} />
        <div className="fixed inset-0 -z-10 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, hsl(45 100% 51% / 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(145 60% 42% / 0.06) 0%, transparent 50%)',
        }} />

        {/* Header */}
        <header className="text-center pt-8 pb-6 px-4 relative">
          <Link
            to="/"
            className="absolute left-4 top-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary" style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}>
            SIMULATORE
            <span className="block text-lg sm:text-2xl font-medium tracking-widest text-foreground/60 mt-1">
              SUPERENALOTTO
            </span>
          </h1>
          <p className="text-sm mt-3 text-muted-foreground max-w-md mx-auto">
            Strumento didattico per lo studio della probabilità
          </p>
        </header>

        <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-6">
          {/* Schedina */}
          <Schedina
            columns={columns}
            onColumnsChange={(next) => setColumns(normalizeColumns(next))}
            onPlay={handlePlay}
            matchedByColumn={matchedByColumn}
            disabled={isAnimating}
          />

          {/* Extraction display */}
          {extraction && (
            <div className="glass-card glow-gold p-5">
              <Estrazione
                extraction={extraction}
                isAnimating={isAnimating}
                revealedCount={revealedCount}
              />
              {lastResults && (
                <div className="mt-4 space-y-3">
                  <div
                    role="status"
                    aria-live="polite"
                    className="text-center text-sm font-semibold p-3 rounded-xl"
                    style={{
                      background: lastResults.includes('🎉')
                        ? 'hsl(145 60% 42% / 0.15)'
                        : 'hsl(45 100% 51% / 0.12)',
                      color: lastResults.includes('🎉')
                        ? 'hsl(145 60% 65%)'
                        : 'hsl(45 80% 65%)',
                      border: `1px solid ${lastResults.includes('🎉') ? 'hsl(145 60% 42% / 0.3)' : 'hsl(45 100% 51% / 0.2)'}`,
                    }}
                  >
                    {lastResults}
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setExtraction(null);
                        setMatchedByColumn([]);
                        setLastResults(null);
                        setRevealedCount(0);
                      }}
                      className="text-xs px-4 py-2 rounded-lg font-semibold bg-secondary/60 border border-border text-foreground hover:bg-secondary transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Nuova Partita
                    </button>
                    <button
                      onClick={() => {
                        const numbersText = columns
                          .map((c, i) => c.numbers.length === 6 ? `Col ${i + 1}: ${c.numbers.join(', ')}${c.superstar ? ` ★${c.superstar}` : ''}` : null)
                          .filter(Boolean)
                          .join('\n');
                        const extText = extraction ? `Estrazione: ${extraction.numbers.join(', ')} | Jolly: ${extraction.jolly} | SuperStar: ${extraction.superstar}` : '';
                        const text = `🎰 SuperEnalotto Simulator\n${numbersText}\n${extText}\n${lastResults}`;
                        navigator.clipboard.writeText(text).then(() => {
                          toast({ title: '📋 Copiato!', description: 'Risultato copiato negli appunti.' });
                        }).catch(() => {
                          toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile copiare.' });
                        });
                      }}
                      className="text-xs px-4 py-2 rounded-lg font-semibold bg-secondary/60 border border-border text-foreground hover:bg-secondary transition-all flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Condividi
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section Buttons */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: '📊', label: 'Probabilità', content: <ProbabilitaPanel /> },
              { icon: '📐', label: 'Formule', content: <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Caricamento…</div>}><FormuleCombinatorie /></Suspense> },
              { icon: '⚡', label: 'Simulazione', content: <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Caricamento…</div>}><SimulazioneVeloce columns={columns} /></Suspense> },
              { icon: '📈', label: 'Statistiche', content: <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Caricamento…</div>}><StatisticheDashboard history={gameHistory} /></Suspense> },
            ].map((item) => (
              <Dialog key={item.label}>
                <DialogTrigger asChild>
                  <button className="text-xs sm:text-sm py-2.5 px-3 rounded-xl font-medium bg-secondary/50 backdrop-blur-sm border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all flex items-center justify-center gap-1.5">
                    {item.icon} {item.label}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0">
                  <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-lg font-bold">
                      {item.icon} {item.label}
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="px-6 pb-6 max-h-[75vh]">
                    {item.content}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-6 text-xs text-muted-foreground/50 space-y-1">
          <p>Simulatore a scopo didattico · Non è un sito di gioco d'azzardo</p>
          <p>
            ⚠️ Il gioco d'azzardo può creare dipendenza · Telefono Verde:{' '}
            <a href="tel:800558822" className="underline hover:text-muted-foreground">800 558 822</a>
          </p>
          <button
            onClick={() => { localStorage.removeItem('global-disclaimer-accepted'); window.location.reload(); }}
            className="underline hover:text-muted-foreground"
          >
            Rileggi il disclaimer
          </button>
        </footer>
      </main>
    </div>
  );
};

export default SuperenalottoIndex;
