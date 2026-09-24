import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Contrast } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'pill' | 'floating';
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  className = '',
  showLabel = false
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'floating') {
    return (
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro (alto contraste)'}
        title={isDark ? 'Modo Oscuro Activo • Clic para Modo Claro' : 'Modo Claro Activo • Clic para Modo Oscuro / Contraste'}
        className={`fixed bottom-5 right-5 z-50 p-3 rounded-full shadow-lg border transition-all cursor-pointer flex items-center justify-center backdrop-blur-md ${
          isDark
            ? 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700 shadow-amber-500/10'
            : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-slate-900/10'
        } ${className}`}
      >
        <span className="relative flex items-center justify-center w-5 h-5">
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700 transition-transform rotate-0" />
          )}
        </span>
        <span className="sr-only">Alternar modo oscuro y contraste</span>
      </motion.button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer select-none ${
          isDark
            ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Modo Claro</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-slate-600" />
            <span>Modo Oscuro</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
          isDark
            ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
        } ${className}`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-600" />
        )}
      </button>
    );
  }

  // Default 'button' variant
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro (alto contraste)'}
      title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>{showLabel ? 'Modo Claro' : 'Claro'}</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-slate-600" />
          <span>{showLabel ? 'Modo Oscuro' : 'Oscuro'}</span>
        </>
      )}
    </button>
  );
};
