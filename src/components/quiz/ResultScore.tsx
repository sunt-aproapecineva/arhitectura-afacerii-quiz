import { useEffect, useRef, useState } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';
import { Check } from 'lucide-react';
import type { QuizState } from '@/lib/quiz/types';
import {
  getScore, computeAxes, computeJourneyStage, B_JOURNEY,
} from '@/lib/quiz/score';
import { TiltCard } from '@/components/ui/tilt-card';
import { ShimmerText } from '@/components/ui/shimmer-text';

// Numărul care „urcă" de la 0 la value; anunță momentul în care se așază.
function useCountUp(value: number, duration = 1200, onDone?: () => void): number {
  const [n, setN] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
      else doneRef.current?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return n;
}

function Gauge({ value, onSettled }: { value: number; onSettled?: () => void }) {
  const [celebrate, setCelebrate] = useState(false);
  const display = useCountUp(value, 1200, () => { setCelebrate(true); onSettled?.(); });
  const size = 196, stroke = 14, r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [offset, setOffset] = useState(c);
  useEffect(() => {
    const t = setTimeout(() => setOffset(c - (value / 100) * c), 120);
    return () => clearTimeout(t);
  }, [c, value]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Celebrare: o singură expirație de lumină când numărul se așază. */}
      <span className="pulse-glow" data-go={celebrate} />
      <span className="pulse-ring" data-go={celebrate} />
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--viridian-dark)" />
            <stop offset="55%" stopColor="var(--viridian-main)" />
            <stop offset="100%" stopColor="var(--viridian-light)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#gaugeGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(.2,.7,.3,1)', filter: 'drop-shadow(0 0 8px rgba(10,150,120,0.55))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="score-nod font-archivo text-5xl font-bold text-white leading-none tabular-nums" data-go={celebrate}>{display}</span>
        <span className="font-archivo text-xs tracking-[0.3em] text-[var(--viridian-light)]/60 mt-1">/ 100</span>
      </div>
    </div>
  );
}

function AxisRadar({ state }: { state: QuizState }) {
  const data = computeAxes(state).map(d => ({ label: d.label, value: Math.max(12, d.value) }));
  return (
    <div className="w-full h-[260px] -mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="rgba(255,255,255,0.10)" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: 'rgba(224,244,240,0.7)', fontSize: 11, fontFamily: 'Archivo Narrow' }}
          />
          <Radar
            dataKey="value"
            stroke="var(--viridian-main)"
            strokeWidth={2}
            fill="var(--viridian-main)"
            fillOpacity={0.28}
            isAnimationActive
            animationDuration={1100}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Journey({ state }: { state: QuizState }) {
  const current = computeJourneyStage(state);
  return (
    <div className="w-full px-1 pt-2">
      <div className="flex items-center justify-between">
        {B_JOURNEY.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={label} className="flex flex-col items-center gap-2 flex-1 relative">
              {i > 0 && (
                <span
                  className="absolute top-[11px] right-1/2 w-full h-[2px]"
                  style={{ background: i <= current ? 'var(--viridian-main)' : 'rgba(255,255,255,0.12)' }}
                />
              )}
              <span
                className={`relative z-10 w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold transition-all ${
                  active
                    ? 'bg-[var(--viridian-main)] text-white shadow-[0_0_14px_var(--viridian-main)]'
                    : done
                    ? 'bg-[var(--viridian-dark)] text-white'
                    : 'bg-white/8 text-white/40 border border-white/10'
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className={`text-[10px] text-center leading-tight font-archivo uppercase tracking-wide ${active ? 'text-[var(--viridian-light)]' : 'text-white/40'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ResultScore({ state }: { state: QuizState }) {
  const score = getScore(state);
  // Verdictul apare DUPĂ ce numărul se așază — ordinea citirii: scor → puls → verdict → explicație.
  const [settled, setSettled] = useState(false);

  return (
    <TiltCard
      tiltLimit={5}
      className="glass p-6 flex flex-col items-center text-center rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      <ShimmerText className="font-archivo uppercase tracking-[0.25em] text-[11px] mb-5">
        {score.title}
      </ShimmerText>

      <Gauge value={score.value} onSettled={() => setSettled(true)} />

      <div
        className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--viridian-main)]/30 bg-[var(--viridian-main)]/10 transition-[opacity,transform] duration-300"
        style={{ opacity: settled ? 1 : 0, transform: settled ? 'none' : 'translateY(6px)', transitionDelay: '120ms', transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--viridian-main)] shadow-[0_0_8px_var(--viridian-main)]" />
        <span className="font-archivo uppercase tracking-wider text-sm text-white">{score.band}</span>
      </div>

      <p
        className="text-sm text-[var(--viridian-ultra)]/75 leading-relaxed mt-4 max-w-sm font-arimo transition-opacity duration-300"
        style={{ opacity: settled ? 1 : 0, transitionDelay: '280ms' }}
      >
        {score.caption}
      </p>

      <div className="w-full mt-6 pt-5 border-t border-white/8">
        {state.branch === 'B' ? <Journey state={state} /> : <AxisRadar state={state} />}
        <p className="text-[11px] text-white/40 mt-3 font-arimo">
          {state.branch === 'B'
            ? 'Unde te afli pe drumul spre prima ta afacere'
            : 'Unde apasă cel mai tare — pe cele 6 axe ale unei afaceri sănătoase'}
        </p>
      </div>
    </TiltCard>
  );
}
