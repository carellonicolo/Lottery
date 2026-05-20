import React from 'react';
import { calculateProbability, AVERAGE_PRIZES, type WinCategory } from '@/lib/winforlife/winforlife';
import { formatCurrency, formatNumber } from '@/lib/shared/math';

const ProbabilitaPanel: React.FC = () => {
  const categories2E: { label: string; matches: number; num: boolean; cat: WinCategory }[] = [
    { label: '10 + Numerone', matches: 10, num: true, cat: '10+1' },
    { label: '10 Numeri', matches: 10, num: false, cat: '10' },
    { label: '9 + Numerone', matches: 9, num: true, cat: '9+1' },
    { label: '9 Numeri', matches: 9, num: false, cat: '9' },
    { label: '8 + Numerone', matches: 8, num: true, cat: '8+1' },
    { label: '8 Numeri', matches: 8, num: false, cat: '8' },
    { label: '7 + Numerone', matches: 7, num: true, cat: '7+1' },
    { label: '7 Numeri', matches: 7, num: false, cat: '7' },
    { label: '3 + Numerone', matches: 3, num: true, cat: '3+1' },
    { label: '3 Numeri', matches: 3, num: false, cat: '3' },
    { label: '2 + Numerone', matches: 2, num: true, cat: '2+1' },
    { label: '2 Numeri', matches: 2, num: false, cat: '2' },
    { label: '1 + Numerone', matches: 1, num: true, cat: '1+1' },
    { label: '1 Numeri', matches: 1, num: false, cat: '1' },
    { label: '0 + Numerone', matches: 0, num: true, cat: '0+1' },
    { label: '0 Numeri', matches: 0, num: false, cat: '0' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Nel <strong>Win for Life Classico</strong> si estraggono 10 numeri su 20, più un Numerone.
        Le probabilità possiedono una <strong>perfetta simmetria matematica</strong>: poiché 10 è esattamente la metà di 20,
        la probabilità di indovinare 10 numeri è identica alla probabilità di indovinarne 0.
      </p>

      <div className="bg-secondary/20 p-4 rounded-xl border border-border space-y-4">
        <h4 className="font-bold text-foreground">Scegliere l'Importo: 1€ vs 2€</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Giocata da 1€:</strong> Si vince solo con i punteggi alti (10, 9, 8, 7) e i rispettivi Numeroni.</li>
          <li><strong>Giocata da 2€:</strong> Attiva la simmetria. Si vince anche con i punteggi bassi (0, 1, 2, 3), raddoppiando le categorie di vincita.</li>
        </ul>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border mt-6">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-secondary-foreground text-xs uppercase font-bold">
            <tr>
              <th className="px-4 py-3">Punteggio</th>
              <th className="px-4 py-3">Premio Medio</th>
              <th className="px-4 py-3">Probabilità</th>
              <th className="px-4 py-3">1 su...</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {categories2E.map((row, idx) => {
              const prob = calculateProbability(row.matches, row.num);
              // Raggruppa visivamente le parti simmetriche (es. 10 e 0)
              const isLow = row.matches <= 3;
              return (
                <tr key={idx} className={`hover:bg-muted/50 transition-colors ${isLow ? 'bg-primary/5' : ''}`}>
                  <td className="px-4 py-3 font-semibold flex items-center gap-2">
                    {row.label}
                    {isLow && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">Solo 2€</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-green-500 font-bold">{formatCurrency(AVERAGE_PRIZES[row.cat])}</td>
                  <td className="px-4 py-3 font-mono text-xs">{(prob.probability * 100).toFixed(6)}%</td>
                  <td className="px-4 py-3 font-mono font-bold">1 su {formatNumber(prob.oneIn)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <p className="text-xs text-muted-foreground italic mt-2">
        Nota: I premi indicati sono valori medi teorici (eccetto il primo premio che è fisso a 3.000€/mese per 20 anni, qui capitalizzato). 
      </p>
    </div>
  );
};

export default ProbabilitaPanel;
