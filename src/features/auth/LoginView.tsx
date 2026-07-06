'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Shield, Mail, Lock, User, MapPin, Eye, EyeOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function LoginView() {
  const { signUp, signIn, isLoading, isCloudEnabled } = useAuthStore();
  const { theme } = useTheme();

  // Auth tabs: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lokasi, setLokasi] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};

    // Validate email & password
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Harap masukkan email yang valid';
    if (!password || password.length < 6) newErrors.password = 'Kata sandi minimal 6 karakter';

    if (activeTab === 'register') {
      if (!name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
      if (!lokasi.trim()) newErrors.lokasi = 'Lokasi wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Harap lengkapi formulir secara benar');
      return;
    }

    try {
      if (activeTab === 'register') {
        // 1. Cloud / Local signup
        await signUp(email, password, name, lokasi);
        // Switch to login tab automatically
        setActiveTab('login');
        toast.success('Pendaftaran sukses! Silakan masuk menggunakan akun baru Anda.');
      } else {
        // 2. Cloud / Local signin (Redirects to Dashboard automatically through HomePage)
        await signIn(email, password);
        toast.success('Masuk berhasil! Selamat datang kembali.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan pada sistem autentikasi');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden select-none transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-slate-50 text-slate-900' 
        : 'bg-black text-slate-100'
    }`}>
      
      {/* Background glowing effects - Crimson red and silver branding */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Sekolah Rakyat Header & Status Badge */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-4 transition-colors ${
            theme === 'light'
              ? 'border-slate-200 bg-slate-100 text-slate-700'
              : 'border-white/5 bg-zinc-950 text-slate-400'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isCloudEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>
              {isCloudEnabled ? 'Cloud Terhubung (Supabase)' : 'Mode Demo Lokal (IndexedDB)'}
            </span>
          </div>

          <div className="flex justify-center items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/20 border border-red-500/30">
              <Shield className="h-7 w-7" />
            </div>
            <div className="text-left">
              <span className="text-[10px] tracking-widest font-black uppercase text-red-500 block">SEKOLAH RAKYAT</span>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                PORTAL BELAJAR CAT
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-2">
            Masuk atau daftarkan akun belajar Anda untuk mengakses simulasi seleksi kompetensi dasar dan analisis AI.
          </p>
        </div>

        {/* Auth card */}
        <Card className="glass-panel border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-white to-red-600" />
          
          {/* Segment control tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-zinc-950/40">
            <button
              onClick={() => { setActiveTab('login'); setErrors({}); }}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                activeTab === 'login' 
                  ? 'text-slate-900 dark:text-white font-black' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <span>Masuk Akun</span>
              {activeTab === 'login' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrors({}); }}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                activeTab === 'register' 
                  ? 'text-slate-900 dark:text-white font-black' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
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
                  {/* Email & Password */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        <span>Alamat Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-600 focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                        required
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-slate-500" />
                        <span>Kata Sandi</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 karakter"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-10 pl-3 pr-10 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-600 focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer"
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
                      className="space-y-4 pt-2 border-t border-slate-200 dark:border-white/5"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-500" />
                          <span>Nama Lengkap</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Danis Arisandi"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-600 focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          <span>Lokasi</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Bandung, Jawa Barat"
                          value={lokasi}
                          onChange={(e) => setLokasi(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-600 focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                        />
                        {errors.lokasi && <p className="text-xs text-red-500 mt-1">{errors.lokasi}</p>}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Submit button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-red-600 text-white hover:bg-red-700 text-xs font-extrabold uppercase tracking-widest rounded-lg shadow-lg shadow-red-600/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : activeTab === 'register' ? (
                    <span>Daftar Akun Baru</span>
                  ) : (
                    <span>Masuk ke Akun</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-200 dark:border-white/5 py-4 bg-slate-50 dark:bg-zinc-950/20">
            <p className="text-[10px] text-slate-600 dark:text-slate-500 text-center font-medium">
              {activeTab === 'register' 
                ? 'Data akun akan diamankan menggunakan enkripsi database cloud.' 
                : 'Silakan hubungi admin Sekolah Rakyat jika Anda melupakan kredensial akun Anda.'}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
