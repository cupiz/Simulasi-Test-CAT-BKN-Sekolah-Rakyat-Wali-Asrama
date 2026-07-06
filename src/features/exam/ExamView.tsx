'use client';

import React, { useEffect, useState } from 'react';
import { useExamStore, useAuthStore } from '../../store';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { AlertCircle, Clock, Flag, Bookmark, Search, CheckCircle, ChevronLeft, ChevronRight, HelpCircle, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function ExamView() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    flags,
    bookmarks,
    questionTimeSpent,
    timeRemaining,
    mode,
    selectQuestion,
    setAnswer,
    toggleFlag,
    toggleBookmark,
    incrementTimeSpent,
    tickTimer,
    submitExam,
    resetExam
  } = useExamStore();

  const auth = useAuthStore();

  // Search and Filter State for Navigator
  const [navSearch, setNavSearch] = useState('');
  const [navFilter, setNavFilter] = useState<'all' | 'answered' | 'unanswered' | 'flagged' | 'bookmarked' | 'teknis' | 'manajerial' | 'sosial' | 'wawancara'>('all');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // 1. Timer ticking and question time spent tracking
  useEffect(() => {
    const timer = setInterval(() => {
      // Tick general countdown timer
      tickTimer();
      // Record time spent on active question
      if (currentQuestion) {
        incrementTimeSpent(currentQuestion.id);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, tickTimer, incrementTimeSpent]);

  // 2. Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in search input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowLeft') {
        if (currentQuestionIndex > 0) selectQuestion(currentQuestionIndex - 1);
      } else if (e.key === 'ArrowRight') {
        if (currentQuestionIndex < questions.length - 1) selectQuestion(currentQuestionIndex + 1);
      } else if (['1', '2', '3', '4', '5'].includes(e.key) && currentQuestion) {
        const optionKeys: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
        const selected = optionKeys[parseInt(e.key) - 1];
        setAnswer(currentQuestion.id, selected);
        toast.success(`Menjawab: Pilihan ${selected}`, { duration: 800 });
      } else if (e.key.toLowerCase() === 'b' && currentQuestion) {
        toggleFlag(currentQuestion.id);
        toast.info('Status Ragu-ragu diperbarui', { duration: 800 });
      } else if (e.key.toLowerCase() === 'f' && currentQuestion) {
        toggleBookmark(currentQuestion.id);
        toast.info('Bookmark diperbarui', { duration: 800 });
      } else if (e.key === 'Enter' && e.ctrlKey) {
        setShowSubmitConfirm(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentQuestionIndex, questions.length, selectQuestion, setAnswer, toggleFlag, toggleBookmark]);

  if (!currentQuestion) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        Memuat soal simulasi...
      </div>
    );
  }

  // 3. Helper calculations for navigator grid filtering
  const filteredNavIndexes = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q, idx }) => {
      const numMatch = (idx + 1).toString() === navSearch || q.topic.toLowerCase().includes(navSearch.toLowerCase()) || q.questionText.toLowerCase().includes(navSearch.toLowerCase());
      if (navSearch && !numMatch) return false;

      switch (navFilter) {
        case 'answered': return !!answers[q.id];
        case 'unanswered': return !answers[q.id];
        case 'flagged': return flags.includes(q.id);
        case 'bookmarked': return bookmarks.includes(q.id);
        case 'teknis': return q.category === 'teknis';
        case 'manajerial': return q.category === 'manajerial';
        case 'sosial': return q.category === 'sosial';
        case 'wawancara': return q.category === 'wawancara';
        default: return true;
      }
    });

  // 4. Timer formatter
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeUserAnswer = answers[currentQuestion.id];
  const isQuestionFlagged = flags.includes(currentQuestion.id);
  const isQuestionBookmarked = bookmarks.includes(currentQuestion.id);

  // 5. Submit Action
  const handleFinalSubmit = async () => {
    setShowSubmitConfirm(false);
    toast.success('Mengirimkan lembar jawaban CAT BKN...');
    await submitExam();
  };

  // Navigator Node color classes
  const getNodeColor = (qId: number, idx: number) => {
    const isActive = idx === currentQuestionIndex;
    const isAns = !!answers[qId];
    const isFlg = flags.includes(qId);

    let border = isActive ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-slate-950 scale-105' : 'border-slate-800';
    let bg = 'bg-slate-900 text-slate-400 hover:bg-slate-800';

    if (isFlg) {
      bg = 'bg-amber-500 text-slate-950 font-bold border-amber-400/40 hover:bg-amber-450';
    } else if (isAns) {
      bg = 'bg-success text-success-foreground font-bold border-success/40 hover:bg-success/90';
    }

    return `${bg} ${border}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* Top Header Bar */}
      <header className="h-14 border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="text-xs px-2 py-0.5 rounded-sm bg-primary/20 text-primary border border-primary/30 font-bold uppercase tracking-wider">
            {mode} mode
          </div>
          <span className="hidden sm:inline text-xs text-slate-400 font-medium">
            Peserta: <strong className="text-slate-200">{auth.name}</strong> ({auth.instansi})
          </span>
        </div>

        {/* Live Timer widget */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-white/5 bg-slate-900/60 text-slate-200 font-mono text-sm">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className={timeRemaining < 300 ? 'text-red-500 font-extrabold animate-pulse' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          <Button
            onClick={() => setShowSubmitConfirm(true)}
            size="sm"
            className="h-8 font-bold bg-success hover:bg-success/90 text-success-foreground text-xs"
          >
            Selesai Ujian
          </Button>
        </div>
      </header>

      {/* Main Split layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-h-[calc(100vh-3.5rem)]">
        
        {/* Left Side: Question Pane */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          
          <Card className="glass-panel border-white/5 flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full shadow-lg">
            <div>
              {/* Card Title & topic */}
              <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-extrabold uppercase tracking-widest ${
                      currentQuestion.category === 'teknis' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      currentQuestion.category === 'manajerial' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      currentQuestion.category === 'sosial' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {currentQuestion.category}
                    </span>
                    <span className="text-xs text-slate-500">• {currentQuestion.topic}</span>
                  </div>
                  <CardTitle className="text-white text-base mt-2">
                    Soal Nomor {currentQuestionIndex + 1} dari {questions.length}
                  </CardTitle>
                </div>

                {/* Flags and bookmarks */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      isQuestionFlagged
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                        : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                    title="Ragu-ragu (B)"
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleBookmark(currentQuestion.id)}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      isQuestionBookmarked
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                    title="Bookmark (F)"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>

              {/* Question Text */}
              <CardContent className="pt-6 space-y-6">
                <p className="text-slate-200 text-sm leading-relaxed font-semibold">
                  {currentQuestion.questionText}
                </p>

                {/* Option selection list */}
                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = activeUserAnswer === opt.key;
                    
                    let optStyle = 'border-white/5 bg-slate-950/20 text-slate-400 hover:border-white/10 hover:text-slate-200';
                    if (isSelected) {
                      optStyle = 'border-primary bg-primary/15 text-white shadow-md shadow-primary/5';
                    }

                    // In Study Mode (Belajar), show correctness immediately after choosing
                    const studyModeSubmitted = mode === 'belajar' && !!activeUserAnswer;
                    if (studyModeSubmitted) {
                      const isCorrectOpt = opt.key === currentQuestion.correctAnswer;
                      if (isCorrectOpt) {
                        optStyle = 'border-success bg-success/15 text-success shadow-md';
                      } else if (isSelected) {
                        optStyle = 'border-red-500 bg-red-500/15 text-red-400';
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => setAnswer(currentQuestion.id, opt.key)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3.5 leading-normal cursor-pointer ${optStyle}`}
                      >
                        <span className="font-extrabold uppercase mt-0.5 text-xs">{opt.key}.</span>
                        <span className="flex-1 font-medium">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Instant Explanation in Study Mode */}
                {mode === 'belajar' && activeUserAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] leading-relaxed text-slate-400 space-y-3"
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-white text-xs">Penjelasan Jawaban (Mode Belajar)</span>
                    </div>
                    <div className="whitespace-pre-line leading-relaxed mt-2">{currentQuestion.explanation}</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5 text-[10px] text-slate-500">
                      <div>
                        <strong className="text-slate-400">Kompetensi:</strong> {currentQuestion.competency}
                      </div>
                      <div>
                        <strong className="text-slate-400">Nilai BerAKHLAK:</strong> {currentQuestion.berakhlak}
                      </div>
                      <div>
                        <strong className="text-slate-400">Landasan Psikologi:</strong> {currentQuestion.psychologyBasis}
                      </div>
                      <div>
                        <strong className="text-slate-400">Tips CAT:</strong> {currentQuestion.catTips}
                      </div>
                    </div>
                  </motion.div>
                )}

              </CardContent>
            </div>

            {/* Bottom Question Controls */}
            <CardFooter className="flex justify-between items-center border-t border-white/5 pt-4">
              <Button
                onClick={() => selectQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                size="sm"
                className="h-9 text-xs flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </Button>

              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Ragu-ragu (B) • Bookmark (F)
              </div>

              <Button
                onClick={() => selectQuestion(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === questions.length - 1}
                variant="outline"
                size="sm"
                className="h-9 text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

        </div>

        {/* Right Side: Navigation Palette Sidebar */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/5 bg-slate-950/30 p-4 flex flex-col space-y-4 max-h-96 lg:max-h-none overflow-y-auto">
          
          {/* Navigator search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nomor, topik, atau kata..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full h-8.5 pl-8 pr-3 rounded-lg border border-white/5 bg-slate-950/40 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Navigator filters */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" />
              <span>Filter Navigator</span>
            </label>
            <select
              value={navFilter}
              onChange={(e) => setNavFilter(e.target.value as any)}
              className="w-full h-8 rounded-lg border border-white/5 bg-slate-900 px-2.5 text-xs text-slate-300 focus:outline-hidden"
            >
              <option value="all">Tampilkan Semua (145)</option>
              <option value="answered">Sudah Dijawab</option>
              <option value="unanswered">Belum Dijawab</option>
              <option value="flagged">Ragu-ragu (Kuning)</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="teknis">Kategori Teknis (90)</option>
              <option value="manajerial">Kategori Manajerial (25)</option>
              <option value="sosial">Kategori Sosial (20)</option>
              <option value="wawancara">Kategori Wawancara (10)</option>
            </select>
          </div>

          {/* Palette Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-5 gap-1.5">
              {filteredNavIndexes.map(({ q, idx }) => (
                <button
                  key={q.id}
                  onClick={() => selectQuestion(idx)}
                  className={`h-9 w-full rounded-md border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${getNodeColor(q.id, idx)}`}
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </button>
              ))}
            </div>
            {filteredNavIndexes.length === 0 && (
              <div className="text-center py-8 text-xs text-muted-foreground">
                Tidak ada nomor yang sesuai filter.
              </div>
            )}
          </div>

          {/* Color Code Legend */}
          <div className="border-t border-white/5 pt-3 space-y-2 text-[10px] text-slate-500">
            <span className="font-semibold block uppercase tracking-wider">Keterangan Warna:</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-xs bg-success border border-success/30" />
                <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-xs bg-amber-500 border border-amber-400/40" />
                <span>Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-xs bg-slate-900 border border-slate-800" />
                <span>Belum Dijawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-xs border-2 border-red-500 bg-slate-900" />
                <span>Sedang Dibuka</span>
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* Radical submit confirmation dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <Card className="glass-panel border-white/10 max-w-md w-full rounded-xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <div>
                <h3 className="text-white text-base font-bold">Kirim Lembar Jawaban?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Anda akan menyelesaikan sesi simulasi CAT BKN Sekolah Rakyat ini.
                </p>
              </div>
            </div>
            
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-white/5 text-xs text-slate-400 space-y-1.5 leading-relaxed">
              <div>
                <span className="font-bold text-slate-300">Total Soal:</span> {questions.length}
              </div>
              <div>
                <span className="font-bold text-slate-300">Sudah Dijawab:</span>{' '}
                <span className="text-success font-extrabold">{Object.keys(answers).length} soal</span>
              </div>
              <div>
                <span className="font-bold text-slate-300">Belum Dijawab:</span>{' '}
                <span className="text-red-400 font-extrabold">{questions.length - Object.keys(answers).length} soal</span>
              </div>
              {flags.length > 0 && (
                <div className="text-amber-500">
                  ⚠️ Masih terdapat <strong className="font-extrabold">{flags.length} soal</strong> dengan status Ragu-ragu.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5">
              <Button
                onClick={() => setShowSubmitConfirm(false)}
                variant="outline"
                className="h-9 text-xs border-white/5 text-slate-300 hover:bg-slate-900"
              >
                Kembali Menjawab
              </Button>
              <Button
                onClick={handleFinalSubmit}
                className="h-9 text-xs bg-success hover:bg-success/90 text-success-foreground font-bold"
              >
                Ya, Kirim Sekarang
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
