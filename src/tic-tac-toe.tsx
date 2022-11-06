import React from "react";
import {RANK, winner} from "./util";
import { BoardRow } from "./board-row";

interface ISquareProps {
  XO: string;
  clicked: React.MouseEventHandler<HTMLButtonElement>;
}

function Square(props: ISquareProps) {
  return (
    <button className="square" onClick={props.clicked}>
      {props.XO}
    </button>
  );
}

interface IBoardState {
  squares: Array<string>;
  x_plays_this_turn: boolean;
}

interface IBoardProps {
  rank: number;
}

class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props: IBoardProps) {
    super(props);
    this.state = {
      squares: Array(props.rank * props.rank).fill(null),
      x_plays_this_turn: true,
    };
    this.render_square = this.render_square.bind(this);
  }

  handle_click(i: number) {
    const squares = this.state.squares.slice();
    if (winner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.x_plays_this_turn ? "x" : "o";
    this.setState({
      squares: squares,
      x_plays_this_turn: !this.state.x_plays_this_turn,
    });
  }

  render_square(i: number) {
    return (
      <Square XO={this.state.squares[i]} clicked={() => this.handle_click(i)} />
    );
  }

  render() {
    let status: string;
    const W$ = winner(this.state.squares);

    if (W$) {
      status = `Winner: ${W$}`;
    } else {
      status = `Next player: ${this.state.x_plays_this_turn ? "x" : "o"}`;
    }
    return (
      <div>
        <div className="status">{status}</div>
        <br />
        <BoardRow rank={this.props.rank} render_square={this.render_square} />
      </div>
    );
  }
}

export default class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board rank={RANK} />
        </div>
        <div className="game-info">
          <div>{}</div>
          <ol>{}</ol>
        </div>
      </div>
    );
  }
}
