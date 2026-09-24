import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, User, Mail, CreditCard, Play, Shield, FileText } from 'lucide-react';
import { CandidateGroup, DocumentType } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface CandidateRegisterModalProps {
  isOpen: boolean;
  onStartExam: (candidate: {
    fullName: string;
    documentType: DocumentType;
    documentId: string;
    email: string;
    selectedGroup: CandidateGroup;
  }) => void;
  totalQuestions: number;
  durationMinutes: number;
  onOpenAdmin: () => void;
  onReturnToMenu?: () => void;
}

const GROUPS_INFO: {
  id: CandidateGroup;
  title: string;
  badge: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'Grupo A',
    title: 'Grupo A',
    badge: 'Grupo A',
    description: 'Algoritmia profunda, series mod 7, arquitecturas de software y toma de decisiones.',
    color: 'from-[#00af00] to-emerald-700'
  },
  {
    id: 'Grupo B',
    title: 'Grupo B',
    badge: 'Grupo B',
    description: 'Secuencias alternantes, estructuras de datos, control de versiones Gitflow y metodologías.',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'Grupo C',
    title: 'Grupo C',
    badge: 'Grupo C',
    description: 'Razonamiento lógico directo, lógica booleana, calidad de código y agilidad.',
    color: 'from-teal-600 to-emerald-700'
  }
];

export const CandidateRegisterModal: React.FC<CandidateRegisterModalProps> = ({
  isOpen,
  onStartExam,
  totalQuestions,
  durationMinutes,
  onOpenAdmin,
  onReturnToMenu
}) => {
  const [fullName, setFullName] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('Cédula de Ciudadanía');
  const [documentId, setDocumentId] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<CandidateGroup>('Grupo A');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!documentId.trim()) {
      setError('Por favor ingresa tu número de documento de identidad.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    setError('');
    onStartExam({
      fullName: fullName.trim(),
      documentType,
      documentId: documentId.trim(),
      email: email.trim(),
      selectedGroup
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-xl p-6 sm:p-8 shadow-xl border border-slate-200 my-auto">
        {/* Top Header with Admin & Contrast/Theme Toggle Buttons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            type="button"
            onClick={onReturnToMenu}
            className="flex items-center space-x-2 text-[#008800] hover:opacity-85 transition-all cursor-pointer group text-left p-1 -ml-1 rounded-lg"
            title="SENA ADSO • Menú Principal"
          >
            <img
              src="/sena-logo.svg"
              alt="Logo SENA"
              className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-xs uppercase tracking-wider text-[#008800]">
              SENA ADSO &bull; Admisión
            </span>
          </button>

          <div className="flex items-center space-x-2">
            <ThemeToggle variant="button" />
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Examen de Admisión ADSO
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 mb-5 leading-relaxed font-normal">
          Ingresa tus datos personales y selecciona el grupo en el que vas a presentar tu prueba técnica.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECCIÓN 1: DATOS DEL POSTULANTE */}
          <div className="space-y-3.5 bg-slate-50 p-4 sm:p-5 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#00af00] text-white flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span>Datos del Postulante</span>
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ej. Carlos Andrés Mendoza"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 focus:border-[#00af00] focus:ring-1 focus:ring-[#00af00] text-xs sm:text-sm text-slate-900 outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Tipo de Documento y Número de Documento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tipo de Documento
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={documentType}
                    onChange={e => setDocumentType(e.target.value as DocumentType)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-slate-300 focus:border-[#00af00] focus:ring-1 focus:ring-[#00af00] text-xs sm:text-sm text-slate-900 outline-none transition-all font-semibold cursor-pointer appearance-none"
                  >
                    <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                    <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                    <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Número de Documento
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={documentId}
                    onChange={e => setDocumentId(e.target.value)}
                    placeholder="Ej. 1098765432"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 focus:border-[#00af00] focus:ring-1 focus:ring-[#00af00] text-xs sm:text-sm text-slate-900 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="postulante@correo.com"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 focus:border-[#00af00] focus:ring-1 focus:ring-[#00af00] text-xs sm:text-sm text-slate-900 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: SELECCIÓN DE GRUPO */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              <span className="w-5 h-5 rounded-full bg-[#00af00] text-white flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>Elige el Grupo en el que vas a presentar el examen</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {GROUPS_INFO.map(grp => {
                const isSelected = selectedGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => setSelectedGroup(grp.id)}
                    className={`py-3.5 px-4 rounded-lg border text-center transition-all cursor-pointer relative overflow-hidden flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-50/80 border-[#00af00] ring-2 ring-[#00af00]/30 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-[#00af00] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl shadow-xs">
                        SELECCIONADO
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-900">{grp.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advertencia de Tiempo */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 space-y-1">
            <div className="flex items-center text-slate-900 font-bold">
              <Clock className="w-4 h-4 text-[#00af00] mr-1.5 shrink-0" />
              <span>Temporizador de {durationMinutes} Minutos</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              Presentarás las preguntas técnicas correspondientes a <strong className="text-slate-900">{selectedGroup}</strong>.
              Al expirar el tiempo ({durationMinutes} minutos), la prueba finalizará y se guardará automáticamente.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-[#00af00] hover:bg-[#009600] text-white font-bold text-sm shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Iniciar Examen en {selectedGroup}</span>
            <Play className="w-4 h-4 fill-white" />
          </button>
        </form>
      </div>
    </div>
  );
};
