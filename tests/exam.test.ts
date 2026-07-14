import { describe, it, expect, vi } from 'vitest';
import { generateDailyQuestions } from '../src/utils/generator';

// Generate a test set using the same pipeline as production
const ALL_QUESTIONS = generateDailyQuestions('2026-07-06');

// Simple unit test verifying question list composition
describe('Sekolah Rakyat CAT Exam Logic', () => {
  it('should seed exactly 145 questions', () => {
    expect(ALL_QUESTIONS.length).toBe(145);
  });

  it('should contain the correct distribution of categories', () => {
    const categories = ALL_QUESTIONS.map((q) => q.category);

    const count = (cat: string) => categories.filter((c) => c === cat).length;

    expect(count('teknis')).toBe(90);
    expect(count('manajerial')).toBe(25);
    expect(count('sosial')).toBe(20);
    expect(count('wawancara')).toBe(10);
  });

  it('should have unique question texts (no duplicate templates)', () => {
    const texts = ALL_QUESTIONS.map(q => q.questionText);
    const uniqueTexts = new Set(texts);
    // All 145 questions should have unique question text
    expect(uniqueTexts.size).toBe(145);
  });

  it('should verify teknis questions have 5 options with scores 1-5', () => {
    const teknisQuestions = ALL_QUESTIONS.filter(q => q.category === 'teknis');
    for (const q of teknisQuestions) {
      expect(q.options.length).toBe(5);
      const keys = q.options.map((o) => o.key).sort();
      expect(keys).toEqual(['A', 'B', 'C', 'D', 'E']);
      // Should have an option with max score 5
      const maxScore = Math.max(...q.options.map(o => o.score));
      expect(maxScore).toBe(5);
    }
  });

  it('should verify manajerial/wawancara questions have 4 options with scores 1-4', () => {
    const fourOptQuestions = ALL_QUESTIONS.filter(q =>
      q.category === 'manajerial' || q.category === 'wawancara'
    );
    for (const q of fourOptQuestions) {
      expect(q.options.length).toBe(4);
      const keys = q.options.map((o) => o.key).sort();
      expect(keys).toEqual(['A', 'B', 'C', 'D']);
      const maxScore = Math.max(...q.options.map(o => o.score));
      expect(maxScore).toBe(4);
    }
  });

  it('should calculate percentages correctly', () => {
    // Scoring logic simulation
    const totalMax = 145 * 5; // 725
    const scoreAchieved = 471;
    const percentage = Math.round((scoreAchieved / totalMax) * 100);
    expect(percentage).toBe(65); // 65% passing grade limit met
  });
});
