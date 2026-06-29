import type { DayStatus } from '../types';
import { motion } from 'framer-motion';

interface StatusSelectorProps {
  value: DayStatus;
  onChange: (status: DayStatus) => void;
}

const options: { value: DayStatus; label: string; icon: string; activeClass: string }[] = [
  { value: 'done', label: 'Feito', icon: '✓', activeClass: 'bg-emerald/20 border-emerald text-emerald' },
  { value: 'partial', label: 'Parcial', icon: '~', activeClass: 'bg-amber/20 border-amber text-amber' },
  { value: 'missed', label: 'Não fiz', icon: '✕', activeClass: 'bg-red/20 border-red text-red' },
];

export default function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-night-300">
        Status do treino
      </h3>
      <div className="flex gap-2">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              whileTap={{ scale: 0.95 }}
              className={`no-tap-highlight flex flex-1 flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? opt.activeClass
                  : 'border-night-600/30 bg-night-700/30 text-night-400'
              }`}
            >
              <span className="text-lg">{opt.icon}</span>
              <span>{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
