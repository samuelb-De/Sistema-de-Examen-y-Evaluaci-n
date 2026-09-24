import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { playDoorLockSound } from '../utils/audio';

interface DoorLockdownModalProps {
  isOpen: boolean;
  onProceedToResults: () => void;
  candidateName: string;
}

export const DoorLockdownModal: React.FC<DoorLockdownModalProps> = ({
  isOpen,
  onProceedToResults,
  candidateName
}) => {
  useEffect(() => {
    if (isOpen) {
      playDoorLockSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Background dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs"
      />

      {/* Left Heavy Door */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ type: 'spring', damping: 16, stiffness: 350, mass: 1.1 }}
        className="absolute top-0 left-0 w-1/2 h-full bg-slate-900 border-r-4 border-[#00af00] shadow-[0_0_30px_rgba(0,175,0,0.4)] flex flex-col justify-between p-8 z-10"
      >
        <div className="h-3 w-full bg-slate-800 rounded-full" />
        <div className="flex flex-col items-end pr-4 text-slate-400 font-mono text-xs space-y-2">
          <span className="font-bold tracking-widest text-[#00af00]">CIERRE AUTOMÁTICO ADSO</span>
          <span className="text-[10px] text-slate-300 font-semibold">COMPUERTA BLOQUEADA</span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full" />
      </motion.div>

      {/* Right Heavy Door */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        transition={{ type: 'spring', damping: 16, stiffness: 350, mass: 1.1 }}
        className="absolute top-0 right-0 w-1/2 h-full bg-slate-900 border-l-4 border-[#00af00] shadow-[0_0_30px_rgba(0,175,0,0.4)] flex flex-col justify-between p-8 z-10"
      >
        <div className="h-3 w-full bg-slate-800 rounded-full" />
        <div className="flex flex-col items-start pl-4 text-slate-400 font-mono text-xs space-y-2">
          <span className="font-bold tracking-widest text-[#00af00]">TIEMPO LÍMITE AGOTADO</span>
          <span className="text-[10px] text-slate-300 font-semibold">CERROJO SELLADO</span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full" />
      </motion.div>

      {/* Center Lock Badge & Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          x: [0, -10, 10, -5, 5, 0]
        }}
        transition={{ delay: 0.28, duration: 0.5, ease: 'easeOut' }}
        className="relative z-30 max-w-md w-full mx-4"
      >
        <div className="bg-white rounded-xl p-7 shadow-2xl border border-slate-200 text-center flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-xl bg-emerald-50 text-[#00af00] border border-emerald-200 flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shadow-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>

          <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-50 text-[#008800] mb-2 border border-emerald-200">
            Compuerta Cerrada &bull; Tiempo Finalizado
          </span>

          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
            Tiempo Agotado
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm mb-5 leading-relaxed font-normal">
            La compuerta del examen se ha cerrado y el temporizador se detuvo.
            Tus respuestas han quedado protegidas y registradas de inmediato en el servidor en la nube.
          </p>

          <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5 flex items-center justify-between text-xs text-slate-700 font-medium">
            <span className="font-bold text-slate-900">{candidateName || 'Postulante'}</span>
            <span className="inline-flex items-center text-[#008800] font-bold bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#00af00]" />
              Sincronizado en Nube
            </span>
          </div>

          <button
            type="button"
            onClick={onProceedToResults}
            className="w-full py-3 px-5 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white font-bold text-sm shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Ver Resultados del Examen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
