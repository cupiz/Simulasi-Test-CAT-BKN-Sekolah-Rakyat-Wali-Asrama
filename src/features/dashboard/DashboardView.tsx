'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { ExamHistoryItem, ExamMode } from '../../types';
import { useExamStore, useAuthStore } from '../../store';
import { StatsOverview } from './StatsOverview';
import { PerformanceCharts } from './PerformanceCharts';
import { LeaderboardCard } from './LeaderboardCard';
import { AchievementsCard } from './AchievementsCard';
import { DailyChallengeCard } from './DailyChallengeCard';
import { AIStudyPlannerCard } from './AIStudyPlannerCard';
import { StudyHeatmap } from './StudyHeatmap';
import { AdminPanel } from '../question/AdminPanel';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { LayoutDashboard, History, ShieldAlert, Sparkles, Moon, Sun, ArrowRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function DashboardView() {
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'admin'>('dashboard');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<ExamHistoryItem | null>(null);
  const [questionCount, setQuestionCount] = useState(145);
  const [latestDate, setLatestDate] = useState('2026-07-06');
  
  const startExam = useExamStore((state) => state.startExam);
  const auth = useAuthStore();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const hist = await db.examHistory.toArray();
    setHistory(hist.sort((a, b) => b.date - a.date));

    const allQs = await db.questions.toArray();
    const dates = [...new Set(allQs.map(q => q.dateStr).filter((d): d is string => !!d))].sort();
    const latest = dates.length > 0 ? dates[dates.length - 1] : '2026-07-06';
    setLatestDate(latest);
    setQuestionCount(allQs.filter(q => q.dateStr === latest).length);
  };

  const handleStartExam = async (mode: ExamMode) => {
    toast.success(`Memulai sesi ujian Baru (${mode}) untuk set tanggal ${latestDate}...`);
    // Default exam is 130 minutes
    await startExam(mode, 130, latestDate);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getCategoryName = (key: string) => {
    if (key === 'teknis') return 'Teknis';
    if (key === 'manajerial') return 'Manajerial';
    if (key === 'sosial') return 'Sosial';
    return 'Wawancara';
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col font-sans select-none pb-12">
      
      {/* Background blobs */}
      <div className="absolute top-0 left-[25%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-[25%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base">
              SR
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-tight">Sekolah Rakyat</span>
              <span className="text-[10px] text-slate-500 block leading-none font-semibold uppercase tracking-wider">Simulasi CAT BKN v1.0</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex space-x-1">
            {(['dashboard', 'history', 'admin'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedHistoryItem(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'dashboard' && 'Dashboard'}
                  {tab === 'history' && 'Riwayat Ujian'}
                  {tab === 'admin' && 'Admin Panel'}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-white/5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-200 block leading-tight">{auth.name}</span>
              <span className="text-[10px] text-slate-500 font-semibold">{auth.instansi}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full space-y-8 relative z-10">
        
        {/* Mobile Tabs */}
        <div className="flex md:hidden border-b border-white/5 pb-2 justify-around">
          {(['dashboard', 'history', 'admin'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedHistoryItem(null);
                }}
                className={`pb-1 text-xs font-bold ${
                  isActive ? 'border-b-2 border-primary text-primary' : 'text-slate-400'
                }`}
              >
                {tab === 'dashboard' && 'Dashboard'}
                {tab === 'history' && 'Riwayat'}
                {tab === 'admin' && 'Admin'}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Profile Card & Info */}
              <StatsOverview onStartExam={handleStartExam} questionCount={questionCount} />

              {/* Heatmap & Analytical Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <StudyHeatmap />
                  <PerformanceCharts history={history} />
                </div>
                
                <div className="space-y-6">
                  <DailyChallengeCard />
                  <AIStudyPlannerCard />
                </div>
              </div>

              {/* Gamification Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LeaderboardCard />
                <AchievementsCard />
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {selectedHistoryItem ? (
                // Expand Details of specific history item
                <Card className="glass-panel border-white/5">
                  <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
                    <div>
                      <Button
                        onClick={() => setSelectedHistoryItem(null)}
                        variant="ghost"
                        size="sm"
                        className="text-xs hover:bg-slate-900 text-slate-400 hover:text-white mb-2 h-7"
                      >
                        ← Kembali ke Riwayat
                      </Button>
                      <CardTitle className="text-white text-base">
                        Simulasi Sesi: {new Date(selectedHistoryItem.date).toLocaleString('id-ID')}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Analisis nilai, kepribadian, dan pembimbing belajar personal.
                      </CardDescription>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        selectedHistoryItem.isPassed
                          ? 'bg-success/15 text-success border border-success/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}>
                        {selectedHistoryItem.isPassed ? 'LULUS' : 'TIDAK LULUS'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Score summary */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="p-3.5 rounded-xl border border-white/5 bg-slate-950/20 text-center">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Total Skor</span>
                        <span className="text-2xl font-black text-white">{selectedHistoryItem.scores.total}</span>
                        <span className="text-[9px] text-slate-500 block">maks: {selectedHistoryItem.maxScores.total}</span>
                      </div>
                      {Object.keys(selectedHistoryItem.scores).filter(k => k !== 'total').map((k) => (
                        <div key={k} className="p-3.5 rounded-xl border border-white/5 bg-slate-950/20 text-center">
                          <span className="text-[10px] text-slate-500 font-semibold block uppercase">{getCategoryName(k)}</span>
                          <span className="text-xl font-bold text-slate-200">{selectedHistoryItem.scores[k as keyof typeof selectedHistoryItem.scores]}</span>
                          <span className="text-[9px] text-slate-500 block">maks: {selectedHistoryItem.maxScores[k as keyof typeof selectedHistoryItem.maxScores]}</span>
                        </div>
                      ))}
                    </div>

                    {/* AI report */}
                    <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                      <h4 className="text-xs font-extrabold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="h-4 w-4" />
                        <span>Analisis AI & Profil Psikologi</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {selectedHistoryItem.aiAnalysis.narrativeReport}
                      </p>
                      
                      {/* Weak areas tasks */}
                      {selectedHistoryItem.aiAnalysis.recommendedTopics.length > 0 && (
                        <div className="pt-2 space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rekomendasi Tindakan AI:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedHistoryItem.aiAnalysis.recommendedTopics.map((topic, i) => (
                              <div key={i} className="p-3.5 rounded-lg border border-white/5 bg-slate-950/40 text-xs space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <span className="font-extrabold text-slate-200">{topic.topic}</span>
                                  <span className={`text-[9px] px-1.5 rounded-xs font-semibold ${
                                    topic.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    topic.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  }`}>
                                    {topic.priority} Priority
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed">{topic.reason}</p>
                                <div className="text-[9px] text-slate-500">
                                  <span className="font-semibold">Bahan:</span> {topic.resources.join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // History List
                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white text-sm font-semibold flex items-center justify-between">
                      <span>Daftar Riwayat Ujian</span>
                      <History className="h-4 w-4 text-primary" />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Tinjau hasil evaluasi simulasi Ujian/Latihan CAT Anda sebelumnya.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-slate-950/20 text-slate-400 font-bold">
                            <th className="p-3">Tanggal Sesi</th>
                            <th className="p-3 text-center">Mode</th>
                            <th className="p-3 text-center">Persentase</th>
                            <th className="p-3 text-center">Skor Total</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Waktu Pengerjaan</th>
                            <th className="p-3 text-center">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {history.length > 0 ? (
                            history.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-950/10 transition-colors">
                                <td className="p-3 font-medium text-slate-200">
                                  {new Date(item.date).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="p-3 text-center capitalize text-slate-400 font-semibold">{item.mode}</td>
                                <td className="p-3 text-center text-slate-300 font-extrabold">{item.percentage}%</td>
                                <td className="p-3 text-center font-black text-white">{item.scores.total}</td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-sm font-semibold text-[10px] ${
                                    item.isPassed ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-400'
                                  }`}>
                                    {item.isPassed ? 'Lulus' : 'Gagal'}
                                  </span>
                                </td>
                                <td className="p-3 text-center text-slate-400 font-mono">
                                  {Math.floor(item.timeSpent / 60)}m {item.timeSpent % 60}s
                                </td>
                                <td className="p-3 text-center">
                                  <Button
                                    onClick={() => setSelectedHistoryItem(item)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-[10px] font-bold text-primary hover:bg-slate-900 cursor-pointer"
                                  >
                                    Detail Analisis
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center p-8 text-muted-foreground font-medium">
                                Belum ada riwayat ujian yang tercatat. Silakan mulai simulasi pertama Anda.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminPanel />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
