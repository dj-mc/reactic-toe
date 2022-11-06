import React from "react";

export const BoardRow = ({
  rank,
  render_square,
}: {
  rank: number;
  render_square: CallableFunction;
}) => {
  return (
    <div>
      {Array.from(Array(rank).keys()).map((row) => (
        <div className="board-row">
          {Array.from(Array(rank).keys()).map((col) =>
            render_square(row * rank + col)
          )}
        </div>
      ))}
    </div>
  );
};
