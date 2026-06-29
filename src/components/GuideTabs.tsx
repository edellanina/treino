import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Shield, ArrowRight } from 'lucide-react';
import { isometricExercises } from '../data/isometrics';
import { painCriteria, progressionRules } from '../data/criteria';

type Tab = 'isometrics' | 'criteria' | 'progression';

const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: 'isometrics', label: 'Isometrias', icon: BookOpen },
  { id: 'criteria', label: 'Critérios', icon: Shield },
  { id: 'progression', label: 'Avançar', icon: ArrowRight },
];

export default function GuideTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('isometrics');

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-night-700/50 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`no-tap-highlight flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
              activeTab === id
                ? 'bg-night-600 text-neon shadow-sm'
                : 'text-night-300 hover:text-night-100'
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'isometrics' && (
            <motion.div
              key="isometrics"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              {isometricExercises.map((ex) => (
                <div
                  key={ex.name}
                  className="rounded-xl border border-night-600/30 bg-night-800/60 p-4"
                >
                  <h4 className="font-display text-base font-bold text-night-50">
                    {ex.name}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-night-200">
                    {ex.how_to}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    <span className="rounded-md bg-neon/10 px-2 py-0.5 font-mono text-neon">
                      S1: {ex.time_s1}
                    </span>
                    <span className="rounded-md bg-amber/10 px-2 py-0.5 font-mono text-amber">
                      S2: {ex.time_s2}
                    </span>
                  </div>
                  {ex.caution && (
                    <p className="mt-2 text-xs text-red">
                      ⚠ {ex.caution}
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'criteria' && (
            <motion.div
              key="criteria"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              <h4 className="font-display text-base font-bold text-night-50">
                Escala de Dor
              </h4>
              <p className="text-sm text-night-300">
                Regra geral: <strong className="text-night-100">dor 0-2 ok</strong> ·{' '}
                <strong className="text-amber">3-4 reduzir</strong> ·{' '}
                <strong className="text-red">5+ parar</strong>
              </p>
              <div className="space-y-2">
                {painCriteria.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-night-600/30 bg-night-800/60 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <h5 className="text-sm font-semibold text-night-50">
                        {c.situation}
                      </h5>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                          c.signal.includes('5+')
                            ? 'bg-red/20 text-red'
                            : c.signal.includes('3-4')
                              ? 'bg-amber/20 text-amber'
                              : 'bg-emerald/20 text-emerald'
                        }`}
                      >
                        {c.signal}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-night-200">
                      <span className="font-semibold text-night-100">Decisão:</span>{' '}
                      {c.decision}
                    </p>
                    <p className="mt-0.5 text-xs text-night-300">
                      {c.observation}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'progression' && (
            <motion.div
              key="progression"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              <h4 className="font-display text-base font-bold text-night-50">
                Quando Avançar?
              </h4>
              <div className="space-y-2">
                {progressionRules.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-night-600/30 bg-night-800/60 p-4"
                  >
                    <h5 className="text-sm font-semibold text-night-50">
                      {r.situation}
                    </h5>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-md bg-night-600/40 px-2 py-0.5 font-mono text-xs text-night-200">
                        {r.signal}
                      </span>
                      <ArrowRight size={14} className="text-night-400" />
                      <span className="text-sm font-semibold text-neon">
                        {r.decision}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-night-300">
                      {r.observation}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
