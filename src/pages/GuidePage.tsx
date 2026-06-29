import { motion } from 'framer-motion';
import GuideTabs from '../components/GuideTabs';

export default function GuidePage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-24"
    >
      <div className="header-glow -mx-4 -mt-4 mb-6 rounded-b-3xl px-4 pb-6 pt-4">
        <h1 className="font-display text-2xl font-bold text-night-50">
          Guia Rápido
        </h1>
        <p className="mt-1 text-sm text-night-300">
          Instruções, critérios e regras de progressão
        </p>
      </div>

      <GuideTabs />
    </motion.div>
  );
}
