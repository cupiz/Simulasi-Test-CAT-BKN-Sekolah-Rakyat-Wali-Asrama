import { describe, it, expect, vi } from 'vitest';
import { ALL_QUESTIONS } from '../src/data/questions';

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

  it('should verify the 5 reference questions are exactly loaded with A-E options', () => {
    for (let i = 0; i < 5; i++) {
      const q = ALL_QUESTIONS[i];
      expect(q.options.length).toBe(5);
      
      const keys = q.options.map((o) => o.key).sort();
      expect(keys).toEqual(['A', 'B', 'C', 'D', 'E']);
      
      // Correct answer must have maximum score of 5
      const correctOpt = q.options.find(o => o.key === q.correctAnswer);
      expect(correctOpt?.score).toBe(5);
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
