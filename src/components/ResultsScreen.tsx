import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  Clock,
  RotateCcw,
  Brain,
  Layers,
  Sparkles,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Grid,
  Calculator,
  BookOpen
} from 'lucide-react';
import { CandidateSubmission, Question } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface ResultsScreenProps {
  submission: CandidateSubmission;
  questions: Question[];
  onRestart: () => void;
  onOpenCandidatesManagement?: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  submission,
  questions,
  onRestart
}) => {
  const { scores, groupAssigned } = submission;
  const { psychoSummary } = scores;
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleResendEmail = async () => {
    if (!submission.email) {
      setEmailStatus({
        type: 'error',
        message: 'No se encontró un correo asociado a este examen.'
      });
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: submission.email.trim(),
          candidate: submission
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStatus({
          type: 'success',
          message: data.mode === 'live'
            ? `Copia oficial enviada correctamente a ${submission.email}`
            : `Copia generada exitosamente para ${submission.email} (Servicio activo).`
        });
      } else {
        setEmailStatus({
          type: 'error',
          message: data.message || data.error || 'Error al conectar con el servidor de correo.'
        });
      }
    } catch (err: any) {
      setEmailStatus({
        type: 'error',
        message: 'Fallo de red al intentar reenviar el correo.'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Group styles and descriptions
  const GROUP_CONFIG = {
    'Grupo A': {
      color: 'text-slate-900',
      bg: 'bg-emerald-50',
      border: 'border-[#00af00]',
      badge: 'bg-[#00af00] text-white',
      title: 'Grupo A • Apto Directo (Sobresaliente)',
      description: 'El postulante demostró alto dominio en lógica de dominó, pensamiento algorítmico y comprensión analítica de software. Cumple con el perfil de ingreso preferencial para ADSO.'
    },
    'Grupo B': {
      color: 'text-slate-900',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      badge: 'bg-amber-600 text-white',
      title: 'Grupo B • Lista de Espera / Apto con Nivelación',
      description: 'El postulante evidencia bases sólidas y buena predisposición al aprendizaje. Se recomienda plan de nivelación en lógica algorítmica y razonamiento preliminar.'
    },
    'Grupo C': {
      color: 'text-slate-900',
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      badge: 'bg-rose-600 text-white',
      title: 'Grupo C • Requiere Refuerzo Académico',
      description: 'El rendimiento obtenido se sitúa por debajo del umbral mínimo de suficiencia técnica requerido para el programa intensivo ADSO. Se recomienda fortalecer pensamiento lógico básico.'
    }
  }[groupAssigned];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center space-x-3.5 group text-left cursor-pointer p-1 -ml-1 rounded-lg hover:bg-slate-50 transition-colors"
            title="Volver al Menú Principal (SENA ADSO)"
          >
            <img
              src="/sena-logo.svg"
              alt="Logo SENA"
              className="w-11 h-11 object-contain group-hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-[#008800] transition-colors">
                Resultados de Selección • ADSO
              </h1>
              <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5 font-normal">
                <span className="font-semibold text-slate-800">{submission.fullName}</span>
                <span>&bull;</span>
                <span>CC: {submission.documentId}</span>
                <span>&bull;</span>
                <span className="text-[#008800] font-semibold inline-flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-0.5 text-[#00af00]" />
                  Nube conectada
                </span>
              </div>
            </div>
          </button>

          <div className="flex items-center space-x-2">
            <ThemeToggle variant="button" />
            <button
              type="button"
              onClick={onRestart}
              className="px-4 py-2 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nuevo Examen</span>
            </button>
          </div>
        </div>

        {/* Big Group Classification Banner */}
        <div
          className={`p-6 sm:p-7 rounded-xl border ${GROUP_CONFIG.border} ${GROUP_CONFIG.bg} shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6`}
        >
          {/* Circular Percentage Gauge */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#00af00]"
                strokeDasharray={`${scores.percentage}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {scores.percentage}%
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-500">
                Puntaje
              </span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-2">
              <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${GROUP_CONFIG.badge}`}>
                Clasificación: {groupAssigned}
              </span>
              <span className="px-3 py-1 rounded text-xs font-semibold bg-white text-slate-800 border border-slate-300 shadow-xs">
                Presentado en: {submission.selectedGroup || 'Grupo A'}
              </span>
            </div>
            <h2 className={`text-xl font-bold ${GROUP_CONFIG.color} mb-2 tracking-tight`}>
              {GROUP_CONFIG.title}
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 font-normal">
              {GROUP_CONFIG.description}
            </p>
            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4 justify-center sm:justify-start font-normal">
              <span>Puntaje Total: <strong className="text-slate-900 font-bold">{scores.totalScore} / {scores.totalMax} pts</strong></span>
              <span>&bull;</span>
              <span>Tiempo Empleado: <strong className="text-slate-900 font-bold">{Math.floor(submission.timeSpentSeconds / 60)} min {submission.timeSpentSeconds % 60} seg</strong></span>
              {submission.timedOut && (
                <>
                  <span>&bull;</span>
                  <span className="text-rose-600 font-semibold">Compuerta cerrada por tiempo</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Evaluation Scores by Academic Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Domino Module */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#00af00] border border-emerald-200 flex items-center justify-center">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Lógica Dominó</h3>
                  <span className="text-[10px] text-slate-500 font-normal">Patrones Secuenciales</span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#008800]">
                {scores.dominoScore} / {scores.dominoMax}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#00af00] rounded-full transition-all"
                style={{ width: `${(scores.dominoScore / (scores.dominoMax || 1)) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-2">
              {Math.round((scores.dominoScore / (scores.dominoMax || 1)) * 100)}% de efectividad lógica
            </div>
          </div>

          {/* Math Module */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#00af00] border border-emerald-200 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Análisis Matemático</h3>
                  <span className="text-[10px] text-slate-500 font-normal">Algoritmia y Cálculo</span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#008800]">
                {scores.mathScore} / {scores.mathMax}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#00af00] rounded-full transition-all"
                style={{ width: `${(scores.mathScore / (scores.mathMax || 1)) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-2">
              {Math.round((scores.mathScore / (scores.mathMax || 1)) * 100)}% de aciertos cuantitativos
            </div>
          </div>

          {/* Reading Module */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded bg-emerald-50 text-[#00af00] border border-emerald-200 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Comprensión Lectora</h3>
                  <span className="text-[10px] text-slate-500 font-normal">Contextos Técnicos</span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#008800]">
                {scores.readingScore} / {scores.readingMax}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#00af00] rounded-full transition-all"
                style={{ width: `${(scores.readingScore / (scores.readingMax || 1)) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-2">
              {Math.round((scores.readingScore / (scores.readingMax || 1)) * 100)}% de asimilación analítica
            </div>
          </div>
        </div>

        {/* Psychological & Project Management Profile */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-6">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-[#00af00] flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Diagnóstico Psicotécnico y Gestión de Proyectos
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Estilo de Aprendizaje (VARK) y Metodología Laboral (Ágil, Tradicional o Híbrida)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Estilo de Aprendizaje */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Estilo de Aprendizaje Dominante
              </div>
              <div className="text-base font-bold text-slate-900 mb-2 flex items-center space-x-2">
                <span>{psychoSummary.dominantLearning}</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-[#008800] border border-emerald-200">
                  Preferencial
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed font-normal">
                {psychoSummary.dominantLearning === 'Visual' &&
                  'Asimila mejor mediante diagramas de flujo, modelos relacionales, esquemas arquitectónicos y prototipos visuales.'}
                {psychoSummary.dominantLearning === 'Auditivo' &&
                  'Aprende de manera óptima mediante debates de código, explicaciones orales y sesiones de rubber-duck debugging.'}
                {psychoSummary.dominantLearning === 'Kinestésico' &&
                  'Aprende programando: manipulando código real, probando en terminal y resolviendo problemas de forma empírica.'}
              </p>

              {/* Distribution bars */}
              <div className="space-y-2 text-xs">
                {(['Visual', 'Auditivo', 'Kinestésico'] as const).map(style => (
                  <div key={style} className="flex items-center justify-between font-normal">
                    <span className="text-slate-700">{style}:</span>
                    <div className="flex items-center space-x-2 w-1/2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00af00] rounded-full"
                          style={{ width: `${(psychoSummary.learningScores[style] / 10) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 w-4 text-right">
                        {psychoSummary.learningScores[style]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Tipo de Gestión de Proyectos */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Metodología de Trabajo Afín
              </div>
              <div className="text-base font-bold text-slate-900 mb-2 flex items-center space-x-2">
                <span>{psychoSummary.dominantManagement}</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  {psychoSummary.dominantManagement === 'Ágil' ? 'Scrum / Kanban' : psychoSummary.dominantManagement === 'Tradicional' ? 'Cascada / Estructurado' : 'Mixto Flexible'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed font-normal">
                {psychoSummary.dominantManagement === 'Ágil' &&
                  'Se adapta con soltura a iteraciones cortas, tableros Kanban, entregas de valor continuo y retroalimentación iterativa.'}
                {psychoSummary.dominantManagement === 'Tradicional' &&
                  'Prioriza la arquitectura documentada, especificaciones funcionales previas, cronogramas secuenciales y control de cambios.'}
                {psychoSummary.dominantManagement === 'Híbrida' &&
                  'Combina la solidez de una arquitectura inicial planificada con la agilidad y sprints iterativos de desarrollo.'}
              </p>

              {/* Distribution bars */}
              <div className="space-y-2 text-xs">
                {(['Ágil', 'Tradicional', 'Híbrida'] as const).map(mgmt => (
                  <div key={mgmt} className="flex items-center justify-between font-normal">
                    <span className="text-slate-700">{mgmt}:</span>
                    <div className="flex items-center space-x-2 w-1/2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-700 rounded-full"
                          style={{ width: `${(psychoSummary.managementScores[mgmt] / 10) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 w-4 text-right">
                        {psychoSummary.managementScores[mgmt]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Role Card */}
          <div className="mt-5 p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start space-x-3">
            <div className="w-8 h-8 rounded bg-[#00af00] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#008800] uppercase tracking-wider">
                Rol Recomendado en Célula de Desarrollo ADSO:
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {psychoSummary.recommendedRole}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                {psychoSummary.roleDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Email Delivery Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-[#00af00] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Copia Oficial de la Evaluación
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    Envío automático
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-normal">
                  Se ha despachado un informe con el desglose de puntajes y perfil psicotécnico a:
                </p>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {submission.email || 'Correo no registrado'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResendEmail}
              disabled={isSendingEmail || !submission.email}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 shrink-0 shadow-xs transition-all cursor-pointer ${
                isSendingEmail || !submission.email
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#00af00] hover:bg-[#009600] text-white'
              }`}
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Reenviar a mi correo</span>
                </>
              )}
            </button>
          </div>

          {/* Feedback message */}
          {emailStatus && (
            <div
              className={`mt-4 p-3 rounded-lg text-xs font-medium flex items-center space-x-2 ${
                emailStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {emailStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{emailStatus.message}</span>
            </div>
          )}
        </div>

        {/* Status card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center space-x-2.5 text-xs font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00af00] shrink-0" />
          <span>Resultado registrado exitosamente en la base de datos central de admisiones.</span>
        </div>
      </div>
    </div>
  );
};
