import React from 'react';
import { DominoPiece } from '../types';

interface DominoPieceViewProps {
  domino: DominoPiece | null;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  isQuestionMark?: boolean;
}

// 3x3 grid coordinates for standard domino pips
const PIP_POSITIONS: Record<number, [number, number][]> = {
  0: [],
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [2, 0], [0, 2], [2, 2]],
  5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  6: [[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2]]
};

export const DominoPieceView: React.FC<DominoPieceViewProps> = ({
  domino,
  size = 'md',
  selected = false,
  onClick,
  isQuestionMark = false
}) => {
  const sizeClasses = {
    sm: 'w-10 h-20 rounded-xl p-1 text-xs',
    md: 'w-16 h-32 rounded-2xl p-1.5 text-sm',
    lg: 'w-20 h-40 rounded-3xl p-2 text-base'
  }[size];

  const pipSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5'
  }[size];

  if (isQuestionMark || !domino) {
    return (
      <div
        onClick={onClick}
        className={`${sizeClasses} flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 shadow-xs transition-all ${
          onClick ? 'cursor-pointer hover:border-[#00af00] hover:bg-emerald-50/40 active:scale-95' : ''
        }`}
      >
        <span className="text-slate-400 font-black text-xl">?</span>
        <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Falta</span>
      </div>
    );
  }

  const renderHalf = (value: number) => {
    const pips = PIP_POSITIONS[Math.min(6, Math.max(0, value))] || [];
    return (
      <div className="relative flex-1 w-full flex items-center justify-center p-1">
        <div className="relative w-full h-full">
          {pips.map(([row, col], idx) => {
            const topPct = row === 0 ? '15%' : row === 1 ? '50%' : '85%';
            const leftPct = col === 0 ? '18%' : col === 1 ? '50%' : '82%';
            return (
              <div
                key={idx}
                style={{ top: topPct, left: leftPct, transform: 'translate(-50%, -50%)' }}
                className={`absolute ${pipSize} rounded-full bg-slate-900`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`${sizeClasses} relative flex flex-col items-center justify-between bg-white border transition-all duration-150 select-none ${
        selected
          ? 'border-[#00af00] ring-3 ring-[#00af00]/25 shadow-md scale-105'
          : 'border-slate-300 shadow-xs hover:border-slate-400'
      } ${onClick ? 'cursor-pointer active:scale-95 hover:scale-102' : 'cursor-default'}`}
    >
      {/* Top half */}
      {renderHalf(domino.top)}

      {/* Center divider bar with central metallic pin */}
      <div className="w-full relative py-0.5 flex items-center justify-center">
        <div className="w-[85%] h-[1.5px] bg-slate-300" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-slate-400" />
      </div>

      {/* Bottom half */}
      {renderHalf(domino.bottom)}
    </button>
  );
};
