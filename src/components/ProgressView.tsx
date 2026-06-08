import { ArrowLeft, TrendingUp } from 'lucide-react';
import { PROGRAM } from '../data/program';
import { WorkoutLog } from '../hooks/useWorkoutHistory';
import { oneRepMaxSeries } from '../lib/oneRepMax';
import { Sparkline } from './Sparkline';

// Map of exerciseId -> display name for all non-cardio exercises in the program.
const STRENGTH_EXERCISES = new Map<string, string>();
for (const day of PROGRAM) {
  for (const ex of day.exercises) {
    if (ex.category !== 'cardio') STRENGTH_EXERCISES.set(ex.id, ex.name);
  }
}

export function ProgressView({ history, onBack }: { history: WorkoutLog[]; onBack: () => void }) {
  // Exercises that actually appear in history, deduped, with a 1RM series.
  const seen = new Set<string>();
  const cards: { id: string; name: string; series: ReturnType<typeof oneRepMaxSeries> }[] = [];
  for (const log of history) {
    for (const exLog of log.exercises) {
      if (seen.has(exLog.exerciseId)) continue;
      const name = STRENGTH_EXERCISES.get(exLog.exerciseId);
      if (!name) continue; // cardio or unknown
      const series = oneRepMaxSeries(history, exLog.exerciseId);
      if (series.length === 0) continue; // no completed weighted sets
      seen.add(exLog.exerciseId);
      cards.push({ id: exLog.exerciseId, name, series });
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 pb-24">
      <header className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-400" />
          Strength Progress
        </h1>
      </header>

      {cards.length === 0 ? (
        <div className="p-6 bg-slate-900 rounded-2xl text-center text-slate-500 text-sm border border-slate-800">
          Log a few weighted workouts and your estimated 1-rep-max trends will show up here.
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map(({ id, name, series }) => {
            const latest = series[series.length - 1].value;
            const first = series[0].value;
            const delta = latest - first;
            return (
              <div key={id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-end justify-between">
                  <h3 className="font-semibold text-slate-100">{name}</h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-400">{Math.round(latest)}<span className="text-sm font-medium text-slate-500"> lb</span></p>
                    <p className="text-xs text-slate-500">est. 1RM</p>
                  </div>
                </div>
                <Sparkline points={series} />
                {series.length > 1 && (
                  <p className={`text-xs font-medium ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {delta >= 0 ? '▲' : '▼'} {Math.abs(Math.round(delta))} lb since {new Date(series[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
