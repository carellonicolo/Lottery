import { useEffect, useRef, lazy, Suspense } from 'react';
import confetti from 'canvas-confetti';
import { useLotto } from '@/hooks/use-lotto';
import lottoLogo from '@/assets/lotto-logo.png';
import wallpaperBg from '@/assets/wallpaper-bg.jpg';
import { GrigliaNumeri } from '@/components/lotto/GrigliaNumeri';
import { SelettoreRuote } from '@/components/lotto/SelettoreRuote';
import { SelettoreSorteImporti } from '@/components/lotto/SelettoreSorteImporti';
import { TabellaEstrazione } from '@/components/lotto/TabellaEstrazione';
import { RegoleLottoModal } from '@/components/lotto/RegoleLottoModal';
import { GlobalDisclaimerModal } from '@/components/shared/GlobalDisclaimerModal';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Landmark, Bot, Shuffle, Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PannelloProbabilita = lazy(() => import('@/components/lotto/PannelloProbabilita').then(m => ({ default: m.PannelloProbabilita })));
const StoricoGiocate = lazy(() => import('@/components/lotto/StoricoGiocate').then(m => ({ default: m.StoricoGiocate })));
const GraficiStatistiche = lazy(() => import('@/components/lotto/GraficiStatistiche').then(m => ({ default: m.GraficiStatistiche })));
const SezioneDidattica = lazy(() => import('@/components/lotto/SezioneDidattica').then(m => ({ default: m.SezioneDidattica })));

const Index = () => {
  const lotto = useLotto();
  const prevVintoRef = useRef<number | null>(null);

  const tuttiIndovinati = lotto.risultatoCorrente
    ? [...new Set(lotto.risultatoCorrente.vincite.flatMap(v => v.numeriIndovinati))]
    : [];

  // Confetti on win
  useEffect(() => {
    if (lotto.risultatoCorrente && lotto.risultatoCorrente.totaleVinto > 0 && prevVintoRef.current !== lotto.risultatoCorrente.totaleVinto) {
      prevVintoRef.current = lotto.risultatoCorrente.totaleVinto;
      const intensity = Math.min(lotto.risultatoCorrente.totaleVinto / 100, 1);
      confetti({
        particleCount: Math.floor(80 + intensity * 200),
        spread: 70 + intensity * 50,
        origin: { y: 0.6 },
        colors: ['#e8732a', '#d4a017', '#2d8a4e', '#c0392b', '#2c6fbb'],
      });
    }
  }, [lotto.risultatoCorrente]);

  return (
    <main className="min-h-screen bg-background py-3 sm:py-6" style={{ backgroundImage: `url(${wallpaperBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <GlobalDisclaimerModal />
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <div className="relative flex items-center justify-center gap-3 mb-4 sm:mb-6">
          <Link
            to="/"
            className="absolute left-0 flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors drop-shadow-[0_1px_4px_hsl(0_0%_0%/0.5)]"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="text-center text-xl sm:text-2xl font-bold uppercase tracking-widest text-white drop-shadow-[0_2px_8px_hsl(0_0%_0%/0.4)]">
            🎱 Simulatore del Gioco del Lotto
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 sm:gap-6">

          {/* ===== SCHEDINA ===== */}
          <div className="schedina-card overflow-hidden w-full max-w-[400px] mx-auto lg:mx-0">
            {/* Header */}
            <div className="schedina-header p-0 flex items-center justify-center overflow-hidden h-[72px] sm:h-[88px]">
              <img src={lottoLogo} alt="Il Gioco del Lotto" className="w-[130%] h-auto object-cover" />
            </div>

            {/* I TUOI NUMERI + RUOTE side by side */}
            <div className="px-2 sm:px-3 pt-2 sm:pt-3">
              <div className="flex rounded-t overflow-hidden">
                <div className="schedina-section-title flex-1 rounded-none text-[8px] sm:text-[10px] flex items-center justify-center gap-1">
                  I TUOI NUMERI (massimo 10)
                  <button
                    onClick={() => lotto.generaNumeriCasuali(5)}
                    disabled={lotto.isEstracting}
                    className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                    aria-label="Genera numeri casuali"
                    title="Genera 5 numeri casuali"
                  >
                    <Shuffle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </button>
                </div>
                <div className="schedina-section-title w-[85px] sm:w-[100px] rounded-none border-l border-white/30 text-[8px] sm:text-[10px]">
                  RUOTE
                </div>
              </div>
              <div className="bg-card/40 rounded-b p-1.5 sm:p-2 flex gap-1.5 sm:gap-2">
                <div className="flex-1 min-w-0">
                  <GrigliaNumeri
                    numeriSelezionati={lotto.numeriSelezionati}
                    numeriIndovinati={tuttiIndovinati}
                    onToggle={lotto.toggleNumero}
                    disabled={lotto.isEstracting}
                  />
                </div>
                <div className="flex-shrink-0 pl-1 border-l border-lotto-salmon/30">
                  <SelettoreRuote
                    ruoteSelezionate={lotto.ruoteSelezionate}
                    onToggle={lotto.toggleRuota}
                    onToggleTutte={lotto.selezionaTutteRuote}
                    disabled={lotto.isEstracting}
                  />
                </div>
              </div>
            </div>

            {/* IMPORTO DI GIOCATA PER SORTE */}
            <div className="px-2 sm:px-3 pt-2 sm:pt-3">
              <div className="schedina-section-title rounded-t text-[8px] sm:text-[10px]">
                IMPORTO DI GIOCATA PER SORTE
              </div>
              <div className="bg-card/40 rounded-b p-1.5 sm:p-2">
                <SelettoreSorteImporti
                  importiPerSorte={lotto.importiPerSorte}
                  numeriSelezionati={lotto.numeriSelezionati.length}
                  onSetImporto={lotto.setImportoSorte}
                  disabled={lotto.isEstracting}
                />
              </div>
            </div>

            {/* Riepilogo e pulsante */}
            <div className="px-2 sm:px-3 py-2.5 sm:py-3 space-y-2 sm:space-y-2.5">
              {lotto.numeriSelezionati.length > 0 && (
                <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap px-1">
                  <span className="text-[9px] sm:text-[10px] text-foreground/50 uppercase">Numeri:</span>
                  {[...lotto.numeriSelezionati].sort((a, b) => a - b).map(n => (
                    <span key={n} className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-lotto-orange text-white text-[8px] sm:text-[10px] font-bold shadow-sm">
                      {n}
                    </span>
                  ))}
                </div>
              )}
              {lotto.sortiAttive.length > 0 && (
                <div className="px-1 space-y-0.5">
                  {lotto.sortiAttive.map(s => (
                    <div key={s} className="flex justify-between text-[9px] sm:text-[11px] text-foreground/60">
                      <span>{s}</span>
                      <span>€{(lotto.importiPerSorte[s]! * lotto.ruoteSelezionate.length).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 px-1">
                <div className="flex-1 text-[10px] sm:text-[11px] text-foreground/60">
                  <span>Costo totale: <strong className="text-foreground">€{lotto.costoTotale.toFixed(2)}</strong></span>
                  <span className="ml-1">({lotto.ruoteSelezionate.length} ruote)</span>
                </div>
              </div>
              <div className="flex gap-1.5 px-1">
                <Button
                  onClick={lotto.gioca}
                  disabled={!lotto.puoGiocare}
                  className="btn-gioca flex-1 font-bold uppercase tracking-wider text-xs sm:text-sm text-white border-0"
                  size="sm"
                >
                  {lotto.isEstracting ? '🎰 Estrazione...' : '🎯 GIOCA!'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => lotto.simulaRapida(100)}
                  disabled={!lotto.puoGiocare || lotto.isEstracting}
                  className="font-bold text-[9px] sm:text-[10px] border-2 border-lotto-blue text-lotto-blue hover:bg-lotto-blue/10 px-2"
                  title="Simula 100 estrazioni istantaneamente"
                >
                  <Zap className="h-3 w-3" />×100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => lotto.simulaRapida(1000)}
                  disabled={!lotto.puoGiocare || lotto.isEstracting}
                  className="font-bold text-[9px] sm:text-[10px] border-2 border-lotto-gold text-lotto-gold hover:bg-lotto-gold/10 px-2"
                  title="Simula 1000 estrazioni istantaneamente"
                >
                  <Zap className="h-3 w-3" />×1K
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={lotto.reset}
                  disabled={lotto.isEstracting}
                  className="font-bold border-2 border-lotto-salmon text-foreground/60"
                  aria-label="Azzera schedina"
                >
                  ↺
                </Button>
              </div>
            </div>

          </div>

          {/* ===== COLONNA DESTRA ===== */}
          <div className="space-y-3 sm:space-y-4">
            {/* Risultati estrazione */}
            <div className="schedina-card overflow-hidden">
              <div className="schedina-header px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
                <span className="text-white font-bold text-xs sm:text-sm uppercase tracking-widest">
                  🎰 Estrazione
                </span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <a
                    href="https://github.com/carellonicolo/giocodellotto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-white/90 hover:text-white hover:bg-white/20 text-[10px] sm:text-xs uppercase tracking-wider px-2 h-7 rounded-md transition-colors"
                    aria-label="Vedi codice sorgente su GitHub"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    Sorgente
                  </a>
                  <RegoleLottoModal />
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-card/60">
                {/* Risultato vincita con aria-live */}
                <div aria-live="polite" aria-atomic="true" className="sr-only">
                  {lotto.risultatoCorrente && (
                    lotto.risultatoCorrente.totaleVinto > 0
                      ? `Hai vinto ${lotto.risultatoCorrente.totaleVinto.toFixed(2)} euro!`
                      : 'Nessuna vincita in questa estrazione.'
                  )}
                </div>

                {/* Banner risultato */}
                {lotto.risultatoCorrente && !lotto.isEstracting && (
                  <div className={`mb-2 p-2 rounded-lg text-center font-bold text-sm uppercase tracking-wider ${
                    lotto.risultatoCorrente.totaleVinto > 0
                      ? 'bg-lotto-gold/15 text-lotto-gold border border-lotto-gold/30'
                      : 'bg-lotto-red/10 text-foreground/50'
                  }`}>
                    {lotto.risultatoCorrente.totaleVinto > 0 ? (
                      <div>
                        <span className="text-lg">🎉</span> Vincita: €{lotto.risultatoCorrente.totaleVintoLordo.toFixed(2)}
                        {lotto.risultatoCorrente.tasse > 0 && (
                          <span className="block text-[10px] font-normal text-foreground/50 mt-0.5">
                            Tasse (8%): -€{lotto.risultatoCorrente.tasse.toFixed(2)} · Netto: €{lotto.risultatoCorrente.totaleVinto.toFixed(2)}
                          </span>
                        )}
                      </div>
                    ) : (
                      'Nessuna vincita'
                    )}
                  </div>
                )}

                {lotto.isEstracting ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="text-3xl sm:text-4xl animate-bounce">🎱</div>
                    <p className="text-muted-foreground mt-2 uppercase tracking-wider text-[10px] sm:text-xs">
                      Estrazione in corso...
                    </p>
                  </div>
                ) : lotto.risultatoCorrente ? (
                  <TabellaEstrazione
                    estrazione={lotto.risultatoCorrente.estrazione}
                    numeriGiocati={lotto.risultatoCorrente.giocata.numeri}
                    ruoteGiocate={lotto.risultatoCorrente.giocata.ruote}
                  />
                ) : (
                  <TabellaEstrazione
                    estrazione={{}}
                    numeriGiocati={[]}
                    ruoteGiocate={[]}
                  />
                )}
              </div>
            </div>

            <Suspense fallback={<div className="schedina-card p-4 text-center text-muted-foreground text-xs">Caricamento...</div>}>
              <PannelloProbabilita
                importiPerSorte={lotto.importiPerSorte}
                numeriGiocati={lotto.numeriSelezionati.length}
                numRuote={lotto.ruoteSelezionate.length}
              />
              <StoricoGiocate
                storico={lotto.storico}
                statistiche={lotto.statistiche}
                onResetStatistiche={lotto.resetStatistiche}
              />
              <GraficiStatistiche storico={lotto.storico} />
              <SezioneDidattica />
            </Suspense>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 px-2 pb-6">
          <div className="disclaimer-card text-center space-y-1.5">
            <ShieldAlert className="h-5 w-5 mx-auto text-lotto-red" />
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground/70">⚠️ AVVERTENZA SUL GIOCO D'AZZARDO:</strong> Il gioco d'azzardo può causare dipendenza patologica. 
              Gioca responsabilmente e solo se maggiorenne. Per informazioni e aiuto chiama il 
              <strong className="text-foreground/70"> Telefono Verde 800 558 822</strong> (ISS).
            </p>
          </div>
          <div className="disclaimer-card text-center space-y-1.5">
            <Landmark className="h-5 w-5 mx-auto text-lotto-blue" />
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-relaxed">
              Il marchio <strong className="text-foreground/70">"Gioco del Lotto"</strong> è di proprietà esclusiva dello Stato italiano, 
              gestito da <strong className="text-foreground/70">Lottomatica S.p.A.</strong> su concessione dell'Agenzia delle Dogane e dei Monopoli. 
              Questa applicazione non è affiliata né autorizzata.
            </p>
          </div>
          <div className="disclaimer-card text-center space-y-1.5">
            <Bot className="h-5 w-5 mx-auto text-lotto-green" />
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-relaxed">
              Questo software è stato <strong className="text-foreground/70">generato con l'ausilio dell'intelligenza artificiale</strong> e ha 
              il <strong className="text-foreground/70">solo scopo di studio della probabilità e della statistica</strong>. Nessuna somma di denaro reale è coinvolta.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;