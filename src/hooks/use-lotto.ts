import { useState, useCallback, useEffect } from 'react';
import type { RisultatoGiocata, Ruota, TipoGiocata, StatisticheSessione, ImportiPerSorte } from '@/lib/lotto/types';
import { RUOTE, NUMERI_MINIMI } from '@/lib/lotto/types';
import { eseguiEstrazione, calcolaRisultato, calcolaCostoTotale } from '@/lib/lotto/engine';

const STORICO_KEY = 'lotto-storico';
const STATS_KEY = 'lotto-statistiche';

function loadStorico(): RisultatoGiocata[] {
  try {
    const raw = localStorage.getItem(STORICO_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RisultatoGiocata[];
    return parsed.map((r) => ({ ...r, timestamp: new Date(r.timestamp) }));
  } catch {
    return [];
  }
}

function loadStats(): StatisticheSessione {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { totaleGiocate: 0, totaleSpeso: 0, totaleVinto: 0, vittorie: 0 };
    return JSON.parse(raw) as StatisticheSessione;
  } catch {
    return { totaleGiocate: 0, totaleSpeso: 0, totaleVinto: 0, vittorie: 0 };
  }
}

export function useLotto() {
  const [numeriSelezionati, setNumeriSelezionati] = useState<number[]>([]);
  const [ruoteSelezionate, setRuoteSelezionate] = useState<Ruota[]>([]);
  const [importiPerSorte, setImportiPerSorte] = useState<ImportiPerSorte>({});
  const [risultatoCorrente, setRisultatoCorrente] = useState<RisultatoGiocata | null>(null);
  const [storico, setStorico] = useState<RisultatoGiocata[]>(loadStorico);
  const [isEstracting, setIsEstracting] = useState(false);
  const [statistiche, setStatistiche] = useState<StatisticheSessione>(loadStats);

  // Persist storico & stats
  useEffect(() => {
    try {
      localStorage.setItem(STORICO_KEY, JSON.stringify(storico));
    } catch {
      // Ignore storage errors (es. quota piena, modalità privata)
    }
  }, [storico]);
  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(statistiche));
    } catch {
      // Ignore storage errors (es. quota piena, modalità privata)
    }
  }, [statistiche]);

  const toggleNumero = useCallback((n: number) => {
    setNumeriSelezionati(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : prev.length >= 10 ? prev : [...prev, n]
    );
  }, []);

  const generaNumeriCasuali = useCallback((quantita: number) => {
    const numeri: number[] = [];
    while (numeri.length < Math.min(quantita, 10)) {
      const n = Math.floor(Math.random() * 90) + 1;
      if (!numeri.includes(n)) numeri.push(n);
    }
    setNumeriSelezionati(numeri.sort((a, b) => a - b));
  }, []);

  const toggleRuota = useCallback((r: Ruota) => {
    setRuoteSelezionate(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  }, []);

  const selezionaTutteRuote = useCallback(() => {
    setRuoteSelezionate(prev =>
      prev.length === RUOTE.length ? [] : [...RUOTE]
    );
  }, []);

  const setImportoSorte = useCallback((tipo: TipoGiocata, importo: number | undefined) => {
    setImportiPerSorte(prev => {
      const next = { ...prev };
      if (importo === undefined || importo <= 0) {
        delete next[tipo];
      } else {
        next[tipo] = importo;
      }
      return next;
    });
  }, []);

  const sortiAttive = Object.keys(importiPerSorte).filter(
    k => (importiPerSorte[k as TipoGiocata] ?? 0) > 0
  ) as TipoGiocata[];

  const costoTotale = calcolaCostoTotale(importiPerSorte, ruoteSelezionate.length);

  const puoGiocare = numeriSelezionati.length > 0
    && ruoteSelezionate.length > 0
    && sortiAttive.length > 0
    && sortiAttive.every(s => numeriSelezionati.length >= NUMERI_MINIMI[s])
    && !isEstracting;

  const gioca = useCallback(() => {
    if (!puoGiocare) return;

    setIsEstracting(true);
    const giocata = {
      numeri: [...numeriSelezionati],
      ruote: [...ruoteSelezionate],
      importiPerSorte: { ...importiPerSorte },
      numeroOro: false,
    };

    const estrazione = eseguiEstrazione(RUOTE);
    const risultato = calcolaRisultato(giocata, estrazione);
    const costo = calcolaCostoTotale(importiPerSorte, ruoteSelezionate.length);

    setTimeout(() => {
      setRisultatoCorrente(risultato);
      setStorico(prev => [risultato, ...prev].slice(0, 50));
      setStatistiche(prev => ({
        totaleGiocate: prev.totaleGiocate + 1,
        totaleSpeso: prev.totaleSpeso + costo,
        totaleVinto: prev.totaleVinto + risultato.totaleVinto,
        vittorie: prev.vittorie + (risultato.totaleVinto > 0 ? 1 : 0),
      }));
      setIsEstracting(false);
    }, 2000);
  }, [puoGiocare, numeriSelezionati, ruoteSelezionate, importiPerSorte]);

  const simulaRapida = useCallback((n: number) => {
    if (!puoGiocare) return;

    const giocata = {
      numeri: [...numeriSelezionati],
      ruote: [...ruoteSelezionate],
      importiPerSorte: { ...importiPerSorte },
      numeroOro: false,
    };
    const costo = calcolaCostoTotale(importiPerSorte, ruoteSelezionate.length);

    let totSpeso = 0;
    let totVinto = 0;
    let vittorie = 0;
    const nuoviRisultati: RisultatoGiocata[] = [];

    for (let i = 0; i < n; i++) {
      const estrazione = eseguiEstrazione(RUOTE);
      const risultato = calcolaRisultato(giocata, estrazione);
      totSpeso += costo;
      totVinto += risultato.totaleVinto;
      if (risultato.totaleVinto > 0) vittorie++;
      if (i < 50) nuoviRisultati.push(risultato);
    }

    setRisultatoCorrente(nuoviRisultati[0] || null);
    setStorico(prev => [...nuoviRisultati, ...prev].slice(0, 50));
    setStatistiche(prev => ({
      totaleGiocate: prev.totaleGiocate + n,
      totaleSpeso: prev.totaleSpeso + totSpeso,
      totaleVinto: prev.totaleVinto + totVinto,
      vittorie: prev.vittorie + vittorie,
    }));
  }, [puoGiocare, numeriSelezionati, ruoteSelezionate, importiPerSorte]);

  const reset = useCallback(() => {
    setNumeriSelezionati([]);
    setRuoteSelezionate([]);
    setImportiPerSorte({});
    setRisultatoCorrente(null);
  }, []);

  const resetStatistiche = useCallback(() => {
    setStorico([]);
    setStatistiche({ totaleGiocate: 0, totaleSpeso: 0, totaleVinto: 0, vittorie: 0 });
    try {
      localStorage.removeItem(STORICO_KEY);
      localStorage.removeItem(STATS_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return {
    numeriSelezionati, ruoteSelezionate, importiPerSorte,
    risultatoCorrente, storico, isEstracting, statistiche,
    sortiAttive, costoTotale, puoGiocare,
    toggleNumero, toggleRuota, selezionaTutteRuote,
    setImportoSorte, gioca, simulaRapida, reset, generaNumeriCasuali, resetStatistiche,
  };
}
