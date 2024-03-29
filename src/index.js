import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.win ? "square-win" : "square"}
                onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
   render() {
       const elements = [0,1,2];

       return (
         <div>
             {elements.map((e, row) =>
                <div key={row} className="board-row">
                    {elements.map((e, col) => this.renderSquare(row*3 + col))}
                </div>
             )}
         </div>
      );
   }

    renderSquare(i) {
        const {squares, win, onClick} = this.props;

        return (
            <Square key={i}
                    value={squares[i]}
                    win={win && win.includes(i)}
                    onClick={() => onClick(i)}
            />
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: null,
                col: null
            }],
            orderAsc: true,
            stepNumber: 0,
            xIsNext: true
        };
    }

    render() {
        const {history, orderAsc, stepNumber} = this.state;
        const current = history[stepNumber];
        const result = calculateWinner(current.squares);

        const chronicle = orderAsc ? history.slice() : history.slice().reverse();

        const moves = chronicle.map((step, index) => {
            const move = orderAsc ? index : chronicle.length - index - 1;
            const desc = (move
                ? 'Go to move #' + move + ' (' + step.col + ',' + step.row  + ')'
                : 'Go to game start'
            );
            const fontWeight = move === this.state.stepNumber ? 'bold' : 'normal';
            return (
                <li key={move}>
                    <button  style={{fontWeight: fontWeight}}
                             onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status, line = null;

        if (stepNumber >= 9) {
            status = "The game is a draw";
        }
        else if (result) {
            status = 'Winner: ' + result.winner;
            line = result.squares;
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                           win={line}
                           onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <div>
                        <button onClick={this.toggleHistory}>{orderAsc ? "Asc" : "Dsc"}</button>
                    </div>
                </div>
            </div>
        );
    }

    toggleHistory = () => {
        this.setState(state => ({
            orderAsc: !state.orderAsc,
        }))
    };

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState(state => ({
            history: [
                ...history,
                {
                    squares: squares,
                    row: i % 3,
                    col: Math.trunc(i / 3)
                }],
            stepNumber: history.length,
            xIsNext: !state.xIsNext
        }));
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                squares: lines[i]
            };
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
   <Game />,
   document.getElementById('root')
);
