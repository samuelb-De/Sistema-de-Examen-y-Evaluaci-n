import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  BookOpen,
  Users,
  Terminal,
  FileSpreadsheet,
  FileJson,
  Plus,
  RotateCcw,
  Edit2,
  Trash2,
  Check,
  Search,
  Eye,
  Mail,
  LogOut,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
  Clock,
  FileUp,
  Send,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Brain,
  Loader2,
  ShieldCheck,
  Calculator,
  Grid
} from 'lucide-react';
import { Question, CandidateSubmission, SectionType, CandidateGroup } from '../types';
import { DominoPieceView } from './DominoPieceView';
import { ThemeToggle } from './ThemeToggle';

interface AdminDashboardProps {
  questions: Question[];
  candidates: CandidateSubmission[];
  durationMinutes: number;
  onUpdateDurationMinutes: (minutes: number) => Promise<void>;
  onRefreshQuestions: () => Promise<void>;
  onSaveQuestion: (question: Question) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
  onResetDefaults: () => Promise<void>;
  onDeleteCandidate: (id: string) => Promise<void>;
  onClearAllCandidates: () => Promise<void>;
  onSwitchToStudent: () => void;
  onSelectCandidateDetails: (candidate: CandidateSubmission) => void;
  onOpenPythonTools: () => void;
}

const GROUPS: CandidateGroup[] = ['Grupo A', 'Grupo B', 'Grupo C'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  questions,
  candidates,
  durationMinutes,
  onUpdateDurationMinutes,
  onRefreshQuestions,
  onSaveQuestion,
  onDeleteQuestion,
  onResetDefaults,
  onDeleteCandidate,
  onClearAllCandidates,
  onSwitchToStudent,
  onSelectCandidateDetails,
  onOpenPythonTools
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'users'>('questions');
  const [activeGroup, setActiveGroup] = useState<'all' | CandidateGroup>('all');
  const [activeCategory, setActiveCategory] = useState<'all' | SectionType>('all');
  const [searchQuestion, setSearchQuestion] = useState('');
  const [userGroupFilter, setUserGroupFilter] = useState<'all' | CandidateGroup>('all');
  const [searchUser, setSearchUser] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  // In-app deletion and inspection states (avoids window.confirm iframe blocks)
  const [candidateToDelete, setCandidateToDelete] = useState<CandidateSubmission | null>(null);
  const [isDeletingCandidate, setIsDeletingCandidate] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [inspectedCandidate, setInspectedCandidate] = useState<CandidateSubmission | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);

  // Time settings state
  const [timeMinutes, setTimeMinutes] = useState<number>(durationMinutes || 25);
  const [isSavingTime, setIsSavingTime] = useState(false);
  const [timeSavedNotice, setTimeSavedNotice] = useState(false);

  useEffect(() => {
    setTimeMinutes(durationMinutes);
  }, [durationMinutes]);

  // PDF upload & auto-parse states
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTargetGroup, setPdfTargetGroup] = useState<CandidateGroup>('Grupo A');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const [pdfErrorMessage, setPdfErrorMessage] = useState<string | null>(null);

  // Global Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailCandidate, setEmailCandidate] = useState<CandidateSubmission | null>(null);
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Gemini AI generation state in AdminDashboard
  const [showAiQuestionModal, setShowAiQuestionModal] = useState(false);
  const [aiQuestionTopic, setAiQuestionTopic] = useState('');
  const [aiQuestionCategory, setAiQuestionCategory] = useState<SectionType>('math');
  const [aiQuestionGroup, setAiQuestionGroup] = useState<CandidateGroup>('Grupo A');
  const [isGeneratingAiQuestion, setIsGeneratingAiQuestion] = useState(false);

  const handleGenerateAiQuestion = async () => {
    setIsGeneratingAiQuestion(true);
    try {
      const res = await fetch('/api/generate-question-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: aiQuestionCategory,
          targetGroup: aiQuestionGroup,
          topic: aiQuestionTopic
        })
      });
      const data = await res.json();
      if (data.success && data.question) {
        setEditingQuestion(data.question);
        setIsCreating(true);
        setShowAiQuestionModal(false);
        setAiQuestionTopic('');
      } else {
        alert('No se pudo generar la pregunta: ' + (data.error || 'Fallo desconocido'));
      }
    } catch (err: any) {
      alert('Error al contactar con el motor de IA: ' + err.message);
    } finally {
      setIsGeneratingAiQuestion(false);
    }
  };

  // Filter questions for active group, category, and search keyword
  const filteredQuestions = questions.filter(q => {
    const matchesGroup = activeGroup === 'all' || q.targetGroup === activeGroup;
    const matchesCategory = activeCategory === 'all' || q.category === activeCategory;
    const matchesSearch =
      searchQuestion.trim() === '' ||
      q.title.toLowerCase().includes(searchQuestion.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(searchQuestion.toLowerCase())) ||
      (q.targetGroup && q.targetGroup.toLowerCase().includes(searchQuestion.toLowerCase())) ||
      q.id.toLowerCase().includes(searchQuestion.toLowerCase());
    return matchesGroup && matchesCategory && matchesSearch;
  });

  // Filter candidates for search and group
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch =
      searchUser.trim() === '' ||
      c.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
      c.documentId.includes(searchUser) ||
      c.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      c.groupAssigned.toLowerCase().includes(searchUser.toLowerCase()) ||
      (c.selectedGroup && c.selectedGroup.toLowerCase().includes(searchUser.toLowerCase()));

    const matchesGroup =
      userGroupFilter === 'all' ||
      c.groupAssigned === userGroupFilter ||
      c.selectedGroup === userGroupFilter;

    return matchesSearch && matchesGroup;
  });

  const startCreate = () => {
    const targetGroup = activeGroup === 'all' ? 'Grupo A' : activeGroup;
    const category = activeCategory === 'all' ? 'domino' : activeCategory;
    const newId = `${targetGroup.replace(' ', '')}-${category}-${Date.now().toString().slice(-5)}`;
    if (category === 'domino') {
      setEditingQuestion({
        id: newId,
        targetGroup: targetGroup,
        category: 'domino',
        title: `Secuencia de Dominó (${targetGroup})`,
        description: 'Determina el patrón lógico de avance entre las fichas.',
        dominoSequence: [
          { top: 1, bottom: 2 },
          { top: 2, bottom: 3 },
          { top: 3, bottom: 4 },
          null
        ],
        options: [
          { id: 'opt-a', text: '4 / 5', domino: { top: 4, bottom: 5 } },
          { id: 'opt-b', text: '4 / 4', domino: { top: 4, bottom: 4 } },
          { id: 'opt-c', text: '5 / 6', domino: { top: 5, bottom: 6 } },
          { id: 'opt-d', text: '3 / 5', domino: { top: 3, bottom: 5 } }
        ],
        correctAnswerId: 'opt-a',
        explanation: 'Las caras avanzan progresivamente de uno en uno.',
        points: 1
      });
    } else {
      setEditingQuestion({
        id: newId,
        targetGroup: targetGroup,
        category: category,
        title: `Nueva Pregunta de ${category.toUpperCase()} (${targetGroup})`,
        description: 'Descripción técnica del problema a resolver.',
        options: [
          { id: 'opt-a', text: 'Opción A' },
          { id: 'opt-b', text: 'Opción B' },
          { id: 'opt-c', text: 'Opción C' },
          { id: 'opt-d', text: 'Opción D' }
        ],
        correctAnswerId: 'opt-a',
        explanation: 'Fundamento conceptual de la respuesta correcta.',
        points: 1
      });
    }
    setIsCreating(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    setIsSaving(true);
    try {
      await onSaveQuestion(editingQuestion);
      setEditingQuestion(null);
      setIsCreating(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickEmail = async (candidate: CandidateSubmission) => {
    setEmailStatus(`Enviando a ${candidate.email} vía Python...`);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: candidate.email, candidate })
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatus(`Correo enviado con éxito a ${candidate.email}`);
      } else {
        setEmailStatus(`Error: ${data.error || 'Fallo de envío'}`);
      }
    } catch (err: any) {
      setEmailStatus(`Error: ${err.message}`);
    }
    setTimeout(() => setEmailStatus(null), 4000);
  };

  const handleSaveDuration = async () => {
    setIsSavingTime(true);
    try {
      await onUpdateDurationMinutes(timeMinutes);
      setTimeSavedNotice(true);
      setTimeout(() => setTimeSavedNotice(false), 3000);
    } finally {
      setIsSavingTime(false);
    }
  };

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      setPdfErrorMessage('Por favor selecciona un archivo PDF primero.');
      return;
    }
    setIsUploadingPdf(true);
    setPdfErrorMessage(null);
    setPdfSuccessMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const res = await fetch('/api/upload-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64,
              targetGroup: pdfTargetGroup
            })
          });
          const data = await res.json();
          if (data.success) {
            setPdfSuccessMessage(data.message || `¡Preguntas cargadas con éxito!`);
            setPdfFile(null);
            await onRefreshQuestions();
          } else {
            setPdfErrorMessage(data.error || 'Error al procesar el archivo PDF.');
          }
        } catch (err: any) {
          setPdfErrorMessage('Error de red: ' + err.message);
        } finally {
          setIsUploadingPdf(false);
        }
      };
      reader.readAsDataURL(pdfFile);
    } catch (err: any) {
      setPdfErrorMessage('Error al leer el archivo: ' + err.message);
      setIsUploadingPdf(false);
    }
  };

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCandidate) {
      setEmailFeedback({ type: 'error', msg: 'Selecciona un postulante para despachar el informe.' });
      return;
    }
    const recipient = emailRecipient.trim() || emailCandidate.email;
    if (!recipient.includes('@')) {
      setEmailFeedback({ type: 'error', msg: 'Ingresa un correo electrónico válido.' });
      return;
    }

    setIsSendingEmail(true);
    setEmailFeedback(null);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          candidate: emailCandidate
        })
      });
      const data = await res.json();
      if (data.success) {
        setEmailFeedback({
          type: 'success',
          msg: data.message || `Informe despachado exitosamente mediante Python smtplib a ${recipient}.`
        });
      } else {
        setEmailFeedback({
          type: 'error',
          msg: data.error || 'No se pudo enviar el correo.'
        });
      }
    } catch (err: any) {
      setEmailFeedback({
        type: 'error',
        msg: 'Error al comunicarse con el servidor: ' + err.message
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4FA] text-slate-900 pb-20 pt-6 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Top Floating iOS Bar */}
        <header className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onSwitchToStudent}
            className="flex items-center space-x-3.5 group text-left cursor-pointer p-1 -ml-1 rounded-lg hover:bg-slate-50 transition-colors"
            title="Volver al Menú Principal (SENA ADSO)"
          >
            <img
              src="/sena-logo.svg"
              alt="Logo SENA"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-[#008800] transition-colors">
                  Panel de Administrador ADSO
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#008800] text-[11px] font-semibold border border-emerald-200">
                  Control Total
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configura preguntas independientes por Grupo (A, B, C) y supervisa historias de usuarios
              </p>
            </div>
          </button>

          <div className="flex items-center space-x-2">
            <ThemeToggle variant="button" />
            <button
              type="button"
              onClick={onSwitchToStudent}
              className="px-4 py-2 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>Presentar Examen (Estudiante)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Configuración de Tiempo, Carga Automática de PDF y Exportaciones */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            {/* 1. Time Settings */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center space-x-2 text-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00af00] flex items-center justify-center border border-emerald-100">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800">Duración de la Prueba</div>
                  <div className="text-[11px] text-slate-500">Configura el tiempo límite</div>
                </div>
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                {[15, 20, 25, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTimeMinutes(mins)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      timeMinutes === mins
                        ? 'bg-[#00af00] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={timeMinutes}
                  onChange={e => setTimeMinutes(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded-md bg-white border border-slate-300 text-xs font-bold text-center text-slate-800 outline-none focus:border-[#00af00]"
                />
                <span className="text-xs text-slate-500 font-medium">min</span>

                <button
                  type="button"
                  onClick={handleSaveDuration}
                  disabled={isSavingTime}
                  className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 shadow-xs disabled:opacity-50"
                >
                  {isSavingTime ? (
                    <span>Guardando...</span>
                  ) : timeSavedNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>¡Guardado!</span>
                    </>
                  ) : (
                    <span>Guardar Tiempo</span>
                  )}
                </button>
              </div>
            </div>

            {/* 2. PDF Auto-Loader Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setIsPdfModalOpen(true);
                setPdfErrorMessage(null);
                setPdfSuccessMessage(null);
              }}
              className="px-3.5 py-2 rounded-lg bg-white border border-[#00af00] text-[#00af00] hover:bg-[#00af00] hover:text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <FileUp className="w-4 h-4" />
              <span>Subir PDF y Cargar Preguntas</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-[#008800] text-[10px] font-bold">Auto</span>
            </button>
          </div>

          {/* Central Global Export & Python Email Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-xs font-medium text-slate-600 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00af00]" />
              <span>Exportación Central de Resultados e Informes por Correo:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (candidates.length > 0) {
                    setEmailCandidate(candidates[0]);
                    setEmailRecipient(candidates[0].email);
                  }
                  setIsEmailModalOpen(true);
                  setEmailFeedback(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 text-slate-600" />
                <span>Enviar Informe por Correo</span>
              </button>

              <a
                href="/api/export/csv"
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Descargar CSV</span>
              </a>

              <a
                href="/api/export/json"
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <FileJson className="w-3.5 h-3.5 text-slate-600" />
                <span>Descargar JSON</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex space-x-1">
          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`flex-1 py-2.5 px-4 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'questions'
                ? 'bg-white text-[#008800] shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Gestión de Preguntas por Grupo ({questions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2.5 px-4 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'users'
                ? 'bg-white text-[#008800] shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Historias de Usuarios y Evaluaciones ({candidates.length})</span>
          </button>
        </div>

        {/* TAB 1: GESTIÓN DE PREGUNTAS POR GRUPO */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {/* Group Selector Cards: Todos los Grupos, Grupo A, Grupo B, Grupo C */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Card 1: Todos los Grupos */}
              <button
                type="button"
                onClick={() => {
                  setActiveGroup('all');
                  setEditingQuestion(null);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
                  activeGroup === 'all'
                    ? 'border-[#00af00] ring-2 ring-[#00af00]/20 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {activeGroup === 'all' && (
                  <div className="absolute top-0 right-0 bg-[#00af00] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-md">
                    ACTIVO
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-slate-900">Todos los Grupos</div>
                  <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 mt-2">
                    {questions.length} Preguntas Totales
                  </span>
                </div>
              </button>

              {/* Cards for Grupo A, Grupo B, Grupo C */}
              {GROUPS.map(g => {
                const isSelected = activeGroup === g;
                const count = questions.filter(q => q.targetGroup === g).length;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setActiveGroup(g);
                      setEditingQuestion(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#00af00] ring-2 ring-[#00af00]/20 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-[#00af00] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-md">
                        ACTIVO
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-slate-900">{g}</div>
                      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 mt-2">
                        {count} Preguntas
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sub-bar: Category Selector, Search and Action Buttons */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto">
                {(
                  [
                    { id: 'all', label: 'Todas las Áreas' },
                    { id: 'domino', label: 'Dominó' },
                    { id: 'math', label: 'Matemáticas' },
                    { id: 'reading', label: 'Comprensión Lectora' },
                    { id: 'psycho', label: 'Psicotécnico' }
                  ] as const
                ).map(cat => {
                  const isCat = activeCategory === cat.id;
                  const catCount =
                    cat.id === 'all'
                      ? (activeGroup === 'all'
                          ? questions.length
                          : questions.filter(q => q.targetGroup === activeGroup).length)
                      : (activeGroup === 'all'
                          ? questions.filter(q => q.category === cat.id).length
                          : questions.filter(q => q.targetGroup === activeGroup && q.category === cat.id).length);

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setEditingQuestion(null);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                        isCat
                          ? 'bg-[#00af00] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isCat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {catCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Questions Input */}
              <div className="relative min-w-[200px] flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuestion}
                  onChange={e => setSearchQuestion(e.target.value)}
                  placeholder="Buscar preguntas..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 focus:border-[#00af00] text-xs text-slate-900 outline-none font-medium"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setAiQuestionCategory(activeCategory === 'all' ? 'math' : activeCategory);
                    setAiQuestionGroup(activeGroup === 'all' ? 'Grupo A' : activeGroup);
                    setShowAiQuestionModal(true);
                  }}
                  disabled={isGeneratingAiQuestion}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="Crear pregunta con Gemini AI para la temática seleccionada"
                >
                  {isGeneratingAiQuestion ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                  )}
                  <span>Crear con IA (Gemini)</span>
                </button>
                <button
                  type="button"
                  onClick={startCreate}
                  className="px-3.5 py-1.5 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {activeGroup === 'all' ? 'Nueva Pregunta' : `Nueva Pregunta para ${activeGroup}`}
                  </span>
                </button>
              </div>
            </div>

            {/* Editing / Creating Form */}
            {editingQuestion && (
              <motion.form
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                onSubmit={handleSaveQuestion}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {isCreating ? 'Creando Pregunta' : 'Editando Pregunta'} en {editingQuestion.targetGroup} ({editingQuestion.id})
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAiQuestionCategory(editingQuestion.category);
                        setAiQuestionGroup(editingQuestion.targetGroup);
                        setShowAiQuestionModal(true);
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generar con IA (Gemini)</span>
                    </button>
                    <span className="text-slate-300">&bull;</span>
                    <button
                      type="button"
                      onClick={() => setEditingQuestion(null)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                {/* Target Group Radio */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Asignar al Grupo:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {GROUPS.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setEditingQuestion({ ...editingQuestion, targetGroup: g })}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          editingQuestion.targetGroup === g
                            ? 'bg-[#00af00] text-white shadow-xs'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Título de la Pregunta
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.title}
                    onChange={e => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 outline-none focus:border-[#00af00] font-semibold"
                    required
                  />
                </div>

                {editingQuestion.category === 'reading' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Texto de Lectura / Contexto Técnico
                    </label>
                    <textarea
                      rows={3}
                      value={editingQuestion.contextText || ''}
                      onChange={e => setEditingQuestion({ ...editingQuestion, contextText: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#00af00]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Descripción / Enunciado
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.description || ''}
                    onChange={e => setEditingQuestion({ ...editingQuestion, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#00af00]"
                  />
                </div>

                {/* Domino sequence editor */}
                {editingQuestion.category === 'domino' && editingQuestion.dominoSequence && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Secuencia de Fichas (0 a 6 pips, o dejar vacío para la incógnita):
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {editingQuestion.dominoSequence.map((tile, tIdx) => (
                        <div key={tIdx} className="flex flex-col items-center bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] font-semibold text-slate-600 mb-1">
                            #{tIdx + 1} {tile === null ? '(Incógnita)' : ''}
                          </span>
                          {tile === null ? (
                            <div className="w-12 h-20 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-bold text-xl">
                              ?
                            </div>
                          ) : (
                            <div className="flex flex-col space-y-1">
                              <input
                                type="number"
                                min={0}
                                max={6}
                                value={tile.top}
                                onChange={e => {
                                  const newSeq = [...editingQuestion.dominoSequence!];
                                  if (newSeq[tIdx]) {
                                    newSeq[tIdx] = { ...newSeq[tIdx]!, top: parseInt(e.target.value) || 0 };
                                    setEditingQuestion({ ...editingQuestion, dominoSequence: newSeq });
                                  }
                                }}
                                className="w-10 p-1 text-center bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                              />
                              <div className="h-[1px] bg-slate-300 w-full" />
                              <input
                                type="number"
                                min={0}
                                max={6}
                                value={tile.bottom}
                                onChange={e => {
                                  const newSeq = [...editingQuestion.dominoSequence!];
                                  if (newSeq[tIdx]) {
                                    newSeq[tIdx] = { ...newSeq[tIdx]!, bottom: parseInt(e.target.value) || 0 };
                                    setEditingQuestion({ ...editingQuestion, dominoSequence: newSeq });
                                  }
                                }}
                                className="w-10 p-1 text-center bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options editor */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Opciones de Respuesta y Respuesta Correcta:
                  </label>
                  {editingQuestion.options.map((opt, oIdx) => (
                    <div key={opt.id} className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setEditingQuestion({ ...editingQuestion, correctAnswerId: opt.id })}
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
                          editingQuestion.correctAnswerId === opt.id
                            ? 'bg-[#00af00] text-white shadow-xs'
                            : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {editingQuestion.correctAnswerId === opt.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + oIdx)
                        )}
                      </button>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={e => {
                          const newOpts = [...editingQuestion.options];
                          newOpts[oIdx] = { ...newOpts[oIdx], text: e.target.value };
                          setEditingQuestion({ ...editingQuestion, options: newOpts });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#00af00] font-semibold"
                      />

                      {editingQuestion.category === 'domino' && opt.domino && (
                        <div className="flex items-center space-x-1 text-xs">
                          <input
                            type="number"
                            min={0}
                            max={6}
                            value={opt.domino.top}
                            onChange={e => {
                              const newOpts = [...editingQuestion.options];
                              newOpts[oIdx].domino = {
                                ...newOpts[oIdx].domino!,
                                top: parseInt(e.target.value) || 0
                              };
                              setEditingQuestion({ ...editingQuestion, options: newOpts });
                            }}
                            className="w-8 p-1 text-center bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                          />
                          <span className="text-slate-400 font-bold">/</span>
                          <input
                            type="number"
                            min={0}
                            max={6}
                            value={opt.domino.bottom}
                            onChange={e => {
                              const newOpts = [...editingQuestion.options];
                              newOpts[oIdx].domino = {
                                ...newOpts[oIdx].domino!,
                                bottom: parseInt(e.target.value) || 0
                              };
                              setEditingQuestion({ ...editingQuestion, options: newOpts });
                            }}
                            className="w-8 p-1 text-center bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Explicación Justificativa
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.explanation || ''}
                    onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#00af00]"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white font-semibold text-xs shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Guardar Pregunta en Nube</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* Questions List for Filtered Questions */}
            <div className="space-y-3">
              {filteredQuestions.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-200">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No hay preguntas que coincidan con los filtros seleccionados.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeGroup === 'all'
                      ? 'No hay preguntas disponibles en el banco.'
                      : `No hay preguntas en ${activeGroup} para los criterios actuales.`}
                  </p>
                </div>
              ) : (
                filteredQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs flex items-start justify-between gap-4 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          #{idx + 1}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-[#008800] border border-emerald-200">
                          {q.targetGroup || 'Grupo A'}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            q.category === 'domino'
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : q.category === 'math'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : q.category === 'reading'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {q.category === 'domino' && 'Dominó'}
                          {q.category === 'math' && 'Matemáticas'}
                          {q.category === 'reading' && 'Lectura'}
                          {q.category === 'psycho' && 'Psicotécnico'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {q.title}
                        </h3>
                      </div>

                      {q.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 font-normal">
                          {q.description}
                        </p>
                      )}

                      {/* Domino sequence preview if domino question */}
                      {q.category === 'domino' && q.dominoSequence && (
                        <div className="my-2 flex items-center space-x-2 overflow-x-auto py-1">
                          {q.dominoSequence.map((d, dIdx) => (
                            <DominoPieceView key={dIdx} domino={d} isQuestionMark={d === null} size="sm" />
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 font-normal mt-1">
                        {q.options.length} opciones &bull; Correcta:{' '}
                        <span className="font-semibold text-slate-800">
                          {q.correctAnswerId
                            ? q.options.find(o => o.id === q.correctAnswerId)?.text || q.correctAnswerId
                            : 'Evaluación Psicométrica'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQuestion(JSON.parse(JSON.stringify(q)));
                          setIsCreating(false);
                        }}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-[#00af00] border border-slate-200 transition-all cursor-pointer"
                        title="Editar Pregunta"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuestionToDelete(q)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer"
                        title="Eliminar Pregunta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HISTORIAS DE USUARIOS Y EVALUACIONES */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {emailStatus && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[#008800] text-xs font-semibold">
                {emailStatus}
              </div>
            )}

            {/* Top Bar: Search, Group Filter Pills & Actions */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                    placeholder="Buscar usuario por nombre, documento o correo..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 focus:border-[#00af00] text-xs text-slate-900 outline-none transition-all font-medium"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href="/api/export/csv"
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </a>
                  <a
                    href="/api/export/json"
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    <span>JSON</span>
                  </a>
                  {candidates.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowClearAllModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Borrar Todos</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Group filter pills and quick stats */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">Filtrar:</span>
                  {(['all', 'Grupo A', 'Grupo B', 'Grupo C'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setUserGroupFilter(g)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        userGroupFilter === g
                          ? 'bg-[#00af00] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {g === 'all' ? 'Todos los Postulantes' : g}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-medium text-slate-500">
                  Mostrando {filteredCandidates.length} de {candidates.length} historias registradas
                </div>
              </div>
            </div>

            {/* Candidates Grid */}
            {filteredCandidates.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center text-slate-500 border border-slate-200">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                <div className="text-base font-bold text-slate-800">
                  {candidates.length === 0 ? 'No hay postulantes registrados' : 'No se encontraron postulantes con los filtros actuales'}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {candidates.length === 0
                    ? 'Cuando un postulante presente el examen, su historia quedará registrada aquí en la nube.'
                    : 'Intenta modificar el término de búsqueda o selecciona otro grupo.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCandidates.map(c => (
                  <div
                    key={c.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-bold text-slate-900">{c.fullName}</h3>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              Presentó: {c.selectedGroup || 'Grupo A'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {c.documentType || 'CC'}: {c.documentId} &bull; {c.email}
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#00af00] text-white shadow-xs">
                          {c.groupAssigned}
                        </span>
                      </div>

                      {/* Scores */}
                      <div className="grid grid-cols-4 gap-2 text-center my-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                        <div>
                          <div className="font-medium text-slate-500">Dominó</div>
                          <div className="font-bold text-slate-800">{c.scores.dominoScore} pts</div>
                        </div>
                        <div>
                          <div className="font-medium text-slate-500">Matem.</div>
                          <div className="font-bold text-slate-800">{c.scores.mathScore} pts</div>
                        </div>
                        <div>
                          <div className="font-medium text-slate-500">Lectura</div>
                          <div className="font-bold text-slate-800">{c.scores.readingScore} pts</div>
                        </div>
                        <div>
                          <div className="font-medium text-slate-500">Total</div>
                          <div className="font-bold text-[#008800]">{c.scores.percentage}%</div>
                        </div>
                      </div>

                      {/* Psychology & Date */}
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-medium">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          Estilo: {(c as any).learningStyle?.type || c.scores?.psychoSummary?.dominantLearning || 'Visual'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          Gestión: {(c as any).projectManagement?.type || c.scores?.psychoSummary?.dominantManagement || 'Ágil'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          Fecha: {new Date(c.completedAt).toLocaleDateString('es-CO', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setInspectedCandidate(c)}
                        className="px-3 py-1.5 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Resultados</span>
                      </button>

                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEmailCandidate(c);
                            setEmailRecipient(c.email);
                            setIsEmailModalOpen(true);
                          }}
                          title="Enviar informe por correo"
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCandidateToDelete(c)}
                          title="Eliminar resultado"
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: CARGA AUTOMÁTICA DE PREGUNTAS DESDE PDF */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isPdfModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
            <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow-xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  setIsPdfModalOpen(false);
                  setPdfFile(null);
                  setPdfSuccessMessage(null);
                  setPdfErrorMessage(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#00af00] border border-emerald-200 flex items-center justify-center">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Cargar Preguntas desde Archivo PDF
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">
                    El sistema lee el documento y procesa las preguntas automáticamente
                  </p>
                </div>
              </div>

              {pdfSuccessMessage ? (
                <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-[#00af00] mx-auto" />
                  <div className="text-sm font-bold text-emerald-950">{pdfSuccessMessage}</div>
                  <p className="text-xs text-emerald-800">
                    Las preguntas han sido insertadas en el banco de datos y están listas para los postulantes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPdfModalOpen(false);
                      setPdfFile(null);
                      setPdfSuccessMessage(null);
                    }}
                    className="mt-2 px-4 py-2 rounded-lg bg-[#00af00] text-white text-xs font-semibold shadow-xs cursor-pointer hover:bg-[#009600]"
                  >
                    Aceptar y Ver Preguntas
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePdfUpload} className="space-y-4">
                  {/* Target Group Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Grupo Destino para las Preguntas:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {GROUPS.map(grp => (
                        <button
                          key={grp}
                          type="button"
                          onClick={() => setPdfTargetGroup(grp)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            pdfTargetGroup === grp
                              ? 'bg-[#00af00] text-white border-[#00af00] shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {grp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Upload Zone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Seleccionar Documento PDF:
                    </label>
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setPdfFile(e.target.files[0]);
                            setPdfErrorMessage(null);
                          }
                        }}
                        className="hidden"
                      />
                      <Upload className="w-7 h-7 text-[#00af00] mb-2" />
                      {pdfFile ? (
                        <div className="text-center">
                          <div className="text-xs font-bold text-slate-900 flex items-center justify-center space-x-1">
                            <FileText className="w-4 h-4 text-[#00af00]" />
                            <span>{pdfFile.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {(pdfFile.size / 1024).toFixed(1)} KB — Clic para cambiar archivo
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-xs font-semibold text-slate-800">
                            Haz clic para seleccionar o arrastra un archivo PDF aquí
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                            Formatos soportados: Exámenes en PDF con preguntas, opciones y claves
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  {pdfErrorMessage && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{pdfErrorMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPdfModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={!pdfFile || isUploadingPdf}
                      className="px-4 py-2 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingPdf ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Procesando PDF...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Leer y Cargar al {pdfTargetGroup}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: ENVÍO DE INFORME POR CORREO */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl border border-slate-200 relative">
              <button
                type="button"
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setEmailFeedback(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#00af00] border border-emerald-200 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Despachar Informe por Correo
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">
                    Envío automatizado de resultados para el postulante
                  </p>
                </div>
              </div>

              {candidates.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  <p className="text-xs">No hay postulantes registrados todavía.</p>
                </div>
              ) : (
                <form onSubmit={handleSendCustomEmail} className="space-y-4">
                  {/* Select Candidate */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Postulante a Informar:
                    </label>
                    <select
                      value={emailCandidate?.id || ''}
                      onChange={e => {
                        const cand = candidates.find(c => c.id === e.target.value);
                        if (cand) {
                          setEmailCandidate(cand);
                          setEmailRecipient(cand.email);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-[#00af00]"
                    >
                      {candidates.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} — {c.documentId} ({c.groupAssigned || 'Pendiente'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Destination email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Correo Electrónico de Destino:
                    </label>
                    <input
                      type="email"
                      required
                      value={emailRecipient}
                      onChange={e => setEmailRecipient(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-[#00af00]"
                    />
                  </div>

                  {emailCandidate && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900">Resumen del Informe:</div>
                      <div className="text-slate-700">
                        Postulante: <span className="font-semibold">{emailCandidate.fullName}</span>
                      </div>
                      <div className="text-slate-700">
                        Grupo Asignado: <span className="font-bold text-[#008800]">{emailCandidate.groupAssigned}</span> |
                        Puntaje Total: <span className="font-bold text-[#008800]">{emailCandidate.scores?.total || 0} pts</span>
                      </div>
                    </div>
                  )}

                  {emailFeedback && (
                    <div
                      className={`p-3 rounded-lg text-xs font-medium flex items-center space-x-2 border ${
                        emailFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border-rose-200'
                      }`}
                    >
                      {emailFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{emailFeedback.msg}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEmailModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cerrar
                    </button>

                    <button
                      type="submit"
                      disabled={isSendingEmail}
                      className="px-4 py-2 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSendingEmail ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Enviando correo...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Informe por Correo</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: DETALLE E HISTORIA COMPLETA DEL CANDIDATO */}
      {/* ======================================================== */}
      <AnimatePresence>
        {inspectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-xl border border-slate-200 relative my-8 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setInspectedCandidate(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Candidate Header */}
              <div className="flex items-start space-x-3 mb-5 pr-8">
                <div className="w-10 h-10 rounded-lg bg-[#00af00] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                  {inspectedCandidate.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {inspectedCandidate.fullName}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#00af00] text-white shadow-xs">
                      {inspectedCandidate.groupAssigned}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {inspectedCandidate.documentType || 'CC'}: {inspectedCandidate.documentId} &bull; {inspectedCandidate.email}
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Examen presentado para: <span className="font-semibold text-slate-700">{inspectedCandidate.selectedGroup || 'Grupo A'}</span> &bull; {new Date(inspectedCandidate.completedAt).toLocaleString('es-CO')}
                  </div>
                </div>
              </div>

              {/* Overall Score Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Desempeño Global
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {inspectedCandidate.scores.percentage}% de Aciertos
                  </div>
                  <div className="text-xs font-medium text-slate-600">
                    Total Acumulado: {inspectedCandidate.scores.totalScore} puntos
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Asignación Final
                  </div>
                  <div className="text-lg font-bold text-[#008800]">
                    {inspectedCandidate.groupAssigned}
                  </div>
                </div>
              </div>

              {/* Score breakdown modules */}
              <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700">Dominó</div>
                  <div className="text-lg font-bold text-[#008800] mt-0.5">
                    {inspectedCandidate.scores.dominoScore} pts
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">Lógica & Secuencias</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700">Matemáticas</div>
                  <div className="text-lg font-bold text-[#008800] mt-0.5">
                    {inspectedCandidate.scores.mathScore} pts
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">Cálculo & Algoritmia</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700">Comprensión</div>
                  <div className="text-lg font-bold text-[#008800] mt-0.5">
                    {inspectedCandidate.scores.readingScore} pts
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">Lectura Técnica</div>
                </div>
              </div>

              {/* Psychometric & Learning Profile */}
              {(() => {
                const learningType =
                  (inspectedCandidate as any).learningStyle?.type ||
                  inspectedCandidate.scores?.psychoSummary?.dominantLearning ||
                  'Visual';
                const learningDesc =
                  (inspectedCandidate as any).learningStyle?.description ||
                  inspectedCandidate.scores?.psychoSummary?.roleDescription ||
                  'Afinidad por captar requerimientos mediante diagramas de flujo, modelos visuales y esquemas conceptuales.';
                const vScore =
                  (inspectedCandidate as any).learningStyle?.vScore ??
                  inspectedCandidate.scores?.psychoSummary?.learningScores?.Visual ??
                  0;
                const aScore =
                  (inspectedCandidate as any).learningStyle?.aScore ??
                  inspectedCandidate.scores?.psychoSummary?.learningScores?.Auditivo ??
                  0;
                const kScore =
                  (inspectedCandidate as any).learningStyle?.kScore ??
                  inspectedCandidate.scores?.psychoSummary?.learningScores?.Kinestésico ??
                  0;

                const mgmtType =
                  (inspectedCandidate as any).projectManagement?.type ||
                  inspectedCandidate.scores?.psychoSummary?.dominantManagement ||
                  'Ágil';
                const mgmtDesc =
                  (inspectedCandidate as any).projectManagement?.description ||
                  inspectedCandidate.scores?.psychoSummary?.roleDescription ||
                  'Orientación a ciclos iterativos continuos, adaptación ágil al cambio y trabajo colaborativo.';

                const recommendedRole = inspectedCandidate.scores?.psychoSummary?.recommendedRole || `${mgmtType} Developer`;

                const answerList = Array.isArray(inspectedCandidate.answers)
                  ? inspectedCandidate.answers
                  : typeof inspectedCandidate.answers === 'object' && inspectedCandidate.answers !== null
                  ? Object.entries(inspectedCandidate.answers).map(([qId, optId]) => {
                      const q = questions.find(item => item.id === qId);
                      const chosenOpt = q?.options.find(o => o.id === optId);
                      const correctOpt = q?.options.find(o => o.id === q?.correctAnswerId);
                      const isCorrect = optId === q?.correctAnswerId;
                      return {
                        questionId: qId,
                        questionTitle: q?.title || qId,
                        selectedAnswerText: chosenOpt?.text || (optId as string),
                        correctAnswerText: correctOpt?.text || q?.correctAnswerId || '',
                        isCorrect
                      };
                    })
                  : [];

                return (
                  <>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Perfil Psicotécnico y Metodológico
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-[#008800] border border-emerald-200">
                          {recommendedRole}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-bold text-slate-900 block mb-1">
                            Estilo de Aprendizaje: {learningType}
                          </span>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {learningDesc}
                          </p>
                          <div className="flex items-center space-x-2 text-[10px] font-semibold text-slate-500 mt-2">
                            <span>V: {vScore}</span>
                            <span>&bull;</span>
                            <span>A: {aScore}</span>
                            <span>&bull;</span>
                            <span>K: {kScore}</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-bold text-slate-900 block mb-1">
                            Metodología de Proyecto: {mgmtType}
                          </span>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {mgmtDesc}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Answers if present */}
                    {answerList.length > 0 && (
                      <div className="mb-5 space-y-2">
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Desglose de Respuestas ({answerList.length})
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                          {answerList.map((ans: any, aIdx: number) => {
                            const isCorrect = ans.isCorrect;
                            return (
                              <div
                                key={aIdx}
                                className={`p-3 rounded-lg border text-xs ${
                                  isCorrect
                                    ? 'bg-emerald-50/40 border-emerald-200'
                                    : 'bg-rose-50/40 border-rose-200'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-semibold text-slate-800 line-clamp-1">
                                    #{aIdx + 1}. {ans.questionTitle || ans.questionId}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 ${
                                      isCorrect
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                                    }`}
                                  >
                                    {isCorrect ? 'Correcto (+1)' : 'Incorrecto (0)'}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600">
                                  Respuesta elegida:{' '}
                                  <span className="font-semibold text-slate-900">
                                    {ans.selectedAnswerText || ans.selectedOptionId}
                                  </span>
                                </div>
                                {!isCorrect && ans.correctAnswerText && (
                                  <div className="text-[11px] text-emerald-800 mt-0.5 font-medium">
                                    Respuesta correcta: {ans.correctAnswerText}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Modal Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    const toDelete = inspectedCandidate;
                    setInspectedCandidate(null);
                    setCandidateToDelete(toDelete);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Resultado</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailCandidate(inspectedCandidate);
                      setEmailRecipient(inspectedCandidate.email);
                      setIsEmailModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Enviar Correo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectedCandidate(null)}
                    className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 4: CONFIRMACIÓN DE ELIMINACIÓN DE CANDIDATO */}
      {/* ======================================================== */}
      <AnimatePresence>
        {candidateToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-slate-200 text-center">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                ¿Eliminar resultado de evaluación?
              </h3>
              <p className="text-xs text-slate-600 mt-2 font-normal">
                Se eliminará permanentemente la historia de{' '}
                <span className="font-semibold text-slate-900">{candidateToDelete.fullName}</span>{' '}
                ({candidateToDelete.documentType || 'CC'} {candidateToDelete.documentId}) de la base de datos.
              </p>
              <div className="flex items-center space-x-2 mt-5">
                <button
                  type="button"
                  onClick={() => setCandidateToDelete(null)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCandidate(candidateToDelete.id);
                    setCandidateToDelete(null);
                  }}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 5: CONFIRMACIÓN DE BORRADO TOTAL DE CANDIDATOS */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showClearAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-slate-200 text-center">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                ¿Borrar todas las historias de usuarios?
              </h3>
              <p className="text-xs text-slate-600 mt-2 font-normal">
                Esta acción eliminará todas las <span className="font-semibold text-rose-600">{candidates.length}</span> historias de postulantes y resultados del sistema. Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center space-x-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowClearAllModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearAllCandidates();
                    setShowClearAllModal(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
                >
                  Borrar Todo
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 6: CONFIRMACIÓN DE ELIMINACIÓN DE PREGUNTA */}
      {/* ======================================================== */}
      <AnimatePresence>
        {questionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-slate-200 text-center">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                ¿Eliminar esta pregunta?
              </h3>
              <p className="text-xs text-slate-600 mt-2 font-normal">
                Se eliminará la pregunta <span className="font-semibold text-slate-900">"{questionToDelete.title}"</span> del{' '}
                <span className="font-semibold text-slate-900">{questionToDelete.targetGroup}</span>.
              </p>
              <div className="flex items-center space-x-2 mt-5">
                <button
                  type="button"
                  onClick={() => setQuestionToDelete(null)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteQuestion(questionToDelete.id);
                    setQuestionToDelete(null);
                  }}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Gemini AI Question Generator Modal in Admin Dashboard */}
      {showAiQuestionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Generar Pregunta con Gemini AI
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Creación automática de preguntas evaluativas por temática
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiQuestionModal(false)}
                disabled={isGeneratingAiQuestion}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Strict Limitation Badge */}
              <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 font-normal leading-relaxed">
                  <strong className="font-semibold text-emerald-950">Límite Estricto:</strong> Este motor está configurado exclusivamente para formular preguntas estructuradas de examen ADSO. No procesa saludos, charlas ni respuestas ajenas a la evaluación.
                </p>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  1. Temática / Categoría:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'math', label: 'Matemáticas y Lógica', icon: Calculator },
                      { id: 'domino', label: 'Secuencias de Dominó', icon: Grid },
                      { id: 'reading', label: 'Comprensión Lectora', icon: BookOpen },
                      { id: 'psycho', label: 'Psicotécnico / Ágil', icon: Brain }
                    ] as const
                  ).map(cat => {
                    const Icon = cat.icon;
                    const isSelected = aiQuestionCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAiQuestionCategory(cat.id)}
                        className={`p-2.5 rounded-lg border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  2. Asignar al Grupo:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GROUPS.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setAiQuestionGroup(g)}
                      className={`py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                        aiQuestionGroup === g
                          ? 'bg-[#00af00] text-white border-[#00af00] shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  3. Enfoque o Tema Específico (Opcional):
                </label>
                <input
                  type="text"
                  value={aiQuestionTopic}
                  onChange={e => setAiQuestionTopic(e.target.value)}
                  placeholder="Ej: Recursividad, Ecuaciones lineales, Gitflow, Principios SOLID..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 outline-none font-normal"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Si se deja vacío, Gemini generará una pregunta técnica óptima acorde a la categoría.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAiQuestionModal(false)}
                disabled={isGeneratingAiQuestion}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGenerateAiQuestion}
                disabled={isGeneratingAiQuestion}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {isGeneratingAiQuestion ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generando Pregunta con Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Generar Pregunta Ahora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
