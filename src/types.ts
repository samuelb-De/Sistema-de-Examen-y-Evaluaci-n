export type SectionType = 'domino' | 'math' | 'reading' | 'psycho';

export type DocumentType = 'Tarjeta de Identidad' | 'Cédula de Ciudadanía' | 'Cédula de Extranjería';

export type LearningStyle = 'Visual' | 'Auditivo' | 'Kinestésico';
export type ProjectManagementStyle = 'Ágil' | 'Tradicional' | 'Híbrida';
export type CandidateGroup = 'Grupo A' | 'Grupo B' | 'Grupo C';
export type AppRole = 'applicant' | 'admin';

export interface ExamSettings {
  durationMinutes: number;
}

export interface DominoPiece {
  top: number; // 0 to 6
  bottom: number; // 0 to 6
}

export interface QuestionOption {
  id: string;
  text: string;
  domino?: DominoPiece;
  learningStyle?: LearningStyle;
  projectStyle?: ProjectManagementStyle;
}

export interface Question {
  id: string;
  targetGroup: CandidateGroup; // 'Grupo A' | 'Grupo B' | 'Grupo C'
  category: SectionType;
  title: string;
  description?: string;
  contextText?: string;
  dominoSequence?: (DominoPiece | null)[]; // null represents the missing piece '?'
  options: QuestionOption[];
  correctAnswerId?: string; // Optional for psycho questions
  explanation?: string;
  points: number;
}

export interface PsychoScoreSummary {
  dominantLearning: LearningStyle;
  learningScores: Record<LearningStyle, number>;
  dominantManagement: ProjectManagementStyle;
  managementScores: Record<ProjectManagementStyle, number>;
  recommendedRole: string;
  roleDescription: string;
}

export interface CandidateScores {
  totalScore: number;
  totalMax: number;
  percentage: number;
  dominoScore: number;
  dominoMax: number;
  mathScore: number;
  mathMax: number;
  readingScore: number;
  readingMax: number;
  psychoSummary: PsychoScoreSummary;
}

export interface CandidateSubmission {
  id: string;
  fullName: string;
  documentType?: DocumentType;
  documentId: string;
  email: string;
  phone?: string;
  selectedGroup: CandidateGroup; // The group chosen by applicant to take exam
  groupAssigned: CandidateGroup; // The group evaluated from results
  scores: CandidateScores;
  answers: Record<string, string>; // questionId -> optionId
  completedAt: string;
  timeSpentSeconds: number;
  timedOut: boolean;
  notes?: string;
}

export interface SectionMeta {
  id: SectionType;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  color: string;
  bgBubble: string;
  badgeBg: string;
}
