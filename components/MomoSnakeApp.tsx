'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { changeDirection, createInitialState, pauseGame, recommendSafeDirection, resetGame, startGame, tickGame } from '@/game/snakeEngine';
import type { Direction, SnakeState } from '@/game/types';
import { loadHighScore, saveHighScore } from '@/lib/storage';

const directionKeys: Record<string, Direction> = {
  ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right'
};

function coordinateKey(x: number, y: number) { return `${x}:${y}`; }
function statusCopy(status: SnakeState['status']) {
  return { idle: 'Awaiting run', running: 'Trajectory live', paused: 'Paused', gameover: 'Collision detected' }[status];
}

export function MomoSnakeApp() {
  const [state, setState] = useState(() => createInitialState());

  useEffect(() => { setState(createInitialState(loadHighScore())); }, []);
  useEffect(() => { saveHighScore(state.highScore); }, [state.highScore]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const direction = directionKeys[event.key];
      if (!direction) return;
      event.preventDefault();
      setState((current) => changeDirection(current, direction));
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (state.status !== 'running') return;
    const timer = window.setInterval(() => setState((current) => tickGame(current)), state.speedMs);
    return () => window.clearInterval(timer);
  }, [state.status, state.speedMs]);

  const snakeCells = useMemo(() => new Set(state.snake.map((point) => coordinateKey(point.x, point.y))), [state.snake]);
  const headKey = coordinateKey(state.snake[0].x, state.snake[0].y);
  const foodKey = coordinateKey(state.food.x, state.food.y);
  const recommendedMove = recommendSafeDirection(state);
  const handleStartPause = useCallback(() => setState((current) => current.status === 'running' ? pauseGame(current) : startGame(current)), []);
  const handleReset = useCallback(() => setState((current) => resetGame(current.highScore)), []);

  return (
    <main className="min-h-screen overflow-hidden px-5 py-6 text-slate-50 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur md:flex-row md:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              Agent-native game lab
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.08em] text-white sm:text-7xl">Momo Snake</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">A GitHub-native MVP: control plane owns specs and review gates, agent plane ships a polished Snake simulation.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm md:min-w-[360px]">
            <Metric label="Score" value={state.score} />
            <Metric label="Best" value={state.highScore} />
            <Metric label="Speed" value={`${Math.round(1000 / state.speedMs)} t/s`} />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-glow backdrop-blur sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Simulation surface</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">Trajectory board</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                <span className={state.status === 'running' ? 'h-2 w-2 rounded-full bg-emerald-300' : 'h-2 w-2 rounded-full bg-slate-500'} />
                {statusCopy(state.status)}
              </div>
            </div>

            <div data-testid="game-board" className="grid aspect-square w-full rounded-[1.5rem] border border-emerald-300/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-2 shadow-inner" style={{ gridTemplateColumns: `repeat(${state.boardSize}, minmax(0, 1fr))` }}>
              {Array.from({ length: state.boardSize * state.boardSize }).map((_, index) => {
                const x = index % state.boardSize;
                const y = Math.floor(index / state.boardSize);
                const key = coordinateKey(x, y);
                const isHead = key === headKey;
                const isSnake = snakeCells.has(key);
                const isFood = key === foodKey;
                return <div key={key} className="p-[2px]"><div className={[
                  'h-full w-full rounded-[5px] border transition-all duration-100',
                  isHead ? 'border-emerald-100 bg-emerald-300 shadow-[0_0_22px_rgba(110,231,183,0.72)]' : '',
                  isSnake && !isHead ? 'border-emerald-300/35 bg-emerald-400/55' : '',
                  isFood ? 'border-fuchsia-200 bg-fuchsia-300 shadow-[0_0_20px_rgba(240,171,252,0.7)]' : '',
                  !isSnake && !isFood ? 'border-white/[0.025] bg-white/[0.025]' : ''
                ].join(' ')} /></div>;
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button data-testid="start-button" onClick={handleStartPause} className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_34px_rgba(110,231,183,0.32)] transition hover:bg-emerald-200">{state.status === 'running' ? 'Pause run' : 'Start run'}</button>
              <button onClick={handleReset} className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.08]">Reset simulation</button>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-slate-400">Controls: WASD / arrow keys</div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <Panel title="Control plane" eyebrow="GitHub-native"><ul className="space-y-3 text-sm text-slate-300"><li className="flex gap-3"><span className="text-emerald-300">01</span><span>PRD, taste guide, specs, review gates.</span></li><li className="flex gap-3"><span className="text-emerald-300">02</span><span>Issues define scoped agent tasks.</span></li><li className="flex gap-3"><span className="text-emerald-300">03</span><span>Actions validate build, tests, and Pages deploy.</span></li></ul></Panel>
            <Panel title="Agent plane" eyebrow="Local heuristic only"><div className="rounded-2xl border border-indigo-300/15 bg-indigo-300/10 p-4"><div className="text-xs uppercase tracking-[0.2em] text-indigo-200">Agent assist</div><div className="mt-2 text-3xl font-semibold capitalize text-white">{recommendedMove}</div><p className="mt-2 text-sm leading-6 text-slate-400">A safe-move heuristic hints the next stable trajectory. No API key, no backend.</p></div></Panel>
            <Panel title="Run log" eyebrow="Telemetry"><div data-testid="run-log" className="space-y-2 font-mono text-sm text-slate-300">{state.log.map((line, index) => <div key={`${line}-${index}`} className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">{line}</div>)}</div></Panel>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</div><div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{value}</div></div>;
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur"><div className="mb-4"><p className="text-xs uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p><h3 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">{title}</h3></div>{children}</section>;
}
