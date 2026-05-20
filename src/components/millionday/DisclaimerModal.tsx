import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ShieldAlert } from 'lucide-react';

const DisclaimerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('millionday-disclaimer-accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('millionday-disclaimer-accepted', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        // Prevent closing by clicking outside
      }
    }}>
      <DialogContent className="max-w-lg w-[95vw] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-destructive">
            <ShieldAlert className="w-8 h-8" />
            Avvertenza Importante
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 text-sm sm:text-base text-foreground/80 leading-relaxed">
          <p>
            Questo sito è un <strong>simulatore didattico</strong> creato esclusivamente per lo studio 
            matematico della probabilità e della statistica applicate al gioco del MillionDAY.
          </p>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li>Nessun denaro reale è coinvolto in alcun modo.</li>
            <li>Le "giocate" e le "vincite" sono simulazioni matematiche locali.</li>
            <li>Il gioco d'azzardo reale può causare dipendenza patologica.</li>
          </ul>
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl mt-6">
            <p className="font-bold text-destructive mb-2 text-center sm:text-left">
              Hai problemi con il gioco d'azzardo?
            </p>
            <p className="text-sm">
              Non sei solo. Chiama il Telefono Verde Nazionale per le problematiche legate all'Azzardo (TVNGA) 
              dell'Istituto Superiore di Sanità al numero gratuito:
            </p>
            <div className="mt-3 text-center">
              <a href="tel:800558822" className="inline-block text-xl font-black text-destructive hover:underline tracking-widest">
                800 558 822
              </a>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-lg shadow-lg shadow-primary/20"
          >
            Ho capito, procedi al simulatore
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerModal;
