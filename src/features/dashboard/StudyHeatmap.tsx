'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { CalendarDays } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

export function StudyHeatmap() {
  const [historyDates, setHistoryDates] = useState<Date[]>([]);

  useEffect(() => {
    async function loadHistory() {
      const hist = await db.examHistory.toArray();
      const dates = hist.map(h => new Date(h.date));
      setHistoryDates(dates);
    }
    loadHistory();
  }, []);

  // Generate last 35 days (5 weeks) to show a compact and clean contribution grid
  const daysToShow = 35;
  const gridCells = Array.from({ length: daysToShow }).map((_, idx) => {
    // subDays from today backwards
    const date = subDays(new Date(), daysToShow - 1 - idx);
    const count = historyDates.filter(d => isSameDay(d, date)).length;
    return {
      date,
      count
    };
  });

  const getHeatColor = (count: number) => {
    if (count === 0) return 'bg-slate-900 border-white/5';
    if (count === 1) return 'bg-blue-900/60 border-blue-800/40 text-white';
    if (count === 2) return 'bg-blue-700/80 border-blue-600/50 text-white';
    return 'bg-blue-500 border-blue-400/60 text-white'; // 3 or more
  };

  return (
    <Card className="glass-panel border-white/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>Heatmap Latihan Harian</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Visualisasi konsistensi pengerjaan simulasi CAT dalam 5 minggu terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center sm:items-start gap-4">
          
          {/* Grid of boxes */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {gridCells.map((cell, idx) => {
              const formattedDate = format(cell.date, 'dd MMM yyyy');
              return (
                <div
                  key={idx}
                  title={`${formattedDate}: ${cell.count} Sesi`}
                  className={`w-6 h-6 rounded-md border flex items-center justify-center text-[9px] font-bold transition-all duration-200 hover:scale-105 cursor-help ${getHeatColor(cell.count)}`}
                >
                  {cell.count > 0 ? cell.count : ''}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] text-slate-500">
            <span className="font-semibold text-slate-400">Tingkat Aktivitas:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-slate-900 border border-white/5" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-blue-900/60 border border-blue-800/40" />
              <span>1 Ujian</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-blue-700/80 border border-blue-600/50" />
              <span>2 Ujian</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-blue-500 border border-blue-400/60" />
              <span>3+ Ujian</span>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
