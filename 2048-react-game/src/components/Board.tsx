import type { Board as BoardType } from '../types/game';
import { Tile } from './Tile';

interface BoardProps {
  board: BoardType;
}

export const Board = ({ board }: BoardProps) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((value, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={value} />
          ))}
        </div>
      ))}
    </div>
  );
};
