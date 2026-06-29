import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Sparkles } from 'lucide-react';
import DayGrid from '../components/DayGrid';
import type { DayRecord } from '../types';
import { workouts } from '../data/workouts';

interface HomePageProps {
  records: Record<number, DayRecord>;
  onSelectDay: (day: number) => void;
  startDay: number;
}

export default function HomePage({ records, onSelectDay, startDay }: HomePageProps) {
  const navigate = useNavigate();
  const todayWorkout = workouts.find((w) => w.day === startDay);

  // Calculate summary
  const doneCount = Object.values(records).filter(
    (r) => r.status === 'done' || r.status === 'partial',
  ).length;

  // Streak
  let streak = 0;
  for (let i = startDay; i >= 1; i--) {
    const r = records[i];
    if (r?.status === 'done' || r?.status === 'partial') {
      streak++;
    } else if (r?.status === 'missed') {
      break;
    } else {
      break;
    }
  }

  const weekMapping: Record<string, string> = {
    S1: 'Semana 1',
    S2: 'Semana 2',
    S3: 'Semana 3',
    S4: 'Semana 4',
    Fim: 'Encerramento',
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header-glow -mx-4 -mt-4 mb-6 rounded-b-3xl px-4 pb-6 pt-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-night-50">
              Treino
            </h1>
            <p className="text-sm text-night-300">30 dias · quadril + isometria</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-night-600/40 px-3 py-1.5 text-xs text-amber">
            <Sparkles size={14} />
            <span className="font-semibold">{streak} dias</span>
          </div>
        </div>

        {todayWorkout && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4"
          >
            <p className="text-xs uppercase tracking-wider text-night-400">
              Treino de hoje
            </p>
            <p className="font-display text-lg font-bold text-neon">
              Dia {startDay} · {weekMapping[todayWorkout.week] ?? todayWorkout.week}
            </p>
            <p className="text-sm text-night-200">{todayWorkout.focus}</p>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => navigate('/treino/hoje')}
          className="no-tap-highlight mt-4 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-neon px-5 py-3.5 font-display text-base font-bold text-night-900 shadow-lg shadow-neon/20 transition-all active:scale-[0.98]"
        >
          <Dumbbell size={20} />
          <span>
            {todayWorkout?.is_rest
              ? 'É dia de descanso'
              : todayWorkout?.is_active_recovery
                ? 'Recuperação ativa'
                : `Dia ${startDay} — ${todayWorkout?.focus ?? 'Começar'}`}
          </span>
        </motion.button>
      </motion.div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-night-600/30 bg-night-800/50 px-4 py-3">
          <p className="text-2xl font-bold text-neon font-mono">{doneCount}/30</p>
          <p className="text-xs text-night-300">dias concluídos</p>
        </div>
        <div className="rounded-xl border border-night-600/30 bg-night-800/50 px-4 py-3">
          <p className="text-2xl font-bold text-emerald font-mono">{streak}</p>
          <p className="text-xs text-night-300">dias seguidos</p>
        </div>
      </div>

      {/* Grid */}
      <DayGrid records={records} onSelectDay={onSelectDay} />
    </div>
  );
}
