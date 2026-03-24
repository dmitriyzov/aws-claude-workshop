import { useEffect, useRef } from 'react';
import type { LeaderboardEntry } from '../types/game';

/** Props for the LeaderboardPopup component */
export interface LeaderboardPopupProps {
  /** Whether the popup is visible */
  isOpen: boolean;
  /** Sorted leaderboard entries (highest score first) */
  entries: LeaderboardEntry[];
  /** Called when the user closes the popup */
  onClose: () => void;
  /** Called when the user clears all scores */
  onClear: () => void;
}

/**
 * Modal popup that displays the top 2048 game scores stored in localStorage.
 * Closes on Escape key or backdrop click.
 */
export const LeaderboardPopup = ({ isOpen, entries, onClose, onClear }: LeaderboardPopupProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="leaderboard-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Leaderboard"
    >
      <div className="leaderboard-popup" ref={dialogRef}>
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">Leaderboard</h2>
          <button
            className="leaderboard-close-button"
            onClick={onClose}
            aria-label="Close leaderboard"
          >
            &times;
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="leaderboard-empty">No scores yet. Play a game to get on the board!</p>
        ) : (
          <ol className="leaderboard-list">
            {entries.map((entry, index) => (
              <li key={entry.id} className={`leaderboard-entry${index === 0 ? ' leaderboard-entry--first' : ''}`}>
                <span className="leaderboard-rank">#{index + 1}</span>
                <span className="leaderboard-score">{entry.score.toLocaleString()}</span>
                <span className="leaderboard-date">{entry.date}</span>
              </li>
            ))}
          </ol>
        )}

        {entries.length > 0 && (
          <button className="leaderboard-clear-button" onClick={onClear}>
            Clear Scores
          </button>
        )}
      </div>
    </div>
  );
};
