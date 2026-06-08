import { OneRepMaxPoint } from '../lib/oneRepMax';

export function Sparkline({
  points,
  width = 320,
  height = 64,
}: {
  points: OneRepMaxPoint[];
  width?: number;
  height?: number;
}) {
  if (points.length === 0) {
    return <p className="text-sm text-slate-500">No data yet.</p>;
  }

  const pad = 6;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const x = (i: number) =>
    points.length === 1 ? width / 2 : pad + (i / (points.length - 1)) * (width - pad * 2);
  const y = (v: number) => height - pad - ((v - min) / range) * (height - pad * 2);

  const coords = points.map((p, i) => ({ cx: x(i), cy: y(p.value) }));
  const polyPoints = coords.map((c) => `${c.cx},${c.cy}`).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {points.length > 1 && (
        <polyline
          points={polyPoints}
          fill="none"
          stroke="#818cf8"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {coords.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={i === coords.length - 1 ? 4 : 2.5} fill="#818cf8" />
      ))}
    </svg>
  );
}
