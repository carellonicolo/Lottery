import React from 'react';
import { type ExtractionResult } from '@/lib/millionday/millionday';
import { motion, AnimatePresence } from 'framer-motion';

interface EstrazioneProps {
  extraction: ExtractionResult;
  isAnimating: boolean;
  revealedBaseCount: number;
  revealedExtraCount: number;
}

const Estrazione: React.FC<EstrazioneProps> = ({
  extraction,
  isAnimating,
  revealedBaseCount,
  revealedExtraCount,
}) => {
  return (
    <div className="space-y-6">
      {/* Base Draw */}
      <div>
        <div className="flex items-center gap-2 mb-4 justify-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary text-center">
            Estrazione Base
          </h3>
          {isAnimating && revealedBaseCount < 5 && (
             <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
          )}
        </div>
        <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
          <AnimatePresence>
            {extraction.baseNumbers.map((num, i) => (
              <motion.div
                key={`base-${i}`}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{
                  scale: i < revealedBaseCount ? 1 : 0,
                  opacity: i < revealedBaseCount ? 1 : 0,
                  y: i < revealedBaseCount ? 0 : 20,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-[0_4px_12px_rgba(255,165,0,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center border-2 border-white/20">
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

      {/* Extra Draw */}
      {revealedBaseCount >= 5 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-4 border-t border-border"
        >
          <div className="flex items-center gap-2 mb-4 justify-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent text-center">
              Estrazione Extra
            </h3>
            {isAnimating && revealedBaseCount >= 5 && revealedExtraCount < 5 && (
               <span className="flex h-2 w-2 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
               </span>
            )}
          </div>
          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
            <AnimatePresence>
              {extraction.extraNumbers.map((num, i) => (
                <motion.div
                  key={`extra-${i}`}
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{
                    scale: i < revealedExtraCount ? 1 : 0,
                    opacity: i < revealedExtraCount ? 1 : 0,
                    y: i < revealedExtraCount ? 0 : 20,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#0077FF] shadow-[0_4px_12px_rgba(0,119,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center border-2 border-white/20">
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
        </motion.div>
      )}
    </div>
  );
};

export default Estrazione;
