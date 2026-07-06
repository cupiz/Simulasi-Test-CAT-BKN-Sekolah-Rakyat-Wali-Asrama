'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Question, QuestionOption } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Trash2, Edit, Plus, FileSpreadsheet, Download, Upload, RefreshCw, Search, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { getInitialQuestions } from '../../data/questions';

export function AdminPanel() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const list = await db.questions.toArray();
    setQuestions(list.sort((a, b) => (a.id || 0) - (b.id || 0)));
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
      { key: 'E', text: '', score: 5 } // Standard SJT graded
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
        const count = await db.questions.count();
        const newQ: Question = {
          dateStr: new Date().toISOString().split('T')[0],
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
      loadQuestions();
    } catch (err) {
      toast.error('Gagal menyimpan pertanyaan');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pertanyaan #${id}?`)) {
      await db.questions.delete(id);
      toast.success('Pertanyaan berhasil dihapus');
      loadQuestions();
    }
  };

  const handleRestoreDefaults = async () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan bank soal ke kondisi semula? Perubahan Anda akan hilang.')) {
      await db.questions.clear();
      const defaults = getInitialQuestions();
      await db.questions.bulkAdd(defaults);
      toast.success('Bank soal default berhasil dipulihkan!');
      loadQuestions();
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bank_soal_sekolah_rakyat_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Bank soal berhasil diekspor ke JSON');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            // Simple validation of fields
            const isValid = parsed.every(q => q.id && q.category && q.questionText && Array.isArray(q.options));
            if (!isValid) {
              toast.error('Format JSON tidak valid. Pastikan struktur data sesuai skema.');
              return;
            }
            await db.questions.clear();
            await db.questions.bulkAdd(parsed);
            toast.success(`Berhasil mengimpor ${parsed.length} soal ke database!`);
            loadQuestions();
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
    const todayStr = new Date().toISOString().split('T')[0];
    const inputDate = prompt("Masukkan tanggal set soal baru (Format: YYYY-MM-DD):", todayStr);
    if (!inputDate) return;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(inputDate)) {
      toast.error("Format tanggal harus YYYY-MM-DD (Contoh: 2026-07-07)");
      return;
    }

    const existingCount = await db.questions.where('dateStr').equals(inputDate).count();
    if (existingCount > 0) {
      toast.info(`Set soal untuk tanggal ${inputDate} (${existingCount} soal) sudah terpasang.`);
      return;
    }

    try {
      const { generateDailyQuestions } = await import('../../utils/generator');
      const dailyQs = generateDailyQuestions(inputDate);
      await db.questions.bulkAdd(dailyQs);
      toast.success(`Berhasil men-generate 145 soal harian baru untuk tanggal ${inputDate}!`);
      loadQuestions();
    } catch (err) {
      toast.error('Gagal men-generate soal harian');
    }
  };

  const filteredQuestions = questions.filter(
    q =>
      q.questionText.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase()) ||
      (q.id ?? '').toString() === search
  );

  return (
    <div className="space-y-6">
      
      {/* Action panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/20 border border-white/5">
        <div className="flex items-center gap-2">
          <Button onClick={handleAddClick} size="sm" className="h-9 font-bold flex items-center gap-1.5 bg-primary text-white">
            <Plus className="h-4 w-4" />
            <span>Tambah Soal</span>
          </Button>
          <Button onClick={handleExportJSON} variant="outline" size="sm" className="h-9 text-slate-300 border-white/5 hover:bg-slate-900">
            <Download className="h-4 w-4 mr-1.5" />
            <span>Ekspor JSON</span>
          </Button>
          <label className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-white/5 bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 cursor-pointer text-slate-300">
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
            <span>Update Soal Harian</span>
          </Button>
        </div>
        <Button onClick={handleRestoreDefaults} variant="outline" size="sm" className="h-9 border-red-500/20 text-red-400 hover:bg-red-500/5">
          <RefreshCw className="h-4 w-4 mr-1.5" />
          <span>Reset Soal Default</span>
        </Button>
      </div>

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
              className="h-8 w-8 text-slate-400 hover:text-white"
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
                  className="border-white/5 hover:bg-slate-900 text-slate-300"
                >
                  Batal
                </Button>
                <Button type="submit" size="sm" className="bg-primary text-white">
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
            <CardTitle className="text-white text-sm font-semibold">Bank Soal Terdaftar</CardTitle>
            <CardDescription className="text-xs">
              Kelola daftar seluruh soal simulasi CAT dalam database IndexedDB.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari kata kunci, topik, atau ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-white/5 bg-slate-950/40 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/20 text-slate-400 font-bold">
                  <th className="p-3 w-12 text-center">ID</th>
                  <th className="p-3 w-24">Kategori</th>
                  <th className="p-3 w-28">Topik</th>
                  <th className="p-3">Kasus Soal</th>
                  <th className="p-3 w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => (
                    <tr key={q.id ?? q.number} className="hover:bg-slate-950/20 transition-colors">
                      <td className="p-3 text-center text-slate-500 font-mono">#{q.id ?? q.number}</td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-extrabold text-[9px] ${
                          q.category === 'teknis' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          q.category === 'manajerial' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          q.category === 'sosial' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {q.category}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-300">{q.topic}</td>
                      <td className="p-3 max-w-sm truncate text-slate-400 leading-normal" title={q.questionText}>
                        {q.questionText}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditClick(q)}
                            className="p-1.5 rounded-md hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit Soal"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id!)}
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
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
                    <td colSpan={5} className="text-center p-8 text-muted-foreground font-medium">
                      Tidak ada pertanyaan yang terdaftar.
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
