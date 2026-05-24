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

import Schedina from '@/components/millionday/Schedina';
import Estrazione from '@/components/millionday/Estrazione';
import ProbabilitaPanel from '@/components/millionday/ProbabilitaPanel';
import { GlobalDisclaimerModal } from '@/components/shared/GlobalDisclaimerModal';

import {
  type ColumnSelection,
  type ExtractionResult,
  generateExtraction,
  checkMatches,
  formatCurrency,
} from '@/lib/millionday/millionday';
import type { GameRecord } from '@/components/millionday/StatisticheDashboard';

const FormuleCombinatorie = lazy(() => import('@/components/millionday/FormuleCombinatorie'));
const SimulazioneVeloce = lazy(() => import('@/components/millionday/SimulazioneVeloce'));
const StatisticheDashboard = lazy(() => import('@/components/millionday/StatisticheDashboard'));
const RegoleModal = lazy(() => import('@/components/millionday/RegoleModal'));

const PANEL_COUNT = 4;
const EMPTY_COL = (): ColumnSelection => ({ numbers: [], isExtra: false });

const normalizeColumns = (cols: ColumnSelection[]): ColumnSelection[] => {
  const safe: ColumnSelection[] = cols.slice(0, PANEL_COUNT).map(c => ({
    numbers: (c.numbers || []).slice(0, 5),
    isExtra: c.isExtra || false,
  }));
  while (safe.length < PANEL_COUNT) safe.push(EMPTY_COL());
  return safe;
};

const MilliondayIndex: React.FC = () => {
  const [columns, setColumns] = useState<ColumnSelection[]>(() => normalizeColumns(Array.from({ length: PANEL_COUNT }, EMPTY_COL)));
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedBaseCount, setRevealedBaseCount] = useState(0);
  const [revealedExtraCount, setRevealedExtraCount] = useState(0);
  
  const [matchedByColumnBase, setMatchedByColumnBase] = useState<number[][]>([]);
  const [matchedByColumnExtra, setMatchedByColumnExtra] = useState<number[][]>([]);
  
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [lastResults, setLastResults] = useState<string | null>(null);
  const gameIdRef = useRef(0);

  const handlePlay = useCallback(() => {
    const safeColumns = normalizeColumns(columns);
    const filledColumns = safeColumns.filter((c) => c.numbers.length === 5);
    if (filledColumns.length === 0) return;

    setIsAnimating(true);
    setRevealedBaseCount(0);
    setRevealedExtraCount(0);
    setMatchedByColumnBase([]);
    setMatchedByColumnExtra([]);
    setLastResults(null);

    const ext = generateExtraction();
    setExtraction(ext);

    let baseCount = 0;
    const baseInterval = setInterval(() => {
      baseCount++;
      setRevealedBaseCount(baseCount);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
      
      if (baseCount >= 5) {
        clearInterval(baseInterval);
        
        let extraCount = 0;
        const extraInterval = setInterval(() => {
          extraCount++;
          setRevealedExtraCount(extraCount);
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
          
          if (extraCount >= 5) {
            clearInterval(extraInterval);
            
            setTimeout(() => {
              const results = safeColumns.map((col, idx) => {
                if (col.numbers.length !== 5) {
                  return { columnIndex: idx, matchedBase: [], matchedExtra: [], categoryBase: null, categoryExtra: null, prizeBase: 0, prizeExtra: 0, totalPrize: 0 };
                }
                return checkMatches(col, ext, idx);
              });

              setMatchedByColumnBase(results.map(r => r.matchedBase));
              setMatchedByColumnExtra(results.map(r => r.matchedExtra));

              const totalWon = results.reduce((sum, r) => sum + r.totalPrize, 0);
              const cost = filledColumns.reduce((sum, col) => sum + 1 + (col.isExtra ? 1 : 0), 0);

              const winMessages = results
                .filter((r) => r.totalPrize > 0)
                .map((r) => {
                  let msg = `Colonna ${r.columnIndex + 1}:`;
                  if (r.categoryBase) msg += ` Base ${r.categoryBase} (${formatCurrency(r.prizeBase)})`;
                  if (r.categoryExtra) msg += ` Extra ${r.categoryExtra} (${formatCurrency(r.prizeExtra)})`;
                  return msg;
                });

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
        }, 400); // Extra numbers animation interval
      }
    }, 400); // Base numbers animation interval
  }, [columns]);

  return (
    <div className="theme-millionday min-h-screen">
      <main className="min-h-screen pb-12 relative overflow-hidden">
        <GlobalDisclaimerModal />
        {/* Background */}
        <div className="fixed inset-0 -z-10" style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(225 50% 18%) 0%, hsl(225 60% 8%) 70%)',
        }} />
        <div className="fixed inset-0 -z-10 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, hsl(45 100% 51% / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(210 100% 50% / 0.1) 0%, transparent 50%)',
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
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary" style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}>
            SIMULATORE
            <span className="block text-lg sm:text-2xl font-medium tracking-widest text-foreground mt-1">
              MILLION<span className="text-primary">DAY</span>
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
            matchedByColumnBase={matchedByColumnBase}
            matchedByColumnExtra={matchedByColumnExtra}
            disabled={isAnimating}
          />

          {/* Extraction display */}
          {extraction && (
            <div className="glass-card glow-gold p-5 bg-card/60 backdrop-blur-xl">
              <Estrazione
                extraction={extraction}
                isAnimating={isAnimating}
                revealedBaseCount={revealedBaseCount}
                revealedExtraCount={revealedExtraCount}
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
                        : 'hsl(225 40% 20% / 0.5)',
                      color: lastResults.includes('🎉')
                        ? 'hsl(45 100% 65%)'
                        : 'hsl(215 20% 65%)',
                      border: `1px solid ${lastResults.includes('🎉') ? 'hsl(45 100% 51% / 0.3)' : 'hsl(225 40% 30% / 0.5)'}`,
                    }}
                  >
                    {lastResults}
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setExtraction(null);
                        setMatchedByColumnBase([]);
                        setMatchedByColumnExtra([]);
                        setLastResults(null);
                        setRevealedBaseCount(0);
                        setRevealedExtraCount(0);
                      }}
                      className="text-xs px-5 py-2.5 rounded-xl font-bold bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" /> Nuova Partita
                    </button>
                    <button
                      onClick={() => {
                        const numbersText = columns
                          .map((c, i) => c.numbers.length === 5 ? `Col ${i + 1}: ${c.numbers.join(', ')}${c.isExtra ? ' (+Extra)' : ''}` : null)
                          .filter(Boolean)
                          .join('\n');
                        const extText = extraction ? `Estrazione Base: ${extraction.baseNumbers.join(', ')}\nEstrazione Extra: ${extraction.extraNumbers.join(', ')}` : '';
                        const text = `⭐ MillionDAY Simulator\n\n${numbersText}\n\n${extText}\n\n${lastResults}`;
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

export default MilliondayIndex;
