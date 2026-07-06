import Dexie, { type Table } from 'dexie';
import { Question, ExamSession, ExamHistoryItem, LeaderboardEntry, Achievement, DailyChallenge, AIStudyPlan } from '../types';

export class SekolahRakyatDatabase extends Dexie {
  questions!: Table<Question, number>;
  examSessions!: Table<ExamSession, string>;
  examHistory!: Table<ExamHistoryItem, number>;
  leaderboard!: Table<LeaderboardEntry, string>;
  achievements!: Table<Achievement, string>;
  dailyChallenges!: Table<DailyChallenge, string>;
  aiStudyPlans!: Table<AIStudyPlan, string>;

  constructor() {
    super('SekolahRakyatDB');
    this.version(1).stores({
      questions: 'id, category, topic',
      examSessions: 'id, mode, isCompleted',
      examHistory: '++id, date, mode, percentage',
      leaderboard: 'id, score, rank, name',
      achievements: 'id, unlockedAt',
      dailyChallenges: 'dateStr, questionId',
      aiStudyPlans: 'id, createdAt'
    });
  }
}

export const db = new SekolahRakyatDatabase();
export default db;
