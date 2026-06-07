export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'idle' | 'running' | 'paused' | 'gameover';

export interface Point {
  x: number;
  y: number;
}

export interface SnakeState {
  boardSize: number;
  snake: Point[];
  food: Point;
  direction: Direction;
  nextDirection: Direction;
  status: GameStatus;
  score: number;
  highScore: number;
  tick: number;
  speedMs: number;
  log: string[];
}
