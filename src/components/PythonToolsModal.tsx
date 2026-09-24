import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Terminal,
  Mail,
  Check,
  Copy,
  Download,
  Code2
} from 'lucide-react';

interface PythonToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonToolsModal: React.FC<PythonToolsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [pythonCode, setPythonCode] = useState<string>('');
  const [testEmail, setTestEmail] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/python/script')
        .then(res => res.json())
        .then(data => {
          if (data.code) setPythonCode(data.code);
        })
        .catch(() => {
          setPythonCode('# Script Python disponible en server/email_and_export.py');
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunEmailTest = async () => {
    if (!testEmail) {
      setConsoleOutput('[Error] Por favor ingresa un correo destinatario.');
      return;
    }

    setIsRunning(true);
    setConsoleOutput(`[Python] Iniciando proceso smtplib y MIME hacia: ${testEmail}...`);

    try {
      const mockCandidate = {
        fullName: 'Prueba Candidato ADSO',
        documentId: '1098765432',
        email: testEmail,
        groupAssigned: 'Grupo A',
        selectedGroup: 'Grupo A',
        scores: {
          dominoScore: 10,
          dominoMax: 10,
          mathScore: 10,
          mathMax: 10,
          readingScore: 10,
          readingMax: 10,
          totalScore: 30,
          totalMax: 30,
          percentage: 100,
          psychoSummary: {
            dominantLearning: 'Visual',
            dominantManagement: 'Ágil',
            recommendedRole: 'Tech Lead / Desarrollador Full-Stack',
            roleDescription: 'Perfil sobresaliente con alta capacidad de modelado lógico.',
            learningScores: { Visual: 4, Auditivo: 3, Kinestésico: 3 },
            managementScores: { Ágil: 4, Tradicional: 3, Híbrida: 3 }
          }
        },
        timeSpentSeconds: 900,
        timedOut: false,
        completedAt: new Date().toISOString()
      };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmail,
          candidate: mockCandidate
        })
      });

      const data = await res.json();
      if (data.success) {
        setConsoleOutput(
          `[Salida Exitosa]\n${data.message || 'Correo procesado correctamente.'}\n\nDetalles del envío:\n- Destinatario: ${testEmail}\n- Estado: 200 OK\n- Módulo: Python smtplib / SSL`
        );
      } else {
        setConsoleOutput(
          `[Error de Ejecución]\n${data.error || data.message || 'Fallo de entrega'}\n\nVerifica las credenciales SMTP_USER y SMTP_PASS en el servidor.`
        );
      }
    } catch (err: any) {
      setConsoleOutput(`[Excepción de Red]\n${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([pythonCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_and_export.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white rounded-xl p-6 shadow-xl border border-slate-200 max-h-[90vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#00af00] border border-emerald-200 flex items-center justify-center shadow-xs">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Módulo de Automatización Python
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Librerías: <code>smtplib</code>, <code>email.mime</code>, <code>csv</code>, <code>json</code>, <code>ssl</code>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Email runner test */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <Mail className="w-4 h-4 text-[#00af00]" />
                <span>Prueba de Despacho de Correo vía Python</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono font-bold">Python 3.10+</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="flex-1 px-3 py-2 rounded-md bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-[#00af00] font-normal"
              />
              <button
                type="button"
                disabled={isRunning}
                onClick={handleRunEmailTest}
                className="py-2 px-4 rounded-md bg-[#00af00] hover:bg-[#009600] text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isRunning ? 'Ejecutando...' : 'Ejecutar Envío Python'}</span>
              </button>
            </div>

            {/* Output terminal */}
            {consoleOutput && (
              <div className="mt-3 p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap overflow-x-auto border border-slate-800 shadow-inner max-h-48">
                {consoleOutput}
              </div>
            )}
          </div>

          {/* Python Script Code Viewer */}
          <div className="p-4 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
                <Code2 className="w-4 h-4" />
                <span>server/email_and_export.py</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center space-x-1 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadScript}
                  className="px-2.5 py-1 rounded bg-[#00af00] hover:bg-[#009600] text-xs font-bold text-white flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Descargar .py</span>
                </button>
              </div>
            </div>

            <pre className="p-3 rounded-md bg-slate-950 text-slate-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-60 border border-slate-800">
              {pythonCode || '# Cargando código Python...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
