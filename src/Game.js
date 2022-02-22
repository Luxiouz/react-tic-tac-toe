import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const rowStyle = {
    display: 'flex'
}

const squareStyle = {
    'width': '60px',
    'height': '60px',
    'backgroundColor': '#ddd',
    'margin': '4px',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'fontSize': '20px',
    'color': 'white'
}

const boardStyle = {
    'backgroundColor': '#eee',
    'width': '208px',
    'alignItems': 'center',
    'justifyContent': 'center',
    'display': 'flex',
    'flexDirection': 'column',
    'border': '3px #eee solid'
}

const containerStyle = {
    'display': 'flex',
    'alignItems': 'center',
    'flexDirection': 'column'
}

const instructionsStyle = {
    'marginTop': '5px',
    'marginBottom': '5px',
    'fontWeight': 'bold',
    'fontSize': '16px',
}

const buttonStyle = {
    'marginTop': '15px',
    'marginBottom': '16px',
    'width': '80px',
    'height': '40px',
    'backgroundColor': '#8acaca',
    'color': 'white',
    'fontSize': '16px',
}

class Square extends React.Component {
    render() {
        const { row, column, value, handleClick } = this.props;
        return (
            <div
                on
                className="square"
                style={squareStyle}
                onClick={() => handleClick(row, column)}
            >
                {value}
            </div>
        );
    }
}

class Board extends React.Component {

    render() {

        const { board, onTurn, onReset, winner, nextX } = this.props;
        console.log("board rendering...", board)
        return (
            <div style={containerStyle} className="gameBoard">
                <div id="statusArea" className="status" style={instructionsStyle}>Next player: <span>{nextX ? 'X' : 'O'}</span></div>
                <div id="winnerArea" className="winner" style={instructionsStyle}>Winner: <span>{winner}</span></div>
                <button style={buttonStyle} onClick={onReset}>Reset</button>
                <div style={boardStyle}>
                    {board.map((rowArray, row) =>
                        <div className="board-row" style={rowStyle} key={row}>
                            {rowArray.map((value, column) => {
                                console.log("value", value)
                                return <Square key={row + column} value={value} row={row} column={column} handleClick={(row, column) => onTurn(row, column)} />
                            })}
                        </div>)}
                </div>
            </div>
        );
    }
}

const initialGameState = {
    nextX: true,
    board: [['', '', ''], ['', '', ''], ['', '', '']],
    winner: '--',
    over: false,
    maxTurns: 9,
    counter: 0,
}
class Game extends React.Component {

    state = {
        ...initialGameState
    }

    onReset = () => {
        console.log("reset game")
        this.setState({ ...initialGameState});
    }

    endGame = (winner) => {
        this.setState((prevState) => {
            return {
                winner,
                over: true,
            }
        });
        alert("GameOver!!!" + JSON.stringify(this.state));
    }

    detecWinner = () => {

        //Only verifyng with row lentgh because Tic Tac Toe has a square board.
        const rowLength = this.state.board.length;

        //I have copied my own code in my notes app because I needed pasted after solve a bug.
        //After solved it, I have pasted my own code.

        //Rows
        for (let row = 0; row < rowLength; row++) {
            const rowComparatorValue = this.state.board[row][0];
            let rowMatches = 0;
            for (let column = 0; column < rowLength; column++) {
                if (this.state.board[row][column] === '') {
                    rowMatches = -1;
                    column = rowLength;
                } else if (rowComparatorValue === this.state.board[row][column]) rowMatches++;
            }
            if (rowMatches === rowLength) { this.endGame(rowComparatorValue + ' in a row'); console.log(this.state.board); return; }
        }

        //Columns
        for (let column = 0; column < rowLength; column++) {
            const comparatorValue = this.state.board[0][column];
            let matches = 0;
            for (let row = 0; row < rowLength; row++) {
                if (this.state.board[row][column] === '') {
                    matches = -1;
                    row = rowLength;
                } else if (comparatorValue === this.state.board[row][column]) matches++;
            }
            if (matches === rowLength) { this.endGame(comparatorValue + ' in a column'); console.log(this.state.board); return; }
        }

        //Diagonal
        const comparatorValue = this.state.board[0][0];
        let matches = 0;

        const comparatorReverseValue = this.state.board[0][rowLength-1];
        let matchesReverse = 0;

        for (let row = 0; row < rowLength; row++) {
            if (this.state.board[row][row] === '') {
                matches = -1;
            } else if (comparatorValue === this.state.board[row][row]) matches++;

            if (this.state.board[row][rowLength -1 - row] === '') {
                matchesReverse = -1;
            } else if (comparatorReverseValue === this.state.board[row][rowLength -1 - row]) matchesReverse++;

            if (matches === rowLength) { this.endGame(comparatorValue + ' in a  diagonal'); console.log(this.state.board); return; }
            if (matchesReverse === rowLength) { this.endGame(comparatorValue + ' in a reverse diagonal'); console.log(this.state.board); return; }
        }


    }

    onTurn = (row, col) => {
        if (this.state.over || this.state.board[row][col] !== '') return;
        const newBoard = [...this.state.board];
        const totalTurns = this.state.counter + 1;
        newBoard[row][col] = this.state.nextX ? 'X' : 'O';
        this.setState((prevState) => {
            return {
                board: [...newBoard],
                nextX: !prevState.nextX,
                counter: totalTurns,
            }
        });

        this.detecWinner();

        if (totalTurns >= this.state.maxTurns) {
            this.endGame('None');
        }
    }

    render() {
        const { board, nextX, winner } = this.state;
        return (
            <div className="game">
                <div className="game-board">
                    <Board board={board} nextX={nextX} winner={winner} onTurn={this.onTurn} onReset={this.onReset} />
                </div>
            </div>
        );
    }
}

export default Game;
