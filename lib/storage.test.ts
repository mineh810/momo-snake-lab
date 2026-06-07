import { describe, expect, it } from 'vitest';
import { loadHighScore, saveHighScore } from './storage';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(key: string) { return this.data.get(key) ?? null; }
  key(index: number) { return Array.from(this.data.keys())[index] ?? null; }
  removeItem(key: string) { this.data.delete(key); }
  setItem(key: string, value: string) { this.data.set(key, value); }
}

describe('high score storage', () => {
  it('loads zero for missing or invalid values', () => {
    const storage = new MemoryStorage();
    expect(loadHighScore(storage)).toBe(0);
    storage.setItem('momo-snake-high-score-v1', 'bad');
    expect(loadHighScore(storage)).toBe(0);
  });

  it('saves valid scores', () => {
    const storage = new MemoryStorage();
    saveHighScore(42, storage);
    expect(loadHighScore(storage)).toBe(42);
  });
});
