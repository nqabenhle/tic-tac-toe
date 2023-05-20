import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Cell from './components/Cell';

const App = () => {
  const [rows, setRows] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]);
  const [winner, setWinner] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pause, setPause] = useState(false);
  const [score, setScore] = useState(
    { playerO: 0, playerX: 0}
  );

  const winningPositions = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ]

  const clearRows = (resumeGame=false) => {
    setRows([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ])

    resumeGame && setPause(false);
  }

  const checkDraw = () => {
    for (const row of rows) {
      for (const cell of row) {
        if (cell === null) {
          return false;
        }
      }
    }

    return true;
  }

  const checkWinner = () => {
    for (const pos of winningPositions) {
      const cell1 = rows[pos[0][0]][pos[0][1]]
      const cell2 = rows[pos[1][0]][pos[1][1]]
      const cell3 = rows[pos[2][0]][pos[2][1]]

      if (cell1 !== null && cell1 === cell2 && cell2 === cell3) {
        const player = currentPlayer === 1 
          ? 'playerO' : 'playerX';

        setScore((prevScore) => ({
          ...prevScore,
          [player]: prevScore[player] + 1
        }));

        return true;
      }
    }

    return false;
  }

  const resetGame = () => {
    setGameOver(false);
    setWinner(null);
    setCurrentPlayer(0);
    clearRows();
    setScore({ playerO: 0, playerX: 0 });
    setPause(false);
  }

  useEffect(() => {
    setPause(true);

    if (score.playerO === 3) {
      setWinner('Player O');
      setGameOver(true);
    } else if (score.playerX === 3) {
      setWinner('Player X');
      setGameOver(true);
    } else {
      setTimeout(clearRows, 1500, true);
    }    
  }, [score])

  useEffect(() => {
    if (!checkWinner() && checkDraw()) {
      setTimeout(clearRows, 1500, true);
    }
  }, [rows])

  const updateRows = (rowPosition, columnPosition) => {
    setRows((prevRows) => {
      const newGrid = [...prevRows];

      newGrid.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell === null && rowIndex === rowPosition && cellIndex === columnPosition) {
            setCurrentPlayer((prevPlayer) => (
              prevPlayer === 0 ? 1 : 0
            ));
            newGrid[rowIndex][cellIndex] = currentPlayer;
          }
        });
      });

      return newGrid;
    });
  }

  return (
    <div>
      {winner && <Confetti />}
      <h1>Best out 3</h1>

      {winner && 
        <p className='winner-text'>The winner is {winner}</p>
      }
      
      <p className='score-display'>
        <span className='player-o'>Player O: </span> 
        {score.playerO} - {score.playerX} :
        <span className='player-x'>Player X</span>
      </p>

      <div className='gameboard'>
        {rows.map((cells, rowPosition) => (
          cells.map((cell, columnPosition) => (
            <Cell
              cell={cell}
              columnPosition={columnPosition}
              currentPlayer={currentPlayer}
              gameOver={gameOver}
              pause={pause}
              rowPosition={rowPosition}
              setCurrentPlayer={setCurrentPlayer}
              updateRows={updateRows}
            />
          ))
        ))}
      </div>

      {!gameOver && 
        <p>The current player 
          is {currentPlayer === 1 ? 'Player X' : 'Player O'}
        </p>
      }

      {gameOver && <div className='button-container'>
        <button onClick={resetGame}>Reset Game</button>
      </div>}
    </div>
  )
}

export default App;