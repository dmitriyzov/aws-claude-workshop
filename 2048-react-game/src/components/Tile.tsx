interface TileProps {
  value: number;
}

export const Tile = ({ value }: TileProps) => {
  return (
    <div className={`tile tile-${value}`}>
      {value !== 0 && <span className="tile-value">{value}</span>}
    </div>
  );
};
