import { useState, useEffect } from 'react';

export type ExerciseLog = {
  exerciseId: string;
  sets: {
    weight: number;
    reps: number;
    completed: boolean;
  }[];
};

export type WorkoutLog = {
  id: string;
  date: string; // ISO string
  programId: string;
  exercises: ExerciseLog[];
};

type SetDefault = { weight: number; reps: number };
type ExerciseDefaults = Record<string, SetDefault[]>;

const HISTORY_KEY = 'workout_history';
const DEFAULTS_KEY = 'exercise_defaults';

export function useWorkoutHistory() {
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [exerciseDefaults, setExerciseDefaults] = useState<ExerciseDefaults>({});

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
    const defaults = localStorage.getItem(DEFAULTS_KEY);
    if (defaults) {
      setExerciseDefaults(JSON.parse(defaults));
    }
  }, []);

  const saveWorkout = (log: WorkoutLog) => {
    const newHistory = [log, ...history];
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const getLastLogForExercise = (exerciseId: string): ExerciseLog | null => {
    for (const log of history) {
      const exLog = log.exercises.find((e) => e.exerciseId === exerciseId);
      if (exLog) return exLog;
    }
    return null;
  };

  const getExerciseDefaults = (exerciseId: string): SetDefault[] | null => {
    return exerciseDefaults[exerciseId] ?? null;
  };

  const saveExerciseDefault = (exerciseId: string, setIndex: number, weight: number, reps: number) => {
    setExerciseDefaults(prev => {
      const current = prev[exerciseId] ? [...prev[exerciseId]] : [];
      current[setIndex] = { weight, reps };
      const updated = { ...prev, [exerciseId]: current };
      localStorage.setItem(DEFAULTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { history, saveWorkout, getLastLogForExercise, getExerciseDefaults, saveExerciseDefault };
}
