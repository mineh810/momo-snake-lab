const KEY = 'momo-snake-high-score-v1';

export function loadHighScore(storage: Storage | undefined = typeof window !== 'undefined' ? window.localStorage : undefined): number {
  if (!storage) return 0;
  const raw = storage.getItem(KEY);
  if (!raw) return 0;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function saveHighScore(score: number, storage: Storage | undefined = typeof window !== 'undefined' ? window.localStorage : undefined): void {
  if (!storage || !Number.isFinite(score) || score < 0) return;
  storage.setItem(KEY, String(Math.floor(score)));
}
