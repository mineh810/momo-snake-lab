import type { Direction, Point, SnakeState } from './types';

export const BOARD_SIZE = 18;
export const INITIAL_SPEED_MS = 128;
const MAX_LOGS = 7;

const vectors: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const opposites: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

export function samePoint(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

export function appendLog(state: SnakeState, message: string): SnakeState {
  return { ...state, log: [`> ${message}`, ...state.log].slice(0, MAX_LOGS) };
}

export function createInitialState(highScore = 0): SnakeState {
  const mid = Math.floor(BOARD_SIZE / 2);
  return {
    boardSize: BOARD_SIZE,
    snake: [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid }
    ],
    food: { x: mid + 4, y: mid },
    direction: 'right',
    nextDirection: 'right',
    status: 'idle',
    score: 0,
    highScore,
    tick: 0,
    speedMs: INITIAL_SPEED_MS,
    log: ['> simulation initialized', '> food spawned', '> awaiting run command']
  };
}

export function startGame(state: SnakeState): SnakeState {
  if (state.status === 'gameover') return appendLog(createInitialState(state.highScore), 'new run initialized');
  return appendLog({ ...state, status: 'running' }, 'run started');
}

export function pauseGame(state: SnakeState): SnakeState {
  if (state.status !== 'running') return state;
  return appendLog({ ...state, status: 'paused' }, 'run paused');
}

export function resetGame(highScore = 0): SnakeState {
  return appendLog(createInitialState(highScore), 'simulation reset');
}

export function changeDirection(state: SnakeState, nextDirection: Direction): SnakeState {
  if (opposites[state.direction] === nextDirection) return state;
  return { ...state, nextDirection };
}

export function spawnFood(boardSize: number, snake: Point[], seedTick = 0): Point {
  const occupied = new Set(snake.map((point) => `${point.x}:${point.y}`));
  const total = boardSize * boardSize;
  const start = (snake[0].x * 31 + snake[0].y * 17 + seedTick * 13 + snake.length * 7) % total;

  for (let offset = 0; offset < total; offset += 1) {
    const index = (start + offset) % total;
    const candidate = { x: index % boardSize, y: Math.floor(index / boardSize) };
    if (!occupied.has(`${candidate.x}:${candidate.y}`)) return candidate;
  }

  return { x: 0, y: 0 };
}

export function isOutOfBounds(point: Point, boardSize: number) {
  return point.x < 0 || point.y < 0 || point.x >= boardSize || point.y >= boardSize;
}

export function tickGame(state: SnakeState): SnakeState {
  if (state.status !== 'running') return state;

  const direction = state.nextDirection;
  const vector = vectors[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };
  const willEat = samePoint(nextHead, state.food);
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  const hitSelf = bodyToCheck.some((point) => samePoint(point, nextHead));
  const hitWall = isOutOfBounds(nextHead, state.boardSize);

  if (hitWall || hitSelf) {
    return appendLog(
      {
        ...state,
        direction,
        status: 'gameover',
        highScore: Math.max(state.highScore, state.score)
      },
      hitWall ? 'collision detected: boundary' : 'collision detected: self'
    );
  }

  const nextSnake = [nextHead, ...state.snake];
  const trimmedSnake = willEat ? nextSnake : nextSnake.slice(0, -1);
  const nextScore = state.score + (willEat ? 10 : 0);
  const nextState: SnakeState = {
    ...state,
    snake: trimmedSnake,
    food: willEat ? spawnFood(state.boardSize, trimmedSnake, state.tick + 1) : state.food,
    direction,
    score: nextScore,
    highScore: Math.max(state.highScore, nextScore),
    tick: state.tick + 1,
    speedMs: Math.max(72, INITIAL_SPEED_MS - Math.floor(nextScore / 40) * 6)
  };

  return willEat ? appendLog(nextState, 'momo particle captured') : nextState;
}

export function recommendSafeDirection(state: SnakeState): Direction {
  const ordered: Direction[] = [state.nextDirection, 'up', 'right', 'down', 'left'];
  const unique = [...new Set(ordered)].filter((dir) => opposites[state.direction] !== dir);

  for (const direction of unique) {
    const vector = vectors[direction];
    const nextHead = { x: state.snake[0].x + vector.x, y: state.snake[0].y + vector.y };
    const body = state.snake.slice(0, -1);
    if (!isOutOfBounds(nextHead, state.boardSize) && !body.some((point) => samePoint(point, nextHead))) {
      return direction;
    }
  }

  return state.nextDirection;
}
