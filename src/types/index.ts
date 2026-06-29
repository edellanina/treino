export type DayStatus = 'done' | 'partial' | 'missed' | 'pending';

export interface DayRecord {
  status: DayStatus;
  pain_before: number;
  pain_after: number;
  effort: number;
  sleep: number;
  notes: string;
}

export interface WorkoutDay {
  day: number;
  week: string;
  focus: string;
  exercises: string[];
  volume: string;
  time_per_exercise?: string;
  is_rest: boolean;
  is_active_recovery: boolean;
  description?: string;
}

export interface IsometricExercise {
  name: string;
  how_to: string;
  time_s1: string;
  time_s2: string;
  caution: string;
}

export interface Criterion {
  situation: string;
  signal: string;
  decision: string;
  observation: string;
}

export interface ProgressionRule {
  situation: string;
  signal: string;
  decision: string;
  observation: string;
}
