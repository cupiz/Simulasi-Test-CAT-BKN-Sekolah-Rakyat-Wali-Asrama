'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { Achievement } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Trophy, Flame, Award, ShieldCheck, Zap, Calendar, Lock } from 'lucide-react';

export function AchievementsCard() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    async function loadAchievements() {
      const data = await db.achievements.toArray();
      setAchievements(data);
    }
    loadAchievements();
  }, []);

  const getIcon = (iconName: string, unlocked: boolean) => {
    const props = {
      className: `h-5 w-5 ${unlocked ? 'text-primary' : 'text-slate-500'}`
    };
    switch (iconName) {
      case 'Flame': return <Flame {...props} />;
      case 'Award': return <Award {...props} />;
      case 'ShieldAlert': return <ShieldCheck {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Calendar': return <Calendar {...props} />;
      default: return <Trophy {...props} />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <Card className="glass-panel border-white/5 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between text-white">
          <span>Pencapaian Wali Asrama</span>
          <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
            {unlockedCount} / {achievements.length} Terbuka
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          Lencana reputasi pembinaan karakter & kedisiplinan asrama.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-1 no-scrollbar">
        {achievements.map((ach) => {
          const isUnlocked = !!ach.unlockedAt;
          return (
            <div
              key={ach.id}
              className={`flex items-center gap-3.5 p-2.5 rounded-xl border transition-all duration-200 ${
                isUnlocked
                  ? 'border-primary/20 bg-primary/5 text-white'
                  : 'border-white/5 bg-slate-950/20 opacity-60'
              }`}
            >
              <div
                className={`p-2 rounded-lg border ${
                  isUnlocked
                    ? 'bg-primary/10 border-primary/20'
                    : 'bg-slate-900 border-white/5'
                }`}
              >
                {getIcon(ach.icon, isUnlocked)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold block truncate">
                    {ach.title}
                  </span>
                  {!isUnlocked && <Lock className="h-3 w-3 text-slate-600" />}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 leading-normal">
                  {ach.description}
                </span>
                {isUnlocked && ach.unlockedAt && (
                  <span className="text-[8px] text-slate-500 block mt-1">
                    Terbuka: {new Date(ach.unlockedAt).toLocaleDateString('id-ID')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
