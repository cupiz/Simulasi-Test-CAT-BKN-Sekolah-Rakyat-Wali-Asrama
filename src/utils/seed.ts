import { db } from '../lib/db';
import { getInitialQuestions } from '../data/questions';
import { generateDailyQuestions } from './generator';
import { Achievement } from '../types';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_exam',
    title: 'Percobaan Pertama',
    description: 'Menyelesaikan simulasi ujian atau latihan pertama Anda di asrama.',
    icon: 'Flame',
    unlockedAt: null
  },
  {
    id: 'passed_exam',
    title: 'Lulus Batas Kelulusan',
    description: 'Mendapatkan persentase skor kelulusan minimal 65% dalam simulasi.',
    icon: 'Award',
    unlockedAt: null
  },
  {
    id: 'score_600',
    title: 'Master Wali Asrama',
    description: 'Mencapai skor luar biasa minimal 600 poin dalam ujian CAT.',
    icon: 'ShieldAlert',
    unlockedAt: null
  },
  {
    id: 'speed_run',
    title: 'Speed Demon',
    description: 'Menyelesaikan seluruh soal simulasi ujian dalam waktu kurang dari 30 menit.',
    icon: 'Zap',
    unlockedAt: null
  },
  {
    id: 'daily_done',
    title: 'Konsistensi Harian',
    description: 'Berhasil menjawab tantangan harian (Daily Challenge) pertama Anda.',
    icon: 'Calendar',
    unlockedAt: null
  }
];

export async function seedDatabase() {
  try {
    // 1. Seed Questions if empty for default dates 2026-07-01 to 2026-07-06
    const targetDates = [
      '2026-07-01',
      '2026-07-02',
      '2026-07-03',
      '2026-07-04',
      '2026-07-05',
      '2026-07-06'
    ];

    // Migration: If we do not have the new format questions, clear the table to force a clean seed
    const sample = await db.questions.limit(50).toArray();
    const hasNewFormat = sample.some(q => q.questionText.includes('[SKB CAT BKN Wali Asrama]'));
    if (sample.length > 0 && !hasNewFormat) {
      console.log('Old style questions detected (missing new prefix). Clearing table for clean seed...');
      await db.questions.clear();
    }

    for (const dateStr of targetDates) {
      const count = await db.questions.where('dateStr').equals(dateStr).count();
      if (count < 145) {
        console.log(`Seeding 145 questions for date ${dateStr} (current count: ${count})...`);
        // Clear any existing partial questions for this date to avoid duplicates
        const existingForDate = await db.questions.where('dateStr').equals(dateStr).toArray();
        const existingIds = existingForDate.map(q => q.id).filter((id): id is number => !!id);
        if (existingIds.length > 0) {
          await db.questions.bulkDelete(existingIds);
        }

        let questions;
        if (dateStr === '2026-07-06') {
          // Keep 2026-07-06 as the reference/default question set
          questions = getInitialQuestions('2026-07-06');
        } else {
          // Generate procedural set of 145 questions
          questions = generateDailyQuestions(dateStr);
        }
        await db.questions.bulkAdd(questions);
        console.log(`Seeded ${questions.length} questions successfully for ${dateStr}.`);
      }
    }

    // 2. Seed Achievements if empty
    const achievementCount = await db.achievements.count();
    if (achievementCount === 0) {
      console.log('Seeding achievements...');
      await db.achievements.bulkPut(INITIAL_ACHIEVEMENTS);
      console.log('Seeded initial achievements.');
    }

    // 3. Seed Mock Leaderboard data for a realistic competitive feel
    const leaderboardCount = await db.leaderboard.count();
    if (leaderboardCount === 0) {
      console.log('Seeding mock competitors on leaderboard...');
      const mockCompetitors = [
        { id: 'c1', name: 'Andi Wijaya', instansi: 'Sekolah Rakyat Sumut', score: 685, timeSpent: 5400, rank: 1 },
        { id: 'c2', name: 'Siti Rahma', instansi: 'Sekolah Rakyat Jabar', score: 650, timeSpent: 6200, rank: 2 },
        { id: 'c3', name: 'Budi Santoso', instansi: 'Sekolah Rakyat Jatim', score: 620, timeSpent: 4800, rank: 3 },
        { id: 'c4', name: 'Dewi Lestari', instansi: 'Sekolah Rakyat Bali', score: 580, timeSpent: 6900, rank: 4 },
        { id: 'c5', name: 'Faisal Haris', instansi: 'Sekolah Rakyat Sulsel', score: 545, timeSpent: 7300, rank: 5 }
      ];
      await db.leaderboard.bulkPut(mockCompetitors);
      console.log('Seeded mock competitors.');
    }
  } catch (err) {
    console.error('Failed to seed IndexedDB:', err);
  }
}
