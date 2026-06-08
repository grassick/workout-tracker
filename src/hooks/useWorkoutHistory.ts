import { useState, useEffect } from 'react';
import { collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

export function useWorkoutHistory(uid: string) {
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [exerciseDefaults, setExerciseDefaults] = useState<ExerciseDefaults>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      const workoutsSnap = await getDocs(
        query(collection(db, 'users', uid, 'workouts'), orderBy('date', 'desc'))
      );
      const defaultsSnap = await getDocs(collection(db, 'users', uid, 'exerciseDefaults'));
      if (cancelled) return;

      setHistory(workoutsSnap.docs.map((d) => d.data() as WorkoutLog));

      const defaults: ExerciseDefaults = {};
      defaultsSnap.forEach((d) => {
        defaults[d.id] = (d.data().sets as SetDefault[]) ?? [];
      });
      setExerciseDefaults(defaults);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const saveWorkout = async (log: WorkoutLog) => {
    // Optimistic local update keeps the UI instant; Firestore write follows.
    setHistory((prev) => [log, ...prev]);
    await setDoc(doc(db, 'users', uid, 'workouts', log.id), log);
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
    setExerciseDefaults((prev) => {
      const current = prev[exerciseId] ? [...prev[exerciseId]] : [];
      current[setIndex] = { weight, reps };
      const updated = { ...prev, [exerciseId]: current };
      // Fire-and-forget: persist the per-exercise doc.
      setDoc(doc(db, 'users', uid, 'exerciseDefaults', exerciseId), { sets: current }, { merge: true });
      return updated;
    });
  };

  return { history, loading, saveWorkout, getLastLogForExercise, getExerciseDefaults, saveExerciseDefault };
}
