'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore, useExamStore } from '../../store';
import { db } from '../../lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Shield, Sparkles, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ExamMode } from '../../types';

export function LoginView() {
  const login = useAuthStore((state) => state.login);
  const startExam = useExamStore((state) => state.startExam);

  const [name, setName] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [instansi, setInstansi] = useState('');
  const [mode, setMode] = useState<ExamMode>('ujian');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-07-06');

  useEffect(() => {
    async function loadDates() {
      const allQs = await db.questions.toArray();
      const dates = [...new Set(allQs.map(q => q.dateStr).filter((d): d is string => !!d))].sort();
      if (dates.length > 0) {
        setAvailableDates(dates);
        const todayStr = new Date().toISOString().split('T')[0];
        if (dates.includes(todayStr)) {
          setSelectedDate(todayStr);
        } else {
          setSelectedDate(dates[dates.length - 1]);
        }
      } else {
        setAvailableDates(['2026-07-06']);
        setSelectedDate('2026-07-06');
      }
    }
    loadDates();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!participantId.trim()) newErrors.participantId = 'Nomor peserta wajib diisi';
    if (!instansi.trim()) newErrors.instansi = 'Instansi asal wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Harap lengkapi semua data formulir');
      return;
    }

    // Save auth profile
    login(name, participantId, instansi);

    // If starting directly into an exam
    toast.success(`Selamat datang, ${name}! Mempersiapkan sesi ${mode}...`);
    
    // Automatically trigger starting exam in the store
    // 130 minutes duration, passing selectedDate
    await startExam(mode, 130, selectedDate);
  };

  const modeDescriptions = {
    belajar: {
      title: 'Mode Belajar',
      icon: BookOpen,
      color: 'text-blue-500 border-blue-500/25 bg-blue-500/5',
      desc: 'Jawaban benar dan pembahasan 300+ kata langsung terlihat setelah menjawab. Tanpa batas waktu.'
    },
    latihan: {
      title: 'Mode Latihan',
      icon: GraduationCap,
      color: 'text-amber-500 border-amber-500/25 bg-amber-500/5',
      desc: 'Simulasi santai dengan pembahasan ditampilkan setelah selesai. Timer fleksibel.'
    },
    ujian: {
      title: 'Mode Ujian (CAT)',
      icon: Trophy,
      color: 'text-success border-success/25 bg-success/5',
      desc: 'Simulasi BKN standar. Waktu 130 menit, otomatis submit, dan masuk ke Leaderboard lokal.'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 relative overflow-hidden select-none">
      
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium mb-3">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Kualitas Produksi Setara Startup Unicorn</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            CAT BKN Sekolah Rakyat
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Portal Simulasi Khusus Seleksi Wali Asrama (Dormitory Warden)
          </p>
        </div>

        <Card className="glass-panel border-white/5 shadow-2xl rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Login Peserta Ujian</CardTitle>
                <CardDescription className="text-slate-400">
                  Lengkapi kredensial untuk merekam nilai ke lembar ujian resmi BKN.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-300">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Contoh: Danis Arisandi"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-white/10 bg-slate-950/40 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="participantId" className="text-xs font-semibold text-slate-300">
                    Nomor Peserta Ujian
                  </label>
                  <input
                    id="participantId"
                    type="text"
                    placeholder="Contoh: BKN-2026-0912"
                    value={participantId}
                    onChange={(e) => {
                      setParticipantId(e.target.value);
                      if (errors.participantId) setErrors({ ...errors, participantId: '' });
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-white/10 bg-slate-950/40 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  {errors.participantId && <p className="text-xs text-red-500 mt-1">{errors.participantId}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="instansi" className="text-xs font-semibold text-slate-300">
                    Instansi Asal
                  </label>
                  <input
                    id="instansi"
                    type="text"
                    placeholder="Contoh: Asrama Sekolah Rakyat Bandung"
                    value={instansi}
                    onChange={(e) => {
                      setInstansi(e.target.value);
                      if (errors.instansi) setErrors({ ...errors, instansi: '' });
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-white/10 bg-slate-950/40 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  {errors.instansi && <p className="text-xs text-red-500 mt-1">{errors.instansi}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="examDate" className="text-xs font-semibold text-slate-300">
                    Pilih Tanggal Soal CAT
                  </label>
                  <select
                    id="examDate"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-white/10 bg-slate-950/40 text-sm text-white focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
                  >
                    {availableDates.map(date => (
                      <option key={date} value={date} className="bg-slate-950 text-white">
                        Ujian Set: {date}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mode Selection Cards */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">
                  Pilih Mode Latihan / Ujian
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(['belajar', 'latihan', 'ujian'] as ExamMode[]).map((m) => {
                    const info = modeDescriptions[m];
                    const Icon = info.icon;
                    const isSelected = mode === m;
                    return (
                      <div
                        key={m}
                        onClick={() => setMode(m)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-white shadow-md'
                            : 'border-white/5 hover:border-white/10 bg-slate-950/30 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1.5 rounded-lg border ${info.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold">{info.title}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400">
                          {info.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-11 bg-primary text-white hover:bg-primary/95 text-sm font-semibold rounded-lg shadow-lg shadow-primary/20">
                  Mulai Simulasi Sekarang
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-white/5 py-4 bg-slate-950/20">
            <p className="text-[11px] text-slate-500">
              Sistem akan memuat 145 soal resmi (90 Teknis, 25 Manajerial, 20 Sosial, 10 Wawancara).
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
