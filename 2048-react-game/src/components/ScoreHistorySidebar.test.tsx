import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScoreHistorySidebar } from './ScoreHistorySidebar';
import type { LeaderboardEntry } from '../types/game';

const mockEntries: LeaderboardEntry[] = [
  { id: '1', score: 5000, date: '1/1/2026' },
  { id: '2', score: 3200, date: '1/2/2026' },
  { id: '3', score: 1024, date: '1/3/2026' },
];

describe('ScoreHistorySidebar', () => {
  const onClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the sidebar with a title', () => {
    render(<ScoreHistorySidebar entries={mockEntries} onClear={onClear} />);
    expect(screen.getByText('Score History')).toBeInTheDocument();
  });

  it('displays all entries', () => {
    render(<ScoreHistorySidebar entries={mockEntries} onClear={onClear} />);
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('3,200')).toBeInTheDocument();
    expect(screen.getByText('1,024')).toBeInTheDocument();
  });

  it('shows empty state when there are no entries', () => {
    render(<ScoreHistorySidebar entries={[]} onClear={onClear} />);
    expect(screen.getByText(/No scores yet/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('highlights the first-place entry', () => {
    render(<ScoreHistorySidebar entries={mockEntries} onClear={onClear} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('score-sidebar-entry--first');
    expect(items[1]).not.toHaveClass('score-sidebar-entry--first');
  });

  it('calls onClear when the clear button is clicked', () => {
    render(<ScoreHistorySidebar entries={mockEntries} onClear={onClear} />);
    fireEvent.click(screen.getByText('Clear Scores'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not show the clear button when entries are empty', () => {
    render(<ScoreHistorySidebar entries={[]} onClear={onClear} />);
    expect(screen.queryByText('Clear Scores')).toBeNull();
  });

  it('displays rank numbers for each entry', () => {
    render(<ScoreHistorySidebar entries={mockEntries} onClear={onClear} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('#3')).toBeInTheDocument();
  });

  it('displays dates for each entry', () => {
    render(<ScoreHistorySidebar entries={mockEntries} onClear={onClear} />);
    expect(screen.getByText('1/1/2026')).toBeInTheDocument();
    expect(screen.getByText('1/2/2026')).toBeInTheDocument();
  });
});
