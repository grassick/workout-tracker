import { useState, useEffect } from 'react';

export type WorkoutLog = {
  id: string;
  date: string; // ISO string
  programId: string;
  exercises: {
    exerciseId: string;
    sets: {
      weight: number;
      reps: number;
      completed: boolean;
    }[];
  }[];
};

export function useWorkoutHistory() {
  const [history, setHistory] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('workout_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const saveWorkout = (log: WorkoutLog) => {
    const newHistory = [log, ...history];
    setHistory(newHistory);
    localStorage.setItem('workout_history', JSON.stringify(newHistory));
  };

  const getLastLogForExercise = (exerciseId: string) => {
    // Find the most recent log containing this exercise
    for (const log of history) {
      const exLog = log.exercises.find((e) => e.exerciseId === exerciseId);
      if (exLog) return exLog;
    }
    return null;
  };

  return { history, saveWorkout, getLastLogForExercise };
}
