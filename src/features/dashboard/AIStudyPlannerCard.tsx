'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { AIStudyPlan, AIStudyPlanTask, ExamHistoryItem } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Brain, Calendar, CheckSquare, ListTodo, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export function AIStudyPlannerCard() {
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [activePlan, setActivePlan] = useState<AIStudyPlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const hist = await db.examHistory.toArray();
      setHistory(hist);
      
      const plans = await db.aiStudyPlans.toArray();
      const latestPlan = plans.sort((a, b) => b.createdAt - a.createdAt)[0];
      
      if (latestPlan) {
        setActivePlan(latestPlan);
      } else if (hist.length > 0) {
        // Automatically generate if history exists but no plan is present
        await generateNewPlan(hist);
      }
    }
    loadData();
  }, []);

  const generateNewPlan = async (histList: ExamHistoryItem[]) => {
    if (histList.length === 0) return;
    setLoading(true);

    const latest = histList[histList.length - 1];
    const weakAreas = latest.aiAnalysis.recommendedTopics.map(t => t.topic);

    // Calculate weakest category based on scores ratio
    const categories: ('teknis' | 'manajerial' | 'sosial' | 'wawancara')[] = ['teknis', 'manajerial', 'sosial', 'wawancara'];
    const ratios = categories.map(cat => ({
      category: cat,
      ratio: latest.scores[cat] / (latest.maxScores[cat] || 1)
    }));
    ratios.sort((a, b) => a.ratio - b.ratio);
    const weakestCategory = ratios[0].category;

    // Database of category-specific tasks
    const taskLibrary: Record<'teknis' | 'manajerial' | 'sosial' | 'wawancara', { topic: string; description: string; durationMin: number }[]> = {
      teknis: [
        { topic: 'SOP Penanganan Bullying & Intimidasi', description: 'Mengkaji protokol penanganan bullying fisik/non-fisik dan perlindungan saksi junior.', durationMin: 45 },
        { topic: 'Konseling Siswa Homesick & Stres Ujian', description: 'Mempelajari koping stres remaja dan merancang forum peer-support kamar.', durationMin: 40 },
        { topic: 'Sanitasi Kamar & Pencegahan Hama', description: 'Membuat jadwal penataan lemari mandiri dan SOP higienitas asrama Sekolah Rakyat.', durationMin: 30 },
        { topic: 'Manajemen Gadget & Kecanduan Game', description: 'Strategi pembatasan gawai persuasif dan pembinaan regulasi diri digital siswa.', durationMin: 45 }
      ],
      manajerial: [
        { topic: 'Penerapan Servant Leadership Asrama', description: 'Mempelajari konsep kepemimpinan mengayomi bagi ketua organisasi asrama.', durationMin: 45 },
        { topic: 'Penegakan Tata Tertib Persuasif', description: 'Latihan merumuskan teguran mendidik tanpa intimidasi di ruang makan asrama.', durationMin: 40 },
        { topic: 'Pendelegasian Tugas Piket Adil', description: 'Manajemen beban kerja pengurus asrama dan resolusi konflik kecemburuan tugas.', durationMin: 35 },
        { topic: 'Pengambilan Keputusan Jam Malam', description: 'Studi kasus dispensasi keluar asrama atas dasar darurat keluarga vs aturan.', durationMin: 50 }
      ],
      sosial: [
        { topic: 'Inklusivitas & Resolusi Konflik SARA', description: 'Mempelajari Contact Hypothesis untuk merukunkan perselisihan latar belakang budaya.', durationMin: 45 },
        { topic: 'Kebinekaan Global di Asrama', description: 'Merancang program apresiasi ragam daerah untuk meminimalkan stereotip suku.', durationMin: 40 },
        { topic: 'Mediasi Pengucilan Sosial Kamar', description: 'Teknik fasilitasi restoratif terintegrasi guna merangkul siswa yang dikucilkan.', durationMin: 45 },
        { topic: 'Etika Sosio-Kultural BerAKHLAK', description: 'Refleksi nilai toleransi, keadilan sosial, dan kesopanan komunal di lingkungan BKN.', durationMin: 30 }
      ],
      wawancara: [
        { topic: 'Anti-Gratifikasi & Akuntabilitas ASN', description: 'Mengkaji panduan KPK tentang gratifikasi pendidikan dan integritas pegawai.', durationMin: 45 },
        { topic: 'Benturan Kepentingan Wali Asrama', description: 'Analisis dilema memberi perlakuan istimewa kepada sanak saudara di asrama.', durationMin: 40 },
        { topic: 'Core Values BerAKHLAK Instansi', description: 'Ulasan mendalam mengenai akuntabilitas, komitmen, dan moralitas aparatur sipil.', durationMin: 30 },
        { topic: 'Loyalitas & Penegakan Kode Etik', description: 'Menghadapi tekanan eksternal dari wali murid yang meminta nilai atau kelonggaran SOP.', durationMin: 45 }
      ]
    };
    
    // Construct dynamic tasks based on weak categories
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const tasks: AIStudyPlanTask[] = days.map((day, idx) => {
      let topic = '';
      let category = '';
      let durationMin = 30;
      let description = '';

      if (idx === 0) {
        topic = latest.aiAnalysis.recommendedTopics[0]?.topic || 'Review Pertanyaan Salah';
        category = 'Fokus Utama';
        durationMin = 45;
        description = 'Analisis mendalam terhadap soal-soal yang salah pada sesi ujian terakhir Anda.';
      } else if (idx >= 1 && idx <= 4) {
        const libTask = taskLibrary[weakestCategory][idx - 1];
        topic = libTask.topic;
        category = weakestCategory.charAt(0).toUpperCase() + weakestCategory.slice(1);
        durationMin = libTask.durationMin;
        description = libTask.description;
      } else if (idx === 5) {
        topic = 'Simulasi CAT Mode Ujian';
        category = 'Simulasi';
        durationMin = 130;
        description = 'Mengerjakan simulasi ujian penuh 145 soal dengan pembatasan waktu ketat.';
      } else {
        topic = 'Evaluasi & AI Report Review';
        category = 'Analisis';
        durationMin = 30;
        description = 'Mengevaluasi grafik kompetensi asrama di Dashboard dan merencanakan minggu depan.';
      }

      return {
        id: `t_${idx}_${Date.now()}`,
        day,
        topic,
        category,
        durationMin,
        description,
        completed: false
      };
    });

    const newPlan: AIStudyPlan = {
      id: `plan_${Date.now()}`,
      createdAt: Date.now(),
      weakestAreas: weakAreas,
      tasks
    };

    await db.aiStudyPlans.add(newPlan);
    setActivePlan(newPlan);
    setLoading(false);
    toast.success('Rencana belajar AI baru berhasil dirancang!');
  };

  const handleToggleTask = async (taskId: string) => {
    if (!activePlan) return;
    
    const updatedTasks = activePlan.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const updatedPlan = {
      ...activePlan,
      tasks: updatedTasks
    };

    await db.aiStudyPlans.update(activePlan.id!, { tasks: updatedTasks });
    setActivePlan(updatedPlan);
  };

  return (
    <Card className="glass-panel border-white/5 h-full flex flex-col justify-between">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between text-white">
          <span>AI Study Planner (Jadwal Mingguan)</span>
          <Brain className="h-4 w-4 text-primary animate-pulse" />
        </CardTitle>
        <CardDescription className="text-xs">
          Rencana belajar adaptif 7 hari yang dirancang AI berdasarkan skor kelemahan Anda.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-3">
            <Calendar className="h-10 w-10 text-slate-600" />
            <p className="text-xs text-slate-400 max-w-[240px]">
              Selesaikan minimal <strong className="text-slate-900 dark:text-slate-200">1 Ujian Latihan/CAT</strong> agar AI dapat memetakan kelemahan materi Anda.
            </p>
          </div>
        ) : activePlan ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
            
            {/* Weakest Area badge */}
            {activePlan.weakestAreas.length > 0 && (
              <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-[10px] text-red-400">
                <span className="font-bold">Fokus Utama AI:</span> {activePlan.weakestAreas.join(', ')}
              </div>
            )}

            {/* Checklist */}
            <div className="space-y-1.5">
              {activePlan.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                    task.completed
                      ? 'border-success/20 bg-success/5 text-slate-500'
                      : 'border-white/5 bg-slate-950/20 text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="mt-1 h-3.5 w-3.5 rounded-sm border-slate-700 bg-slate-950/40 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-slate-500">
                        {task.day} • {task.category}
                      </span>
                      <span className="text-[9px] text-slate-500">{task.durationMin}m</span>
                    </div>
                    <span className={`text-xs font-bold block mt-0.5 ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.topic}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">
                      {task.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-xs text-muted-foreground">
            Menghubungkan asisten belajar...
          </div>
        )}
      </CardContent>

      {history.length > 0 && activePlan && (
        <div className="p-6 pt-0 mt-4">
          <Button
            onClick={() => generateNewPlan(history)}
            disabled={loading}
            variant="outline"
            className="w-full text-xs flex items-center justify-center gap-2 h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Rancang Ulang Jadwal AI</span>
          </Button>
        </div>
      )}
    </Card>
  );
}
