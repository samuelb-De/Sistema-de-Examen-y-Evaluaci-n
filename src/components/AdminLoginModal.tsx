import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, X, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setPassword('');
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: shake ? [-10, 10, -6, 6, -3, 3, 0] : 0
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-slate-200 relative"
      >
        <button
          onClick={() => {
            setPassword('');
            setError(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#00af00] border border-emerald-200 flex items-center justify-center mb-3">
          <Lock className="w-5 h-5" />
        </div>

        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Acceso de Administrador
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed font-normal">
          Ingresa la contraseña de seguridad para acceder a la configuración del examen, banco de preguntas, historias de usuarios y carga de PDFs.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                autoFocus
                placeholder="Ingresa la contraseña"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-[#00af00] focus:ring-1 focus:ring-[#00af00] text-sm text-slate-900 outline-none transition-all font-mono tracking-widest"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center space-x-2 text-rose-600 text-xs font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Contraseña incorrecta. Verifica e intenta de nuevo.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setPassword('');
                setError(false);
                onClose();
              }}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Acceder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
