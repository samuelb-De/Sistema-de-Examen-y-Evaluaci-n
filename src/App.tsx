import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question, CandidateSubmission, CandidateGroup, AppRole, DocumentType } from './types';
import { DEFAULT_QUESTIONS } from './data/defaultQuestions';
import { evaluateSubmission } from './utils/evaluation';
import { CandidateRegisterModal } from './components/CandidateRegisterModal';
import { ExamScreen } from './components/ExamScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { DoorLockdownModal } from './components/DoorLockdownModal';
import { CandidatesManagement } from './components/CandidatesManagement';
import { QuestionEditorModal } from './components/QuestionEditorModal';
import { PythonToolsModal } from './components/PythonToolsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ThemeToggle } from './components/ThemeToggle';
import { Shield, GraduationCap, Sparkles } from 'lucide-react';

type AppScreen = 'register' | 'exam' | 'results' | 'candidates';

export default function App() {
  const [role, setRole] = useState<AppRole>('student');
  const [screen, setScreen] = useState<AppScreen>('register');
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [candidates, setCandidates] = useState<CandidateSubmission[]>([]);
  const [durationMinutes, setDurationMinutes] = useState<number>(25);

  // Current candidate exam state
  const [currentCandidate, setCurrentCandidate] = useState<{
    fullName: string;
    documentType: DocumentType;
    documentId: string;
    email: string;
    selectedGroup: CandidateGroup;
  } | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examStartTime, setExamStartTime] = useState<number>(Date.now());
  const [latestSubmission, setLatestSubmission] = useState<CandidateSubmission | null>(null);

  // Modals
  const [isLockdownOpen, setIsLockdownOpen] = useState(false);
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [isPythonModalOpen, setIsPythonModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Helper to fetch questions
  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      if (data.seeded && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        // Seed default questions to cloud database
        await fetch('/api/questions/seed-bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_QUESTIONS)
        });
      }
    } catch (err) {
      console.warn('Backend questions fetch failed:', err);
    }
  };

  // Helper to fetch candidates
  const fetchCandidates = async () => {
    try {
      const res = await fetch('/api/candidates');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCandidates(data);
      }
    } catch (err) {
      console.warn('Backend candidates fetch failed:', err);
    }
  };

  // Load questions, candidates and settings from cloud backend on mount
  useEffect(() => {
    fetchQuestions();
    fetchCandidates();

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.durationMinutes === 'number' && data.durationMinutes > 0) {
          setDurationMinutes(data.durationMinutes);
        }
      })
      .catch(() => {});
  }, []);

  // Update duration handler
  const handleUpdateDuration = async (minutes: number) => {
    setDurationMinutes(minutes);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationMinutes: minutes })
      });
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  // Filter questions for the student's selected group
  const activeExamQuestions = React.useMemo(() => {
    if (!currentCandidate) return questions;
    const groupSpecific = questions.filter(q => q.targetGroup === currentCandidate.selectedGroup);
    return groupSpecific.length > 0 ? groupSpecific : questions;
  }, [questions, currentCandidate]);

  // Handler: Start new exam
  const handleStartExam = (candidateData: {
    fullName: string;
    documentType: DocumentType;
    documentId: string;
    email: string;
    selectedGroup: CandidateGroup;
  }) => {
    setCurrentCandidate(candidateData);
    setExamAnswers({});
    setExamStartTime(Date.now());
    setScreen('exam');
  };

  // Handler: Select answer
  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setExamAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Handler: Submit Exam (either manual or timed out)
  const handleSubmitExam = async (timedOut: boolean = false) => {
    if (!currentCandidate) return;

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - examStartTime) / 1000));
    const { scores, groupAssigned } = evaluateSubmission(activeExamQuestions, examAnswers);

    const submission: CandidateSubmission = {
      id: `cand-${Date.now()}`,
      fullName: currentCandidate.fullName,
      documentType: currentCandidate.documentType || 'Cédula de Ciudadanía',
      documentId: currentCandidate.documentId,
      email: currentCandidate.email,
      selectedGroup: currentCandidate.selectedGroup,
      groupAssigned,
      scores,
      answers: examAnswers,
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      timedOut
    };

    setLatestSubmission(submission);

    // Save to server cloud storage
    try {
      await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      setCandidates(prev => [submission, ...prev.filter(c => c.id !== submission.id)]);

      // Enviar automáticamente copia oficial de la evaluación al correo ingresado
      if (submission.email && submission.email.trim()) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: submission.email.trim(),
            candidate: submission
          })
        })
          .then(res => res.json())
          .then(data => {
            console.log('Notificación de evaluación enviada por correo:', data);
          })
          .catch(err => {
            console.warn('Error en despacho automático de correo:', err);
          });
      }
    } catch (err) {
      console.error('Error saving candidate to cloud:', err);
    }

    if (timedOut) {
      setIsLockdownOpen(true);
    } else {
      setScreen('results');
    }
  };

  // Handler: Save question from Editor (Create or Update)
  const handleSaveQuestion = async (updatedQuestion: Question) => {
    try {
      await fetch(`/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuestion)
      });
      setQuestions(prev => {
        const idx = prev.findIndex(q => q.id === updatedQuestion.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updatedQuestion;
          return next;
        }
        return [...prev, updatedQuestion];
      });
    } catch (err) {
      console.error('Error saving question:', err);
    }
  };

  // Handler: Delete question
  const handleDeleteQuestion = async (id: string) => {
    try {
      await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  // Handler: Reset questions to defaults
  const handleResetDefaults = async () => {
    if (window.confirm('¿Restaurar las preguntas predeterminadas de ADSO para los grupos A, B y C?')) {
      try {
        await fetch('/api/questions/seed-bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_QUESTIONS)
        });
        setQuestions(DEFAULT_QUESTIONS);
      } catch (err) {
        console.error('Error resetting defaults:', err);
      }
    }
  };

  // Handler: Delete single candidate
  const handleDeleteCandidate = async (id: string) => {
    try {
      await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
      setCandidates(prev => prev.filter(c => c.id !== id));
      if (latestSubmission && latestSubmission.id === id) {
        setLatestSubmission(null);
      }
    } catch (err) {
      console.error('Error deleting candidate:', err);
    }
  };

  // Handler: Clear all candidates
  const handleClearAllCandidates = async () => {
    try {
      await fetch('/api/candidates', { method: 'DELETE' });
      setCandidates([]);
      setLatestSubmission(null);
    } catch (err) {
      console.error('Error clearing candidates:', err);
    }
  };

  // Handler: Exit exam and return to main menu
  const handleExitExamToMenu = () => {
    setCurrentCandidate(null);
    setExamAnswers({});
    setScreen('register');
    setRole('student');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans antialiased text-slate-900 selection:bg-[#00af00] selection:text-white">
      {/* ======================================================== */}
      {/* 1. ADMIN FLOW */}
      {/* ======================================================== */}
      {role === 'admin' ? (
        <AdminDashboard
          questions={questions}
          candidates={candidates}
          durationMinutes={durationMinutes}
          onUpdateDurationMinutes={handleUpdateDuration}
          onRefreshQuestions={fetchQuestions}
          onSaveQuestion={handleSaveQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onResetDefaults={handleResetDefaults}
          onDeleteCandidate={handleDeleteCandidate}
          onClearAllCandidates={handleClearAllCandidates}
          onSwitchToStudent={() => {
            setRole('student');
            setScreen('register');
          }}
          onSelectCandidateDetails={cand => {
            setLatestSubmission(cand);
            setRole('student');
            setScreen('results');
          }}
          onOpenPythonTools={() => setIsPythonModalOpen(true)}
        />
      ) : (
        /* ======================================================== */
        /* 2. STUDENT FLOW */
        /* ======================================================== */
        <>
          {/* Register Screen (Choose Group, Document Type & Enter Details + Admin Button) */}
          {screen === 'register' && (
            <div className="min-h-screen flex items-center justify-center p-4">
              <CandidateRegisterModal
                isOpen={true}
                onStartExam={handleStartExam}
                totalQuestions={questions.length}
                durationMinutes={durationMinutes}
                onOpenAdmin={() => setIsAdminLoginOpen(true)}
                onReturnToMenu={() => {
                  setScreen('register');
                  setRole('student');
                }}
              />
            </div>
          )}

          {/* Active Exam Screen (NO Admin button shown here, as requested) */}
          {screen === 'exam' && currentCandidate && (
            <ExamScreen
              candidate={currentCandidate}
              questions={activeExamQuestions}
              answers={examAnswers}
              onSelectAnswer={handleSelectAnswer}
              onSubmitExam={handleSubmitExam}
              onExitToMenu={handleExitExamToMenu}
              durationMinutes={durationMinutes}
            />
          )}

          {/* Results Screen */}
          {screen === 'results' && latestSubmission && (
            <ResultsScreen
              submission={latestSubmission}
              questions={activeExamQuestions}
              onRestart={() => setScreen('register')}
              onOpenCandidatesManagement={() => setScreen('candidates')}
            />
          )}

          {/* Candidates Management / Historias de Usuarios Screen */}
          {screen === 'candidates' && (
            <CandidatesManagement
              candidates={candidates}
              onDeleteCandidate={handleDeleteCandidate}
              onClearAllCandidates={handleClearAllCandidates}
              onBack={() => {
                if (latestSubmission) setScreen('results');
                else setScreen('register');
              }}
              onOpenPythonModal={() => setIsPythonModalOpen(true)}
              onSelectCandidateDetails={cand => {
                setLatestSubmission(cand);
                setScreen('results');
              }}
            />
          )}
        </>
      )}

      {/* Admin Login Modal (Password: 1234) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setRole('admin');
        }}
      />

      {/* Door Lockdown Vault Animation Modal */}
      <DoorLockdownModal
        isOpen={isLockdownOpen}
        candidateName={currentCandidate?.fullName || 'Postulante'}
        onProceedToResults={() => {
          setIsLockdownOpen(false);
          setScreen('results');
        }}
      />

      {/* Question Editor CRUD Modal (Accessible if needed) */}
      <QuestionEditorModal
        isOpen={isQuestionEditorOpen}
        onClose={() => setIsQuestionEditorOpen(false)}
        questions={questions}
        onSaveQuestion={handleSaveQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onResetDefaults={handleResetDefaults}
      />

      {/* Python Tools & Email Dispatcher Modal */}
      <PythonToolsModal
        isOpen={isPythonModalOpen}
        onClose={() => setIsPythonModalOpen(false)}
        candidateSample={latestSubmission || candidates[0]}
      />

      {/* Persistent Floating Theme / High-Contrast Toggle Button */}
      <ThemeToggle variant="floating" />
    </div>
  );
}
