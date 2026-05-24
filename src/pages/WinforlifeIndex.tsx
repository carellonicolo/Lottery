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

import Schedina from '@/components/winforlife/Schedina';
import Estrazione from '@/components/winforlife/Estrazione';
import ProbabilitaPanel from '@/components/winforlife/ProbabilitaPanel';
import { GlobalDisclaimerModal } from '@/components/shared/GlobalDisclaimerModal';

import {
  type ColumnSelection,
  type ExtractionResult,
  generateExtraction,
  checkMatches,
} from '@/lib/winforlife/winforlife';
import { formatCurrency } from '@/lib/shared/math';
import type { GameRecord } from '@/components/winforlife/StatisticheDashboard';

const FormuleCombinatorie = lazy(() => import('@/components/winforlife/FormuleCombinatorie'));
const SimulazioneVeloce = lazy(() => import('@/components/winforlife/SimulazioneVeloce'));
const StatisticheDashboard = lazy(() => import('@/components/winforlife/StatisticheDashboard'));
const RegoleModal = lazy(() => import('@/components/winforlife/RegoleModal'));

const PANEL_COUNT = 2;
const EMPTY_COL = (): ColumnSelection => ({ numbers: [], numerone: null, bet: 2 });

const normalizeColumns = (cols: ColumnSelection[]): ColumnSelection[] => {
  const safe: ColumnSelection[] = cols.slice(0, PANEL_COUNT).map(c => ({
    numbers: (c.numbers || []).slice(0, 10),
    numerone: c.numerone ?? null,
    bet: c.bet || 2,
  }));
  while (safe.length < PANEL_COUNT) safe.push(EMPTY_COL());
  return safe;
};

const WinforlifeIndex: React.FC = () => {
  const [columns, setColumns] = useState<ColumnSelection[]>(() => normalizeColumns(Array.from({ length: PANEL_COUNT }, EMPTY_COL)));
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [numeroneRevealed, setNumeroneRevealed] = useState(false);
  
  const [matchedByColumn, setMatchedByColumn] = useState<{ matchedNumbers: number[], numeroneMatch: boolean }[]>([]);
  
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [lastResults, setLastResults] = useState<string | null>(null);
  const gameIdRef = useRef(0);

  const handlePlay = useCallback(() => {
    const safeColumns = normalizeColumns(columns);
    const filledColumns = safeColumns.filter((c) => c.numbers.length === 10 && c.numerone !== null);
    if (filledColumns.length === 0) return;

    setIsAnimating(true);
    setRevealedCount(0);
    setNumeroneRevealed(false);
    setMatchedByColumn([]);
    setLastResults(null);

    const ext = generateExtraction();
    setExtraction(ext);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
      
      if (count >= 10) {
        clearInterval(interval);
        
        // Suspense per il Numerone
        setTimeout(() => {
          setNumeroneRevealed(true);
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
          
          setTimeout(() => {
            const results = safeColumns.map((col, idx) => {
              if (col.numbers.length !== 10 || col.numerone === null) {
                return { columnIndex: idx, matchedNumbers: [], numeroneMatch: false, category: null, prize: 0 };
              }
              return checkMatches(col, ext, idx);
            });

            setMatchedByColumn(results.map(r => ({ matchedNumbers: r.matchedNumbers, numeroneMatch: r.numeroneMatch })));

            const totalWon = results.reduce((sum, r) => sum + r.prize, 0);
            const cost = filledColumns.reduce((sum, col) => sum + col.bet, 0);

            const winMessages = results
              .filter((r) => r.prize > 0)
              .map((r) => `Colonna ${r.columnIndex + 1}: Punteggio ${r.category} (${formatCurrency(r.prize)})`);

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
          }, 600);
        }, 1000);
      }
    }, 250); // Faster animation for 10 numbers
  }, [columns]);

  return (
    <div className="theme-winforlife min-h-screen">
      <main className="min-h-screen pb-12 relative overflow-hidden">
        <GlobalDisclaimerModal />
        {/* Background */}
        <div className="fixed inset-0 -z-10" style={{
          background: 'radial-gradient(circle at 50% -20%, hsl(140 70% 18%) 0%, hsl(140 70% 6%) 100%)',
        }} />
        <div className="fixed inset-0 -z-10 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, hsl(350 80% 50% / 0.15) 0%, transparent 40%), radial-gradient(circle at 20% 80%, hsl(140 70% 40% / 0.1) 0%, transparent 40%)',
        }} />

        {/* Header */}
        <header className="text-center pt-8 pb-6 px-4 relative">
          <Link
            to="/"
            className="absolute left-4 top-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="absolute right-4 top-8">
            <Suspense fallback={null}>
               <RegoleModal />
            </Suspense>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white italic" style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            Win for Life
            <span className="block text-xl sm:text-3xl text-primary font-bold not-italic tracking-widest mt-1">
              CLASSICO
            </span>
          </h1>
          <p className="text-sm mt-3 text-muted-foreground max-w-md mx-auto font-medium">
            Sperimenta la simmetria perfetta della distribuzione normale
          </p>
        </header>

        <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-6">
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
            <div className="glass-card p-5 sm:p-8 bg-card/80 backdrop-blur-xl border-primary/20">
              <Estrazione
                extraction={extraction}
                isAnimating={isAnimating}
                revealedCount={revealedCount}
                numeroneRevealed={numeroneRevealed}
              />
              {lastResults && !isAnimating && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div
                    role="status"
                    aria-live="polite"
                    className="text-center text-sm font-bold p-4 rounded-xl shadow-lg border"
                    style={{
                      background: lastResults.includes('🎉')
                        ? 'linear-gradient(135deg, hsl(140 70% 40% / 0.2), hsl(140 70% 40% / 0.05))'
                        : 'hsl(140 50% 14% / 0.8)',
                      color: lastResults.includes('🎉')
                        ? 'hsl(140 70% 50%)'
                        : 'hsl(140 20% 65%)',
                      borderColor: lastResults.includes('🎉') ? 'hsl(140 70% 40% / 0.5)' : 'hsl(140 50% 25%)',
                    }}
                  >
                    {lastResults}
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setExtraction(null);
                        setMatchedByColumn([]);
                        setLastResults(null);
                        setRevealedCount(0);
                        setNumeroneRevealed(false);
                      }}
                      className="text-xs px-5 py-2.5 rounded-xl font-bold bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" /> Nuova Partita
                    </button>
                    <button
                      onClick={() => {
                        const numbersText = columns
                          .map((c, i) => c.numbers.length === 10 ? `Col ${i + 1} (${c.bet}€): ${c.numbers.join(', ')} | Num: ${c.numerone}` : null)
                          .filter(Boolean)
                          .join('\n');
                        const extText = extraction ? `Numeri Vincenti: ${extraction.numbers.join(', ')}\nNumerone: ${extraction.numerone}` : '';
                        const text = `W Win for Life Simulator\n\n${numbersText}\n\n${extText}\n\n${lastResults}`;
                        navigator.clipboard.writeText(text).then(() => {
                          toast({ title: '📋 Copiato!', description: 'Risultato copiato negli appunti.' });
                        }).catch(() => {
                          toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile copiare.' });
                        });
                      }}
                      className="text-xs px-5 py-2.5 rounded-xl font-bold bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Share2 className="w-4 h-4" /> Condividi
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section Buttons */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '📊', label: 'Probabilità', content: <ProbabilitaPanel /> },
              { icon: '📐', label: 'Formule', content: <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Caricamento…</div>}><FormuleCombinatorie /></Suspense> },
              { icon: '⚡', label: 'Simulazione', content: <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Caricamento…</div>}><SimulazioneVeloce columns={columns} /></Suspense> },
              { icon: '📈', label: 'Statistiche', content: <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Caricamento…</div>}><StatisticheDashboard history={gameHistory} /></Suspense> },
            ].map((item) => (
              <Dialog key={item.label}>
                <DialogTrigger asChild>
                  <button className="text-xs sm:text-sm py-3 px-4 rounded-xl font-bold bg-secondary/80 backdrop-blur-md border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2">
                    <span className="text-base">{item.icon}</span> {item.label}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 border-border bg-background">
                  <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-secondary/30">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span> {item.label}
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="px-6 py-6 max-h-[calc(90vh-80px)]">
                    {item.content}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-6 text-xs text-muted-foreground/60 space-y-1.5">
          <p>Simulatore a scopo didattico · Non è un sito di gioco d'azzardo</p>
          <p>
            ⚠️ Il gioco d'azzardo può creare dipendenza · Telefono Verde:{' '}
            <a href="tel:800558822" className="underline hover:text-primary transition-colors">800 558 822</a>
          </p>
          <button
            onClick={() => { localStorage.removeItem('global-disclaimer-accepted'); window.location.reload(); }}
            className="underline hover:text-primary transition-colors pt-2"
          >
            Rileggi il disclaimer
          </button>
        </footer>
      </main>
    </div>
  );
};

export default WinforlifeIndex;
