export type Tile = number;
export type Board = Tile[][];

export interface GameState {
  board: Board;
  score: number;
  gameOver: boolean;
  won: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
