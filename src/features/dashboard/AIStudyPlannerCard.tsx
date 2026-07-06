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
    
    // Construct standard tasks based on weak categories
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const tasks: AIStudyPlanTask[] = days.map((day, idx) => {
      let topic = 'Penguatan Umum SOP Asrama';
      let category = 'Teknis';
      let durationMin = 30;
      let description = 'Membaca regulasi asrama Sekolah Rakyat dan meninjau hak kepedulian bersama.';

      if (idx === 0) {
        topic = latest.aiAnalysis.recommendedTopics[0]?.topic || 'Review Pertanyaan Salah';
        category = 'Fokus Utama';
        description = 'Analisis mendalam terhadap 10 soal yang salah pada sesi ujian terakhir.';
      } else if (idx === 1) {
        topic = 'Studi Kasus Psikologi Remaja & Homesick';
        category = 'Teknis';
        description = 'Mempelajari Social Support Theory dan intervensi awal stres homesick.';
      } else if (idx === 2) {
        topic = 'Latihan Soal Manajerial (Decision Making)';
        category = 'Manajerial';
        description = 'Melatih penegakan aturan persuasif tanpa menciptakan atmosfer ketakutan.';
      } else if (idx === 3) {
        topic = 'Resolusi Konflik Sosial-Kultural';
        category = 'Sosial';
        description = 'Mengkaji penerapan Contact Hypothesis dalam pementasan seni kolaboratif.';
      } else if (idx === 4) {
        topic = 'Integritas & Anti-Korupsi ASN';
        category = 'Wawancara';
        description = 'Review panduan gratifikasi dan akuntabilitas nilai BerAKHLAK.';
      } else if (idx === 5) {
        topic = 'Simulasi CAT Mode Ujian';
        category = 'Simulasi';
        durationMin = 130;
        description = 'Mengerjakan simulasi ujian penuh 145 soal dengan pembatasan waktu ketat.';
      } else {
        topic = 'Evaluasi & AI Report Review';
        category = 'Analisis';
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
              Selesaikan minimal **1 Ujian Latihan/CAT** agar AI dapat memetakan kelemahan materi Anda.
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
