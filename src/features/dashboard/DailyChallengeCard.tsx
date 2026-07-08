'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { DailyChallenge, Question } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Sparkles, CheckCircle2, XCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function DailyChallengeCard() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    async function loadDailyChallenge() {
      try {
        let current = await db.dailyChallenges.get(todayStr);
        let q = null;

        if (current) {
          q = await db.questions.get(current.questionId);
        }

        // If not generated yet or the cached question was deleted, regenerate
        if (!current || !q) {
          const keys = await db.questions.toCollection().primaryKeys();
          if (keys.length > 0) {
            const dateNum = new Date().getDate();
            const keyIndex = (dateNum * 17) % keys.length;
            const qId = keys[keyIndex];
            current = {
              dateStr: todayStr,
              questionId: qId as number
            };
            await db.dailyChallenges.put(current);
            q = await db.questions.get(qId as number);
          }
        }

        if (current && q) {
          setChallenge(current);
          setQuestion(q);
          if (current.answeredOption) {
            setSelectedOption(current.answeredOption);
            setSubmitted(true);
          }
        }
      } catch (err) {
        console.error('Failed to load daily challenge:', err);
      }
    }
    loadDailyChallenge();
  }, [todayStr]);

  const handleSubmit = async () => {
    if (!selectedOption || !challenge || !question) return;

    const isCorrect = selectedOption === question.correctAnswer;
    const pointsEarned = isCorrect ? 50 : 10;

    const updated: DailyChallenge = {
      ...challenge,
      answeredOption: selectedOption,
      isCorrect,
      pointsEarned
    };

    await db.dailyChallenges.put(updated);
    setChallenge(updated);
    setSubmitted(true);

    if (isCorrect) {
      toast.success(`Benar! Anda mendapatkan +${pointsEarned} poin harian 🎉`);
      // Unlock daily achievement
      try {
        await db.achievements.update('daily_done', { unlockedAt: Date.now() });
      } catch (e) {}
    } else {
      toast.error(`Kurang tepat. Anda mendapatkan +${pointsEarned} poin partisipasi.`);
    }
  };

  if (!question) {
    return (
      <Card className="glass-panel border-white/5 h-full">
        <CardContent className="py-8 text-center text-xs text-muted-foreground">
          Mempersiapkan tantangan harian...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-white/5 h-full flex flex-col justify-between">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between text-white">
          <span>Tantangan Harian (Daily Challenge)</span>
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
        </CardTitle>
        <CardDescription className="text-xs">
          Selesaikan satu soal cepat setiap hari untuk mengumpulkan poin asrama.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        
        {/* Category tag */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-sm bg-primary/20 text-primary border border-primary/30">
            {question.category}
          </span>
          <span className="text-[10px] text-slate-500">{question.topic}</span>
        </div>

        {/* Question Text */}
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {question.questionText}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            const isCorrectOption = opt.key === question.correctAnswer;
            
            let btnStyle = 'border-white/5 bg-slate-950/20 text-slate-400 hover:border-white/10 hover:text-slate-200';
            if (submitted) {
              if (isCorrectOption) {
                btnStyle = 'border-success/30 bg-success/10 text-success';
              } else if (isSelected) {
                btnStyle = 'border-red-500/30 bg-red-500/10 text-red-500';
              }
            } else if (isSelected) {
              btnStyle = 'border-primary bg-primary/10 text-white';
            }

            return (
              <button
                key={opt.key}
                disabled={submitted}
                onClick={() => setSelectedOption(opt.key)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
              >
                <span className="font-extrabold uppercase mt-0.5">{opt.key}.</span>
                <span className="leading-tight">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation when submitted */}
        {submitted && challenge && (
          <div className="p-3 rounded-lg bg-slate-950/40 border border-white/5 text-[11px] leading-relaxed text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              {challenge.isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-success">Jawaban Anda Benar! (+{challenge.pointsEarned} poin)</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">Jawaban Anda Kurang Tepat (+{challenge.pointsEarned} poin)</span>
                </>
              )}
            </div>
            <p className="line-clamp-4">{question.explanation}</p>
          </div>
        )}

      </CardContent>

      <div className="p-6 pt-0 mt-4">
        {!submitted ? (
          <Button
            disabled={!selectedOption}
            onClick={handleSubmit}
            className="w-full text-xs font-semibold"
          >
            Submit Jawaban Harian
          </Button>
        ) : (
          <div className="text-center text-[10px] text-slate-500 font-medium">
            Tantangan selesai! Kembali lagi besok untuk tantangan berikutnya.
          </div>
        )}
      </div>
    </Card>
  );
}
