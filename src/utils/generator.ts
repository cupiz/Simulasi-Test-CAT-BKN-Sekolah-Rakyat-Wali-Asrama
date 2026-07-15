import { Question } from '../types';
import parsedQuestions from '../../PDF/parsed_questions.json';
import extraTechnicalQuestions from '../data/extra_teknis.json';

// Seeded random helper
function getSeededRandom(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

export function generateDailyQuestions(dateStr: string): Question[] {
  const result: Question[] = [];

  // Filter based on official BKN subtest categories in the PDF parsed data
  const teknisRefs = parsedQuestions.filter(q => q.category === 'teknis');
  const manajerialRefs = parsedQuestions.filter(q => q.category === 'manajerial');
  const sosialRefs = parsedQuestions.filter(q => q.category === 'sosial');
  const wawancaraRefs = parsedQuestions.filter(q => q.category === 'wawancara');

  // Combine the 60 parsed technical questions with the 30 extra ones to make exactly 90 unique questions
  const allTeknisRefs = [...teknisRefs, ...extraTechnicalQuestions];

  // 1. Technical: 90 Questions (1 to 90)
  for (let num = 1; num <= 90; num++) {
    const qRand = getSeededRandom(`${dateStr}-teknis-v5-${num}`);
    const ref = allTeknisRefs[(num - 1) % allTeknisRefs.length];

    // Shuffle options based on daily seeded random to randomize answer order
    const optionOrder = [0, 1, 2, 3, 4].sort(() => qRand() - 0.5);
    const keys: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];

    const formattedOptions = optionOrder.map((oldIdx, newIdx) => {
      const opt = ref.options[oldIdx];
      return {
        key: keys[newIdx],
        text: opt.text,
        score: opt.score
      };
    });

    const correctOpt = formattedOptions.find(o => o.score === 5);
    const correctAnswer = correctOpt ? correctOpt.key : 'A';

    result.push({
      dateStr,
      number: num,
      category: 'teknis',
      topic: ref.topic,
      questionText: `[Ujian Set ${dateStr}] ${ref.questionText}`,
      options: formattedOptions,
      correctAnswer,
      explanation: ref.explanation,
      competency: ref.competency,
      berakhlak: ref.berakhlak,
      psychologyBasis: ref.psychologyBasis,
      catTips: ref.catTips
    });
  }

  // 2. Managerial: 25 Questions (91 to 115)
  for (let num = 91; num <= 115; num++) {
    const qRand = getSeededRandom(`${dateStr}-manajerial-v5-${num}`);
    const ref = manajerialRefs[num - 91];

    const optionOrder = [0, 1, 2, 3].sort(() => qRand() - 0.5);
    const keys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

    const formattedOptions = optionOrder.map((oldIdx, newIdx) => {
      const opt = ref.options[oldIdx];
      return {
        key: keys[newIdx],
        text: opt.text,
        score: opt.score
      };
    });

    const correctOpt = formattedOptions.find(o => o.score === 4);
    const correctAnswer = correctOpt ? correctOpt.key : 'A';

    result.push({
      dateStr,
      number: num,
      category: 'manajerial',
      topic: ref.topic,
      questionText: `[Ujian Set ${dateStr}] ${ref.questionText}`,
      options: formattedOptions,
      correctAnswer,
      explanation: ref.explanation,
      competency: ref.competency,
      berakhlak: ref.berakhlak,
      psychologyBasis: ref.psychologyBasis,
      catTips: ref.catTips
    });
  }

  // 3. Sosial: 20 Questions (116 to 135)
  for (let num = 116; num <= 135; num++) {
    const qRand = getSeededRandom(`${dateStr}-sosial-v5-${num}`);
    const ref = sosialRefs[num - 116];

    const optionOrder = [0, 1, 2, 3, 4].sort(() => qRand() - 0.5);
    const keys: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];

    const formattedOptions = optionOrder.map((oldIdx, newIdx) => {
      const opt = ref.options[oldIdx];
      return {
        key: keys[newIdx],
        text: opt.text,
        score: opt.score
      };
    });

    const correctOpt = formattedOptions.find(o => o.score === 5);
    const correctAnswer = correctOpt ? correctOpt.key : 'A';

    result.push({
      dateStr,
      number: num,
      category: 'sosial',
      topic: ref.topic,
      questionText: `[Ujian Set ${dateStr}] ${ref.questionText}`,
      options: formattedOptions,
      correctAnswer,
      explanation: ref.explanation,
      competency: ref.competency,
      berakhlak: ref.berakhlak,
      psychologyBasis: ref.psychologyBasis,
      catTips: ref.catTips
    });
  }

  // 4. Wawancara: 10 Questions (136 to 145)
  for (let num = 136; num <= 145; num++) {
    const qRand = getSeededRandom(`${dateStr}-wawancara-v5-${num}`);
    const ref = wawancaraRefs[num - 136];

    const optionOrder = [0, 1, 2, 3].sort(() => qRand() - 0.5);
    const keys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

    const formattedOptions = optionOrder.map((oldIdx, newIdx) => {
      const opt = ref.options[oldIdx];
      return {
        key: keys[newIdx],
        text: opt.text,
        score: opt.score
      };
    });

    const correctOpt = formattedOptions.find(o => o.score === 4);
    const correctAnswer = correctOpt ? correctOpt.key : 'A';

    result.push({
      dateStr,
      number: num,
      category: 'wawancara',
      topic: ref.topic,
      questionText: `[Ujian Set ${dateStr}] ${ref.questionText}`,
      options: formattedOptions,
      correctAnswer,
      explanation: ref.explanation,
      competency: ref.competency,
      berakhlak: ref.berakhlak,
      psychologyBasis: ref.psychologyBasis,
      catTips: ref.catTips
    });
  }

  return result.sort((a, b) => (a.number || 0) - (b.number || 0));
}
