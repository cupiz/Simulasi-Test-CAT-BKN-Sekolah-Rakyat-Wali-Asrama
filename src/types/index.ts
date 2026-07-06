export type ExamMode = 'latihan' | 'ujian' | 'belajar';

export interface QuestionOption {
  text: string;
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  score: number; // Graduated SJT scores from 1 to 5 (or 0-5)
}

export interface Question {
  id: number;
  category: 'teknis' | 'manajerial' | 'sosial' | 'wawancara';
  topic: string;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E'; // Option with score = 5
  explanation: string;
  competency: string;
  berakhlak: string;
  psychologyBasis: string;
  catTips: string;
}

export interface ExamSession {
  id?: string;
  mode: ExamMode;
  startTime: number;
  timeRemaining: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>;
  flags: number[]; // Ragu-ragu
  bookmarks: number[];
  questionTimeSpent: Record<number, number>; // questionId -> seconds spent
  currentQuestionId: number;
  isCompleted: boolean;
}

export interface CategoryScores {
  teknis: number;
  manajerial: number;
  sosial: number;
  wawancara: number;
  total: number;
}

export interface AISpiderMetric {
  subject: string;
  score: number;
  fullMark: number;
}

export interface AIAnalysisResult {
  psychologyProfile: {
    leadership: number;
    empathy: number;
    communication: number;
    problemSolving: number;
    characterBuilding: number;
    conflictManagement: number;
    integrity: number;
    decisionMaking: number;
    service: number;
  };
  narrativeReport: string;
  recommendedTopics: {
    topic: string;
    reason: string;
    priority: 'High' | 'Medium' | 'Low';
    resources: string[];
  }[];
}

export interface ExamHistoryItem {
  id?: number;
  date: number;
  mode: ExamMode;
  scores: CategoryScores;
  maxScores: CategoryScores;
  percentage: number;
  isPassed: boolean;
  timeSpent: number; // in seconds
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>;
  questionTimeSpent: Record<number, number>;
  aiAnalysis: AIAnalysisResult;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  instansi: string;
  score: number;
  timeSpent: number; // seconds
  rank: number;
  isCurrentUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}

export interface DailyChallenge {
  dateStr: string; // YYYY-MM-DD
  questionId: number;
  answeredOption?: 'A' | 'B' | 'C' | 'D' | 'E';
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface AIStudyPlanTask {
  id: string;
  day: string;
  topic: string;
  category: string;
  durationMin: number;
  description: string;
  completed: boolean;
}

export interface AIStudyPlan {
  id?: string;
  createdAt: number;
  weakestAreas: string[];
  tasks: AIStudyPlanTask[];
}
