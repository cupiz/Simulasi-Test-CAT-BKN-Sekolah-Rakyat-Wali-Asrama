'use client';

import React from 'react';
import { useAuthStore } from '../../store';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GraduationCap, LogOut, Play, Calendar, User, FileText, MapPin, Clock, Target, Shield, BookOpen, Zap } from 'lucide-react';
import { ExamMode } from '../../types';
import { toast } from 'sonner';

interface StatsOverviewProps {
  onStartExam: (mode: ExamMode, date: string) => void;
  questionCount: number;
  availableDates: string[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export function StatsOverview({
  onStartExam,
  questionCount,
  availableDates,
  selectedDate,
  setSelectedDate
}: StatsOverviewProps) {
  const auth = useAuthStore();
  const { logout } = auth;

  const handleStart = (mode: ExamMode) => {
    onStartExam(mode, selectedDate);
  };

  return (
    <div className="space-y-6">

      {/* ═══════════════════════════════════════════════════════════════
          HERO: Mulai Simulasi Ujian - BESAR & PALING ATAS
          ═══════════════════════════════════════════════════════════════ */}
      <Card className="glass-panel border-red-600/20 overflow-hidden relative">
        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-red-900/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative p-6 md:p-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-red-600/15 border border-red-600/25 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">
                    Simulasi CAT BKN
                  </h2>
                  <p className="text-[11px] text-red-400 font-bold uppercase tracking-widest">
                    Seleksi Wali Asrama — Sekolah Rakyat
                  </p>
                </div>
              </div>
            </div>

            {/* Date Selector */}
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Bank Soal Tanggal</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-white/10 bg-black text-sm text-white focus:outline-hidden focus:border-red-500/50 transition-all cursor-pointer min-w-[200px]"
                >
                  {availableDates.map(date => (
                    <option key={date} value={date} className="bg-zinc-950 text-white">
                      {date}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Exam Description */}
          <div className="bg-black/30 rounded-xl border border-white/5 p-5 space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              Ujian Seleksi Kompetensi Bidang (SKB) <strong className="text-white">CAT BKN</strong> untuk posisi{' '}
              <strong className="text-red-400">Wali Asrama Sekolah Rakyat</strong>. Simulasi ini menguji kemampuan{' '}
              teknis pengelolaan asrama, manajerial kepemimpinan, sosial kultural, dan wawancara situasional.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FileText className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span><strong className="text-white">{questionCount}</strong> Soal</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span><strong className="text-white">130</strong> Menit</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Target className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Passing Grade <strong className="text-white">65%</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span>Scoring <strong className="text-white">SJT</strong></span>
              </div>
            </div>
          </div>

          {/* Mode Cards with Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Mode Ujian CAT */}
            <div className="md:col-span-2 p-5 rounded-xl bg-red-600/5 border border-red-600/20 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-600/15 flex items-center justify-center">
                  <Play className="h-4 w-4 text-red-500 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Mode Ujian (CAT)</h3>
                  <p className="text-[11px] text-red-400/80 font-semibold">Simulasi penuh seperti ujian asli</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulasi ujian CAT BKN sesungguhnya. Waktu dibatasi <strong className="text-white">130 menit</strong>, 
                soal ditampilkan satu per satu, jawaban tidak bisa diubah setelah berpindah soal, 
                dan pembahasan baru muncul setelah ujian selesai. Cocok untuk mengukur kesiapan Anda menghadapi tes seleksi yang sesungguhnya.
              </p>
              <Button
                onClick={() => handleStart('ujian')}
                className="w-full h-12 bg-red-600 text-white hover:bg-red-700 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-red-600/20 rounded-xl cursor-pointer transition-all hover:scale-[1.005] active:scale-[0.995]"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>MULAI SIMULASI UJIAN CAT</span>
              </Button>
            </div>

            {/* Mode Belajar */}
            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/15 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Mode Belajar</h3>
                  <p className="text-[11px] text-blue-400/80 font-semibold">Tanpa batas waktu</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kerjakan soal tanpa tekanan waktu. Pembahasan dan jawaban benar langsung ditampilkan setelah Anda memilih jawaban, sehingga Anda bisa memahami konsep dan logika di balik setiap soal.
              </p>
              <Button
                onClick={() => handleStart('belajar')}
                variant="outline"
                className="w-full h-10 text-xs font-bold border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/15 hover:text-blue-400 cursor-pointer rounded-xl flex items-center justify-center gap-2"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Mulai Mode Belajar</span>
              </Button>
            </div>

            {/* Mode Latihan */}
            <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Mode Latihan</h3>
                  <p className="text-[11px] text-amber-400/80 font-semibold">Dengan timer, bisa review</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gabungan terbaik dari kedua mode. Waktu tetap berjalan seperti ujian sesungguhnya, namun Anda bisa melihat pembahasan di akhir dan mengulang soal yang salah untuk memperkuat pemahaman.
              </p>
              <Button
                onClick={() => handleStart('latihan')}
                variant="outline"
                className="w-full h-10 text-xs font-bold border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 hover:text-amber-400 cursor-pointer rounded-xl flex items-center justify-center gap-2"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Mulai Mode Latihan</span>
              </Button>
            </div>

          </div>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          ROW 2: Profil Peserta + Komposisi Soal + Ketentuan Kelulusan
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Profil Peserta */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-extrabold text-[10px] tracking-wider uppercase">
                <User className="h-3.5 w-3.5" />
                <span>Kartu Peserta</span>
              </div>
              <Button
                onClick={() => {
                  logout();
                  toast.info('Keluar dari portal peserta.');
                }}
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] text-slate-500 hover:text-red-400 cursor-pointer"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Keluar
              </Button>
            </div>
            <h3 className="text-lg font-black text-white leading-tight">
              {auth.name || 'Peserta Ujian'}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">Lokasi:</span>
              <span className="text-slate-300 font-bold">{auth.lokasi || auth.instansi || '-'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Komposisi Soal */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-extrabold text-[10px] tracking-wider uppercase">
              <FileText className="h-3.5 w-3.5" />
              <span>Komposisi Soal ({questionCount})</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-medium">
              <li className="flex justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
                <span className="text-slate-400">Teknis:</span>
                <span className="text-blue-400 font-extrabold">90 Soal</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
                <span className="text-slate-400">Manajerial:</span>
                <span className="text-amber-400 font-extrabold">25 Soal</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
                <span className="text-slate-400">Sosial:</span>
                <span className="text-emerald-400 font-extrabold">20 Soal</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
                <span className="text-slate-400">Wawancara:</span>
                <span className="text-red-400 font-extrabold">10 Soal</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Ketentuan Kelulusan */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-extrabold text-[10px] tracking-wider uppercase">
              <Calendar className="h-3.5 w-3.5" />
              <span>Ketentuan Kelulusan</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                Durasi pengerjaan: <strong className="text-white">130 menit</strong> (7.800 detik) untuk seluruh mode.
              </p>
              <p>
                Passing grade minimal: <strong className="text-emerald-400 font-extrabold">65%</strong> dari total skor SJT.
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Mendukung autosave realtime &amp; navigasi keyboard (←, →, 1-5).
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
