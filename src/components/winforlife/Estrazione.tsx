import React from 'react';
import { type ExtractionResult } from '@/lib/winforlife/winforlife';
import { motion, AnimatePresence } from 'framer-motion';

interface EstrazioneProps {
  extraction: ExtractionResult;
  isAnimating: boolean;
  revealedCount: number;
  numeroneRevealed: boolean;
}

const Estrazione: React.FC<EstrazioneProps> = ({
  extraction,
  isAnimating,
  revealedCount,
  numeroneRevealed,
}) => {
  return (
    <div className="space-y-8">
      {/* 10 Numeri Vincenti */}
      <div>
        <div className="flex items-center gap-2 mb-6 justify-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary text-center">
            Numeri Vincenti
          </h3>
          {isAnimating && revealedCount < 10 && (
             <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
          )}
        </div>
        
        <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto place-items-center">
          <AnimatePresence>
            {extraction.numbers.map((num, i) => (
              <motion.div
                key={`win-${i}`}
                initial={{ scale: 0, opacity: 0, rotateY: -180 }}
                animate={{
                  scale: i < revealedCount ? 1 : 0,
                  opacity: i < revealedCount ? 1 : 0,
                  rotateY: i < revealedCount ? 0 : -180,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#00E676] to-[#00A050] shadow-[0_4px_12px_rgba(0,230,118,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center border-2 border-white/20">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-inner flex items-center justify-center">
                    <span className="text-lg sm:text-2xl font-black text-slate-800 tracking-tighter">
                      {num}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Numerone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealedCount === 10 ? 1 : 0 }}
        className="pt-6 border-t border-border/50 max-w-md mx-auto"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent flex items-center gap-2">
            Il Numerone
            {isAnimating && revealedCount === 10 && !numeroneRevealed && (
               <span className="flex h-2 w-2 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
               </span>
            )}
          </h3>
          
          <AnimatePresence>
            {numeroneRevealed && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                className="relative"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#FF1744] to-[#D50000] shadow-[0_8px_24px_rgba(255,23,68,0.5),inset_0_-6px_12px_rgba(0,0,0,0.3),inset_0_6px_12px_rgba(255,255,255,0.5)] flex items-center justify-center border-4 border-yellow-400">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 shadow-inner flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-black text-red-600 tracking-tighter">
                      {extraction.numerone}
                    </span>
                  </div>
                </div>
                
                {/* Glow behind Numerone */}
                <div className="absolute inset-0 bg-red-500 blur-2xl -z-10 opacity-30 mix-blend-screen rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Estrazione;
