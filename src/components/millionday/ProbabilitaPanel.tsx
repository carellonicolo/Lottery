import React from 'react';
import { calculateProbabilityBase, WIN_CATEGORIES, AVERAGE_PRIZES_BASE, AVERAGE_PRIZES_EXTRA } from '@/lib/millionday/millionday';
import { formatCurrency, formatNumber } from '@/lib/shared/math';

const ProbabilitaPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Il <strong>MillionDAY</strong> prevede l'estrazione di 5 numeri su 55. 
        Le probabilità di vincita sono le stesse sia per l'estrazione Base che per quella Extra. 
        Ciò che cambia è il premio per la categoria massima (1.000.000€ per il Base, 100.000€ per l'Extra).
      </p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-secondary-foreground text-xs uppercase font-bold">
            <tr>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Premio Base</th>
              <th className="px-4 py-3">Premio Extra</th>
              <th className="px-4 py-3">Probabilità Esatta</th>
              <th className="px-4 py-3">1 su...</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {WIN_CATEGORIES.map((cat) => {
              const prob = calculateProbabilityBase(cat.category);
              return (
                <tr key={cat.category} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-primary">{cat.description}</td>
                  <td className="px-4 py-3 font-mono">{formatCurrency(AVERAGE_PRIZES_BASE[cat.category])}</td>
                  <td className="px-4 py-3 font-mono">{formatCurrency(AVERAGE_PRIZES_EXTRA[cat.category])}</td>
                  <td className="px-4 py-3 font-mono text-xs">{(prob.probability * 100).toFixed(6)}%</td>
                  <td className="px-4 py-3 font-mono font-bold">1 su {formatNumber(prob.oneIn)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm">
        <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
           L'Opzione EXTRA
        </h4>
        <p className="text-muted-foreground">
          Aggiungendo l'opzione EXTRA (costo 1€ aggiuntivo), i tuoi 5 numeri partecipano a una <strong>seconda estrazione</strong> 
          di 5 numeri, sorteggiati tra i 50 rimanenti dopo l'estrazione base. Le probabilità matematiche <em>a priori</em> di fare 5 all'Extra 
          sono identiche a quelle del gioco base (1 su 3.478.761).
        </p>
      </div>
    </div>
  );
};

export default ProbabilitaPanel;
