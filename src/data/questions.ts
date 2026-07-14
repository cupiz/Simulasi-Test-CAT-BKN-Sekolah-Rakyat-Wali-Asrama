import { Question } from '../types';
import { generateDailyQuestions } from '../utils/generator';

// getInitialQuestions now delegates to generateDailyQuestions which uses
// the 145 unique, diverse questions from parsed_questions.json + extra_teknis.json.
// This eliminates the old dummy template questions that were repetitive/identical.
export const getInitialQuestions = (dateStr: string = '2026-07-06'): Question[] => {
  return generateDailyQuestions(dateStr);
};
