import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertBannerProps {
  painBefore: number;
  painAfter: number;
}

export default function AlertBanner({ painBefore, painAfter }: AlertBannerProps) {
  const maxPain = Math.max(painBefore, painAfter);

  if (maxPain === 0) return null;

  const isSevere = maxPain >= 5;
  const isModerate = maxPain >= 3;

  if (!isSevere && !isModerate) return null;

  const bg = isSevere ? 'bg-red/10 border-red/30' : 'bg-amber/10 border-amber/30';
  const text = isSevere ? 'text-red' : 'text-amber';
  const Icon = isSevere ? AlertCircle : isModerate ? AlertTriangle : Info;
  const message = isSevere
    ? 'Dor ≥ 5: interrompa o treino e consulte um profissional.'
    : 'Dor 3-4: reduza a intensidade do exercício.';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className={`flex items-start gap-3 rounded-xl border p-4 ${bg}`}
    >
      <Icon size={20} className={`mt-0.5 shrink-0 ${text}`} />
      <div>
        <p className={`text-sm font-semibold ${text}`}>
          Atenção
        </p>
        <p className={`mt-0.5 text-sm ${text} opacity-90`}>
          {message}
        </p>
      </div>
    </motion.div>
  );
}
