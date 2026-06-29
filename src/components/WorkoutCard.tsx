import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { WorkoutDay } from '../types';
import { isometricExercises } from '../data/isometrics';

interface WorkoutCardProps {
  workout: WorkoutDay;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const getExerciseInstructions = (name: string) => {
    return isometricExercises.find(
      (e) => e.name.toLowerCase() === name.toLowerCase(),
    );
  };

  const getVolumeColor = () => {
    if (workout.is_rest) return 'text-night-300';
    if (workout.is_active_recovery) return 'text-amber';
    if (workout.week === 'S1' || workout.week === 'S2') return 'text-neon';
    return 'text-emerald';
  };

  return (
    <div className="rounded-2xl border border-night-600/50 bg-night-800/80 p-5 backdrop-blur">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-night-600/50 px-2 py-0.5 font-mono text-xs font-bold text-night-200">
              Dia {workout.day}
            </span>
            <span className="rounded-md bg-night-600/30 px-2 py-0.5 font-mono text-xs text-night-300">
              {workout.week}
            </span>
          </div>
          <h2 className="mt-2 font-display text-xl font-bold text-night-50">
            {workout.focus}
          </h2>
        </div>
      </div>

      {/* Description */}
      {workout.description && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber/10 p-3 text-sm text-amber">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>{workout.description}</p>
        </div>
      )}

      {/* Exercises */}
      {workout.exercises.length > 0 && (
        <div className="mb-4 space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-night-300">
            Exercícios
          </h3>
          {workout.exercises.map((ex) => {
            const instructions = getExerciseInstructions(ex);
            const isOpen = expandedExercise === ex;

            return (
              <div key={ex}>
                <button
                  onClick={() =>
                    setExpandedExercise(isOpen ? null : ex)
                  }
                  disabled={!instructions}
                  className={`no-tap-highlight flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                    isOpen
                      ? 'bg-night-600/40 text-neon'
                      : 'bg-night-700/50 text-night-100 hover:bg-night-600/30'
                  }`}
                >
                  <span className="font-medium">{ex}</span>
                  {instructions && (
                    <span className="shrink-0 text-night-400">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && instructions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mx-4 mt-1 space-y-2 rounded-xl border border-night-600/30 bg-night-800 p-4 text-sm">
                        <p className="text-night-200">{instructions.how_to}</p>
                        <div className="flex gap-4 text-xs">
                          <span className="text-neon">S1: {instructions.time_s1}</span>
                          <span className="text-amber">S2: {instructions.time_s2}</span>
                        </div>
                        {instructions.caution && (
                          <p className="flex items-start gap-1.5 text-red">
                            <Info size={13} className="mt-0.5 shrink-0" />
                            <span>{instructions.caution}</span>
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Volume */}
      <div className={`flex items-center gap-2 text-sm font-medium ${getVolumeColor()}`}>
        <span className="text-night-400">Volume:</span>
        <span>{workout.volume}</span>
        {workout.time_per_exercise && (
          <>
            <span className="text-night-500">·</span>
            <span>{workout.time_per_exercise}</span>
          </>
        )}
      </div>
    </div>
  );
}
