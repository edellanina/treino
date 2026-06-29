interface PainSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}

export default function PainSlider({ label, value, onChange, max = 10 }: PainSliderProps) {
  const getLabelColor = (v: number) => {
    if (v <= 2) return 'text-emerald';
    if (v <= 4) return 'text-amber';
    return 'text-red';
  };

  const getEmoji = (v: number) => {
    if (v === 0) return '😊';
    if (v <= 2) return '🙂';
    if (v <= 4) return '😐';
    if (v <= 6) return '😣';
    if (v <= 8) return '😖';
    return '😫';
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-night-300">
          {label}
        </span>
        <span className={`flex items-center gap-1 font-mono text-sm font-bold ${getLabelColor(value)}`}>
          {getEmoji(value)} {value}/{max}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            no-tap-highlight h-2 w-full cursor-pointer appearance-none rounded-full bg-night-600/50
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-night-900
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:transition-all
          "
          style={{
            background: `linear-gradient(to right, 
              ${value <= 2 ? '#10b981' : value <= 4 ? '#f59e0b' : '#ef4444'} ${(value / max) * 100}%, 
              rgba(30, 41, 59, 0.5) ${(value / max) * 100}%
            )`,
            ['--thumb-color' as string]: value <= 2 ? '#10b981' : value <= 4 ? '#f59e0b' : '#ef4444',
          }}
        />
      </div>
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          background: var(--thumb-color, #10b981);
        }
      `}</style>
    </div>
  );
}
