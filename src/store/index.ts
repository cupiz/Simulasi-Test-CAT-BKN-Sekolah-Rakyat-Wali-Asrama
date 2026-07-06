import { create } from 'zustand';
import { db } from '../lib/db';
import { Question, ExamMode, ExamSession, ExamHistoryItem } from '../types';
import { toast } from 'sonner';

interface AuthState {
  name: string;
  participantId: string;
  instansi: string;
  isLoggedIn: boolean;
  login: (name: string, participantId: string, instansi: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load from localStorage on init (client-side only)
  let initialAuth = { name: '', participantId: '', instansi: '', isLoggedIn: false };
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sr_auth');
    if (saved) {
      try {
        initialAuth = JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
  }

  return {
    ...initialAuth,
    login: (name, participantId, instansi) => {
      const state = { name, participantId, instansi, isLoggedIn: true };
      localStorage.setItem('sr_auth', JSON.stringify(state));
      set(state);
    },
    logout: () => {
      localStorage.removeItem('sr_auth');
      set({ name: '', participantId: '', instansi: '', isLoggedIn: false });
    }
  };
});

interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>;
  flags: number[]; // Ragu-ragu
  bookmarks: number[];
  questionTimeSpent: Record<number, number>; // in seconds
  timeRemaining: number; // in seconds
  mode: ExamMode;
  isActive: boolean;
  isCompleted: boolean;
  isLoading: boolean;
  startTime: number;

  setQuestions: (questions: Question[]) => void;
  startExam: (mode: ExamMode, durationMinutes: number, dateStr: string) => Promise<void>;
  resumeExam: (session: ExamSession) => Promise<void>;
  selectQuestion: (index: number) => void;
  setAnswer: (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D' | 'E') => Promise<void>;
  toggleFlag: (questionId: number) => Promise<void>;
  toggleBookmark: (questionId: number) => Promise<void>;
  incrementTimeSpent: (questionId: number) => void;
  tickTimer: () => void;
  submitExam: () => Promise<number>; // returns historyId
  resetExam: () => Promise<void>;
}

export const useExamStore = create<ExamState>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  flags: [],
  bookmarks: [],
  questionTimeSpent: {},
  timeRemaining: 130 * 60, // Default 130 minutes
  mode: 'ujian',
  isActive: false,
  isCompleted: false,
  isLoading: false,
  startTime: 0,

  setQuestions: (questions) => set({ questions }),

  startExam: async (mode, durationMinutes, dateStr) => {
    set({ isLoading: true });
    
    // Fetch only questions for the selected dateStr
    const dbQuestions = await db.questions.where('dateStr').equals(dateStr).toArray();
    const sortedQuestions = dbQuestions.sort((a, b) => (a.number || 0) - (b.number || 0));
    
    const startTime = Date.now();
    const timeRemaining = durationMinutes * 60;
    
    const newSession: ExamSession = {
      id: 'active_session',
      mode,
      dateStr,
      startTime,
      timeRemaining,
      answers: {},
      flags: [],
      bookmarks: [],
      questionTimeSpent: {},
      currentQuestionId: sortedQuestions[0]?.id || 1,
      isCompleted: false
    };

    await db.examSessions.put(newSession);
    
    set({
      questions: sortedQuestions,
      mode,
      startTime,
      timeRemaining,
      answers: {},
      flags: [],
      bookmarks: [],
      questionTimeSpent: {},
      currentQuestionIndex: 0,
      isActive: true,
      isCompleted: false,
      isLoading: false
    });
  },

  resumeExam: async (session) => {
    const dbQuestions = await db.questions.where('dateStr').equals(session.dateStr).toArray();
    const sortedQuestions = dbQuestions.sort((a, b) => (a.number || 0) - (b.number || 0));
    
    const qIndex = sortedQuestions.findIndex(q => q.id === session.currentQuestionId);
    set({
      questions: sortedQuestions,
      mode: session.mode,
      startTime: session.startTime,
      timeRemaining: session.timeRemaining,
      answers: session.answers,
      flags: session.flags,
      bookmarks: session.bookmarks,
      questionTimeSpent: session.questionTimeSpent,
      currentQuestionIndex: qIndex >= 0 ? qIndex : 0,
      isActive: true,
      isCompleted: session.isCompleted
    });
  },

  selectQuestion: (index) => {
    if (index >= 0 && index < get().questions.length) {
      set({ currentQuestionIndex: index });
      // Update session active question in Dexie
      const activeQId = get().questions[index].id;
      db.examSessions.update('active_session', { currentQuestionId: activeQId }).catch(() => {});
    }
  },

  setAnswer: async (questionId, optionKey) => {
    const newAnswers = { ...get().answers, [questionId]: optionKey };
    set({ answers: newAnswers });
    await db.examSessions.update('active_session', { answers: newAnswers }).catch(() => {});
  },

  toggleFlag: async (questionId) => {
    const currentFlags = get().flags;
    const isFlagged = currentFlags.includes(questionId);
    const newFlags = isFlagged 
      ? currentFlags.filter(id => id !== questionId)
      : [...currentFlags, questionId];
    
    set({ flags: newFlags });
    await db.examSessions.update('active_session', { flags: newFlags }).catch(() => {});
  },

  toggleBookmark: async (questionId) => {
    const currentBookmarks = get().bookmarks;
    const isBookmarked = currentBookmarks.includes(questionId);
    const newBookmarks = isBookmarked
      ? currentBookmarks.filter(id => id !== questionId)
      : [...currentBookmarks, questionId];
    
    set({ bookmarks: newBookmarks });
    await db.examSessions.update('active_session', { bookmarks: newBookmarks }).catch(() => {});
  },

  incrementTimeSpent: (questionId) => {
    const spent = get().questionTimeSpent;
    const currentVal = spent[questionId] || 0;
    const newSpent = { ...spent, [questionId]: currentVal + 1 };
    
    set({ questionTimeSpent: newSpent });
    // Throttle writing time spent to Dexie or write it synchronously since it's local
    db.examSessions.update('active_session', { questionTimeSpent: newSpent }).catch(() => {});
  },

  tickTimer: () => {
    const currentRemaining = get().timeRemaining;
    if (currentRemaining <= 1) {
      // Auto submit when time runs out
      set({ timeRemaining: 0 });
      get().submitExam().then(() => {
        toast.info('Waktu habis! Jawaban Anda telah dikirimkan secara otomatis.');
      });
    } else {
      const nextRemaining = currentRemaining - 1;
      set({ timeRemaining: nextRemaining });
      db.examSessions.update('active_session', { timeRemaining: nextRemaining }).catch(() => {});
    }
  },

  submitExam: async () => {
    set({ isLoading: true });
    const { questions, answers, mode, startTime, timeRemaining, questionTimeSpent } = get();
    
    // Calculate category scores
    // Max score calculation: 5 points for matching the highest option score
    const maxScores = { teknis: 0, manajerial: 0, sosial: 0, wawancara: 0, total: 0 };
    const scores = { teknis: 0, manajerial: 0, sosial: 0, wawancara: 0, total: 0 };

    questions.forEach(q => {
      // Add max score possible for this question
      const maxQScore = Math.max(...q.options.map(o => o.score));
      maxScores[q.category] += maxQScore;
      maxScores.total += maxQScore;

      const qId = q.id ?? 0;
      const userAns = answers[qId];
      if (userAns) {
        const option = q.options.find(o => o.key === userAns);
        const score = option ? option.score : 0;
        scores[q.category] += score;
        scores.total += score;
      }
    });

    const percentage = Math.round((scores.total / maxScores.total) * 100);
    
    // Passing grade threshold based on standard CAT: Let's set a global passing rate at 65%
    const isPassed = percentage >= 65;
    const timeSpent = (130 * 60) - timeRemaining; // assuming 130 min total

    // Generate psychological profile based on actual answer score ratios in categories
    // For a real-time startup feel, we will simulate the AI analysis with highly dynamic rule-based generation
    const leadershipScore = Math.min(100, Math.round((scores.manajerial / maxScores.manajerial) * 100 + (scores.teknis / maxScores.teknis) * 10 - Math.random() * 5));
    const empathyScore = Math.min(100, Math.round((scores.sosial / maxScores.sosial) * 100 + (scores.teknis / maxScores.teknis) * 5));
    const communicationScore = Math.min(100, Math.round((scores.manajerial / maxScores.manajerial) * 80 + (scores.sosial / maxScores.sosial) * 20));
    const problemSolvingScore = Math.min(100, Math.round((scores.teknis / maxScores.teknis) * 90 + (scores.manajerial / maxScores.manajerial) * 10));
    const characterBuildingScore = Math.min(100, Math.round((scores.teknis / maxScores.teknis) * 100));
    const conflictManagementScore = Math.min(100, Math.round((scores.teknis / maxScores.teknis) * 70 + (scores.sosial / maxScores.sosial) * 30));
    const integrityScore = Math.min(100, Math.round((scores.wawancara / maxScores.wawancara) * 100));
    const decisionMakingScore = Math.min(100, Math.round((scores.manajerial / maxScores.manajerial) * 90 + (scores.wawancara / maxScores.wawancara) * 10));
    const serviceScore = Math.min(100, Math.round((scores.sosial / maxScores.sosial) * 80 + (scores.teknis / maxScores.teknis) * 20));

    const weakestAreas: string[] = [];
    const recommendedTopics: { topic: string; reason: string; priority: 'High' | 'Medium' | 'Low'; resources: string[] }[] = [];

    // Analyze weak points
    if (scores.teknis / maxScores.teknis < 0.7) {
      weakestAreas.push('Kompetensi Teknis Asrama (Homesick, Bullying, SOP Asrama)');
      recommendedTopics.push({
        topic: 'Manajemen Psikologi Remaja & SOP Asrama',
        reason: 'Skor Kompetensi Teknis Anda berada di bawah batas kompetensi minimum 70%. Penting untuk mendalami regulasi emosi remaja asrama.',
        priority: 'High',
        resources: ['Modul Standar Asrama Sekolah Rakyat V1.2', 'Panduan Konseling Remaja Terintegrasi BKN']
      });
    }
    if (scores.manajerial / maxScores.manajerial < 0.7) {
      weakestAreas.push('Kompetensi Manajerial (Leadership & Decision Making)');
      recommendedTopics.push({
        topic: 'Decisive Leadership & Servant Management',
        reason: 'Kemampuan pengambilan keputusan manajerial dalam asrama masih memerlukan latihan pendelegasian wewenang secara adil.',
        priority: 'Medium',
        resources: ['Buku Kepemimpinan Mengayomi Edisi BKN', 'Manajemen Konflik Organisasi Siswa']
      });
    }
    if (scores.sosial / maxScores.sosial < 0.7) {
      weakestAreas.push('Kompetensi Sosio-Kultural (Inklusivitas & Moderasi)');
      recommendedTopics.push({
        topic: 'Kebinekaan Global & Resolusi Konflik SARA',
        reason: 'Respons Anda terhadap perselisihan latar belakang budaya memerlukan pemahaman teori Contact Hypothesis.',
        priority: 'High',
        resources: ['Materi Kebangsaan Pancasila BKN', 'Inklusivitas Sosial di Sekolah Menengah']
      });
    }
    if (scores.wawancara / maxScores.wawancara < 0.7) {
      weakestAreas.push('Kompetensi Wawancara (Integritas & Anti Korupsi)');
      recommendedTopics.push({
        topic: 'Etika ASN BerAKHLAK & Integritas Publik',
        reason: 'Skor wawancara integritas menunjukkan kecenderungan permisif dalam beberapa konflik kepentingan.',
        priority: 'High',
        resources: ['Core Values ASN BerAKHLAK Panduan Utama', 'Pemberantasan Gratifikasi Lembaga Pendidikan KPK']
      });
    }

    if (recommendedTopics.length === 0) {
      recommendedTopics.push({
        topic: 'Optimasi Kecepatan CAT',
        reason: 'Pemahaman materi Anda sudah sangat baik. Fokus latihan dapat diarahkan pada efisiensi waktu pengerjaan.',
        priority: 'Low',
        resources: ['Simulasi CAT BKN Speed Challenge']
      });
    }

    const narrativeReport = `Berdasarkan analisis CAT BKN Sekolah Rakyat, Anda menunjukkan profil psikologi Wali Asrama yang ${isPassed ? 'kompeten dan siap bertugas' : 'masih memerlukan pembinaan intensif'}. Nilai Integritas Anda tercatat sebesar ${integrityScore}%, sedangkan aspek Empati & Pelayanan Sosial mendapat skor ${empathyScore}%. Fokus penguatan sebaiknya diarahkan pada topik: ${weakestAreas.length > 0 ? weakestAreas.join(', ') : 'Pemeliharaan konsistensi nilai'}.`;

    const aiAnalysis = {
      psychologyProfile: {
        leadership: leadershipScore,
        empathy: empathyScore,
        communication: communicationScore,
        problemSolving: problemSolvingScore,
        characterBuilding: characterBuildingScore,
        conflictManagement: conflictManagementScore,
        integrity: integrityScore,
        decisionMaking: decisionMakingScore,
        service: serviceScore
      },
      narrativeReport,
      recommendedTopics
    };

    const historyItem: ExamHistoryItem = {
      date: Date.now(),
      mode,
      scores,
      maxScores,
      percentage,
      isPassed,
      timeSpent,
      answers,
      questionTimeSpent,
      aiAnalysis
    };

    // Save history
    const historyId = await db.examHistory.add(historyItem);
    
    // Clear active session from DB
    await db.examSessions.delete('active_session');

    // Add score to local leaderboard if in exam mode
    if (mode === 'ujian') {
      const auth = useAuthStore.getState();
      await db.leaderboard.add({
        id: Math.random().toString(36).substring(7),
        name: auth.name || 'Peserta Ujian',
        instansi: auth.instansi || 'Sekolah Rakyat',
        score: scores.total,
        timeSpent,
        rank: 1, // rank recalculated in view
        isCurrentUser: true
      });

      // Trigger achievement check
      await checkAchievements(scores.total, timeSpent, isPassed);
    }

    set({
      isActive: false,
      isCompleted: true,
      isLoading: false
    });

    return historyId;
  },

  resetExam: async () => {
    await db.examSessions.delete('active_session');
    set({
      answers: {},
      flags: [],
      bookmarks: [],
      questionTimeSpent: {},
      currentQuestionIndex: 0,
      isActive: false,
      isCompleted: false,
      timeRemaining: 130 * 60
    });
  }
}));

// Achievement checking logic helper
async function checkAchievements(totalScore: number, timeSpent: number, isPassed: boolean) {
  try {
    const list = await db.achievements.toArray();
    
    const unlock = async (id: string) => {
      const ach = list.find(a => a.id === id);
      if (ach && !ach.unlockedAt) {
        await db.achievements.update(id, { unlockedAt: Date.now() });
        toast.success(`Achievement Unlocked 🎉: ${ach.title}`);
      }
    };

    // Attempt first completion
    await unlock('first_exam');

    if (isPassed) {
      await unlock('passed_exam');
    }

    if (totalScore >= 600) {
      await unlock('score_600');
    }

    if (timeSpent < 30 * 60) {
      await unlock('speed_run');
    }
  } catch (e) {
    // ignore
  }
}
