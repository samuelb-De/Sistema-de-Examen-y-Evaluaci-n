import {
  Question,
  CandidateScores,
  CandidateGroup,
  LearningStyle,
  ProjectManagementStyle,
  PsychoScoreSummary
} from '../types';

export function evaluateSubmission(
  questions: Question[],
  answers: Record<string, string>
): { scores: CandidateScores; groupAssigned: CandidateGroup } {
  let dominoScore = 0;
  let dominoMax = 0;

  let mathScore = 0;
  let mathMax = 0;

  let readingScore = 0;
  let readingMax = 0;

  const learningCounts: Record<LearningStyle, number> = {
    Visual: 0,
    Auditivo: 0,
    Kinestésico: 0
  };

  const managementCounts: Record<ProjectManagementStyle, number> = {
    Ágil: 0,
    Tradicional: 0,
    Híbrida: 0
  };

  questions.forEach(q => {
    const selectedOptId = answers[q.id];

    if (q.category === 'domino') {
      dominoMax += q.points || 1;
      if (selectedOptId && selectedOptId === q.correctAnswerId) {
        dominoScore += q.points || 1;
      }
    } else if (q.category === 'math') {
      mathMax += q.points || 1;
      if (selectedOptId && selectedOptId === q.correctAnswerId) {
        mathScore += q.points || 1;
      }
    } else if (q.category === 'reading') {
      readingMax += q.points || 1;
      if (selectedOptId && selectedOptId === q.correctAnswerId) {
        readingScore += q.points || 1;
      }
    } else if (q.category === 'psycho') {
      if (selectedOptId) {
        const option = q.options.find(o => o.id === selectedOptId);
        if (option) {
          if (option.learningStyle) {
            learningCounts[option.learningStyle] = (learningCounts[option.learningStyle] || 0) + 1;
          }
          if (option.projectStyle) {
            managementCounts[option.projectStyle] = (managementCounts[option.projectStyle] || 0) + 1;
          }
        }
      }
    }
  });

  // Calculate dominant learning style
  let dominantLearning: LearningStyle = 'Visual';
  let maxLearn = -1;
  (Object.keys(learningCounts) as LearningStyle[]).forEach(style => {
    if (learningCounts[style] > maxLearn) {
      maxLearn = learningCounts[style];
      dominantLearning = style;
    }
  });

  // Calculate dominant project management style
  let dominantManagement: ProjectManagementStyle = 'Ágil';
  let maxMgmt = -1;
  (Object.keys(managementCounts) as ProjectManagementStyle[]).forEach(style => {
    if (managementCounts[style] > maxMgmt) {
      maxMgmt = managementCounts[style];
      dominantManagement = style;
    }
  });

  // Role recommendations
  let recommendedRole = 'Desarrollador Full-Stack';
  let roleDescription = 'Perfil equilibrado apto para construcción ágil y desarrollo de aplicaciones web.';

  if (dominantManagement === 'Ágil') {
    if (dominantLearning === 'Visual') {
      recommendedRole = 'Desarrollador Frontend & UX/UI Ágil';
      roleDescription = 'Destaca por captar requerimientos visuales rápidamente y diseñar experiencias intuitivas en ciclos cortos de sprint.';
    } else if (dominantLearning === 'Auditivo') {
      recommendedRole = 'Scrum Master & Facilitador Técnico';
      roleDescription = 'Gran capacidad de comunicación verbal, negociación con el cliente y desbloqueo dinámico de equipos.';
    } else {
      recommendedRole = 'Desarrollador Full-Stack & DevOps';
      roleDescription = 'Enfoque práctico de experimentación, integración continua y resolución empírica de problemas en código.';
    }
  } else if (dominantManagement === 'Tradicional') {
    if (dominantLearning === 'Visual') {
      recommendedRole = 'Arquitecto de Software & Modelador de BD';
      roleDescription = 'Excelente capacidad de análisis abstracto, modelado relacional riguroso y documentación arquitectónica.';
    } else if (dominantLearning === 'Auditivo') {
      recommendedRole = 'Analista de Requerimientos & Auditor de Calidad';
      roleDescription = 'Capacidad para entrevistar stakeholders, levantar especificaciones formales y verificar conformidad de normas.';
    } else {
      recommendedRole = 'Ingeniero de Pruebas (QA) & Automatizador';
      roleDescription = 'Rigurosidad en la ejecución de casos de prueba sistemáticos y control de calidad exhaustivo.';
    }
  } else {
    recommendedRole = 'Líder Técnico de Proyecto Híbrido';
    roleDescription = 'Capacidad para combinar la disciplina de la planificación con la flexibilidad de entregas iterativas continuas.';
  }

  const psychoSummary: PsychoScoreSummary = {
    dominantLearning,
    learningScores: learningCounts,
    dominantManagement,
    managementScores: managementCounts,
    recommendedRole,
    roleDescription
  };

  const totalScore = dominoScore + mathScore + readingScore;
  const totalMax = Math.max(1, dominoMax + mathMax + readingMax);
  const percentage = Math.round((totalScore / totalMax) * 100);

  // Group classification:
  // Grupo A: >= 80%
  // Grupo B: 60% - 79%
  // Grupo C: < 60%
  let groupAssigned: CandidateGroup = 'Grupo C';
  if (percentage >= 80) {
    groupAssigned = 'Grupo A';
  } else if (percentage >= 60) {
    groupAssigned = 'Grupo B';
  } else {
    groupAssigned = 'Grupo C';
  }

  const scores: CandidateScores = {
    totalScore,
    totalMax,
    percentage,
    dominoScore,
    dominoMax,
    mathScore,
    mathMax,
    readingScore,
    readingMax,
    psychoSummary
  };

  return { scores, groupAssigned };
}
