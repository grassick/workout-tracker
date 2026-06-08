import { useState } from 'react';
import { Dumbbell, LogIn } from 'lucide-react';

export function LoginScreen({ onSignIn }: { onSignIn: () => Promise<unknown> }) {
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await onSignIn();
    } catch {
      setError('Sign-in was cancelled or failed. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">My Gym Tracker</h1>
          <p className="text-slate-400">Sign in to sync your workouts and track your strength over time.</p>
        </div>

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogIn className="w-5 h-5" />
          {signingIn ? 'Signing in…' : 'Sign in with Google'}
        </button>

        {error && <p className="text-sm text-rose-400">{error}</p>}
      </div>
    </div>
  );
}
