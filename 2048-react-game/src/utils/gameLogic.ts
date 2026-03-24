import type { Board, Direction } from '../types/game';

const BOARD_SIZE = 4;

export const createEmptyBoard = (): Board => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
};

export const addRandomTile = (board: Board): Board => {
  const emptyCells: Array<[number, number]> = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }

  if (emptyCells.length === 0) return board;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;

  return newBoard;
};

const rotate90Clockwise = (board: Board): Board => {
  const n = BOARD_SIZE;
  const rotated = createEmptyBoard();

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      rotated[col][n - 1 - row] = board[row][col];
    }
  }

  return rotated;
};

const moveLeft = (board: Board): { board: Board; score: number; moved: boolean } => {
  let score = 0;
  let moved = false;
  const newBoard = createEmptyBoard();

  for (let row = 0; row < BOARD_SIZE; row++) {
    let position = 0;
    let merged = false;

    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = board[row][col];

      if (value === 0) continue;

      if (position > 0 && newBoard[row][position - 1] === value && !merged) {
        newBoard[row][position - 1] = value * 2;
        score += value * 2;
        merged = true;
        moved = true;
      } else {
        newBoard[row][position] = value;
        merged = false;
        if (position !== col) {
          moved = true;
        }
        position++;
      }
    }
  }

  return { board: newBoard, score, moved };
};

export const move = (board: Board, direction: Direction): { board: Board; score: number; moved: boolean } => {
  let rotations = 0;

  switch (direction) {
    case 'left':
      rotations = 0;
      break;
    case 'down':
      rotations = 1;
      break;
    case 'right':
      rotations = 2;
      break;
    case 'up':
      rotations = 3;
      break;
  }

  let currentBoard = board;
  for (let i = 0; i < rotations; i++) {
    currentBoard = rotate90Clockwise(currentBoard);
  }

  const result = moveLeft(currentBoard);

  for (let i = 0; i < (4 - rotations) % 4; i++) {
    result.board = rotate90Clockwise(result.board);
  }

  return result;
};

export const canMove = (board: Board): boolean => {
  // Check for empty cells
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 0) return true;
    }
  }

  // Check for possible merges
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = board[row][col];

      if (col < BOARD_SIZE - 1 && board[row][col + 1] === value) return true;
      if (row < BOARD_SIZE - 1 && board[row + 1][col] === value) return true;
    }
  }

  return false;
};

export const hasWon = (board: Board): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 2048) return true;
    }
  }
  return false;
};

export const initializeGame = (): Board => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};
