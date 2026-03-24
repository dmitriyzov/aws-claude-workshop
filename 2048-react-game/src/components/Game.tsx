import { useGame } from '../hooks/useGame';
import { Board } from './Board';

export const Game = () => {
  const { gameState, resetGame } = useGame();

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">2048</h1>
        <div className="game-info">
          <div className="score-container">
            <div className="score-label">Score</div>
            <div className="score-value">{gameState.score}</div>
          </div>
          <button className="new-game-button" onClick={resetGame}>
            New Game
          </button>
        </div>
      </div>

      <div className="game-board-container">
        <Board board={gameState.board} />

        {gameState.gameOver && (
          <div className="game-overlay">
            <div className="game-message">
              <h2>{gameState.won ? 'You Win!' : 'Game Over!'}</h2>
              <button className="try-again-button" onClick={resetGame}>
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="game-instructions">
        <p>Use arrow keys to move tiles</p>
        <p>Combine tiles with the same number to create larger numbers</p>
        <p>Reach 2048 to win!</p>
      </div>
    </div>
  );
};
