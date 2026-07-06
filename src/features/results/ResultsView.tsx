'use client';

import React, { useEffect, useState } from 'react';
import { useExamStore, useAuthStore } from '../../store';
import { db } from '../../lib/db';
import { ExamHistoryItem } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import { Download, Award, RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, Sparkles, BookOpen, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function ResultsView() {
  const resetExam = useExamStore((state) => state.resetExam);
  const questions = useExamStore((state) => state.questions);
  const auth = useAuthStore();

  const [result, setResult] = useState<ExamHistoryItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadLatestResult() {
      const history = await db.examHistory.toArray();
      const latest = history.sort((a, b) => b.date - a.date)[0];
      if (latest) {
        setResult(latest);
      }
    }
    loadLatestResult();
  }, []);

  const handleReturnToDashboard = async () => {
    await resetExam();
  };

  const handleExportPDF = () => {
    if (!result) return;
    toast.success('Mempersiapkan sertifikat PDF untuk diunduh...');
    
    // In a pure client-side environment, we can generate a premium print-optimized HTML layout 
    // that the user can print/save as PDF, or simulate downloading an elegant PDF document.
    // Let's create a beautiful iframe print trigger for maximum quality!
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Gagal membuka jendela cetak. Pastikan pop-up diizinkan.');
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Sertifikat CAT BKN Sekolah Rakyat</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; background: #fff; color: #111; padding: 40px; }
            .cert-box { border: 15px double #1e3a8a; padding: 40px; text-align: center; max-width: 800px; margin: 0 auto; }
            .title { font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 5px; }
            .subtitle { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #555; }
            .name-label { margin-top: 30px; font-size: 16px; color: #666; }
            .name { font-size: 24px; font-weight: bold; border-bottom: 2px solid #1e3a8a; display: inline-block; padding: 5px 30px; margin-top: 5px; }
            .score-box { display: flex; justify-content: space-around; margin-top: 40px; background: #f3f4f6; padding: 20px; border-radius: 10px; }
            .score-item { text-align: center; }
            .score-num { font-size: 20px; font-weight: bold; color: #10b981; }
            .score-lbl { font-size: 11px; text-transform: uppercase; color: #666; }

            @media print {
              body { padding: 0; }
              .cert-box { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <div class="title">SERTIFIKAT KELULUSAN SIMULASI</div>
            <div class="subtitle">CAT BKN Sekolah Rakyat - Wali Asrama</div>
            <div class="name-label">Diberikan kepada:</div>
            <div class="name">${auth.name}</div>
            <p style="font-size: 12px; color: #444; max-width: 500px; margin: 20px auto;">
              Telah menyelesaikan simulasi ujian CAT Wali Asrama pada tanggal ${new Date(result.date).toLocaleDateString('id-ID')} dengan hasil kelulusan yang memuaskan.
            </p>
            <div class="score-box">
              <div class="score-item">
                <div class="score-num">${result.scores.total}</div>
                <div class="score-lbl">Total Skor</div>
              </div>
              <div class="score-item">
                <div class="score-num">${result.percentage}%</div>
                <div class="score-lbl">Persentase</div>
              </div>
              <div class="score-item">
                <div class="score-num" style="color: ${result.isPassed ? '#10b981' : '#ef4444'}">${result.isPassed ? 'LULUS' : 'TIDAK LULUS'}</div>
                <div class="score-lbl">Status</div>
              </div>
            </div>

          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    if (!result) return;
    toast.success('Mengekspor log jawaban ke CSV...');
    let csvContent = "data:text/csv;charset=utf-8,Nomor Soal,Kategori,Topik,Jawaban Anda,Kunci Jawaban,Correct,Waktu Pengerjaan (detik)\n";
    
    questions.forEach((q, idx) => {
      const qId = q.id ?? 0;
      const userAns = result.answers[qId] || "-";
      const correctAns = q.correctAnswer;
      const isCorrect = userAns === correctAns ? "Benar" : "Salah";
      const timeSpent = result.questionTimeSpent[qId] || 0;
      csvContent += `${idx + 1},${q.category},${q.topic},${userAns},${correctAns},${isCorrect},${timeSpent}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `hasil_cat_bkn_${auth.name}_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      user: {
        name: auth.name,
        participantId: auth.participantId,
        instansi: auth.instansi
      },
      examDetails: result
    }, null, 2));

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hasil_cat_bkn_${auth.name}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Laporan hasil berhasil diekspor ke JSON');
  };

  if (!result || !mounted) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 text-white space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-slate-400">Memproses hasil evaluasi CAT...</p>
      </div>
    );
  }

  // 1. Radar Competency Data for Recharts
  const radarData = [
    { subject: 'Leadership', A: result.aiAnalysis.psychologyProfile.leadership, fullMark: 100 },
    { subject: 'Empathy', A: result.aiAnalysis.psychologyProfile.empathy, fullMark: 100 },
    { subject: 'Communication', A: result.aiAnalysis.psychologyProfile.communication, fullMark: 100 },
    { subject: 'Problem Solving', A: result.aiAnalysis.psychologyProfile.problemSolving, fullMark: 100 },
    { subject: 'Char Building', A: result.aiAnalysis.psychologyProfile.characterBuilding, fullMark: 100 },
    { subject: 'Conflict Mgmt', A: result.aiAnalysis.psychologyProfile.conflictManagement, fullMark: 100 },
    { subject: 'Integrity', A: result.aiAnalysis.psychologyProfile.integrity, fullMark: 100 },
    { subject: 'Decision Making', A: result.aiAnalysis.psychologyProfile.decisionMaking, fullMark: 100 },
    { subject: 'Social Service', A: result.aiAnalysis.psychologyProfile.service, fullMark: 100 }
  ];

  // 2. Average time per question statistics
  const timeArray = Object.values(result.questionTimeSpent);
  const totalRecordedTime = timeArray.reduce((a, b) => a + b, 0);
  const avgTimePerQuestion = timeArray.length > 0 ? Math.round(totalRecordedTime / timeArray.length) : 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 p-4 md:p-8 flex flex-col font-sans select-none">
      
      <div className="max-w-5xl mx-auto w-full space-y-8 relative z-10">
        
        {/* Pass/Fail Header Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className={`glass-panel overflow-hidden border-2 ${
            result.isPassed ? 'border-success/30' : 'border-red-500/30'
          }`}>
            <div className={`p-8 text-center flex flex-col items-center justify-center space-y-4 ${
              result.isPassed
                ? 'bg-linear-to-b from-success/15 to-transparent'
                : 'bg-linear-to-b from-red-500/10 to-transparent'
            }`}>
              <div className={`p-3 rounded-full border ${
                result.isPassed
                  ? 'bg-success/20 border-success/30 text-success'
                  : 'bg-red-500/20 border-red-500/30 text-red-400'
              }`}>
                <Award className="h-10 w-10 animate-bounce" />
              </div>
              
              <div className="space-y-1.5">
                <span className="text-[10px] tracking-widest font-extrabold uppercase text-slate-500">LAPORAN EVALUASI RESMI BKN</span>
                <h1 className="text-3xl font-black text-white tracking-tight">
                  SIMULASI CAT WALI ASRAMA
                </h1>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Kredensial:{' '}
                  <strong className="text-slate-200">{auth.name}</strong> •{' '}
                  <span className="text-slate-500">{auth.instansi}</span>
                </p>
              </div>

              <div className="pt-2">
                <span className={`text-4xl font-black tracking-wider ${
                  result.isPassed ? 'text-success' : 'text-red-400'
                }`}>
                  {result.isPassed ? 'LULUS SELEKSI' : 'TIDAK LULUS'}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Batas Kelulusan Passing Grade BKN: <strong className="text-slate-900 dark:text-white">65%</strong>
                </p>
              </div>
            </div>

            {/* Scorecard grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 border-t border-white/5 divide-x divide-y md:divide-y-0 divide-white/5 bg-slate-950/20">
              <div className="p-4 text-center">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Total Skor</span>
                <span className="text-xl font-black text-white">{result.scores.total}</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Maks: {result.maxScores.total}</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Persentase</span>
                <span className="text-xl font-extrabold text-slate-200">{result.percentage}%</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Rerata Waktu Soal</span>
                <span className="text-xl font-mono font-bold text-slate-200">{avgTimePerQuestion}s</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Total Waktu</span>
                <span className="text-xl font-mono font-bold text-slate-200">
                  {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                </span>
              </div>
              <div className="p-4 col-span-2 md:col-span-1 text-center bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors" onClick={handleExportPDF}>
                <Download className="h-4 w-4 text-primary mb-1 animate-pulse" />
                <span className="text-[9px] font-bold text-primary uppercase">Unduh Sertifikat</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 2-Column Details: Psychology charts and AI Study Material */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Radar competency profile chart */}
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-sm font-semibold">Profil Psikologi Wali Asrama</CardTitle>
              <CardDescription className="text-xs">
                Refleksi 9 pilar kepribadian asisten asrama berdasarkan tanggapan SJT.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 8 }} />
                  <Radar
                    name="Profil Anda"
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI study recommendation card */}
          <Card className="glass-panel border-white/5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-white text-sm font-semibold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span>Analisis AI & Rekomendasi Belajar</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Bahan kajian yang wajib diulas berdasarkan analisis kesalahan Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 overflow-y-auto max-h-[220px] no-scrollbar">
              <p className="text-[11px] leading-relaxed text-slate-400 font-medium italic">
                "{result.aiAnalysis.narrativeReport}"
              </p>
              <div className="space-y-2">
                {result.aiAnalysis.recommendedTopics.map((topic, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-white/5 bg-slate-950/40 text-[10px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-200">{topic.topic}</span>
                      <span className="bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded-xs font-semibold uppercase text-[8px]">
                        {topic.priority}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{topic.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Bonus 6: Heatmap jawaban (145 blocks color-coded) */}
        <Card className="glass-panel border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-sm font-semibold flex items-center justify-between">
              <span>Heatmap Lembar Jawaban CAT ({questions.length} Soal)</span>
              <div className="flex gap-4 text-[10px] text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-success rounded-xs border border-success/30" />
                  <span>Benar (bobot tinggi)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500/20 border border-red-500/30" />
                  <span>Salah/Kurang Tepat</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-slate-900 border border-white/5" />
                  <span>Kosong</span>
                </div>
              </div>
            </CardTitle>
            <CardDescription className="text-xs">
              Peta visual akurasi jawaban Anda untuk seluruh rentang nomor soal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 sm:grid-cols-15 md:grid-cols-20 gap-1.5 justify-center">
              {questions.map((q, idx) => {
                const qId = q.id ?? 0;
                const userAns = result.answers[qId];
                const isCorrect = userAns === q.correctAnswer;
                
                let colorClass = 'bg-slate-900 border-white/5 text-slate-600';
                let titleText = `Soal #${idx + 1}: Belum Dijawab`;

                if (userAns) {
                  if (isCorrect) {
                    colorClass = 'bg-success text-success-foreground font-bold border-success/30';
                    titleText = `Soal #${idx + 1}: Jawaban Benar (${userAns})`;
                  } else {
                    colorClass = 'bg-red-500/10 border-red-500/20 text-red-400 font-bold';
                    titleText = `Soal #${idx + 1}: Kurang Tepat (Pilihan: ${userAns}, Kunci: ${q.correctAnswer})`;
                  }
                }

                return (
                  <div
                    key={qId}
                    title={titleText}
                    className={`h-8 w-full rounded-md border text-[10px] font-bold flex items-center justify-center cursor-help transition-all duration-150 hover:scale-105 ${colorClass}`}
                  >
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Share / Export options */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={handleReturnToDashboard} className="h-10 text-xs font-semibold bg-primary text-white">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            <span>Kembali ke Dashboard</span>
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="h-10 text-xs text-slate-300 border-white/5">
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            <span>Ekspor Jawaban CSV</span>
          </Button>
          <Button onClick={handleExportJSON} variant="outline" className="h-10 text-xs text-slate-300 border-white/5">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            <span>Unduh Laporan JSON</span>
          </Button>
        </div>

      </div>

    </div>
  );
}
