import { ExerciseLog, WorkoutLog } from '../hooks/useWorkoutHistory';

// Epley formula for estimated one-rep max.
export function estimate1RM(weight: number, reps: number): number {
  if (reps <= 0) return weight;
  return weight * (1 + reps / 30);
}

// Best estimated 1RM across completed, weighted sets in a single exercise log.
export function best1RMForExercise(exerciseLog: ExerciseLog): number | null {
  let best: number | null = null;
  for (const set of exerciseLog.sets) {
    if (!set.completed || set.weight <= 0) continue;
    const est = estimate1RM(set.weight, set.reps);
    if (best === null || est > best) best = est;
  }
  return best;
}

export type OneRepMaxPoint = { date: string; value: number };

// Time series of best estimated 1RM for an exercise, oldest first.
export function oneRepMaxSeries(history: WorkoutLog[], exerciseId: string): OneRepMaxPoint[] {
  const points: OneRepMaxPoint[] = [];
  for (const log of history) {
    const exLog = log.exercises.find((e) => e.exerciseId === exerciseId);
    if (!exLog) continue;
    const best = best1RMForExercise(exLog);
    if (best === null) continue;
    points.push({ date: log.date, value: best });
  }
  return points.sort((a, b) => a.date.localeCompare(b.date));
}
