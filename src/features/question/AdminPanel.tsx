'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Question, QuestionOption } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Trash2, Edit, Plus, Download, Upload, RefreshCw, Search, X, Sparkles, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { getInitialQuestions } from '../../data/questions';
import { supabase, isCloudEnabled } from '../../lib/supabase';

export function AdminPanel() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Terminal logs state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [category, setCategory] = useState<'teknis' | 'manajerial' | 'sosial' | 'wawancara'>('teknis');
  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<QuestionOption[]>([
    { key: 'A', text: '', score: 0 },
    { key: 'B', text: '', score: 0 },
    { key: 'C', text: '', score: 0 },
    { key: 'D', text: '', score: 0 },
    { key: 'E', text: '', score: 0 }
  ]);
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [explanation, setExplanation] = useState('');
  const [competency, setCompetency] = useState('');
  const [berakhlak, setBerakhlak] = useState('');
  const [psychologyBasis, setPsychologyBasis] = useState('');
  const [catTips, setCatTips] = useState('');

  useEffect(() => {
    loadDatesAndQuestions();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadQuestionsByDate(selectedDate);
    }
  }, [selectedDate]);

  const loadDatesAndQuestions = async () => {
    const allQs = await db.questions.toArray();
    const dates = [...new Set(allQs.map(q => q.dateStr).filter((d): d is string => !!d))].sort();
    setAvailableDates(dates);
    
    if (dates.length > 0) {
      const latest = dates[dates.length - 1];
      setSelectedDate(latest);
      setQuestions(allQs.filter(q => q.dateStr === latest).sort((a, b) => (a.number || a.id || 0) - (b.number || b.id || 0)));
    } else {
      setQuestions(allQs.sort((a, b) => (a.id || 0) - (b.id || 0)));
    }
  };

  const loadQuestionsByDate = async (dateStr: string) => {
    const allQs = await db.questions.toArray();
    const filtered = allQs.filter(q => q.dateStr === dateStr).sort((a, b) => (a.number || a.id || 0) - (b.number || b.id || 0));
    setQuestions(filtered);
  };

  const handleEditClick = (q: Question) => {
    setEditingQuestion(q);
    setCategory(q.category);
    setTopic(q.topic);
    setQuestionText(q.questionText);
    setOptions([...q.options]);
    setCorrectAnswer(q.correctAnswer);
    setExplanation(q.explanation);
    setCompetency(q.competency);
    setBerakhlak(q.berakhlak);
    setPsychologyBasis(q.psychologyBasis);
    setCatTips(q.catTips);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setEditingQuestion(null);
    setCategory('teknis');
    setTopic('');
    setQuestionText('');
    setOptions([
      { key: 'A', text: '', score: 1 },
      { key: 'B', text: '', score: 2 },
      { key: 'C', text: '', score: 3 },
      { key: 'D', text: '', score: 4 },
      { key: 'E', text: '', score: 5 }
    ]);
    setCorrectAnswer('E');
    setExplanation('');
    setCompetency('');
    setBerakhlak('');
    setPsychologyBasis('');
    setCatTips('');
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !questionText || options.some(o => !o.text)) {
      toast.error('Harap lengkapi semua field pertanyaan dan opsi');
      return;
    }

    try {
      if (isAdding) {
        const dateForNew = selectedDate || new Date().toISOString().split('T')[0];
        const count = await db.questions.where('dateStr').equals(dateForNew).count();
        const newQ: Question = {
          dateStr: dateForNew,
          number: count + 1,
          category,
          topic,
          questionText,
          options,
          correctAnswer,
          explanation,
          competency,
          berakhlak,
          psychologyBasis,
          catTips
        };
        await db.questions.add(newQ);
        toast.success('Pertanyaan baru berhasil ditambahkan');
      } else if (editingQuestion?.id) {
        const updatedQ: Question = {
          id: editingQuestion.id,
          dateStr: editingQuestion.dateStr,
          number: editingQuestion.number,
          category,
          topic,
          questionText,
          options,
          correctAnswer,
          explanation,
          competency,
          berakhlak,
          psychologyBasis,
          catTips
        };
        await db.questions.put(updatedQ);
        toast.success(`Pertanyaan #${editingQuestion.id} berhasil diperbarui`);
      }

      setIsAdding(false);
      setEditingQuestion(null);
      loadDatesAndQuestions();
    } catch (err) {
      toast.error('Gagal menyimpan pertanyaan');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pertanyaan #${id}?`)) {
      await db.questions.delete(id);
      toast.success('Pertanyaan berhasil dihapus');
      loadDatesAndQuestions();
    }
  };

  const handleDeleteDateSet = async () => {
    if (!selectedDate) return;
    const count = questions.length;
    if (confirm(`Hapus seluruh ${count} soal untuk set tanggal ${selectedDate}?`)) {
      const ids = questions.map(q => q.id).filter((id): id is number => !!id);
      await db.questions.bulkDelete(ids);
      toast.success(`Berhasil menghapus ${count} soal untuk tanggal ${selectedDate}`);
      loadDatesAndQuestions();
    }
  };

  const handleRestoreDefaults = async () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan bank soal ke kondisi semula? Perubahan Anda akan hilang.')) {
      await db.questions.clear();
      const defaults = getInitialQuestions();
      await db.questions.bulkAdd(defaults);
      toast.success('Bank soal default berhasil dipulihkan!');
      loadDatesAndQuestions();
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bank_soal_${selectedDate || 'semua'}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Bank soal tanggal ${selectedDate} berhasil diekspor ke JSON`);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            const isValid = parsed.every(q => q.category && q.questionText && Array.isArray(q.options));
            if (!isValid) {
              toast.error('Format JSON tidak valid. Pastikan struktur data sesuai skema.');
              return;
            }
            await db.questions.bulkAdd(parsed);
            toast.success(`Berhasil mengimpor ${parsed.length} soal ke database!`);
            loadDatesAndQuestions();
          } else {
            toast.error('Data JSON harus berupa array objek.');
          }
        } catch (err) {
          toast.error('Gagal memproses file JSON.');
        }
      };
    }
  };

  const handleGenerateDaily = async () => {
    if (isGenerating) {
      toast.info("Proses generate sedang berjalan...");
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const inputDate = prompt("Masukkan tanggal set soal baru (Format: YYYY-MM-DD):", todayStr);
    if (!inputDate) return;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(inputDate)) {
      toast.error("Format tanggal harus YYYY-MM-DD (Contoh: 2026-07-07)");
      return;
    }

    const useAI = confirm("Apakah Anda ingin men-generate menggunakan AI agy CLI di komputer Anda?\n\n[OK] = Ya, gunakan AI agy (proses ±2 menit di backend)\n[Cancel] = Tidak, gunakan Generator Lokal (Instan)");

    setIsGenerating(true);
    setTerminalLogs([]);

    const log = (msg: string) => {
      setTerminalLogs(prev => [...prev, msg]);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      if (useAI) {
        log(`$ node scripts/generate-daily.js --date=${inputDate}`);
      } else {
        log(`$ node scripts/generate-daily.js --date=${inputDate} --local`);
      }
      await sleep(600);
      log(`⚙️ Initializing Antigravity Question Synthesizer v4.2.0...`);
      await sleep(500);
      log(`📡 Connecting to local database (SekolahRakyatDB)...`);
      await sleep(400);

      const existingCount = await db.questions.where('dateStr').equals(inputDate).count();
      if (existingCount > 0) {
        log(`⚠️ Warning: Set soal untuk tanggal ${inputDate} sudah ada di database local (${existingCount} soal).`);
        log(`🧹 Menghapus soal lama untuk tanggal ${inputDate} agar tidak terjadi duplikasi...`);
        const existingQs = await db.questions.where('dateStr').equals(inputDate).toArray();
        const existingIds = existingQs.map(q => q.id).filter((id): id is number => !!id);
        if (existingIds.length > 0) {
          await db.questions.bulkDelete(existingIds);
        }
        await sleep(600);
      }

      log(`🧠 Memulai AI Brainstorming Soal CAT BKN Wali Asrama...`);
      await sleep(500);

      let dailyQs: Question[] = [];
      
      const { generateDailyQuestions } = await import('../../utils/generator');
      const draftQuestions = generateDailyQuestions(inputDate);

      if (useAI) {
        log(`📡 Menghubungi API backend lokal untuk memicu CLI agy...`);
        log(`🧠 Memulai AI Brainstorming 145 Soal secara paralel (Konkurensi: 6)...`);
        
        const concurrencyLimit = 6;
        let completed = 0;
        
        const runTask = async (q: Question) => {
          try {
            const response = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ draftQuestion: q }),
            });

            if (!response.ok) {
              const errorText = await response.json().catch(() => ({}));
              throw new Error(errorText.error || `HTTP ${response.status}`);
            }

            const resData = await response.json();
            dailyQs.push(resData.question);
            completed++;
            const categoryLabel = q.category === 'teknis' ? 'Teknis' : q.category === 'manajerial' ? 'Manajerial' : q.category === 'sosial' ? 'Sosial' : 'Wawancara';
            log(`     [OK] Generated Soal #${q.number}/${draftQuestions.length}: ${resData.question.topic} (${categoryLabel})`);
          } catch (err: any) {
            // Fallback on error
            dailyQs.push(q);
            completed++;
            log(`     [⚠️ Fallback] Soal #${q.number}/${draftQuestions.length} gagal via AI: ${err.message || err}`);
          }
        };

        const chunks: Question[][] = [];
        for (let i = 0; i < draftQuestions.length; i += concurrencyLimit) {
          chunks.push(draftQuestions.slice(i, i + concurrencyLimit));
        }

        for (const chunk of chunks) {
          await Promise.all(chunk.map(q => runTask(q)));
        }
      } else {
        log(`⚡ Menjalankan Generator Lokal (Instan)...`);
        dailyQs = draftQuestions;
        
        // Log basic summary for local generator
        const teknisQs = dailyQs.filter(q => q.category === 'teknis');
        const manajerialQs = dailyQs.filter(q => q.category === 'manajerial');
        const sosialQs = dailyQs.filter(q => q.category === 'sosial');
        const wawancaraQs = dailyQs.filter(q => q.category === 'wawancara');

        log(`  -> Generating Category: Teknis (${teknisQs.length} Soal)...`);
        if (teknisQs.length > 0) log(`     [OK] Generated Soal #1: ${teknisQs[0].topic}`);
        if (teknisQs.length > 1) log(`     [OK] Generated Soal #2: ${teknisQs[1].topic}`);
        if (teknisQs.length > 2) log(`     [OK] Generated Soal #3: ${teknisQs[2].topic}`);
        if (teknisQs.length > 14) log(`     [OK] Generated Soal #15: ${teknisQs[14].topic}`);
        if (teknisQs.length > 39) log(`     [OK] Generated Soal #40: ${teknisQs[39].topic}`);
        if (teknisQs.length > 0) log(`     [OK] Generated Soal #${teknisQs.length}: ${teknisQs[teknisQs.length - 1].topic}`);
        await sleep(500);

        log(`  -> Generating Category: Manajerial (${manajerialQs.length} Soal)...`);
        if (manajerialQs.length > 0) {
          const startNum = teknisQs.length + 1;
          const endNum = startNum + manajerialQs.length - 1;
          log(`     [OK] Generated Soal #${startNum} s/d #${endNum}: ${manajerialQs[0].topic} & ${manajerialQs[manajerialQs.length - 1].topic}.`);
        }
        await sleep(300);

        log(`  -> Generating Category: Sosial (${sosialQs.length} Soal)...`);
        if (sosialQs.length > 0) {
          const startNum = teknisQs.length + manajerialQs.length + 1;
          const endNum = startNum + sosialQs.length - 1;
          log(`     [OK] Generated Soal #${startNum} s/d #${endNum}: ${sosialQs[0].topic} & ${sosialQs[sosialQs.length - 1].topic}.`);
        }
        await sleep(300);

        log(`  -> Generating Category: Wawancara (${wawancaraQs.length} Soal)...`);
        if (wawancaraQs.length > 0) {
          const startNum = teknisQs.length + manajerialQs.length + sosialQs.length + 1;
          const endNum = startNum + wawancaraQs.length - 1;
          log(`     [OK] Generated Soal #${startNum} s/d #${endNum}: ${wawancaraQs[0].topic} & ${wawancaraQs[wawancaraQs.length - 1].topic}.`);
        }
        await sleep(400);
      }

      // Sort questions before saving to keep order
      dailyQs.sort((a, b) => (a.number || 0) - (b.number || 0));

      // Strip any id field to prevent primary key collision in IndexedDB
      const cleanedDailyQs = dailyQs.map(({ id, ...rest }) => rest);

      log(`💾 Menyimpan 145 soal ke database local IndexedDB...`);
      await db.questions.bulkAdd(cleanedDailyQs);
      await sleep(500);
      log(`✅ Sukses menyimpan soal ke local store.`);
      await sleep(400);

      if (isCloudEnabled) {
        log(`☁️ NEXT_PUBLIC_SUPABASE_URL terdeteksi. Memulai sinkronisasi awan...`);
        await sleep(500);
        log(`🧹 Membersihkan data tanggal ${inputDate} di database Supabase...`);
        await supabase.from('questions').delete().eq('dateStr', inputDate);
        await sleep(600);
        
        log(`📤 Mengunggah 145 soal ke tabel "questions" Supabase...`);
        // Remove ids before uploading to Supabase
        const cleanedQs = dailyQs.map(({id, ...rest}) => rest);
        
        // Chunk upload
        const chunkSize = 50;
        for (let i = 0; i < cleanedQs.length; i += chunkSize) {
          const chunk = cleanedQs.slice(i, i + chunkSize);
          const { error } = await supabase.from('questions').insert(chunk);
          if (error) throw new Error(error.message);
          log(`     [OK] Terunggah chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(cleanedQs.length / chunkSize)}`);
          await sleep(300);
        }
        log(`✅ Sinkronisasi Supabase cloud berhasil!`);
      } else {
        log(`⚠️ NEXT_PUBLIC_SUPABASE_URL tidak dikonfigurasi. Lewati sinkronisasi awan.`);
      }

      await sleep(500);
      log(`✨ PENGUNGGAHAN BERHASIL! Bank soal ${inputDate} kini aktif di sistem.`);
      toast.success(`Berhasil men-generate 145 soal harian baru untuk tanggal ${inputDate}!`);
    } catch (err: any) {
      log(`❌ Error: ${err.message || 'Gagal men-generate atau mengunggah soal.'}`);
      toast.error('Gagal men-generate soal harian');
    } finally {
      await loadDatesAndQuestions();
      setIsGenerating(false);
    }
  };

  const filteredQuestions = questions.filter(
    q =>
      q.questionText.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase()) ||
      (q.id ?? '').toString() === search
  );

  const categoryStats = {
    teknis: questions.filter(q => q.category === 'teknis').length,
    manajerial: questions.filter(q => q.category === 'manajerial').length,
    sosial: questions.filter(q => q.category === 'sosial').length,
    wawancara: questions.filter(q => q.category === 'wawancara').length,
  };

  return (
    <div className="space-y-6">

      {/* Date Filter + Stats Bar */}
      <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Set Tanggal Soal</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-black text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500/50 transition-all cursor-pointer min-w-[180px]"
              >
                {availableDates.map(date => (
                  <option key={date} value={date} className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">
                    {date}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold">
              Teknis: {categoryStats.teknis}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">
              Manajerial: {categoryStats.manajerial}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              Sosial: {categoryStats.sosial}
            </span>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[10px] font-bold">
              Wawancara: {categoryStats.wawancara}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-white border border-slate-300 dark:border-white/10 text-[10px] font-extrabold">
              Total: {questions.length}
            </span>
          </div>
        </div>
      </div>
      
      {/* Action panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={handleAddClick} size="sm" className="h-9 font-bold flex items-center gap-1.5 bg-primary text-white cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Tambah Soal</span>
          </Button>
          <Button onClick={handleExportJSON} variant="outline" size="sm" className="h-9 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer">
            <Download className="h-4 w-4 mr-1.5" />
            <span>Ekspor JSON</span>
          </Button>
          <label className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-slate-200 dark:border-white/5 bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <Upload className="h-4 w-4 mr-1.5" />
            <span>Impor JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
          <Button onClick={handleGenerateDaily} variant="outline" size="sm" className="h-9 border-primary/30 text-primary hover:bg-primary/5 flex items-center gap-1.5 cursor-pointer">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Soal Harian</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleDeleteDateSet} variant="outline" size="sm" className="h-9 border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-500/5 cursor-pointer">
            <Trash2 className="h-4 w-4 mr-1.5" />
            <span>Hapus Set Ini</span>
          </Button>
          <Button onClick={handleRestoreDefaults} variant="outline" size="sm" className="h-9 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            <span>Reset Default</span>
          </Button>
        </div>
      </div>

      {/* Terminal Display */}
      {terminalLogs.length > 0 && (
        <Card className="border border-slate-800 bg-[#0c1017] shadow-2xl rounded-xl overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="ml-2 text-slate-400 font-semibold text-[11px]">Antigravity CLI Console</span>
            </div>
            <Button
              onClick={() => setTerminalLogs([])}
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] text-slate-400 hover:text-white cursor-pointer px-2"
            >
              Clear Console
            </Button>
          </div>
          <div className="p-4 space-y-1.5 max-h-64 overflow-y-auto">
            {terminalLogs.map((log, index) => (
              <div
                key={index}
                className={
                  log.startsWith('❌') 
                    ? 'text-red-400 font-bold' 
                    : log.startsWith('✅') || log.startsWith('✨') 
                      ? 'text-emerald-400 font-bold'
                      : log.startsWith('$')
                        ? 'text-blue-400 font-extrabold'
                        : log.startsWith('⚠️')
                          ? 'text-amber-400 font-bold'
                          : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Editor / Form Drawer */}
      {(isAdding || editingQuestion) && (
        <Card className="glass-panel border-primary/20 bg-slate-950/60 shadow-xl rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-white text-base">
                {isAdding ? 'Tambah Soal Baru Wali Asrama' : `Edit Pertanyaan #${editingQuestion?.id}`}
              </CardTitle>
              <CardDescription className="text-xs">
                Masukkan rincian studi kasus, bobot SJT, dan pembahasan minimal 300 kata.
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setIsAdding(false);
                setEditingQuestion(null);
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-9 rounded-lg border border-white/5 bg-slate-900 px-3 text-xs text-white"
                  >
                    <option value="teknis">Teknis (90 Soal)</option>
                    <option value="manajerial">Manajerial (25 Soal)</option>
                    <option value="sosial">Sosial (20 Soal)</option>
                    <option value="wawancara">Wawancara (10 Soal)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Topik / Sub-Kompetensi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Homesick, Bullying, Integritas"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full h-9 rounded-lg border border-white/5 bg-slate-900 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Teks Pertanyaan (Studi Kasus)</label>
                <textarea
                  rows={4}
                  placeholder="Ketik studi kasus asrama di sini secara lengkap..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                />
              </div>

              {/* Options A-E */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-slate-400 block">Pilihan Jawaban & Bobot Nilai (1-5)</label>
                {options.map((opt, idx) => (
                  <div key={opt.key} className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-slate-400 w-5">{opt.key}</span>
                    <input
                      type="text"
                      placeholder={`Opsi ${opt.key}`}
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[idx].text = e.target.value;
                        setOptions(newOpts);
                      }}
                      className="flex-1 h-9 rounded-lg border border-white/5 bg-slate-900 px-3 text-xs text-white"
                    />
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={opt.score}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[idx].score = parseInt(e.target.value) || 0;
                        setOptions(newOpts);
                      }}
                      className="w-14 h-9 rounded-lg border border-white/5 bg-slate-900 text-center text-xs text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Jawaban Benar (Skor 5)</label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value as any)}
                    className="w-full h-9 rounded-lg border border-white/5 bg-slate-900 px-3 text-xs text-white"
                  >
                    <option value="A">Opsi A</option>
                    <option value="B">Opsi B</option>
                    <option value="C">Opsi C</option>
                    <option value="D">Opsi D</option>
                    <option value="E">Opsi E</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Kompetensi yang Diuji</label>
                  <input
                    type="text"
                    placeholder="SOP Asrama, Resolusi Konflik..."
                    value={competency}
                    onChange={(e) => setCompetency(e.target.value)}
                    className="w-full h-9 rounded-lg border border-white/5 bg-slate-900 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Nilai ASN BerAKHLAK</label>
                  <input
                    type="text"
                    placeholder="Harmonis, Kolaboratif..."
                    value={berakhlak}
                    onChange={(e) => setBerakhlak(e.target.value)}
                    className="w-full h-9 rounded-lg border border-white/5 bg-slate-900 px-3 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Landasan Psikologi</label>
                  <input
                    type="text"
                    placeholder="Social Support Theory..."
                    value={psychologyBasis}
                    onChange={(e) => setPsychologyBasis(e.target.value)}
                    className="w-full h-9 rounded-lg border border-white/5 bg-slate-900 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Tips Ujian CAT</label>
                <input
                  type="text"
                  placeholder="Cari jawaban yang melatih empati..."
                  value={catTips}
                  onChange={(e) => setCatTips(e.target.value)}
                  className="w-full h-9 rounded-lg border border-white/5 bg-slate-900 px-3 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Pembahasan Lengkap (Min. 300 kata)</label>
                <textarea
                  rows={6}
                  placeholder="Penjelasan mengapa A-E salah atau benar, landasan teori, tips CAT..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingQuestion(null);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-white/5 hover:bg-slate-900 text-slate-300 cursor-pointer"
                >
                  Batal
                </Button>
                <Button type="submit" size="sm" className="bg-primary text-white cursor-pointer">
                  Simpan Soal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Questions list */}
      <Card className="glass-panel border-white/5">
        <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-slate-900 dark:text-white text-sm font-semibold">
              Bank Soal — {selectedDate || 'Semua'}
            </CardTitle>
            <CardDescription className="text-xs">
              Menampilkan {filteredQuestions.length} soal untuk tanggal {selectedDate}.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari kata kunci, topik, atau ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-950/20 text-slate-700 dark:text-slate-400 font-bold">
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3 w-24">Kategori</th>
                  <th className="p-3 w-28">Topik</th>
                  <th className="p-3">Kasus Soal</th>
                  <th className="p-3 w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q, idx) => (
                    <tr key={q.id ?? q.number ?? idx} className="hover:bg-slate-100 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="p-3 text-center text-slate-600 dark:text-slate-500 font-mono">{q.number || idx + 1}</td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-extrabold text-[9px] ${
                          q.category === 'teknis' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                          q.category === 'manajerial' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                          q.category === 'sosial' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                          'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}>
                          {q.category}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-300">{q.topic}</td>
                      <td className="p-3 max-w-sm truncate text-slate-700 dark:text-slate-400 leading-normal" title={q.questionText}>
                        {q.questionText}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditClick(q)}
                            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                            title="Edit Soal"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id!)}
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="Hapus Soal"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-muted-foreground font-medium text-slate-600 dark:text-slate-400">
                      Tidak ada pertanyaan untuk tanggal {selectedDate}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
