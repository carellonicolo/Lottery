import React, { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Card } from '@/components/ui/card';

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
      combinazioniTotali: renderFormula('C(55, 5) = \\frac{55!}{5!(55-5)!} = 3.478.761'),
      prob5: renderFormula('P(5) = \\frac{C(5, 5) \\cdot C(50, 0)}{C(55, 5)} = \\frac{1 \\cdot 1}{3.478.761} \\approx 0.000000287'),
      prob4: renderFormula('P(4) = \\frac{C(5, 4) \\cdot C(50, 1)}{C(55, 5)} = \\frac{5 \\cdot 50}{3.478.761} = \\frac{250}{3.478.761} \\approx 0.00007186'),
      prob3: renderFormula('P(3) = \\frac{C(5, 3) \\cdot C(50, 2)}{C(55, 5)} = \\frac{10 \\cdot 1225}{3.478.761} = \\frac{12.250}{3.478.761} \\approx 0.00352'),
      prob2: renderFormula('P(2) = \\frac{C(5, 2) \\cdot C(50, 3)}{C(55, 5)} = \\frac{10 \\cdot 19600}{3.478.761} = \\frac{196.000}{3.478.761} \\approx 0.05634'),
    });
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-bold text-primary mb-3">Le Combinazioni Totali</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Nel MillionDAY vengono estratti 5 numeri da un bacino di 55. L'ordine di estrazione non conta.
          Il numero totale di combinazioni possibili è dato dal coefficiente binomiale "55 su 5":
        </p>
        <Card className="p-4 bg-muted/30 border-primary/20 flex justify-center overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: formulas.combinazioniTotali || '' }} />
        </Card>
      </section>

      <section>
        <h3 className="text-lg font-bold text-primary mb-3">Distribuzione Ipergeometrica</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Per calcolare la probabilità di indovinare <span className="italic">k</span> numeri, usiamo 
          la distribuzione ipergeometrica. La formula generale è:
        </p>
        <Card className="p-4 bg-muted/30 flex justify-center overflow-x-auto mb-6">
          <div dangerouslySetInnerHTML={{ __html: katex.renderToString('P(X=k) = \\frac{C(5, k) \\cdot C(50, 5-k)}{C(55, 5)}', { displayMode: true, throwOnError: false }) }} />
        </Card>

        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-foreground mb-2">Punteggio 5</h4>
            <Card className="p-3 bg-muted/10 overflow-x-auto">
              <div dangerouslySetInnerHTML={{ __html: formulas.prob5 || '' }} />
            </Card>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2">Punteggio 4</h4>
            <Card className="p-3 bg-muted/10 overflow-x-auto">
              <div dangerouslySetInnerHTML={{ __html: formulas.prob4 || '' }} />
            </Card>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2">Punteggio 3</h4>
            <Card className="p-3 bg-muted/10 overflow-x-auto">
              <div dangerouslySetInnerHTML={{ __html: formulas.prob3 || '' }} />
            </Card>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2">Punteggio 2</h4>
            <Card className="p-3 bg-muted/10 overflow-x-auto">
              <div dangerouslySetInnerHTML={{ __html: formulas.prob2 || '' }} />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FormuleCombinatorie;
