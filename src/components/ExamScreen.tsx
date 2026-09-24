import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Cloud,
  CheckCircle2,
  Shield,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { Question, SectionType, CandidateGroup } from '../types';
import { DominoPieceView } from './DominoPieceView';
import { playTickWarningSound } from '../utils/audio';
import { ThemeToggle } from './ThemeToggle';

interface ExamScreenProps {
  candidate: {
    fullName: string;
    documentId: string;
    email: string;
    selectedGroup?: CandidateGroup;
  };
  questions: Question[];
  answers: Record<string, string>;
  onSelectAnswer: (questionId: string, optionId: string) => void;
  onSubmitExam: (timedOut?: boolean) => void;
  onExitToMenu?: () => void;
  durationMinutes?: number;
}

const SECTIONS: { id: SectionType; title: string }[] = [
  { id: 'domino', title: 'Lógica Dominó' },
  { id: 'math', title: 'Matemáticas' },
  { id: 'reading', title: 'Comprensión Lectora' },
  { id: 'psycho', title: 'Psicotécnico & Proyectos' }
];

export const ExamScreen: React.FC<ExamScreenProps> = ({
  candidate,
  questions,
  answers,
  onSelectAnswer,
  onSubmitExam,
  onExitToMenu,
  durationMinutes = 25
}) => {
  const [activeSection, setActiveSection] = useState<SectionType>('domino');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  // Filter questions for active section
  const sectionQuestions = questions.filter(q => q.category === activeSection);
  const currentQuestion = sectionQuestions[currentSectionIndex] || sectionQuestions[0];

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmitExam(true); // Timed out
          return 0;
        }
        if (prev === 60 || prev === 30 || prev === 10) {
          playTickWarningSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onSubmitExam]);

  // When activeSection changes, reset question index
  const handleSectionChange = (sec: SectionType) => {
    setActiveSection(sec);
    setCurrentSectionIndex(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalAnswered = Object.keys(answers).length;
  const isTimeCritical = timeLeft < 180; // less than 3 mins

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-28 pt-4 px-3 sm:px-6">
      {/* Top Navigation Bar */}
      <header className="max-w-5xl mx-auto mb-4">
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          {/* Logo SENA & Candidate Profile */}
          <div className="flex items-center space-x-3">
            {/* Clickable SENA Logo */}
            <button
              type="button"
              onClick={() => setShowConfirmExit(true)}
              className="flex items-center space-x-2 group p-1 -ml-1 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
              title="Volver al Menú Principal (Requiere confirmación)"
            >
              <img
                src="/sena-logo.svg"
                alt="Logo SENA"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="hidden lg:block text-left">
                <span className="block text-[11px] font-bold text-[#008800] uppercase tracking-wider leading-none">
                  SENA ADSO
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">
                  Evaluación
                </span>
              </div>
            </button>

            <div className="hidden sm:block h-8 w-px bg-slate-200" />

            {/* Candidate Profile Pill */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#00af00] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {candidate.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {candidate.fullName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#008800] text-[10px] font-bold border border-emerald-200">
                    {candidate.selectedGroup || 'Grupo A'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                  <span>CC: {candidate.documentId}</span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center text-[#008800] font-semibold">
                    <Cloud className="w-3 h-3 mr-0.5 text-[#00af00]" />
                    Nube Activa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Timer Bubble */}
          <div
            className={`px-4 py-1.5 rounded-lg border flex items-center space-x-2 ${
              isTimeCritical
                ? 'bg-red-50 border-red-300 text-red-600 ring-2 ring-red-400/20'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-red-500' : 'text-[#00af00]'}`} />
            <span className="font-mono text-base sm:text-lg font-bold tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-500 hidden sm:inline">
              restante
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <ThemeToggle variant="button" />
            <button
              type="button"
              onClick={() => setShowConfirmSubmit(true)}
              className="px-4 py-2 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>Finalizar</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Section Selector */}
        <div className="mt-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex overflow-x-auto gap-1">
          {SECTIONS.map(sec => {
            const isActive = activeSection === sec.id;
            const qInSection = questions.filter(q => q.category === sec.id);
            const answeredCount = qInSection.filter(q => !!answers[q.id]).length;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSectionChange(sec.id)}
                className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer select-none border ${
                  isActive
                    ? 'bg-[#00af00] text-white border-[#00af00] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{sec.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    answeredCount === qInSection.length && qInSection.length > 0
                      ? isActive
                        ? 'bg-white text-[#008800]'
                        : 'bg-emerald-100 text-emerald-800'
                      : isActive
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {answeredCount}/{qInSection.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Question quick jump bubbles */}
        <div className="mt-2.5 flex items-center space-x-1.5 overflow-x-auto py-1 px-1">
          {sectionQuestions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === currentSectionIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentSectionIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center justify-center cursor-pointer border ${
                  isCurrent
                    ? 'bg-[#00af00] text-white border-[#00af00] shadow-xs'
                    : isAnswered
                    ? 'bg-emerald-50 text-[#008800] border-emerald-300'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Question Card Area */}
      <main className="max-w-4xl mx-auto">
        {currentQuestion ? (
          <div
            key={currentQuestion.id}
            className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm"
          >
            {/* Question Header */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                  Pregunta {currentSectionIndex + 1} de {sectionQuestions.length}
                </span>
                <span className="text-xs font-bold text-[#008800] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {candidate.selectedGroup || currentQuestion.targetGroup || 'Grupo A'}
                </span>
                <span className="text-xs text-slate-400">
                  &bull; {currentQuestion.points || 1} {currentQuestion.points === 1 ? 'punto' : 'puntos'}
                </span>
              </div>
              {answers[currentQuestion.id] && (
                <span className="inline-flex items-center text-[#008800] text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#00af00]" />
                  Respondida
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug tracking-tight">
              {currentQuestion.title}
            </h2>

            {/* Reading Context Text if present */}
            {currentQuestion.contextText && (
              <div className="my-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed font-sans shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <span>Texto de Caso Técnico:</span>
                </div>
                {currentQuestion.contextText}
              </div>
            )}

            {/* Question Description / Prompt */}
            {currentQuestion.description && (
              <p className="text-slate-600 text-sm mb-6 leading-relaxed font-normal">
                {currentQuestion.description}
              </p>
            )}

            {/* ------------------------------------------------ */}
            {/* 1. DOMINO SEQUENCE PATTERN DISPLAY */}
            {/* ------------------------------------------------ */}
            {currentQuestion.category === 'domino' && currentQuestion.dominoSequence && (
              <div className="my-6 p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Secuencia Lógica de Dominó:
                </div>

                {/* Horizontal Domino Row */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 py-2">
                  {currentQuestion.dominoSequence.map((tile, idx) => (
                    <React.Fragment key={idx}>
                      <DominoPieceView domino={tile} isQuestionMark={tile === null} size="md" />
                      {idx < currentQuestion.dominoSequence!.length - 1 && (
                        <div className="text-slate-400 font-bold text-lg hidden sm:block">&rarr;</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="text-xs text-slate-500 mt-4 text-center font-normal">
                  Selecciona abajo la ficha que completa coherentemente la regla o ciclo del dominó.
                </div>
              </div>
            )}

            {/* ------------------------------------------------ */}
            {/* OPTIONS LIST (DOMINO OR STANDARD TEXT) */}
            {/* ------------------------------------------------ */}
            <div className="mt-6">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Opciones de Respuesta:
              </div>

              {currentQuestion.category === 'domino' ? (
                // Domino Grid Options
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {currentQuestion.options.map((opt, oIdx) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => onSelectAnswer(currentQuestion.id, opt.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50/80 border-[#00af00] ring-2 ring-[#00af00]/25 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-700 mb-2">
                          Opción {String.fromCharCode(65 + oIdx)}
                        </div>
                        {opt.domino && (
                          <DominoPieceView
                            domino={opt.domino}
                            selected={isSelected}
                            size="md"
                          />
                        )}
                        <div className="text-xs font-medium text-slate-800 mt-3 text-center">
                          {opt.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Standard Multiple Choice Text Options
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, oIdx) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onSelectAnswer(currentQuestion.id, opt.id)}
                        className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-start space-x-3 ${
                          isSelected
                            ? 'bg-emerald-50/80 border-[#00af00] ring-2 ring-[#00af00]/25 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isSelected
                              ? 'bg-[#00af00] text-white'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <div className="flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                          {opt.text}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200">
            No hay preguntas en esta sección.
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentSectionIndex === 0}
            onClick={() => setCurrentSectionIndex(prev => Math.max(0, prev - 1))}
            className="py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold shadow-xs flex items-center space-x-1.5 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="text-xs font-medium text-slate-600 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200">
            Respondidas: <strong className="text-slate-900 font-bold">{totalAnswered}</strong> de {questions.length}
          </div>

          {currentSectionIndex < sectionQuestions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentSectionIndex(prev => prev + 1)}
              className="py-2.5 px-4 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const currentSecIdx = SECTIONS.findIndex(s => s.id === activeSection);
                if (currentSecIdx < SECTIONS.length - 1) {
                  handleSectionChange(SECTIONS[currentSecIdx + 1].id);
                } else {
                  setShowConfirmSubmit(true);
                }
              }}
              className="py-2.5 px-5 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>{activeSection === 'psycho' ? 'Finalizar Examen' : 'Siguiente Sección'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      {/* Confirmation Modal before early finishing */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-[#00af00] border border-emerald-200 mx-auto flex items-center justify-center mb-3">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              ¿Deseas entregar la prueba ahora?
            </h3>
            <p className="text-slate-600 text-xs mb-5 leading-relaxed font-normal">
              Has respondido <strong>{totalAnswered}</strong> de <strong>{questions.length}</strong> preguntas del <strong className="text-slate-900">{candidate.selectedGroup || 'Grupo A'}</strong>.
              Al entregar, se evaluarán tus resultados y perfil psicotécnico de forma automática.
            </p>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Seguir respondiendo
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmSubmit(false);
                  onSubmitExam(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Sí, Entregar Prueba
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Exit Exam to Main Menu */}
      {showConfirmExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              ¿Estás seguro de que deseas salir del examen?
            </h3>
            <p className="text-slate-600 text-xs mb-5 leading-relaxed font-normal">
              Estás en medio de la evaluación de admisión ADSO. Si decides salir ahora, volverás al menú principal y <strong>se perderá el progreso de las preguntas respondidas</strong> en esta sesión.
            </p>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowConfirmExit(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Continuar con el Examen
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmExit(false);
                  if (onExitToMenu) {
                    onExitToMenu();
                  }
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Sí, Salir al Menú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
