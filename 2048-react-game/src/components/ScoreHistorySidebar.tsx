import type { LeaderboardEntry } from '../types/game';

interface ScoreHistorySidebarProps {
  entries: LeaderboardEntry[];
  onClear: () => void;
}

export const ScoreHistorySidebar = ({ entries, onClear }: ScoreHistorySidebarProps) => {
  return (
    <aside className="score-sidebar">
      <h2 className="score-sidebar-title">Score History</h2>

      {entries.length === 0 ? (
        <p className="score-sidebar-empty">No scores yet. Play a game!</p>
      ) : (
        <ol className="score-sidebar-list">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className={`score-sidebar-entry${index === 0 ? ' score-sidebar-entry--first' : ''}`}
            >
              <span className="score-sidebar-rank">#{index + 1}</span>
              <span className="score-sidebar-score">{entry.score.toLocaleString()}</span>
              <span className="score-sidebar-date">{entry.date}</span>
            </li>
          ))}
        </ol>
      )}

      {entries.length > 0 && (
        <button className="score-sidebar-clear" onClick={onClear}>
          Clear Scores
        </button>
      )}
    </aside>
  );
};
