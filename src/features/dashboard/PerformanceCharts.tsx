'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ExamHistoryItem } from '../../types';

interface PerformanceChartsProps {
  history: ExamHistoryItem[];
}

export function PerformanceCharts({ history }: PerformanceChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px] items-center justify-center text-muted-foreground text-xs">
        Memuat grafik analisis...
      </div>
    );
  }

  // 1. Pie Chart Data: Question Composition
  const compositionData = [
    { name: 'Teknis (90 Soal)', value: 90, color: '#3b82f6' },
    { name: 'Manajerial (25 Soal)', value: 25, color: '#f59e0b' },
    { name: 'Sosial (20 Soal)', value: 20, color: '#10b981' },
    { name: 'Wawancara (10 Soal)', value: 10, color: '#ef4444' }
  ];

  // 2. Line Chart Data: Historical Progress
  const progressData = history.length > 0 
    ? history.map((item, idx) => ({
        name: `Ujian ${idx + 1}`,
        skor: item.scores.total,
        percentage: item.percentage,
        date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      }))
    : [
        { name: 'Belum Ada', skor: 0, percentage: 0, date: '' }
      ];

  // 3. Radar Chart Data: Average competency profile
  const defaultProfile = {
    leadership: 60,
    empathy: 60,
    communication: 65,
    problemSolving: 55,
    characterBuilding: 60,
    conflictManagement: 50,
    integrity: 70,
    decisionMaking: 55,
    service: 65
  };

  const averageProfile = history.length > 0
    ? history.reduce((acc, curr) => {
        const prof = curr.aiAnalysis.psychologyProfile;
        return {
          leadership: acc.leadership + prof.leadership,
          empathy: acc.empathy + prof.empathy,
          communication: acc.communication + prof.communication,
          problemSolving: acc.problemSolving + prof.problemSolving,
          characterBuilding: acc.characterBuilding + prof.characterBuilding,
          conflictManagement: acc.conflictManagement + prof.conflictManagement,
          integrity: acc.integrity + prof.integrity,
          decisionMaking: acc.decisionMaking + prof.decisionMaking,
          service: acc.service + prof.service
        };
      }, {
        leadership: 0, empathy: 0, communication: 0, problemSolving: 0,
        characterBuilding: 0, conflictManagement: 0, integrity: 0, decisionMaking: 0, service: 0
      })
    : defaultProfile;

  if (history.length > 0) {
    Object.keys(averageProfile).forEach(key => {
      const k = key as keyof typeof averageProfile;
      averageProfile[k] = Math.round(averageProfile[k] / history.length);
    });
  }

  const radarData = [
    { subject: 'Leadership', A: averageProfile.leadership, fullMark: 100 },
    { subject: 'Empathy', A: averageProfile.empathy, fullMark: 100 },
    { subject: 'Communication', A: averageProfile.communication, fullMark: 100 },
    { subject: 'Problem Solving', A: averageProfile.problemSolving, fullMark: 100 },
    { subject: 'Char Building', A: averageProfile.characterBuilding, fullMark: 100 },
    { subject: 'Conflict Mgmt', A: averageProfile.conflictManagement, fullMark: 100 },
    { subject: 'Integrity', A: averageProfile.integrity, fullMark: 100 },
    { subject: 'Decision Making', A: averageProfile.decisionMaking, fullMark: 100 },
    { subject: 'Social Service', A: averageProfile.service, fullMark: 100 }
  ];

  // 4. Bar Chart: Category-wise scores compared to Max score (based on latest attempt)
  const latestAttempt = history[history.length - 1];
  const barData = latestAttempt
    ? [
        { name: 'Teknis', Skor: latestAttempt.scores.teknis, Maksimal: latestAttempt.maxScores.teknis },
        { name: 'Manajerial', Skor: latestAttempt.scores.manajerial, Maksimal: latestAttempt.maxScores.manajerial },
        { name: 'Sosial', Skor: latestAttempt.scores.sosial, Maksimal: latestAttempt.maxScores.sosial },
        { name: 'Wawancara', Skor: latestAttempt.scores.wawancara, Maksimal: latestAttempt.maxScores.wawancara }
      ]
    : [
        { name: 'Teknis', Skor: 0, Maksimal: 450 },
        { name: 'Manajerial', Skor: 0, Maksimal: 125 },
        { name: 'Sosial', Skor: 0, Maksimal: 100 },
        { name: 'Wawancara', Skor: 0, Maksimal: 50 }
      ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Radar Chart of psychological core competencies */}
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold flex items-center justify-between">
            <span>Profil Psikologi & Karakter Asrama</span>
            <span className="text-[11px] text-muted-foreground font-normal">Rerata Seluruh Sesi</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Refleksi kompetensi interpersonal, kepemimpinan, dan empati Wali Asrama.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 8 }} />
              <Radar
                name="Kompetensi Anda"
                dataKey="A"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.25}
              />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Line Chart of historical scores */}
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold flex items-center justify-between">
            <span>Tren Nilai Ujian CAT</span>
            <span className="text-[11px] text-muted-foreground font-normal">Riwayat Skor Total</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Perkembangan perolehan skor total dari setiap simulasi ujian.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Line
                type="monotone"
                dataKey="skor"
                stroke="#f59e0b"
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
                dot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Bar Chart: Breakdown of latest test */}
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold flex items-center justify-between">
            <span>Rincian Nilai Sesi Terakhir</span>
            <span className="text-[11px] text-muted-foreground font-normal">Perbandingan Skor Maksimal</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Skor capaian per kategori kompetensi dibandingkan batas poin maksimal.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Skor" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Maksimal" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Pie Chart: Question composition */}
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold flex items-center justify-between">
            <span>Komposisi Soal CAT BKN</span>
            <span className="text-[11px] text-muted-foreground font-normal">145 Soal Mandatori</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Pembagian jumlah soal berdasarkan silabus resmi BKN Sekolah Rakyat.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="w-[60%] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-[40%] text-xs space-y-2.5">
            {compositionData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300 text-[11px]">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
