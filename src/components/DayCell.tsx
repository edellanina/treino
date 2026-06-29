import { motion } from 'framer-motion';
import type { DayStatus } from '../types';

interface DayCellProps {
  day: number;
  status: DayStatus;
  isCurrentDay: boolean;
  isPast: boolean;
  onClick: () => void;
}

const statusStyles: Record<DayStatus, { bg: string; border: string; text: string }> = {
  done: {
    bg: 'bg-emerald/10',
    border: 'border-emerald/40',
    text: 'text-emerald',
  },
  partial: {
    bg: 'bg-amber/10',
    border: 'border-amber/40',
    text: 'text-amber',
  },
  missed: {
    bg: 'bg-red/10',
    border: 'border-red/40',
    text: 'text-red',
  },
  pending: {
    bg: 'bg-night-800/50',
    border: 'border-night-600/30',
    text: 'text-night-200',
  },
};

export default function DayCell({ day, status, isCurrentDay, isPast, onClick }: DayCellProps) {
  const s = statusStyles[status];
  const isFuture = !isPast && !isCurrentDay;
  const labels: Record<DayStatus, string> = {
    done: '✅',
    partial: '⚠️',
    missed: '❌',
    pending: '',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={isFuture}
      whileTap={isFuture ? undefined : { scale: 0.92 }}
      className={`
        no-tap-highlight relative flex aspect-square flex-col items-center justify-center rounded-xl border text-center transition-all
        ${s.bg} ${s.border}
        ${isCurrentDay ? 'glow-neon border-neon ring-1 ring-neon/50' : ''}
        ${isFuture ? 'cursor-not-allowed opacity-40' : 'cursor-pointer active:scale-95'}
      `}
    >
      <span className={`font-mono text-lg font-bold leading-none ${isCurrentDay ? 'text-neon' : s.text}`}>
        {day}
      </span>
      {status !== 'pending' && (
        <span className="mt-0.5 text-[10px]">{labels[status]}</span>
      )}
      {isCurrentDay && (
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-neon glow-neon" />
      )}
    </motion.button>
  );
}
