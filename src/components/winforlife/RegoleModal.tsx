import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Info } from 'lucide-react';

const RegoleModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-white/90 hover:text-white hover:bg-white/20 text-[10px] sm:text-xs uppercase tracking-wider px-2 h-7 rounded-md transition-colors">
          <Info className="w-3.5 h-3.5" />
          Regole
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-[95vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            W Come funziona Win for Life Classico
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm mt-4 text-muted-foreground">
          <p>
            Il <strong>Win for Life Classico</strong> è un gioco molto particolare basato sull'estrazione di esattamente metà dei numeri disponibili.
          </p>
          
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
            <h4 className="font-bold text-primary mb-1 text-base">La Meccanica</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Si scelgono <strong>10 numeri</strong> su 20 disponibili.</li>
              <li>Si sceglie <strong>1 Numerone</strong> su 20 disponibili.</li>
              <li>Vengono estratti 10 numeri vincenti e 1 Numerone.</li>
              <li>Il premio massimo è una rendita di <strong>3.000€ al mese per 20 anni</strong>.</li>
            </ul>
          </div>

          <div className="bg-secondary/20 p-3 rounded-xl border border-border">
            <h4 className="font-bold text-foreground mb-1 text-base">L'Importo della Giocata</h4>
            <p className="mb-2">Le categorie di vincita cambiano in base a quanto decidi di spendere:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Giocata da 1€:</strong> Vinci solo indovinando i punteggi più alti: 10, 9, 8, 7 (più eventualmente il Numerone).
              </li>
              <li>
                <strong>Giocata da 2€:</strong> Si attiva la simmetria del gioco! Oltre ai punteggi alti, vinci anche con i punteggi speculari bassi: 0, 1, 2, 3. 
                Infatti, la probabilità di indovinare 0 numeri è matematicamente identica alla probabilità di indovinarne 10.
              </li>
            </ul>
          </div>

          <p className="text-xs italic opacity-80 pt-2 border-t border-border">
            Nota: I premi riportati nel simulatore sono le quote medie teoriche per fini didattici. Il premio massimo è stato capitalizzato in un'unica somma figurativa per il calcolo delle statistiche.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegoleModal;
