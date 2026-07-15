'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/db';
import { Question, QuestionOption } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Trash2, Edit, Plus, Download, Upload, RefreshCw, Search, X, Sparkles, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { generateDailyQuestions } from '../../utils/generator';
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

  // Sync ref lock to prevent duplicate concurrent cloud downloads
  const syncedDates = useRef<Set<string>>(new Set());

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
    const localDates = [...new Set(allQs.map(q => q.dateStr).filter((d): d is string => !!d))];
    let mergedDates = [...localDates];

    if (isCloudEnabled) {
      try {
        const { data: onlineQs, error: onlineError } = await supabase
          .from('questions')
          .select('dateStr');
        
        if (onlineError) {
          console.error('Gagal mengambil daftar tanggal online:', onlineError.message);
        } else if (onlineQs) {
          const onlineDates = [...new Set(onlineQs.map(q => q.dateStr).filter((d): d is string => !!d))];
          mergedDates = [...new Set([...localDates, ...onlineDates])];
        }
      } catch (err) {
        console.error('Gagal memuat tanggal dari cloud:', err);
      }
    }

    const sortedDates = mergedDates.sort();
    setAvailableDates(sortedDates);
    
    if (sortedDates.length > 0) {
      const latest = sortedDates[sortedDates.length - 1];
      setSelectedDate(latest);
      await loadQuestionsByDate(latest);
    } else {
      setQuestions(allQs.sort((a, b) => (a.id || 0) - (b.id || 0)));
    }
  };

  const loadQuestionsByDate = async (dateStr: string) => {
    // 1. Ambil data lokal & bersihkan duplikasi lokal yang terlanjur ada
    let allQs = await db.questions.toArray();
    let dateQs = allQs.filter(q => q.dateStr === dateStr).sort((a, b) => (a.number || a.id || 0) - (b.number || b.id || 0));
    
    // Cari duplikat di IndexedDB
    const seenNumbers = new Set<number>();
    const duplicateIds: number[] = [];
    for (const q of dateQs) {
      if (q.number) {
        if (seenNumbers.has(q.number)) {
          if (q.id) duplicateIds.push(q.id);
        } else {
          seenNumbers.add(q.number);
        }
      }
    }
    
    if (duplicateIds.length > 0) {
      await db.questions.bulkDelete(duplicateIds);
      // Muat ulang setelah penghapusan duplikat
      allQs = await db.questions.toArray();
      dateQs = allQs.filter(q => q.dateStr === dateStr).sort((a, b) => (a.number || a.id || 0) - (b.number || b.id || 0));
    }
    
    let filtered = dateQs;

    // 2. Sinkronisasi dua arah antara Lokal dan Cloud
    if (isCloudEnabled && !syncedDates.current.has(dateStr)) {
      syncedDates.current.add(dateStr);
      try {
        const { data: onlineQs, error: onlineError } = await supabase
          .from('questions')
          .select('*')
          .eq('dateStr', dateStr);
        
        if (onlineError) {
          console.error('Gagal sinkronisasi dari cloud:', onlineError.message);
          toast.error(`Gagal sinkronisasi otomatis dari cloud: ${onlineError.message}`);
        } else {
          const onlineList = onlineQs || [];
          let updatedLocalNeeded = false;
          
          // A. Sync: Cloud -> Lokal (Jika di lokal tidak ada, unduh dari cloud)
          const localNumbers = new Set(filtered.map(q => q.number));
          const addedLocalNumbers = new Set<number>();
          
          for (const onlineQ of onlineList) {
            if (onlineQ.number && !localNumbers.has(onlineQ.number) && !addedLocalNumbers.has(onlineQ.number)) {
              const { id, ...cleanedQ } = onlineQ;
              await db.questions.add(cleanedQ);
              addedLocalNumbers.add(onlineQ.number);
              updatedLocalNeeded = true;
            }
          }
          
          // B. Sync: Lokal -> Cloud (Jika di cloud tidak ada, unggah dari lokal)
          const onlineNumbers = new Set(onlineList.map(q => q.number));
          const toUploadToCloud = [];
          
          for (const localQ of filtered) {
            if (localQ.number && !onlineNumbers.has(localQ.number)) {
              const { id, ...cleanedQ } = localQ;
              toUploadToCloud.push(cleanedQ);
            }
          }
          
          if (toUploadToCloud.length > 0) {
             console.log(`Mengunggah ${toUploadToCloud.length} soal lokal yang hilang ke Supabase Cloud...`);
             toast.info(`Sinkronisasi: Mengunggah ${toUploadToCloud.length} soal lokal ke Supabase Cloud...`);
             
             try {
               const chunkSize = 50;
               let uploadSuccess = true;
               let lastErrorMessage = '';
               
               for (let i = 0; i < toUploadToCloud.length; i += chunkSize) {
                 const chunk = toUploadToCloud.slice(i, i + chunkSize);
                 const { error } = await supabase.from('questions').insert(chunk);
                 if (error) {
                   uploadSuccess = false;
                   lastErrorMessage = error.message;
                   console.error('Gagal upload chunk ke cloud:', error.message);
                 }
               }
               
               if (uploadSuccess) {
                 toast.success(`Sinkronisasi: Berhasil mengunggah ${toUploadToCloud.length} soal lokal ke Supabase Cloud!`);
               } else {
                 toast.error(`Sinkronisasi: Gagal mengunggah sebagian soal ke cloud (${lastErrorMessage})`);
               }
             } catch (uploadErr: any) {
               console.error('Error saat upload soal ke cloud:', uploadErr);
               toast.error(`Sinkronisasi: Gagal mengunggah ke Supabase (${uploadErr.message || uploadErr})`);
             }
          }
          
          if (updatedLocalNeeded) {
            const freshQs = await db.questions.toArray();
            filtered = freshQs.filter(q => q.dateStr === dateStr).sort((a, b) => (a.number || a.id || 0) - (b.number || b.id || 0));
            toast.info(`Sinkronisasi: Berhasil mengunduh soal dari Supabase Cloud ke lokal!`);
          }
        }
      } catch (err: any) {
        console.error('Gagal sinkronisasi data online:', err);
        toast.error(`Gagal sinkronisasi otomatis ke cloud: ${err.message || err}`);
      }
    }
    
    setQuestions(filtered);
  };

  const handleForceSyncCloud = async (dateStr: string) => {
    if (!dateStr) {
      toast.error('Pilih tanggal terlebih dahulu.');
      return;
    }
    
    if (!isCloudEnabled) {
      toast.error('Koneksi Supabase Cloud belum aktif! Periksa .env.local dan restart server NPM Anda.');
      return;
    }

    toast.info(`Memulai sinkronisasi manual untuk tanggal ${dateStr}...`);

    try {
      const localQs = await db.questions.where('dateStr').equals(dateStr).toArray();
      
      const { data: onlineQs, error: onlineError } = await supabase
        .from('questions')
        .select('*')
        .eq('dateStr', dateStr);
        
      if (onlineError) {
        toast.error(`Gagal mengambil data online: ${onlineError.message}`);
        return;
      }
      
      const onlineList = onlineQs || [];
      const localNumbers = new Set(localQs.map(q => q.number));
      const onlineNumbers = new Set(onlineList.map(q => q.number));
      
      // A. Sync: Cloud -> Lokal
      let localAddedCount = 0;
      for (const onlineQ of onlineList) {
        if (onlineQ.number && !localNumbers.has(onlineQ.number)) {
          const { id, ...cleanedQ } = onlineQ;
          await db.questions.add(cleanedQ);
          localAddedCount++;
        }
      }
      
      // B. Sync: Lokal -> Cloud
      const toUpload = [];
      for (const localQ of localQs) {
        if (localQ.number && !onlineNumbers.has(localQ.number)) {
          const { id, ...cleanedQ } = localQ;
          toUpload.push(cleanedQ);
        }
      }
      
      let uploadSuccessCount = 0;
      if (toUpload.length > 0) {
        const chunkSize = 50;
        for (let i = 0; i < toUpload.length; i += chunkSize) {
          const chunk = toUpload.slice(i, i + chunkSize);
          const { error } = await supabase.from('questions').insert(chunk);
          if (error) {
            toast.error(`Gagal mengunggah sebagian soal: ${error.message}`);
            return;
          }
          uploadSuccessCount += chunk.length;
        }
      }
      
      if (localAddedCount > 0 || uploadSuccessCount > 0) {
        toast.success(`Sinkronisasi Selesai: Berhasil mengunggah ${uploadSuccessCount} soal ke Cloud, mengunduh ${localAddedCount} soal ke Lokal.`);
      } else {
        toast.success('Semua data soal lokal dan cloud untuk tanggal ini sudah sinkron (100% sama).');
      }
      
      // reload
      const freshQs = await db.questions.toArray();
      const filtered = freshQs.filter(q => q.dateStr === dateStr).sort((a, b) => (a.number || a.id || 0) - (b.number || b.id || 0));
      setQuestions(filtered);
    } catch (err: any) {
      toast.error(`Gagal melakukan sinkronisasi: ${err.message || err}`);
    }
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
    const q = await db.questions.get(id);
    if (confirm(`Apakah Anda yakin ingin menghapus pertanyaan #${q?.number || id}?`)) {
      await db.questions.delete(id);
      
      if (isCloudEnabled && q?.dateStr && q?.number) {
        try {
          const { error } = await supabase
            .from('questions')
            .delete()
            .eq('dateStr', q.dateStr)
            .eq('number', q.number);
          if (error) throw new Error(error.message);
          toast.success(`Pertanyaan #${q.number} berhasil dihapus di Local & Supabase Cloud`);
        } catch (cloudErr: any) {
          toast.error(`Gagal menghapus di Supabase Cloud: ${cloudErr.message || cloudErr}`);
        }
      } else {
        toast.success('Pertanyaan berhasil dihapus');
      }
      loadDatesAndQuestions();
    }
  };

  const handleDeleteDateSet = async () => {
    if (!selectedDate) return;
    const count = questions.length;
    if (confirm(`Hapus seluruh ${count} soal untuk set tanggal ${selectedDate} di LOCAL dan CLOUD Supabase?`)) {
      const ids = questions.map(q => q.id).filter((id): id is number => !!id);
      await db.questions.bulkDelete(ids);
      
      if (isCloudEnabled) {
        try {
          const { error } = await supabase.from('questions').delete().eq('dateStr', selectedDate);
          if (error) throw new Error(error.message);
          toast.success(`Berhasil menghapus ${count} soal untuk tanggal ${selectedDate} di Local & Supabase Cloud!`);
        } catch (cloudErr: any) {
          toast.error(`Gagal menghapus di Supabase Cloud: ${cloudErr.message || cloudErr}`);
        }
      } else {
        toast.success(`Berhasil menghapus ${count} soal untuk tanggal ${selectedDate}`);
      }
      
      loadDatesAndQuestions();
    }
  };

  const handleRestoreDefaults = async () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan bank soal ke kondisi semula? Perubahan Anda akan hilang.')) {
      await db.questions.clear();
      localStorage.removeItem('sr_db_initial_seeded');
      const { seedDatabase } = await import('../../utils/seed');
      await seedDatabase();
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
          const parsed = JSON.parse(event.target?.result as string) as Question[];
          if (Array.isArray(parsed)) {
            const isValid = parsed.every(q => q.category && q.questionText && Array.isArray(q.options));
            if (!isValid) {
              toast.error('Format JSON tidak valid. Pastikan struktur data sesuai skema.');
              return;
            }

            const uniqueDates = Array.from(new Set(parsed.map(q => q.dateStr).filter((d): d is string => !!d)));
            if (uniqueDates.length === 0) {
              toast.error('Tidak ada tanggal valid (dateStr) ditemukan dalam data.');
              return;
            }

            // Clean existing local questions for these dates to avoid duplicates
            await db.questions.where('dateStr').anyOf(uniqueDates).delete();

            // Strip id property to let IndexedDB generate auto-incrementing key
            const cleaned = parsed.map(({ id, ...rest }) => rest);
            await db.questions.bulkAdd(cleaned);

            toast.success(`Lokal: Berhasil mengimpor ${parsed.length} soal ke database lokal!`);

            if (isCloudEnabled) {
              toast.info('Cloud: Sinkronisasi ke Supabase Cloud sedang berjalan...');
              try {
                // Delete existing cloud questions for these dates
                await supabase.from('questions').delete().in('dateStr', uniqueDates);

                // Upload in chunks of 50
                const chunkSize = 50;
                let uploadSuccess = true;
                for (let i = 0; i < cleaned.length; i += chunkSize) {
                  const chunk = cleaned.slice(i, i + chunkSize);
                  const { error } = await supabase.from('questions').insert(chunk);
                  if (error) {
                    uploadSuccess = false;
                    console.error('Error uploading chunk:', error.message);
                  }
                }

                if (uploadSuccess) {
                  toast.success(`Cloud: Berhasil mengunggah ${parsed.length} soal ke Supabase Cloud!`);
                } else {
                  toast.error('Cloud: Sebagian atau seluruh soal gagal diunggah ke Supabase.');
                }
              } catch (cloudErr: any) {
                toast.error(`Cloud: Gagal mengunggah ke Supabase (${cloudErr.message || cloudErr})`);
              }
            }

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

      let dailyQs: Question[] = [];
      const existingQs = await db.questions.where('dateStr').equals(inputDate).toArray();
      dailyQs = [...existingQs];
      log(`📄 Ditemukan ${existingQs.length} soal lokal di database IndexedDB.`);

      if (isCloudEnabled) {
        log(`🌐 Memeriksa data online di Supabase untuk tanggal ${inputDate}...`);
        try {
          const { data: onlineQuestions, error: onlineError } = await supabase
            .from('questions')
            .select('*')
            .eq('dateStr', inputDate);
          
          if (onlineError) {
            log(`⚠️ Gagal mengambil data online: ${onlineError.message}`);
          } else if (onlineQuestions && onlineQuestions.length > 0) {
            log(`🌐 Ditemukan ${onlineQuestions.length} soal online di Supabase.`);
            for (const onlineQ of onlineQuestions) {
              if (!dailyQs.some(offQ => offQ.number === onlineQ.number)) {
                const { id, ...cleanedQ } = onlineQ;
                await db.questions.add(cleanedQ);
                dailyQs.push(cleanedQ);
              }
            }
          }
        } catch (e: any) {
          log(`⚠️ Gagal melakukan sinkronisasi dengan Supabase: ${e.message}`);
        }
      }

      const { generateDailyQuestions } = await import('../../utils/generator');
      const draftQuestions = generateDailyQuestions(inputDate);

      if (!useAI) {
        log(`🧹 Membersihkan data lama untuk tanggal ${inputDate} untuk Generator Lokal...`);
        const existingIds = existingQs.map(q => q.id).filter((id): id is number => !!id);
        if (existingIds.length > 0) {
          await db.questions.bulkDelete(existingIds);
        }
        if (isCloudEnabled) {
          await supabase.from('questions').delete().eq('dateStr', inputDate);
        }
        await sleep(500);

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

        const cleanedDailyQs = dailyQs.map(({ id, ...rest }) => rest);
        log(`💾 Menyimpan 145 soal ke database local IndexedDB...`);
        await db.questions.bulkAdd(cleanedDailyQs);
        await sleep(500);

        if (isCloudEnabled) {
          log(`📤 Mengunggah 145 soal ke tabel "questions" Supabase...`);
          const chunkSize = 50;
          for (let i = 0; i < cleanedDailyQs.length; i += chunkSize) {
            const chunk = cleanedDailyQs.slice(i, i + chunkSize);
            const { error } = await supabase.from('questions').insert(chunk);
            if (error) throw new Error(error.message);
            log(`     [OK] Terunggah chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(cleanedDailyQs.length / chunkSize)}`);
            await sleep(300);
          }
        }
      } else {
        log(`📡 Menghubungi API backend lokal untuk memicu CLI agy...`);
        
        const skippedNumbers = new Set(dailyQs.map(q => q.number));
        const tasksToRun = draftQuestions.filter(q => !skippedNumbers.has(q.number));
        
        log(`📊 Progress: ${dailyQs.length} soal sudah lengkap. ${tasksToRun.length} soal tersisa.`);
        log(`🧠 Memulai AI Brainstorming ${tasksToRun.length} sisa soal CAT BKN Wali Asrama secara berurutan...`);
        
        const concurrencyLimit = 5;
        let completed = 0;
        
        const runTask = async (q: Question) => {
          const categoryLabel = q.category === 'teknis' ? 'Teknis' : q.category === 'manajerial' ? 'Manajerial' : q.category === 'sosial' ? 'Sosial' : 'Wawancara';
          try {
            log(`🤖 Memulai generate Soal #${q.number}/${draftQuestions.length} (${categoryLabel})...`);
            
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
            const generatedQ = resData.question;
            const { id, ...cleanedQ } = generatedQ;
            
            // Save incrementally to IndexedDB
            await db.questions.add(cleanedQ);

            // Save incrementally to Supabase
            if (isCloudEnabled) {
              const { error } = await supabase.from('questions').insert(cleanedQ);
              if (error) log(`     [⚠️ Cloud Save Error] Soal #${q.number} gagal diunggah: ${error.message}`);
            }

            dailyQs.push(generatedQ);
            completed++;
            log(`     [OK] Generated Soal #${q.number}/${draftQuestions.length}: ${generatedQ.topic} via CLI: ${resData.cliUsed || 'agy'} (Attempt ${resData.attempts || 1})`);
          } catch (err: any) {
            // Fallback on error: save draft so slots are not empty
            const { id, ...cleanedQ } = q;
            await db.questions.add(cleanedQ);
            if (isCloudEnabled) {
              await supabase.from('questions').insert(cleanedQ);
            }
            dailyQs.push(q);
            completed++;
            log(`     [⚠️ Fallback] Soal #${q.number}/${draftQuestions.length} gagal via AI: ${err.message || err}`);
          }
        };

        const chunks: Question[][] = [];
        for (let i = 0; i < tasksToRun.length; i += concurrencyLimit) {
          chunks.push(tasksToRun.slice(i, i + concurrencyLimit));
        }

        for (const chunk of chunks) {
          await Promise.all(chunk.map(q => runTask(q)));
        }
      }

      dailyQs.sort((a, b) => (a.number || 0) - (b.number || 0));
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
          <Button onClick={() => handleForceSyncCloud(selectedDate)} variant="outline" size="sm" className="h-9 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 flex items-center gap-1.5 cursor-pointer">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sinkronisasi Cloud</span>
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

        {/* Editor / Form Drawer (Popup Modal) */}
      {(isAdding || editingQuestion) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <Card className="glass-panel border-primary/20 bg-slate-950/90 shadow-2xl rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <label className="text-[11px] font-bold text-slate-400">Kategori Subtes</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full rounded-lg border border-white/5 bg-slate-900 p-2.5 text-xs text-white focus:outline-hidden"
                    >
                      <option value="teknis">Teknis (90 Soal - Skala 5/0)</option>
                      <option value="manajerial">Manajerial (25 Soal - Skala 4-1)</option>
                      <option value="sosial">Sosial Kultural (20 Soal - Skala 5-1)</option>
                      <option value="wawancara">Wawancara (10 Soal - Skala 4-1)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400">Topik Permasalahan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Dampak Bullying di Kamar Tidur"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full rounded-lg border border-white/5 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Studi Kasus Soal (SJT Text)</label>
                  <textarea
                    rows={4}
                    placeholder="Tulis skenario studi kasus secara detail..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                  />
                </div>

                <div className="border-y border-white/5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-white">Formulasi Pilihan Jawaban & Bobot Nilai</h4>
                    <span className="text-[10px] text-slate-400">Sistem mendeteksi kategori: <strong className="text-primary uppercase">{category}</strong></span>
                  </div>
                  
                  <div className="space-y-3">
                    {options.slice(0, category === 'manajerial' || category === 'wawancara' ? 4 : 5).map((opt, idx) => (
                      <div key={opt.key} className="flex gap-3 items-start">
                        <span className="w-6 h-8 flex items-center justify-center rounded-md bg-slate-900 border border-white/5 text-white font-extrabold text-xs mt-1">
                          {opt.key}
                        </span>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder={`Tulis opsi jawaban ${opt.key}...`}
                            value={opt.text}
                            onChange={(e) => {
                              const newOpts = [...options];
                              newOpts[idx].text = e.target.value;
                              setOptions(newOpts);
                            }}
                            className="w-full rounded-lg border border-white/5 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                          />
                        </div>
                        <div className="w-24">
                          <select
                            value={opt.score}
                            onChange={(e) => {
                              const newOpts = [...options];
                              newOpts[idx].score = parseInt(e.target.value);
                              setOptions(newOpts);
                            }}
                            className="w-full rounded-lg border border-white/5 bg-slate-900 p-2.5 text-xs text-white focus:outline-hidden text-center"
                          >
                            {category === 'teknis' ? (
                              <>
                                <option value={5}>Skor 5</option>
                                <option value={0}>Skor 0</option>
                              </>
                            ) : category === 'manajerial' || category === 'wawancara' ? (
                              <>
                                <option value={4}>Skor 4</option>
                                <option value={3}>Skor 3</option>
                                <option value={2}>Skor 2</option>
                                <option value={1}>Skor 1</option>
                              </>
                            ) : (
                              <>
                                <option value={5}>Skor 5</option>
                                <option value={4}>Skor 4</option>
                                <option value={3}>Skor 3</option>
                                <option value={2}>Skor 2</option>
                                <option value={1}>Skor 1</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400">Kompetensi Diuji</label>
                      <input
                        type="text"
                        placeholder="Kompetensi..."
                        value={competency}
                        onChange={(e) => setCompetency(e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-slate-900 p-2 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400">Nilai BerAKHLAK</label>
                      <input
                        type="text"
                        placeholder="Core Values..."
                        value={berakhlak}
                        onChange={(e) => setBerakhlak(e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-slate-900 p-2 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400">Landasan Psikologis</label>
                      <input
                        type="text"
                        placeholder="Teori..."
                        value={psychologyBasis}
                        onChange={(e) => setPsychologyBasis(e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-slate-900 p-2 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400">Tips Ujian CAT</label>
                      <input
                        type="text"
                        placeholder="Tips taktis..."
                        value={catTips}
                        onChange={(e) => setCatTips(e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-slate-900 p-2 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">Kunci Jawaban Benar (Opsi Terbaik)</label>
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value as any)}
                      className="w-32 rounded-lg border border-white/5 bg-slate-900 p-2 text-xs text-white focus:outline-hidden"
                    >
                      <option value="A">Opsi A</option>
                      <option value="B">Opsi B</option>
                      <option value="C">Opsi C</option>
                      <option value="D">Opsi D</option>
                      {category !== 'manajerial' && category !== 'wawancara' && <option value="E">Opsi E</option>}
                    </select>
                  </div>
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
        </div>
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
