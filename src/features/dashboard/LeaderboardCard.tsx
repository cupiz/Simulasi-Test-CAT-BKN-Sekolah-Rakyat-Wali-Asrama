'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { LeaderboardEntry } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Trophy, Medal, Search, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function LeaderboardCard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      const data = await db.leaderboard.toArray();
      // Sort by score desc, then timeSpent asc
      const sorted = data.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeSpent - b.timeSpent;
      });
      // Add ranks dynamically
      const ranked = sorted.map((entry, idx) => ({
        ...entry,
        rank: idx + 1
      }));
      setEntries(ranked);
    }
    loadLeaderboard();
  }, []);

  const filteredEntries = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.instansi.toLowerCase().includes(search.toLowerCase())
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-xs font-bold text-slate-500 w-5 text-center">{rank}</span>;
  };

  return (
    <Card className="glass-panel border-white/5 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between text-white">
          <span>Leaderboard Wali Asrama</span>
          <Medal className="h-4 w-4 text-primary" />
        </CardTitle>
        <CardDescription className="text-xs">
          Peringkat real-time simulasi CAT BKN nasional tingkat instansi.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama atau instansi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-white/5 bg-slate-950/40 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto max-h-[300px] space-y-1.5 pr-1 no-scrollbar">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                  item.isCurrentUser
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-white/5 bg-slate-950/20 hover:bg-slate-950/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 flex justify-center">
                    {getRankBadge(item.rank)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-200">
                        {item.name}
                      </span>
                      {item.isCurrentUser && (
                        <span className="text-[9px] bg-primary/20 text-primary border border-primary/30 px-1 rounded-sm">
                          Anda
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {item.instansi}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-success block">
                    {item.score} <span className="text-[9px] font-normal text-slate-500">pts</span>
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-500">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{Math.floor(item.timeSpent / 60)}m</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-muted-foreground">
              Belum ada peringkat yang cocok.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
