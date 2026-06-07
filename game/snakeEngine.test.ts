import { describe, expect, it } from 'vitest';
import { changeDirection, createInitialState, spawnFood, tickGame } from './snakeEngine';

function runningState() {
  return { ...createInitialState(), status: 'running' as const };
}

describe('snake engine', () => {
  it('creates a centered initial state', () => {
    const state = createInitialState(30);
    expect(state.snake).toHaveLength(3);
    expect(state.direction).toBe('right');
    expect(state.highScore).toBe(30);
  });

  it('moves the snake forward', () => {
    const state = runningState();
    const next = tickGame(state);
    expect(next.snake[0]).toEqual({ x: state.snake[0].x + 1, y: state.snake[0].y });
  });

  it('prevents direct reversal', () => {
    const state = runningState();
    const next = changeDirection(state, 'left');
    expect(next.nextDirection).toBe('right');
  });

  it('grows and scores when eating food', () => {
    const state = runningState();
    const next = tickGame({ ...state, food: { x: state.snake[0].x + 1, y: state.snake[0].y } });
    expect(next.score).toBe(10);
    expect(next.snake).toHaveLength(4);
  });

  it('ends the game when hitting wall', () => {
    const next = tickGame({ ...runningState(), snake: [{ x: 17, y: 9 }, { x: 16, y: 9 }], direction: 'right', nextDirection: 'right' });
    expect(next.status).toBe('gameover');
  });

  it('ends the game when hitting itself', () => {
    const state = tickGame({
      ...runningState(),
      snake: [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }],
      direction: 'right',
      nextDirection: 'down',
      food: { x: 12, y: 12 }
    });
    expect(state.status).toBe('gameover');
  });

  it('spawns food away from snake', () => {
    const food = spawnFood(4, [{ x: 0, y: 0 }, { x: 1, y: 0 }], 1);
    expect([{ x: 0, y: 0 }, { x: 1, y: 0 }]).not.toContainEqual(food);
  });
});
