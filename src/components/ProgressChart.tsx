import { motion } from 'framer-motion';
import { TrendingUp, Activity, Flame } from 'lucide-react';
import type { DayRecord } from '../types';
import { workouts } from '../data/workouts';
import { useEffect, useState } from 'react';

interface ProgressChartProps {
  records: Record<number, DayRecord>;
}

type WeeklySummary = {
  week: string;
  total: number;
  done: number;
  avgPainBefore: number;
  avgPainAfter: number;
  avgEffort: number;
};

export default function ProgressChart({ records }: ProgressChartProps) {
  const [weekly, setWeekly] = useState<WeeklySummary[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalDone, setTotalDone] = useState(0);

  useEffect(() => {
    const weekLabels = ['S1', 'S2', 'S3', 'S4', 'Fim'];
    const weekData = weekLabels.map((label) => {
      const days = workouts.filter((w) => w.week === label);
      const dayRecords = days
        .map((d) => records[d.day])
        .filter(Boolean) as DayRecord[];
      const done = dayRecords.filter(
        (r) => r.status === 'done' || r.status === 'partial',
      ).length;

      return {
        week: label,
        total: days.length,
        done,
        avgPainBefore: dayRecords.length
          ? Math.round(
              (dayRecords.reduce((s, r) => s + r.pain_before, 0) /
                dayRecords.length) * 10,
            ) / 10
          : 0,
        avgPainAfter: dayRecords.length
          ? Math.round(
              (dayRecords.reduce((s, r) => s + r.pain_after, 0) /
                dayRecords.length) * 10,
            ) / 10
          : 0,
        avgEffort: dayRecords.length
          ? Math.round(
              (dayRecords.reduce((s, r) => s + r.effort, 0) /
                dayRecords.length) * 10,
            ) / 10
          : 0,
      };
    });
    setWeekly(weekData);
    setTotalDone(
      Object.values(records).filter(
        (r) => r.status === 'done' || r.status === 'partial',
      ).length,
    );

    // Streak: count consecutive days from today backwards
    let count = 0;
    for (let i = 30; i >= 1; i--) {
      const r = records[i];
      if (r?.status === 'done' || r?.status === 'partial') {
        count++;
      } else if (r?.status === 'missed') {
        break;
      }
      // if no record, stop
      if (!r) break;
    }
    setStreak(count);
  }, [records]);

  const maxPain = Math.max(
    ...weekly.map((w) => Math.max(w.avgPainBefore, w.avgPainAfter)),
    1,
  );

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-night-600/30 bg-night-800/60 p-4 text-center">
          <Flame size={20} className="mx-auto text-amber" />
          <p className="mt-1 font-mono text-2xl font-bold text-amber">{streak}</p>
          <p className="text-xs text-night-300">seq.</p>
        </div>
        <div className="rounded-xl border border-night-600/30 bg-night-800/60 p-4 text-center">
          <Activity size={20} className="mx-auto text-neon" />
          <p className="mt-1 font-mono text-2xl font-bold text-neon">
            {totalDone}
          </p>
          <p className="text-xs text-night-300">feitos</p>
        </div>
        <div className="rounded-xl border border-night-600/30 bg-night-800/60 p-4 text-center">
          <TrendingUp size={20} className="mx-auto text-emerald" />
          <p className="mt-1 font-mono text-2xl font-bold text-emerald">
            {Math.round((totalDone / 30) * 100)}%
          </p>
          <p className="text-xs text-night-300">total</p>
        </div>
      </div>

      {/* Weekly summary */}
      {weekly.map((w) => (
        <motion.div
          key={w.week}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-night-600/30 bg-night-800/60 p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-md bg-night-600/40 px-2 py-0.5 font-mono text-xs font-bold text-night-200">
              {w.week}
            </span>
            <span className="text-xs text-night-300">
              {w.done}/{w.total} dias
            </span>
          </div>

          {/* Bar progress */}
          <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-night-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(w.done / w.total) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                w.done === w.total
                  ? 'bg-emerald'
                  : w.done > 0
                    ? 'bg-amber'
                    : 'bg-night-500'
              }`}
            />
          </div>

          {/* Pain chart mini */}
          <div className="flex items-end gap-1">
            <div className="flex-1 text-center">
              <div
                className="mx-auto w-8 rounded-t-sm bg-neon/60"
                style={{
                  height: `${Math.max((w.avgPainBefore / maxPain) * 40, 2)}px`,
                }}
              />
              <p className="mt-0.5 text-[10px] text-night-300">
                {w.avgPainBefore}
              </p>
            </div>
            <div className="flex-1 text-center">
              <div
                className="mx-auto w-8 rounded-t-sm bg-amber/60"
                style={{
                  height: `${Math.max((w.avgPainAfter / maxPain) * 40, 2)}px`,
                }}
              />
              <p className="mt-0.5 text-[10px] text-night-300">
                {w.avgPainAfter}
              </p>
            </div>
          </div>
          <div className="mt-1 flex justify-center gap-4 text-[10px] text-night-400">
            <span>● antes</span>
            <span>● depois</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
