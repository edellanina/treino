import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Bed, Zap } from 'lucide-react';
import WorkoutCard from '../components/WorkoutCard';
import StatusSelector from '../components/StatusSelector';
import PainSlider from '../components/PainSlider';
import AlertBanner from '../components/AlertBanner';
import { workouts } from '../data/workouts';
import type { DayRecord, DayStatus } from '../types';

interface WorkoutPageProps {
  day: number;
  savedRecord: DayRecord | null;
  onSave: (day: number, record: DayRecord) => void;
}

export default function WorkoutPage({ day, savedRecord, onSave }: WorkoutPageProps) {
  const navigate = useNavigate();
  const workout = workouts.find((w) => w.day === day);

  const [status, setStatus] = useState<DayStatus>(savedRecord?.status ?? 'pending');
  const [painBefore, setPainBefore] = useState(savedRecord?.pain_before ?? 0);
  const [painAfter, setPainAfter] = useState(savedRecord?.pain_after ?? 0);
  const [effort, setEffort] = useState(savedRecord?.effort ?? 0);
  const [sleep, setSleep] = useState(savedRecord?.sleep ?? 0);
  const [notes, setNotes] = useState(savedRecord?.notes ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (savedRecord) {
      setStatus(savedRecord.status);
      setPainBefore(savedRecord.pain_before);
      setPainAfter(savedRecord.pain_after);
      setEffort(savedRecord.effort);
      setSleep(savedRecord.sleep);
      setNotes(savedRecord.notes);
    }
  }, [savedRecord, day]);

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-night-300">Dia não encontrado.</p>
        <button onClick={() => navigate('/treino/')} className="mt-4 text-neon">
          Voltar
        </button>
      </div>
    );
  }

  const handleSave = () => {
    onSave(day, {
      status,
      pain_before: painBefore,
      pain_after: painAfter,
      effort,
      sleep,
      notes,
    });
    setSaved(true);
    setTimeout(() => navigate('/treino/'), 1200);
  };

  const canSave = status !== 'pending' || painBefore > 0 || painAfter > 0 || notes.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-24"
    >
      {/* Back */}
      <button
        onClick={() => navigate('/treino/')}
        className="no-tap-highlight mb-4 flex items-center gap-1.5 text-sm text-night-300 transition-colors hover:text-night-100"
      >
        <ArrowLeft size={18} />
        <span>Voltar</span>
      </button>

      <WorkoutCard workout={workout} />

      {/* Alert Banner */}
      <div className="mt-4">
        <AlertBanner painBefore={painBefore} painAfter={painAfter} />
      </div>

      {/* Registration Form */}
      <div className="mt-6 space-y-5 rounded-2xl border border-night-600/50 bg-night-800/80 p-5 backdrop-blur">
        <h3 className="font-display text-lg font-bold text-night-50">
          {savedRecord ? 'Editar registro' : 'Registrar treino'}
        </h3>

        <StatusSelector value={status} onChange={setStatus} />

        <PainSlider
          label="Dor antes"
          value={painBefore}
          onChange={setPainBefore}
        />

        <PainSlider
          label="Dor depois"
          value={painAfter}
          onChange={setPainAfter}
        />

        {/* Esforço */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-night-300">
              <Zap size={13} /> Esforço
            </span>
            <span className="font-mono text-sm font-bold text-neon">
              {effort}/5
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setEffort(v)}
                className={`no-tap-highlight flex h-10 flex-1 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  effort >= v
                    ? 'bg-neon/20 text-neon border border-neon/30'
                    : 'bg-night-700/50 text-night-400 border border-night-600/20'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Sono */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-night-300">
              <Bed size={13} /> Sono (0-10)
            </span>
            <span className="font-mono text-sm font-bold text-amber">
              {sleep}/10
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
            className="
              no-tap-highlight h-2 w-full cursor-pointer appearance-none rounded-full bg-night-600/50
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-night-900
              [&::-webkit-slider-thumb]:bg-amber
              [&::-webkit-slider-thumb]:shadow-lg
            "
            style={{
              background: `linear-gradient(to right, #f59e0b ${(sleep / 10) * 100}%, rgba(30, 41, 59, 0.5) ${(sleep / 10) * 100}%)`,
            }}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-300">
            Observações
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Como foi o treino? Algo relevante?"
            rows={3}
            className="w-full resize-none rounded-xl border border-night-600/30 bg-night-700/50 px-4 py-3 text-sm text-night-100 placeholder-night-400 outline-none transition-colors focus:border-neon/50 focus:ring-1 focus:ring-neon/20"
          />
        </div>

        {/* Save */}
        <motion.button
          onClick={handleSave}
          disabled={!canSave}
          whileTap={canSave ? { scale: 0.97 } : undefined}
          className={`no-tap-highlight flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 font-display text-base font-bold transition-all ${
            saved
              ? 'bg-emerald text-white'
              : canSave
                ? 'bg-neon text-night-900 shadow-lg shadow-neon/20 active:scale-[0.98]'
                : 'bg-night-600/50 text-night-400'
          }`}
        >
          <Save size={18} />
          <span>{saved ? 'Salvo!' : 'Salvar'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
