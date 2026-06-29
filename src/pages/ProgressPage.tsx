import { motion } from 'framer-motion';
import ProgressChart from '../components/ProgressChart';
import type { DayRecord } from '../types';

interface ProgressPageProps {
  records: Record<number, DayRecord>;
}

export default function ProgressPage({ records }: ProgressPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-24"
    >
      <div className="header-glow -mx-4 -mt-4 mb-6 rounded-b-3xl px-4 pb-6 pt-4">
        <h1 className="font-display text-2xl font-bold text-night-50">
          Progresso
        </h1>
        <p className="mt-1 text-sm text-night-300">
          Acompanhe sua evolução ao longo dos 30 dias
        </p>
      </div>

      <ProgressChart records={records} />
    </motion.div>
  );
}
