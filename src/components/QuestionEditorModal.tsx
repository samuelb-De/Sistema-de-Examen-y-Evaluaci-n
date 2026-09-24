import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Check,
  Save,
  Grid,
  Calculator,
  BookOpen,
  Brain,
  Sparkles,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { Question, SectionType, CandidateGroup } from '../types';

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSaveQuestion: (question: Question) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
  onResetDefaults: () => Promise<void>;
}

const GROUPS_LIST: CandidateGroup[] = ['Grupo A', 'Grupo B', 'Grupo C'];

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSaveQuestion,
  onDeleteQuestion,
  onResetDefaults
}) => {
  const [activeCategory, setActiveCategory] = useState<SectionType>('domino');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<CandidateGroup | 'all'>('Grupo A');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Gemini AI generation state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTargetCategory, setAiTargetCategory] = useState<SectionType>('math');
  const [aiTargetGroup, setAiTargetGroup] = useState<CandidateGroup>('Grupo A');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!isOpen) return null;

  // Filter questions by Category and Target Group
  const categoryQuestions = questions.filter(q => {
    const matchesCat = q.category === activeCategory;
    const matchesGroup = selectedGroupFilter === 'all' || q.targetGroup === selectedGroupFilter;
    return matchesCat && matchesGroup;
  });

  const handleGenerateWithAi = async (cat?: SectionType, grp?: CandidateGroup, customTopic?: string) => {
    const targetCat = cat || aiTargetCategory;
    const targetGrp = grp || aiTargetGroup;
    const topicToUse = customTopic !== undefined ? customTopic : aiTopic;

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/generate-question-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: targetCat,
          targetGroup: targetGrp,
          topic: topicToUse
        })
      });
      const data = await res.json();
      if (data.success && data.question) {
        setEditingQuestion(data.question);
        setIsCreating(true);
        setShowAiModal(false);
        setAiTopic('');
      } else {
        alert('No se pudo generar la pregunta: ' + (data.error || 'Fallo desconocido'));
      }
    } catch (err: any) {
      alert('Error de conexión con el motor de IA: ' + err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const startCreate = () => {
    const currentGroup: CandidateGroup = selectedGroupFilter === 'all' ? 'Grupo A' : selectedGroupFilter;
    const newId = `${currentGroup.replace(' ', '')}-${activeCategory}-${Date.now().toString().slice(-5)}`;

    if (activeCategory === 'domino') {
      setEditingQuestion({
        id: newId,
        targetGroup: currentGroup,
        category: 'domino',
        title: `Secuencia de Dominó (${currentGroup})`,
        description: 'Observa la serie de fichas y determina la que continúa el patrón.',
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
        explanation: 'Las caras avanzan progresivamente.',
        points: 1
      });
    } else {
      setEditingQuestion({
        id: newId,
        targetGroup: currentGroup,
        category: activeCategory,
        title: `Nueva Pregunta de ${activeCategory.toUpperCase()} (${currentGroup})`,
        description: 'Planteamiento del problema o caso técnico.',
        options: [
          { id: 'opt-a', text: 'Opción A' },
          { id: 'opt-b', text: 'Opción B' },
          { id: 'opt-c', text: 'Opción C' },
          { id: 'opt-d', text: 'Opción D' }
        ],
        correctAnswerId: 'opt-a',
        explanation: 'Justificación conceptual de la respuesta correcta.',
        points: 1
      });
    }
    setIsCreating(true);
  };

  const startEdit = (q: Question) => {
    setEditingQuestion(JSON.parse(JSON.stringify(q)));
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col p-6 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00af00]" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Editor de Preguntas por Grupo ADSO
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Personaliza preguntas diferenciadas para el Grupo A, Grupo B y Grupo C
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Group Selector Pills */}
        <div className="pt-3 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">
              Grupo:
            </span>
            {(['Grupo A', 'Grupo B', 'Grupo C', 'all'] as const).map(grp => {
              const count = grp === 'all'
                ? questions.length
                : questions.filter(q => q.targetGroup === grp).length;
              const isSelected = selectedGroupFilter === grp;

              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => {
                    setSelectedGroupFilter(grp);
                    setEditingQuestion(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-[#00af00] text-white shadow-xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{grp === 'all' ? 'Todos los Grupos' : grp}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onResetDefaults}
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Predeterminado</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAiTargetCategory(activeCategory);
                setAiTargetGroup(selectedGroupFilter === 'all' ? 'Grupo A' : selectedGroupFilter);
                setShowAiModal(true);
              }}
              disabled={isGeneratingAi}
              className="px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Crear pregunta con Gemini AI para la temática seleccionada"
            >
              {isGeneratingAi ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              )}
              <span>Crear con IA (Gemini)</span>
            </button>
            <button
              type="button"
              onClick={startCreate}
              className="px-3 py-1.5 rounded-md bg-[#00af00] hover:bg-[#009600] text-white text-xs font-bold shadow-xs flex items-center space-x-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Pregunta</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="py-2.5 flex items-center space-x-1.5 overflow-x-auto border-b border-slate-200">
          {(
            [
              { id: 'domino', label: 'Dominó', icon: Grid },
              { id: 'math', label: 'Matemáticas', icon: Calculator },
              { id: 'reading', label: 'Comprensión', icon: BookOpen },
              { id: 'psycho', label: 'Psicotécnico', icon: Brain }
            ] as const
          ).map(cat => {
            const Icon = cat.icon;
            const count = questions.filter(
              q =>
                q.category === cat.id &&
                (selectedGroupFilter === 'all' || q.targetGroup === selectedGroupFilter)
            ).length;
            const isCatActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setEditingQuestion(null);
                }}
                className={`px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isCatActive
                    ? 'bg-emerald-50 text-[#008800] font-bold border border-emerald-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-bold text-slate-700 border border-slate-200">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {editingQuestion ? (
            /* Editing / Creating Form */
            <form onSubmit={handleSave} className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#008800]">
                  {isCreating ? 'Creando Nueva Pregunta' : 'Modificando Pregunta'} ({editingQuestion.id})
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAiTargetCategory(editingQuestion.category);
                      setAiTargetGroup(editingQuestion.targetGroup);
                      setShowAiModal(true);
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
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              {/* Group Selector in form */}
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Grupo Asignado para esta Pregunta:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GROUPS_LIST.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setEditingQuestion({ ...editingQuestion, targetGroup: g })}
                      className={`py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        editingQuestion.targetGroup === g
                          ? 'bg-[#00af00] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
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
                  className="w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-[#00af00] focus:ring-1 focus:ring-[#00af00]"
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
                    className="w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-[#00af00]"
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
                  className="w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-[#00af00]"
                />
              </div>

              {/* Domino sequence editor */}
              {editingQuestion.category === 'domino' && editingQuestion.dominoSequence && (
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Secuencia de Fichas (0 a 6 pips, o vacío para 'Falta'):
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {editingQuestion.dominoSequence.map((tile, tIdx) => (
                      <div key={tIdx} className="flex flex-col items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-semibold text-slate-600 mb-1">
                          #{tIdx + 1} {tile === null ? '(Incógnita)' : ''}
                        </span>
                        {tile === null ? (
                          <div className="w-12 h-20 rounded-md border-2 border-dashed border-slate-400 flex items-center justify-center text-slate-600 font-bold text-xl">
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
                              className="w-10 p-1 text-center bg-white border border-slate-300 rounded text-xs font-bold"
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
                              className="w-10 p-1 text-center bg-white border border-slate-300 rounded text-xs font-bold"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options editor */}
              <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Opciones y Respuesta Correcta:
                </label>
                {editingQuestion.options.map((opt, oIdx) => (
                  <div key={opt.id} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      title="Marcar como respuesta correcta"
                      onClick={() => setEditingQuestion({ ...editingQuestion, correctAnswerId: opt.id })}
                      className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
                        editingQuestion.correctAnswerId === opt.id
                          ? 'bg-[#00af00] text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
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
                      className="flex-1 px-3 py-1.5 rounded bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-[#00af00] font-normal"
                    />

                    {/* Domino options pip editor */}
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
                          className="w-8 p-1 text-center bg-white border border-slate-300 rounded text-xs font-bold"
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
                          className="w-8 p-1 text-center bg-white border border-slate-300 rounded text-xs font-bold"
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
                  placeholder="Explica la regla lógica o algoritmo que sustenta la respuesta..."
                  className="w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-[#00af00]"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="flex-1 py-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2 rounded-md bg-[#00af00] hover:bg-[#009600] text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Pregunta en Nube</span>
                </button>
              </div>
            </form>
          ) : (
            /* Questions List for active category & group */
            <div className="space-y-3">
              {categoryQuestions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-xs">
                  No hay preguntas registradas para esta categoría en{' '}
                  <strong>{selectedGroupFilter === 'all' ? 'todos los grupos' : selectedGroupFilter}</strong>.
                  Haz clic en "Añadir Pregunta" para crear una.
                </div>
              ) : (
                categoryQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-lg bg-white border border-slate-200 flex items-start justify-between gap-3 hover:border-slate-300 shadow-xs transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-[#008800] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {q.targetGroup || 'Grupo A'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {q.title}
                        </h4>
                      </div>
                      {q.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 font-normal">
                          {q.description}
                        </p>
                      )}
                      <div className="text-[11px] text-slate-500 font-normal mt-1">
                        {q.options.length} opciones &bull; Correcta:{' '}
                        {q.correctAnswerId
                          ? q.options.find(o => o.id === q.correctAnswerId)?.text || q.correctAnswerId
                          : 'Evaluación Psicométrica VARK/Ágil'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(q)}
                        className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        title="Editar Pregunta"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar la pregunta "${q.title}"?`)) {
                            onDeleteQuestion(q.id);
                          }
                        }}
                        className="p-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                        title="Eliminar Pregunta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gemini AI Question Generator Modal */}
      {showAiModal && (
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
                onClick={() => setShowAiModal(false)}
                disabled={isGeneratingAi}
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
                    const isSelected = aiTargetCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAiTargetCategory(cat.id)}
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
                  {GROUPS_LIST.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setAiTargetGroup(g)}
                      className={`py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                        aiTargetGroup === g
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
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
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
                onClick={() => setShowAiModal(false)}
                disabled={isGeneratingAi}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleGenerateWithAi()}
                disabled={isGeneratingAi}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {isGeneratingAi ? (
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
