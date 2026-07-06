'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore, useExamStore } from '../../store';
import { db } from '../../lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Shield, Sparkles, BookOpen, GraduationCap, Trophy, Mail, Lock, User, Hash, School, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ExamMode } from '../../types';

export function LoginView() {
  const { signUp, signIn, checkSession, isLoading, isCloudEnabled, isLoggedIn } = useAuthStore();
  const startExam = useExamStore((state) => state.startExam);

  // Auth tabs: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [instansi, setInstansi] = useState('');
  const [mode, setMode] = useState<ExamMode>('ujian');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-07-06');

  // Fetch available dates
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};

    // Validate email & password
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Harap masukkan email yang valid';
    if (!password || password.length < 6) newErrors.password = 'Kata sandi minimal 6 karakter';

    if (activeTab === 'register') {
      if (!name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
      if (!participantId.trim()) newErrors.participantId = 'Nomor peserta wajib diisi';
      if (!instansi.trim()) newErrors.instansi = 'Instansi asal wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Harap lengkapi formulir secara benar');
      return;
    }

    try {
      if (activeTab === 'register') {
        // 1. Cloud / Local signup
        await signUp(email, password, name, participantId, instansi);
        // Switch to login tab automatically
        setActiveTab('login');
        toast.success('Pendaftaran sukses! Silakan masuk menggunakan akun baru Anda.');
      } else {
        // 2. Cloud / Local signin
        await signIn(email, password);
        
        // Load target exam questions
        toast.success('Masuk berhasil! Menyiapkan sesi simulasi CAT BKN...');
        await startExam(mode, 130, selectedDate);
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan pada sistem autentikasi');
    }
  };

  const modeDescriptions = {
    belajar: {
      title: 'Mode Belajar',
      icon: BookOpen,
      color: 'text-red-500 border-red-500/25 bg-red-500/5',
      desc: 'Kunci jawaban dan pembahasan detail 300+ kata langsung terbuka saat menjawab. Bebas tanpa timer.'
    },
    latihan: {
      title: 'Mode Latihan',
      icon: GraduationCap,
      color: 'text-amber-500 border-amber-500/25 bg-amber-500/5',
      desc: 'Simulasi mandiri di mana ulasan dan hasil ditampilkan di akhir. Durasi timer fleksibel.'
    },
    ujian: {
      title: 'Mode Ujian (CAT)',
      icon: Trophy,
      color: 'text-red-600 border-red-600/25 bg-red-600/5',
      desc: 'Simulasi CAT BKN standar. Waktu 130 menit penuh, auto-submit, dan terekam di Leaderboard.'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-slate-100 p-4 relative overflow-hidden select-none">
      
      {/* Background glowing effects - Crimson red and silver branding */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Sekolah Rakyat Header & Status Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/5 bg-zinc-950 text-xs font-semibold mb-4">
            <span className={`h-2 w-2 rounded-full ${isCloudEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-slate-400">
              {isCloudEnabled ? 'Cloud Terhubung (Supabase)' : 'Mode Demo Lokal (IndexedDB)'}
            </span>
          </div>

          <div className="flex justify-center items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/20 border border-red-500/30">
              <Shield className="h-7 w-7" />
            </div>
            <div className="text-left">
              <span className="text-[10px] tracking-widest font-black uppercase text-red-500 block">SEKOLAH RAKYAT</span>
              <h1 className="text-2xl font-black text-white leading-none tracking-tight">
                SIMULATOR CAT BKN
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
            Sistem simulasi seleksi kompetensi dasar dan wawancara asrama dengan standar kelulusan passing grade 65%.
          </p>
        </div>

        {/* Auth / Exam configuration card */}
        <Card className="glass-panel border-white/10 bg-zinc-950/70 shadow-2xl rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-white to-red-600" />
          
          {/* Segment control tabs */}
          <div className="grid grid-cols-2 border-b border-white/5 bg-zinc-950/40">
            <button
              onClick={() => { setActiveTab('login'); setErrors({}); }}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                activeTab === 'login' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>Masuk Ujian</span>
              {activeTab === 'login' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrors({}); }}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                activeTab === 'register' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>Daftar Akun</span>
              {activeTab === 'register' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}
            </button>
          </div>

          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === 'login' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === 'login' ? 10 : -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Email & Password (Common for both) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        <span>Alamat Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-white/5 bg-black text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                        required
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-slate-500" />
                        <span>Kata Sandi</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 karakter"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-10 pl-3 pr-10 rounded-lg border border-white/5 bg-black text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>
                  </div>

                  {/* Additional registration fields */}
                  {activeTab === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-2 border-t border-white/5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-500" />
                            <span>Nama Lengkap</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Danis Arisandi"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-white/5 bg-black text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                          />
                          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Hash className="h-3.5 w-3.5 text-slate-500" />
                            <span>Nomor Peserta Ujian</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: BKN-2026-0912"
                            value={participantId}
                            onChange={(e) => setParticipantId(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-white/5 bg-black text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                          />
                          {errors.participantId && <p className="text-xs text-red-500 mt-1">{errors.participantId}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <School className="h-3.5 w-3.5 text-slate-500" />
                          <span>Instansi Asal</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Asrama Sekolah Rakyat Bandung"
                          value={instansi}
                          onChange={(e) => setInstansi(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-white/5 bg-black text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                        />
                        {errors.instansi && <p className="text-xs text-red-500 mt-1">{errors.instansi}</p>}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Date selection & Mode selections (Only relevant for immediate Ujian initiation on tab 'login') */}
              {activeTab === 'login' && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Pilih Tanggal Bank Soal CAT
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-white/5 bg-black text-xs text-white focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all cursor-pointer"
                    >
                      {availableDates.map(date => (
                        <option key={date} value={date} className="bg-zinc-950 text-white text-xs">
                          Ujian Set: {date}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mode selection Cards */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Pilih Mode Simulasi Ujian
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
                            className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                              isSelected
                                ? 'border-red-600 bg-red-650/10 text-white shadow-md shadow-red-600/5'
                                : 'border-white/5 hover:border-white/10 bg-black/40 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className={`p-1 rounded-md border ${info.color}`}>
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-[11px] font-bold">{info.title}</span>
                            </div>
                            <p className="text-[10px] leading-normal text-slate-500">
                              {info.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit buttons */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-red-600 text-white hover:bg-red-700 text-xs font-extrabold uppercase tracking-widest rounded-lg shadow-lg shadow-red-600/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : activeTab === 'register' ? (
                    <span>Buat Akun Sekarang</span>
                  ) : (
                    <span>Masuk & Mulai Simulasi</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/5 py-4 bg-zinc-950/20">
            <p className="text-[10px] text-slate-500 text-center font-medium">
              {activeTab === 'register' 
                ? 'Data akun akan diamankan menggunakan enkripsi database cloud.' 
                : 'Sesi ujian memuat 145 soal resmi (90 Teknis, 25 Manajerial, 20 Sosial, 10 Wawancara).'}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
