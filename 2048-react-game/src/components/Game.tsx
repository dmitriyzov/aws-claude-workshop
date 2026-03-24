import { useState, useEffect, useRef } from 'react';
import { useGame } from '../hooks/useGame';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Board } from './Board';
import { LeaderboardPopup } from './LeaderboardPopup';

export const Game = () => {
  const { gameState, resetGame } = useGame();
  const { entries, saveScore, clearLeaderboard } = useLeaderboard();
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const scoreSavedRef = useRef(false);

  // Save score once when game ends
  useEffect(() => {
    if (gameState.gameOver && !scoreSavedRef.current && gameState.score > 0) {
      scoreSavedRef.current = true;
      saveScore(gameState.score);
    }
    if (!gameState.gameOver) {
      scoreSavedRef.current = false;
    }
  }, [gameState.gameOver, gameState.score, saveScore]);

  const handleNewGame = () => {
    scoreSavedRef.current = false;
    resetGame();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">2048</h1>
        <div className="game-info">
          <div className="score-container">
            <div className="score-label">Score</div>
            <div className="score-value">{gameState.score}</div>
          </div>
          <button className="new-game-button" onClick={handleNewGame}>
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
              <button className="try-again-button" onClick={handleNewGame}>
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

      <div className="leaderboard-button-container">
        <button
          className="leaderboard-button"
          onClick={() => setLeaderboardOpen(true)}
          aria-label="Open leaderboard"
        >
          Leaderboard
        </button>
      </div>

      <LeaderboardPopup
        isOpen={leaderboardOpen}
        entries={entries}
        onClose={() => setLeaderboardOpen(false)}
        onClear={clearLeaderboard}
      />
    </div>
  );
};
