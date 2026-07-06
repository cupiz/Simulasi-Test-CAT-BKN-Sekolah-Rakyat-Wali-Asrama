'use client';

import React, { useEffect, useState } from 'react';
import { seedDatabase } from '../../utils/seed';
import { useExamStore } from '../../store';
import { db } from '../../lib/db';
import { Loader2 } from 'lucide-react';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const { setQuestions, resumeExam } = useExamStore();

  useEffect(() => {
    async function init() {
      // 1. Seed IndexedDB with questions, mock leaderboard, achievements
      await seedDatabase();

      // 2. Load questions for the latest date from IndexedDB to state
      const dbQuestions = await db.questions.toArray();
      const dates = [...new Set(dbQuestions.map(q => q.dateStr).filter((d): d is string => !!d))].sort();
      const latestDate = dates.length > 0 ? dates[dates.length - 1] : '2026-07-06';
      const latestQuestions = dbQuestions.filter(q => q.dateStr === latestDate).sort((a, b) => (a.number || 0) - (b.number || 0));
      setQuestions(latestQuestions);

      // 3. Auto-resume existing active session if available
      try {
        const activeSession = await db.examSessions.get('active_session');
        if (activeSession && !activeSession.isCompleted) {
          resumeExam(activeSession);
        }
      } catch (err) {
        console.error('Failed to restore active session:', err);
      }

      setInitialized(true);
    }
    init();
  }, [setQuestions, resumeExam]);

  if (!initialized) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground space-y-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="absolute inset-0 h-10 w-10 rounded-full border border-primary/20 animate-ping" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Menginisialisasi Simulator CAT BKN Sekolah Rakyat...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
