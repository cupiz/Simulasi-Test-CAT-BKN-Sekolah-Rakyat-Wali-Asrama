'use client';

import React from 'react';
import { useAuthStore, useExamStore } from '../../store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GraduationCap, ShieldAlert, LogOut, Play, Calendar, User, FileText } from 'lucide-react';
import { ExamMode } from '../../types';
import { toast } from 'sonner';

interface StatsOverviewProps {
  onStartExam: (mode: ExamMode) => void;
  questionCount: number;
}

export function StatsOverview({ onStartExam, questionCount }: StatsOverviewProps) {
  const auth = useAuthStore();
  const { logout } = auth;

  const handleStart = (mode: ExamMode) => {
    onStartExam(mode);
  };

  return (
    <Card className="glass-panel border-white/5 overflow-hidden">
      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-linear-to-r from-primary/10 via-transparent to-transparent">
        
        {/* User profile */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-primary font-extrabold text-xs tracking-wider uppercase">
            <User className="h-4 w-4" />
            <span>Kartu Peserta CAT BKN</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white leading-tight">
            {auth.name || 'Peserta Ujian'}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 font-medium">Nomor:</span>{' '}
              <span className="text-slate-300 font-bold">{auth.participantId || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Instansi:</span>{' '}
              <span className="text-slate-300 font-bold">{auth.instansi || '-'}</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              logout();
              toast.info('Keluar dari portal peserta.');
            }}
            variant="outline"
            className="text-xs h-9"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            <span>Ganti Akun</span>
          </Button>
        </div>

      </div>

      <CardContent className="p-6 md:p-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Composition Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-primary" />
            <span>Komposisi Soal CAT ({questionCount})</span>
          </h3>
          <ul className="text-xs text-slate-300 space-y-2 font-medium">
            <li className="flex justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
              <span className="text-slate-400">Kompetensi Teknis:</span>
              <span className="text-blue-400 font-extrabold">90 Soal</span>
            </li>
            <li className="flex justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
              <span className="text-slate-400">Kompetensi Manajerial:</span>
              <span className="text-amber-400 font-extrabold">25 Soal</span>
            </li>
            <li className="flex justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
              <span className="text-slate-400">Kompetensi Sosial:</span>
              <span className="text-emerald-400 font-extrabold">20 Soal</span>
            </li>
            <li className="flex justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
              <span className="text-slate-400">Kompetensi Wawancara:</span>
              <span className="text-red-400 font-extrabold">10 Soal</span>
            </li>
          </ul>
        </div>

        {/* Exam stats */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Ketentuan Kelulusan</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/20 border border-white/5 text-xs text-slate-300 space-y-3 leading-relaxed">
            <p>
              Durasi pengerjaan resmi adalah <strong className="text-white">130 menit</strong> (7.800 detik) untuk seluruh mode Ujian.
            </p>
            <p>
              Passing grade standar kelulusan simulasi disetel pada persentase kelulusan minimal <strong className="text-success font-extrabold">65%</strong> dari total akumulasi skor SJT.
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Sistem CAT mendukung autosave realtime dan keyboard navigasi (←, →, 1, 2, 3, 4, 5).
            </p>
          </div>
        </div>

        {/* Launcher Panel */}
        <div className="space-y-4 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>Mulai Ujian Simulasi</span>
          </h3>
          <div className="space-y-2.5">
            <Button
              onClick={() => handleStart('ujian')}
              className="w-full h-10 bg-success text-success-foreground hover:bg-success/90 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-success/10"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Luncurkan Mode Ujian (CAT)</span>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleStart('belajar')}
                variant="outline"
                className="h-9 text-[11px] font-bold border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                Mode Belajar
              </Button>
              <Button
                onClick={() => handleStart('latihan')}
                variant="outline"
                className="h-9 text-[11px] font-bold border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
              >
                Mode Latihan
              </Button>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
