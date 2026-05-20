import React, { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const FormuleCombinatorie: React.FC = () => {
  const [formulas, setFormulas] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const renderFormula = (tex: string) => {
      try {
        return katex.renderToString(tex, { throwOnError: false, displayMode: true });
      } catch (e) {
        return tex;
      }
    };

    setFormulas({
      combinazioniTotali: renderFormula('C(20, 10) = \\frac{20!}{10!(20-10)!} = 184.756'),
      ipergeometrica: renderFormula('P(X=k) = \\frac{C(10, k) \\cdot C(10, 10-k)}{C(20, 10)}'),
      prob10: renderFormula('P(10) = \\frac{C(10, 10) \\cdot C(10, 0)}{184.756} = \\frac{1 \\cdot 1}{184.756}'),
      prob0: renderFormula('P(0) = \\frac{C(10, 0) \\cdot C(10, 10)}{184.756} = \\frac{1 \\cdot 1}{184.756}'),
      simmetria: renderFormula('C(10, k) = C(10, 10-k)'),
    });
  }, []);

  const chartData = [
    { name: '0', prob: 1 },
    { name: '1', prob: 100 },
    { name: '2', prob: 2025 },
    { name: '3', prob: 14400 },
    { name: '4', prob: 44100 },
    { name: '5', prob: 63504 },
    { name: '6', prob: 44100 },
    { name: '7', prob: 14400 },
    { name: '8', prob: 2025 },
    { name: '9', prob: 100 },
    { name: '10', prob: 1 },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-bold text-primary mb-3">La Curva a Campana Perfetta</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Il Win for Life è forse il gioco più interessante da un punto di vista didattico per spiegare la <strong>Distribuzione Normale</strong>. 
          Poiché si estraggono esattamente 10 numeri su un totale di 20, le probabilità si distribuiscono in modo perfettamente simmetrico.
        </p>
        
        <div className="h-64 w-full bg-card/50 rounded-xl border p-4 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'currentColor' }} />
              <YAxis tick={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                contentStyle={{ backgroundColor: 'hsl(140 50% 14%)', border: '1px solid hsl(140 70% 40%)', borderRadius: '8px' }}
                formatter={(value: number) => [`${value} combinazioni`, '']}
                labelFormatter={(label) => `Punteggio ${label}`}
              />
              <Bar dataKey="prob" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? 'hsl(140 20% 65%)' : (index === 0 || index === 10 ? 'hsl(350 80% 50%)' : 'hsl(140 70% 40%)')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-primary mb-3">Dimostrazione Matematica</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Lo spazio campionario totale è dato dal coefficiente binomiale "20 su 10":
        </p>
        <Card className="p-4 bg-muted/30 border-primary/20 flex justify-center overflow-x-auto mb-6">
          <div dangerouslySetInnerHTML={{ __html: formulas.combinazioniTotali || '' }} />
        </Card>

        <p className="text-sm text-muted-foreground mb-4">
          La probabilità di indovinare <span className="italic">k</span> numeri segue la distribuzione ipergeometrica:
        </p>
        <Card className="p-4 bg-muted/30 flex justify-center overflow-x-auto mb-6">
          <div dangerouslySetInnerHTML={{ __html: formulas.ipergeometrica || '' }} />
        </Card>
      </section>

      <section className="bg-accent/10 border border-accent/20 p-5 rounded-xl">
        <h3 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
          Il Paradosso dello Zero
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          La simmetria binomiale <span className="inline-block px-1 bg-background rounded" dangerouslySetInnerHTML={{ __html: formulas.simmetria }} /> ci dimostra che la probabilità di indovinare tutti e 10 i numeri è <strong>esattamente identica</strong> alla probabilità di non indovinarne nemmeno uno (fare 0):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-3 bg-muted/10 overflow-x-auto">
            <div dangerouslySetInnerHTML={{ __html: formulas.prob10 || '' }} />
          </Card>
          <Card className="p-3 bg-muted/10 overflow-x-auto">
            <div dangerouslySetInnerHTML={{ __html: formulas.prob0 || '' }} />
          </Card>
        </div>
        <p className="text-sm text-foreground font-semibold mt-4 text-center">
          Ecco perché la giocata da 2€ premia sia il 10 che lo 0 con lo stesso montepremi massimo!
        </p>
      </section>
    </div>
  );
};

export default FormuleCombinatorie;
