import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROGRAM, STRETCHES, WorkoutDay } from './data/program';
import { useWorkoutHistory, WorkoutLog, ExerciseLog } from './hooks/useWorkoutHistory';
import { Play, ChevronRight, Info, CheckCircle, RotateCcw, History, ArrowLeft, Plus, Minus, Dumbbell, Timer as TimerIcon, X } from 'lucide-react';

const SESSION_KEY = 'active_session';

type SetLog = { weight: number; reps: number; completed: boolean };

type SessionState = {
  dayId: string;
  currentExerciseIndex: number;
  logs: Record<string, SetLog[]>;
};

// --- Components ---

function Timer({ initialSeconds = 60, type = 'rest' }: { initialSeconds?: number, type?: 'rest' | 'interval' }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'rest'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
    setMode('work');
  };

  const setIntervalMode = (newMode: 'work' | 'rest') => {
    setIsActive(false);
    setMode(newMode);
    setSeconds(30);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 text-white rounded-xl p-4 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
            <TimerIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-mono font-bold leading-none tracking-tight">{formatTime(seconds)}</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              {type === 'interval' ? (mode === 'work' ? '🔥 High Intensity' : '😌 Recovery') : 'Rest Timer'}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggle}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 ${
              isActive
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/40'
            }`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={reset} className="p-2 text-slate-500 hover:text-white transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {type === 'interval' && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
          <button
            onClick={() => setIntervalMode('work')}
            className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'work' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            30s Work
          </button>
          <button
            onClick={() => setIntervalMode('rest')}
            className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'rest' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            30s Rest
          </button>
        </div>
      )}
    </div>
  );
}

function StretchesModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-100">Stretching Routine</h3>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 space-y-6">
          <section>
            <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">Gym (Between Sets)</h4>
            <div className="space-y-3">
              {STRETCHES.map((s, i) => (
                <div key={i} className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-100">{s.name}</span>
                    <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700 text-slate-400">{s.duration}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">When: {s.when}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">Home (Daily/Off-Days)</h4>
            <div className="space-y-3">
              {[
                { name: 'Lying hamstring stretch', duration: '60s/side', target: 'Hamstrings' },
                { name: 'Wall calf stretch', duration: '60s/side', target: 'Calves' },
                { name: 'Half-kneeling hip flexor', duration: '60s/side', target: 'Hip flexors' },
                { name: 'Chin tucks', duration: '10-15 reps', target: 'Posture' },
                { name: 'Doorway chest stretch', duration: '60s/side', target: 'Pecs' },
                { name: 'Cat-cow', duration: '10 slow reps', target: 'Spine' },
              ].map((s, i) => (
                <div key={i} className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-100">{s.name}</span>
                    <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700 text-slate-400">{s.duration}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Target: {s.target}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

function Home({
  onStartWorkout,
  history
}: {
  onStartWorkout: (day: WorkoutDay) => void,
  history: WorkoutLog[]
}) {
  const [showStretches, setShowStretches] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! Let's get moving.";
    if (hour < 18) return "Good afternoon! Time to crush it.";
    return "Good evening! Finish the day strong.";
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">My Gym Tracker</h1>
        <p className="text-slate-400">{getGreeting()}</p>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl text-white shadow-lg mt-4">
          <p className="font-medium text-sm opacity-90">"Consistency is the key to progress. Even a small step forward is still a step."</p>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-indigo-400" />
          Start Workout
        </h2>
        <div className="grid gap-3">
          {PROGRAM.map((day) => (
            <button
              key={day.id}
              onClick={() => onStartWorkout(day)}
              className="group relative flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-700 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-left"
            >
              <div>
                <h3 className="font-semibold text-slate-100">{day.title}</h3>
                <p className="text-sm text-slate-400">{day.focus}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-500" />
          Recent History
        </h2>
        {history.length === 0 ? (
          <div className="p-6 bg-slate-900 rounded-2xl text-center text-slate-500 text-sm border border-slate-800">
            No workouts logged yet. Time to start!
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 3).map((log) => {
              const program = PROGRAM.find(p => p.id === log.programId);
              return (
                <div key={log.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-100">{program?.title || 'Unknown Workout'}</p>
                    <p className="text-xs text-slate-500">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <button
        onClick={() => setShowStretches(true)}
        className="w-full py-3 bg-slate-900 border border-slate-700 text-slate-300 font-medium rounded-xl shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
      >
        <Info className="w-5 h-5" />
        View Stretching Routine
      </button>

      <AnimatePresence>
        {showStretches && <StretchesModal onClose={() => setShowStretches(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ActiveSession({
  day,
  initialSession,
  onFinish,
  onCancel,
  getLastLog,
  getExerciseDefaults,
  saveExerciseDefault,
}: {
  day: WorkoutDay;
  initialSession: SessionState | null;
  onFinish: (log: WorkoutLog) => void;
  onCancel: () => void;
  getLastLog: (exerciseId: string) => ExerciseLog | null;
  getExerciseDefaults: (exerciseId: string) => { weight: number; reps: number }[] | null;
  saveExerciseDefault: (exerciseId: string, setIndex: number, weight: number, reps: number) => void;
}) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(
    initialSession?.currentExerciseIndex ?? 0
  );
  const [logs, setLogs] = useState<Record<string, SetLog[]>>(
    initialSession?.logs ?? {}
  );

  const currentExercise = day.exercises[currentExerciseIndex];

  // Persist entire session state to localStorage on every change
  useEffect(() => {
    const session: SessionState = { dayId: day.id, currentExerciseIndex, logs };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [day.id, currentExerciseIndex, logs]);

  // Initialize logs for a new exercise, preferring saved defaults then history
  useEffect(() => {
    if (!logs[currentExercise.id]) {
      const defaults = getExerciseDefaults(currentExercise.id);
      const lastLog = getLastLog(currentExercise.id);
      const fallbackWeight = currentExercise.name.includes('DB') ? 20 : 40;

      setLogs(prev => ({
        ...prev,
        [currentExercise.id]: Array(currentExercise.sets).fill(0).map((_, i) => ({
          weight: defaults?.[i]?.weight ?? lastLog?.sets?.[i]?.weight ?? fallbackWeight,
          reps: defaults?.[i]?.reps ?? lastLog?.sets?.[i]?.reps ?? (parseInt(currentExercise.reps.split('-')[0]) || 10),
          completed: false,
        })),
      }));
    }
  }, [currentExercise, getExerciseDefaults, getLastLog, logs]);

  const updateSet = (setIndex: number, field: 'weight' | 'reps', delta: number) => {
    setLogs(prev => {
      const exLogs = [...(prev[currentExercise.id] || [])];
      if (!exLogs[setIndex]) return prev;
      const updatedSet = { ...exLogs[setIndex], [field]: Math.max(0, exLogs[setIndex][field] + delta) };
      exLogs[setIndex] = updatedSet;
      // Persist per-set defaults so future sessions pre-fill from these values
      saveExerciseDefault(currentExercise.id, setIndex, updatedSet.weight, updatedSet.reps);
      return { ...prev, [currentExercise.id]: exLogs };
    });
  };

  const toggleComplete = (setIndex: number) => {
    setLogs(prev => {
      const exLogs = [...(prev[currentExercise.id] || [])];
      exLogs[setIndex] = { ...exLogs[setIndex], completed: !exLogs[setIndex].completed };
      return { ...prev, [currentExercise.id]: exLogs };
    });
  };

  const handleNext = () => {
    if (currentExerciseIndex < day.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      const workoutLog: WorkoutLog = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        programId: day.id,
        exercises: Object.entries(logs).map(([exId, sets]) => ({
          exerciseId: exId,
          sets,
        })),
      };
      onFinish(workoutLog);
    }
  };

  const progress = (currentExerciseIndex / day.exercises.length) * 100;
  const currentLog = logs[currentExercise.id];

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 -ml-2 text-slate-500 hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 mx-4">
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="text-xs font-mono font-medium text-slate-500">
          {currentExerciseIndex + 1}/{day.exercises.length}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32 max-w-md mx-auto w-full">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold text-slate-100 leading-tight">{currentExercise.name}</h2>
            <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded-md uppercase tracking-wide">
              {currentExercise.category}
            </span>
          </div>

          {/* Tips Card */}
          <div className="bg-slate-800 rounded-xl p-4 border border-indigo-500/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-slate-200 font-medium text-sm">
                  Target: <span className="font-bold text-indigo-400">{currentExercise.reps} reps</span>
                </p>
                {currentExercise.notes && (
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {currentExercise.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Timer for Cardio or Rest */}
          <Timer
            initialSeconds={currentExercise.category === 'cardio' ? 30 : 60}
            type={currentExercise.category === 'cardio' ? 'interval' : 'rest'}
          />

          {/* History Context */}
          {getLastLog(currentExercise.id) && (
            <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
              <History className="w-3 h-3" />
              Last time: {getLastLog(currentExercise.id)?.sets.map(s => `${s.weight}lb`).join(', ')}
            </div>
          )}
        </div>

        {/* Sets Tracker */}
        <div className="space-y-3">
          {currentLog?.map((set, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-2xl border transition-all ${
                set.completed
                  ? 'bg-emerald-950 border-emerald-800'
                  : 'bg-slate-900 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-500">SET {idx + 1}</span>
                <button
                  onClick={() => toggleComplete(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    set.completed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {set.completed ? 'Completed' : 'Mark Done'}
                  {set.completed && <CheckCircle className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Weight Control */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Lbs</label>
                  <div className="flex items-center justify-between bg-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => updateSet(idx, 'weight', -5)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-slate-300 active:scale-95 transition-transform hover:bg-slate-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono font-semibold text-lg text-slate-100">{set.weight}</span>
                    <button
                      onClick={() => updateSet(idx, 'weight', 5)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-slate-300 active:scale-95 transition-transform hover:bg-slate-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reps Control */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Reps</label>
                  <div className="flex items-center justify-between bg-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => updateSet(idx, 'reps', -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-slate-300 active:scale-95 transition-transform hover:bg-slate-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono font-semibold text-lg text-slate-100">{set.reps}</span>
                    <button
                      onClick={() => updateSet(idx, 'reps', 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-slate-300 active:scale-95 transition-transform hover:bg-slate-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2"
          >
            {currentExerciseIndex === day.exercises.length - 1 ? 'Finish Workout' : 'Next Exercise'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { history, saveWorkout, getLastLogForExercise, getExerciseDefaults, saveExerciseDefault } = useWorkoutHistory();
  const [activeDay, setActiveDay] = useState<WorkoutDay | null>(null);
  const [savedSession, setSavedSession] = useState<SessionState | null>(null);

  // On mount, restore any in-progress session
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const session: SessionState = JSON.parse(stored);
      const day = PROGRAM.find(d => d.id === session.dayId);
      if (day) {
        setActiveDay(day);
        setSavedSession(session);
      }
    }
  }, []);

  const handleStart = (day: WorkoutDay) => {
    setSavedSession(null);
    setActiveDay(day);
  };

  const handleFinish = (log: WorkoutLog) => {
    localStorage.removeItem(SESSION_KEY);
    saveWorkout(log);
    setActiveDay(null);
  };

  const handleCancel = () => {
    localStorage.removeItem(SESSION_KEY);
    setActiveDay(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {activeDay ? (
          <motion.div
            key="session"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <ActiveSession
              day={activeDay}
              initialSession={savedSession}
              onFinish={handleFinish}
              onCancel={handleCancel}
              getLastLog={getLastLogForExercise}
              getExerciseDefaults={getExerciseDefaults}
              saveExerciseDefault={saveExerciseDefault}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Home onStartWorkout={handleStart} history={history} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
