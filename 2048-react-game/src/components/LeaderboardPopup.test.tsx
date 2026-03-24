import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaderboardPopup } from './LeaderboardPopup';
import type { LeaderboardEntry } from '../types/game';

const mockEntries: LeaderboardEntry[] = [
  { id: '1', score: 5000, date: '1/1/2026' },
  { id: '2', score: 3200, date: '1/2/2026' },
  { id: '3', score: 1024, date: '1/3/2026' },
];

describe('LeaderboardPopup', () => {
  const onClose = vi.fn();
  const onClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <LeaderboardPopup isOpen={false} entries={mockEntries} onClose={onClose} onClear={onClear} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the popup when isOpen is true', () => {
    render(
      <LeaderboardPopup isOpen={true} entries={mockEntries} onClose={onClose} onClear={onClear} />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  it('displays all leaderboard entries', () => {
    render(
      <LeaderboardPopup isOpen={true} entries={mockEntries} onClose={onClose} onClear={onClear} />,
    );
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('3,200')).toBeInTheDocument();
    expect(screen.getByText('1,024')).toBeInTheDocument();
  });

  it('shows empty state when there are no entries', () => {
    render(
      <LeaderboardPopup isOpen={true} entries={[]} onClose={onClose} onClear={onClear} />,
    );
    expect(screen.getByText(/No scores yet/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('calls onClose when the close button is clicked', () => {
    render(
      <LeaderboardPopup isOpen={true} entries={mockEntries} onClose={onClose} onClear={onClear} />,
    );
    fireEvent.click(screen.getByLabelText('Close leaderboard'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', () => {
    render(
      <LeaderboardPopup isOpen={true} entries={mockEntries} onClose={onClose} onClear={onClear} />,
    );
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    render(
      <LeaderboardPopup isOpen={true} entries={mockEntries} onClose={onClose} onClear={onClear} />,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClear when the clear button is clicked', () => {
    render(
      <LeaderboardPopup isOpen={true} entries={mockEntries} onClose={onClose} onClear={onClear} />,
    );
    fireEvent.click(screen.getByText('Clear Scores'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not show clear button when entries are empty', () => {
    render(
      <LeaderboardPopup isOpen={true} entries={[]} onClose={onClose} onClear={onClear} />,
    );
    expect(screen.queryByText('Clear Scores')).toBeNull();
  });

  it('highlights the first-place entry', () => {
    render(
      <LeaderboardPopup isOpen={true} entries={mockEntries} onClose={onClose} onClear={onClear} />,
    );
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveClass('leaderboard-entry--first');
    expect(listItems[1]).not.toHaveClass('leaderboard-entry--first');
  });
});
