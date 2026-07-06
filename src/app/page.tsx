'use client';

import React from 'react';
import { useAuthStore, useExamStore } from '../store';
import { LoginView } from '../features/auth/LoginView';
import { DashboardView } from '../features/dashboard/DashboardView';
import { ExamView } from '../features/exam/ExamView';
import { ResultsView } from '../features/results/ResultsView';

export default function HomePage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isActive = useExamStore((state) => state.isActive);
  const isCompleted = useExamStore((state) => state.isCompleted);

  if (!isLoggedIn) {
    return <LoginView />;
  }

  if (isActive) {
    return <ExamView />;
  }

  if (isCompleted) {
    return <ResultsView />;
  }

  return <DashboardView />;
}
