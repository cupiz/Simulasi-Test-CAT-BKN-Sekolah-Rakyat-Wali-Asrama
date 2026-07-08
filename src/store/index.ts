import { create } from 'zustand';
import { db } from '../lib/db';
import { Question, ExamMode, ExamSession, ExamHistoryItem, LeaderboardEntry, CategoryScores } from '../types';
import { toast } from 'sonner';
import { supabase, isCloudEnabled } from '../lib/supabase';

interface AuthState {
  name: string;
  participantId: string;
  instansi: string;
  lokasi: string;
  email: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  isCloudEnabled: boolean;
  signUp: (email: string, password: string, name: string, lokasi: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const syncCloudHistoryToLocal = async (userId: string) => {
  if (!isCloudEnabled) return;
  try {
    const { data: cloudHistory, error } = await supabase
      .from('exam_history')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    if (cloudHistory && cloudHistory.length > 0) {
      const formattedItems = cloudHistory.map(item => ({
        date: item.date,
        mode: item.mode,
        scores: item.scores,
        maxScores: item.max_scores,
        percentage: item.percentage,
        isPassed: item.is_passed,
        timeSpent: item.time_spent,
        answers: item.answers,
        questionTimeSpent: {},
        aiAnalysis: item.ai_analysis
      }));
      
      const localHistory = await db.examHistory.toArray();
      const localDates = new Set(localHistory.map(h => h.date));
      const newItems = formattedItems.filter(item => !localDates.has(item.date));
      
      if (newItems.length > 0) {
        await db.examHistory.bulkAdd(newItems);
        toast.info(`Berhasil mensinkronisasi ${newItems.length} riwayat ujian dari Cloud!`);
      }
    }
  } catch (err) {
    console.error('Gagal melakukan sinkronisasi database awan:', err);
  }
};

export const useAuthStore = create<AuthState>((set) => {
  let initialAuth = { name: '', participantId: '', instansi: '', lokasi: '', email: '', isLoggedIn: false, isLoading: false, isCloudEnabled };
  
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sr_auth');
    if (saved) {
      try {
        initialAuth = { ...JSON.parse(saved), isLoading: false, isCloudEnabled };
      } catch (e) {
        // ignore
      }
    }
  }

  return {
    ...initialAuth,
    signUp: async (email, password, name, lokasi) => {
      set({ isLoading: true });
      if (!isCloudEnabled) {
        const localUsers = JSON.parse(localStorage.getItem('sr_mock_users') || '[]');
        if (localUsers.some((u: any) => u.email === email)) {
          set({ isLoading: false });
          throw new Error('Email sudah terdaftar (mode lokal)');
        }
        localUsers.push({ email, password, name, lokasi });
        localStorage.setItem('sr_mock_users', JSON.stringify(localUsers));
        set({ isLoading: false });
        toast.success('Registrasi akun lokal berhasil! Silakan masuk.');
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            lokasi: lokasi
          }
        }
      });

      if (error) {
        set({ isLoading: false });
        throw error;
      }
      
      set({ isLoading: false });
      toast.success('Registrasi berhasil! Silakan masuk.');
    },

    signIn: async (email, password) => {
      set({ isLoading: true });
      if (!isCloudEnabled) {
        const localUsers = JSON.parse(localStorage.getItem('sr_mock_users') || '[]');
        const user = localUsers.find((u: any) => u.email === email && u.password === password);
        if (!user) {
          set({ isLoading: false });
          throw new Error('Email atau kata sandi salah (mode lokal)');
        }
        const state = {
          name: user.name,
          participantId: '',
          instansi: user.lokasi || '',
          lokasi: user.lokasi || '',
          email: user.email,
          isLoggedIn: true,
          isLoading: false
        };
        localStorage.setItem('sr_auth', JSON.stringify(state));
        set(state);
        toast.success(`Selamat datang kembali, ${user.name}!`);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        set({ isLoading: false });
        throw error;
      }

      if (data.user) {
        const meta = data.user.user_metadata;
        const state = {
          name: meta.full_name || '',
          participantId: '',
          instansi: meta.lokasi || '',
          lokasi: meta.lokasi || '',
          email: data.user.email || '',
          isLoggedIn: true,
          isLoading: false
        };
        localStorage.setItem('sr_auth', JSON.stringify(state));
        set(state);
        toast.success(`Selamat datang kembali, ${state.name}!`);
        
        syncCloudHistoryToLocal(data.user.id);
      }
    },

    logout: async () => {
      set({ isLoading: true });
      if (isCloudEnabled) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('sr_auth');
      set({
        name: '',
        participantId: '',
        instansi: '',
        lokasi: '',
        email: '',
        isLoggedIn: false,
        isLoading: false
      });
      toast.info('Sesi Anda telah berakhir.');
    },

    checkSession: async () => {
      if (!isCloudEnabled) {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('sr_auth');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              set({ ...parsed, isLoading: false });
            } catch (e) {}
          }
        }
        return;
      }

      set({ isLoading: true });
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata;
          const state = {
            name: meta.full_name || '',
            participantId: '',
            instansi: meta.lokasi || '',
            lokasi: meta.lokasi || '',
            email: session.user.email || '',
            isLoggedIn: true,
            isLoading: false
          };
          localStorage.setItem('sr_auth', JSON.stringify(state));
          set(state);
          syncCloudHistoryToLocal(session.user.id);
        } else {
          set({ name: '', participantId: '', instansi: '', lokasi: '', email: '', isLoggedIn: false, isLoading: false });
        }
      } catch (e) {
        set({ isLoading: false });
      }
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
      narrativeReport: generateDynamicNarrative(
        isPassed,
        scores,
        maxScores,
        integrityScore,
        empathyScore,
        weakestAreas
      ),
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

    // Save history locally
    const historyId = await db.examHistory.add(historyItem);
    
    // Save to Supabase Cloud DB if logged in and cloud is enabled
    const authState = useAuthStore.getState();
    if (authState.isLoggedIn && authState.isCloudEnabled) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const { error } = await supabase.from('exam_history').insert({
            user_id: userData.user.id,
            user_name: authState.name || 'Peserta Ujian',
            user_instansi: authState.lokasi || authState.instansi || 'Sekolah Rakyat',
            date: historyItem.date,
            mode: historyItem.mode,
            scores: historyItem.scores,
            max_scores: historyItem.maxScores,
            percentage: historyItem.percentage,
            is_passed: historyItem.isPassed,
            time_spent: historyItem.timeSpent,
            answers: historyItem.answers,
            ai_analysis: historyItem.aiAnalysis
          });
          if (error) throw error;
          toast.success('Hasil ujian berhasil disinkronisasi ke Cloud!');
        }
      } catch (err) {
        console.error('Gagal mengunggah riwayat ke Cloud:', err);
      }
    }
    
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

      // Reload leaderboard store
      await useLeaderboardStore.getState().loadLeaderboard();
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

// ═══════════════════════════════════════════════════════════════
// DYNAMIC NARRATIVE GENERATOR
// ═══════════════════════════════════════════════════════════════
function generateDynamicNarrative(
  isPassed: boolean,
  scores: CategoryScores,
  maxScores: CategoryScores,
  integrityScore: number,
  empathyScore: number,
  weakestAreas: string[]
): string {
  const generalStatus = isPassed
    ? "menunjukkan kompetensi yang sangat matang dan siap memikul tanggung jawab penuh sebagai Wali Asrama Sekolah Rakyat."
    : "masih memerlukan bimbingan intensif dan pembenahan pada beberapa aspek kompetensi sebelum dinyatakan siap bertugas.";

  // Integrity assessment
  let integrityText = "";
  if (integrityScore >= 85) {
    integrityText = "Tingkat integritas moral Anda luar biasa tinggi, menunjukkan ketegasan dalam etika dan penolakan gratifikasi.";
  } else if (integrityScore >= 65) {
    integrityText = "Integritas Anda berada pada level standar kelayakan, namun Anda harus lebih cermat menghindari benturan kepentingan kecil.";
  } else {
    integrityText = "Skor integritas Anda tergolong rendah, menandakan adanya celah kompromi etika dalam situasi krisis di asrama.";
  }

  // Empathy and Service
  let socialText = "";
  if (empathyScore >= 80) {
    socialText = "Kemampuan sosio-kultural dan empati sosial Anda sangat menonjol, ideal untuk menciptakan iklim asrama yang harmonis dan inklusif.";
  } else if (empathyScore >= 60) {
    socialText = "Anda memiliki empati sosial yang cukup, namun perlu lebih aktif merespons dinamika isolasi sosial siswa.";
  } else {
    socialText = "Aspek pelayanan sosial Anda memerlukan evaluasi serius karena respons Anda cenderung kaku dan kurang peka terhadap siswa.";
  }

  // Technical SOP
  const techRatio = scores.teknis / maxScores.teknis;
  let techText = "";
  if (techRatio >= 0.8) {
    techText = "Pemahaman teknis Anda mengenai tata tertib asrama, bullying, dan SOP keselamatan sangat taktis dan komprehensif.";
  } else if (techRatio >= 0.6) {
    techText = "Penguasaan prosedur operasional asrama Anda memadai, tetapi perlu diperkuat pada bagian mitigasi darurat.";
  } else {
    techText = "Pemahaman teknis Anda berada di zona kritis. Sangat disarankan untuk meninjau ulang modul asrama dasar.";
  }

  const weakestText = weakestAreas.length > 0
    ? `Fokus perbaikan mandiri sebaiknya diprioritaskan pada: ${weakestAreas.join(", ")}.`
    : "Pertahankan konsistensi performa Anda dengan melatih efisiensi waktu pengerjaan.";

  return `Berdasarkan analisis hasil evaluasi CAT BKN, Anda ${generalStatus} ${integrityText} ${socialText} ${techText} ${weakestText}`;
}

// ═══════════════════════════════════════════════════════════════
// LEADERBOARD STORE (DYNAMIC SIMULATION)
// ═══════════════════════════════════════════════════════════════
interface LeaderboardState {
  entries: LeaderboardEntry[];
  loadLeaderboard: () => Promise<void>;
  simulateCompetitorActivity: () => Promise<{ name: string; score: number; rankBefore: number; rankAfter: number } | null>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],

  loadLeaderboard: async () => {
    const authState = useAuthStore.getState();
    if (authState.isLoggedIn && authState.isCloudEnabled) {
      try {
        const { data: cloudHistory, error } = await supabase
          .from('exam_history')
          .select('user_id, user_name, user_instansi, scores, time_spent')
          .order('percentage', { ascending: false })
          .limit(200);

        if (error) throw error;

        if (cloudHistory && cloudHistory.length > 0) {
          const entriesMap: Record<string, LeaderboardEntry> = {};

          cloudHistory.forEach(item => {
            const uid = item.user_id;
            const score = item.scores?.total || 0;
            const timeSpent = item.time_spent || 0;
            const name = item.user_name || 'Peserta Ujian';
            const instansi = item.user_instansi || 'Sekolah Rakyat';

            // Keep the highest score for this user
            if (!entriesMap[uid] || score > entriesMap[uid].score) {
              entriesMap[uid] = {
                id: uid,
                name,
                instansi,
                score,
                timeSpent,
                rank: 1,
                isCurrentUser: false
              };
            }
          });

          // Identify the current user's ID
          const currentUserId = authState.email ? (await supabase.auth.getSession())?.data?.session?.user?.id : null;

          const entriesList = Object.values(entriesMap);
          const sorted = entriesList.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.timeSpent - b.timeSpent;
          });

          const ranked = sorted.map((entry, idx) => ({
            ...entry,
            rank: idx + 1,
            isCurrentUser: entry.id === currentUserId
          }));

          set({ entries: ranked });
          return;
        }
      } catch (err) {
        console.error('Failed to load cloud leaderboard, using local fallback:', err);
      }
    }

    const data = await db.leaderboard.toArray();
    const sorted = data.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpent - b.timeSpent;
    });
    const ranked = sorted.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
    set({ entries: ranked });
  },

  simulateCompetitorActivity: async () => {
    const list = await db.leaderboard.toArray();
    if (list.length === 0) return null;

    const competitors = list.filter(item => !item.isCurrentUser);
    if (competitors.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * competitors.length);
    const chosen = competitors[randomIndex];

    const pointsToAdd = Math.floor(Math.random() * 16) + 5; // add 5 to 20 points
    const oldScore = chosen.score;
    const newScore = Math.min(745, oldScore + pointsToAdd);

    if (newScore === oldScore) return null;

    // Simulate slightly faster time too
    const oldTime = chosen.timeSpent;
    const newTime = Math.max(3600, oldTime - Math.floor(Math.random() * 200));

    await db.leaderboard.update(chosen.id, { score: newScore, timeSpent: newTime });

    const updatedList = await db.leaderboard.toArray();
    const sorted = updatedList.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpent - b.timeSpent;
    });

    const sortedOld = [...list].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpent - b.timeSpent;
    });

    const rankBefore = sortedOld.findIndex(item => item.id === chosen.id) + 1;

    const ranked = sorted.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));

    const rankAfter = ranked.findIndex(item => item.id === chosen.id) + 1;

    set({ entries: ranked });

    return {
      name: chosen.name,
      score: newScore,
      rankBefore,
      rankAfter
    };
  }
}));
