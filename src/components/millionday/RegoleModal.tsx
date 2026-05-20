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
            ⭐ Come funziona MillionDAY
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm mt-4 text-muted-foreground">
          <p>
            Il <strong>MillionDAY</strong> è un gioco basato sull'estrazione di <strong>5 numeri</strong> compresi tra l'1 e il 55.
          </p>
          
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
            <h4 className="font-bold text-primary mb-1 text-base">Gioco Base</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Si scelgono 5 numeri da 1 a 55.</li>
              <li>Vengono estratti 5 numeri vincenti.</li>
              <li>Il costo di una giocata singola è di <strong>1€</strong>.</li>
              <li>Indovinando tutti i 5 numeri si vince il premio massimo di <strong>1.000.000€</strong>.</li>
            </ul>
          </div>

          <div className="bg-accent/10 p-3 rounded-xl border border-accent/20">
            <h4 className="font-bold text-accent mb-1 text-base">Opzione EXTRA</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Aggiungendo l'opzione EXTRA (costo aggiuntivo <strong>1€</strong>), si partecipa a una seconda estrazione.</li>
              <li>Vengono estratti altri 5 numeri tra i 50 rimanenti dopo l'estrazione base.</li>
              <li>Se i tuoi numeri non sono stati estratti nel gioco Base, possono ancora vincere nell'Extra.</li>
              <li>Il premio massimo per l'Extra (5 numeri) è di <strong>100.000€</strong>.</li>
            </ul>
          </div>

          <p className="text-xs italic opacity-80 pt-2 border-t border-border">
            Nota: I premi riportati nel simulatore sono le quote fisse lorde approssimate come da regolamento ufficiale. 
            Le probabilità mostrate sono esatte dal punto di vista matematico.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegoleModal;
