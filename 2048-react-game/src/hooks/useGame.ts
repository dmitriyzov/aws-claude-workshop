import { useState, useEffect, useCallback } from 'react';
import type { GameState, Direction } from '../types/game';
import { initializeGame, move, addRandomTile, canMove, hasWon } from '../utils/gameLogic';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: initializeGame(),
    score: 0,
    gameOver: false,
    won: false,
  }));

  const resetGame = useCallback(() => {
    setGameState({
      board: initializeGame(),
      score: 0,
      gameOver: false,
      won: false,
    });
  }, []);

  const handleMove = useCallback((direction: Direction) => {
    setGameState((prevState) => {
      if (prevState.gameOver) return prevState;

      const result = move(prevState.board, direction);

      if (!result.moved) return prevState;

      const newBoard = addRandomTile(result.board);
      const newScore = prevState.score + result.score;
      const won = !prevState.won && hasWon(newBoard);
      const gameOver = !canMove(newBoard);

      return {
        board: newBoard,
        score: newScore,
        gameOver,
        won,
      };
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const direction = keyMap[event.key];
      if (direction) {
        event.preventDefault();
        handleMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  return {
    gameState,
    resetGame,
    handleMove,
  };
};
