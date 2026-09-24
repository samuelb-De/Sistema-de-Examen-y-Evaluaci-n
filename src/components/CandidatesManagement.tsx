import React, { useState } from 'react';
import {
  Users,
  Search,
  Trash2,
  FileSpreadsheet,
  FileJson,
  Eye,
  Mail,
  ChevronLeft,
  CheckCircle,
  Terminal,
  Layers,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { CandidateSubmission, CandidateGroup } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface CandidatesManagementProps {
  candidates: CandidateSubmission[];
  onDeleteCandidate: (id: string) => Promise<void>;
  onClearAllCandidates: () => Promise<void>;
  onBack: () => void;
  onOpenPythonModal: () => void;
  onSelectCandidateDetails: (candidate: CandidateSubmission) => void;
}

export const CandidatesManagement: React.FC<CandidatesManagementProps> = ({
  candidates,
  onDeleteCandidate,
  onClearAllCandidates,
  onBack,
  onOpenPythonModal,
  onSelectCandidateDetails
}) => {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState<'Todos' | CandidateGroup>('Todos');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [sendEmailStatus, setSendEmailStatus] = useState<string | null>(null);

  // Filter candidates
  const filtered = candidates.filter(c => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.documentId.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesGroup =
      groupFilter === 'Todos' ||
      c.groupAssigned === groupFilter ||
      c.selectedGroup === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const handleDeleteOne = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la historia de usuario de ${name}?`)) {
      setDeletingId(id);
      await onDeleteCandidate(id);
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    await onClearAllCandidates();
    setConfirmClearAll(false);
  };

  const handleQuickEmail = async (candidate: CandidateSubmission) => {
    setSendEmailStatus(`Enviando a ${candidate.email} vía Python...`);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: candidate.email, candidate })
      });
      const data = await res.json();
      if (data.success) {
        setSendEmailStatus(`Correo Python enviado a ${candidate.email}`);
      } else {
        setSendEmailStatus(`Error: ${data.error || 'Fallo de envío'}`);
      }
    } catch (err: any) {
      setSendEmailStatus(`Error de conexión: ${err.message}`);
    }
    setTimeout(() => setSendEmailStatus(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border border-slate-200"
              title="Volver al Menú Principal"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2.5 group text-left cursor-pointer p-1 -ml-1 rounded-lg hover:bg-slate-50 transition-colors"
              title="Volver al Menú Principal (SENA ADSO)"
            >
              <img
                src="/sena-logo.svg"
                alt="Logo SENA"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-[#008800] transition-colors">
                    Historias de Usuarios y Registros ADSO
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Panel de control de postulantes por grupos, nube y exportación
                </p>
              </div>
            </button>
          </div>

          {/* Action Buttons: Python, CSV, JSON, Contrast Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle variant="button" />

            <button
              type="button"
              onClick={onOpenPythonModal}
              className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#008800] text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-emerald-200"
            >
              <Terminal className="w-3.5 h-3.5 text-[#00af00]" />
              <span>Python & Email</span>
            </button>

            <a
              href="/api/export/csv"
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-slate-200"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
              <span>Descargar CSV</span>
            </a>

            <a
              href="/api/export/json"
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-slate-200"
            >
              <FileJson className="w-3.5 h-3.5 text-slate-600" />
              <span>Descargar JSON</span>
            </a>

            {candidates.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Borrar Todos</span>
              </button>
            )}
          </div>
        </div>

        {/* Email toast feedback if active */}
        {sendEmailStatus && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-xs">
            {sendEmailStatus}
          </div>
        )}

        {/* Filters & Search Bubble Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar postulante por nombre, cédula o correo..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#00af00] focus:ring-1 focus:ring-[#00af00] text-xs text-slate-900 outline-none transition-all font-normal"
            />
          </div>

          {/* Group Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
            {(['Todos', 'Grupo A', 'Grupo B', 'Grupo C'] as const).map(grp => (
              <button
                key={grp}
                type="button"
                onClick={() => setGroupFilter(grp)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  groupFilter === grp
                    ? 'bg-[#00af00] text-white shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-center shadow-xs">
            <div className="text-2xl font-bold text-slate-900">{candidates.length}</div>
            <div className="text-[11px] font-medium text-slate-500">Total Postulantes</div>
          </div>
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-center shadow-xs">
            <div className="text-2xl font-bold text-[#008800]">
              {candidates.filter(c => c.groupAssigned === 'Grupo A' || c.selectedGroup === 'Grupo A').length}
            </div>
            <div className="text-[11px] font-bold text-[#008800]">Grupo A (Avanzado)</div>
          </div>
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-center shadow-xs">
            <div className="text-2xl font-bold text-amber-700">
              {candidates.filter(c => c.groupAssigned === 'Grupo B' || c.selectedGroup === 'Grupo B').length}
            </div>
            <div className="text-[11px] font-bold text-amber-900">Grupo B (Intermedio)</div>
          </div>
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 text-center shadow-xs">
            <div className="text-2xl font-bold text-rose-700">
              {candidates.filter(c => c.groupAssigned === 'Grupo C' || c.selectedGroup === 'Grupo C').length}
            </div>
            <div className="text-[11px] font-bold text-rose-900">Grupo C (Fundamentos)</div>
          </div>
        </div>

        {/* Candidates List Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <div className="text-base font-bold text-slate-800">No se encontraron historias de usuarios</div>
            <p className="text-xs text-slate-500 mt-1">
              Los exámenes de los estudiantes aparecerán automáticamente almacenados aquí en la nube.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(c => {
              const { scores } = c;
              const isDeleting = deletingId === c.id;

              return (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            {c.fullName}
                          </h3>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            Presentó: {c.selectedGroup || 'Grupo A'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-normal">
                          CC: {c.documentId} &bull; {c.email}
                        </div>
                      </div>

                      {/* Calificación asignada */}
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        c.groupAssigned === 'Grupo A'
                          ? 'bg-emerald-100 text-[#008800] border border-emerald-300'
                          : c.groupAssigned === 'Grupo B'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        Clasif: {c.groupAssigned}
                      </span>
                    </div>

                    {/* Scores row */}
                    <div className="grid grid-cols-4 gap-2 text-center my-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                      <div>
                        <div className="font-normal text-slate-500">Dominó</div>
                        <div className="font-bold text-slate-900">
                          {c.scores?.dominoScore ?? (c.scores as any)?.domino ?? 0} pts
                        </div>
                      </div>
                      <div>
                        <div className="font-normal text-slate-500">Matem.</div>
                        <div className="font-bold text-slate-900">
                          {c.scores?.mathScore ?? (c.scores as any)?.math ?? 0} pts
                        </div>
                      </div>
                      <div>
                        <div className="font-normal text-slate-500">Lectura</div>
                        <div className="font-bold text-slate-900">
                          {c.scores?.readingScore ?? (c.scores as any)?.reading ?? 0} pts
                        </div>
                      </div>
                      <div>
                        <div className="font-normal text-slate-500">Total</div>
                        <div className="font-bold text-[#008800]">
                          {c.scores?.percentage ?? 0}%
                        </div>
                      </div>
                    </div>

                    {/* Psychological Profiles */}
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        VARK: {(c as any).learningStyle?.type || c.scores?.psychoSummary?.dominantLearning || 'Visual'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        Metodología: {(c as any).projectManagement?.type || c.scores?.psychoSummary?.dominantManagement || 'Ágil'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                        {new Date(c.completedAt).toLocaleDateString('es-CO', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSelectCandidateDetails(c)}
                      className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 border border-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Resultados</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickEmail(c)}
                        title="Enviar correo de resultados vía Python"
                        className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDeleteOne(c.id, c.fullName)}
                        title="Borrar historia de usuario"
                        className="p-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal confirm clear all */}
        {confirmClearAll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-xl border border-slate-200 text-center">
              <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                ¿Borrar todos los postulantes?
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-normal">
                Esta acción eliminará todas las historias de usuarios y registros de la nube.
              </p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
                >
                  Sí, Borrar Todo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
