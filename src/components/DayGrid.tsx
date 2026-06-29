import { motion } from 'framer-motion';
import DayCell from './DayCell';
import { workouts } from '../data/workouts';
import type { DayRecord } from '../types';

interface DayGridProps {
  records: Record<number, DayRecord>;
  onSelectDay: (day: number) => void;
}

const weekLabels = ['S1', 'S2', 'S3', 'S4', 'Fim'];

function getDayStatus(day: number, records: Record<number, DayRecord>): DayRecord['status'] {
  return records[day]?.status ?? 'pending';
}

export default function DayGrid({ records, onSelectDay }: DayGridProps) {
  const today = new Date();

  // Determina qual dia do plano o usuário está (baseado em quantos dias desde o início)
  // Se não tem registro, usamos um fallback: primeiro dia do plano que não está no futuro
  const startDateStr = (records as Record<string, unknown>)['_meta'] as string | undefined;
  const startDate = startDateStr ? new Date(startDateStr) : null;

  const daysSinceStart = startDate
    ? Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : -1;

  const currentPlanDay = startDate ? Math.min(Math.max(daysSinceStart + 1, 1), 30) : 1;

  // Agrupa dias por semana
  const weeks = weekLabels.map((label) => ({
    label,
    days: workouts.filter((w) => w.week === label),
  }));

  return (
    <div className="space-y-4">
      {weeks.map((week, wi) => (
        <motion.div
          key={week.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: wi * 0.08 }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-night-600/50 px-2.5 py-0.5 font-mono text-xs font-bold text-night-200">
              {week.label}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-night-600 to-transparent" />
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {week.days.map((w) => {
              const isCurrent = w.day === currentPlanDay;
              const isPast = w.day < currentPlanDay;
              return (
                <DayCell
                  key={w.day}
                  day={w.day}
                  status={getDayStatus(w.day, records)}
                  isCurrentDay={isCurrent}
                  isPast={isPast}
                  onClick={() => onSelectDay(w.day)}
                />
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
