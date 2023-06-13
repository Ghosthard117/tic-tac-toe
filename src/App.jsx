import { useState } from "react"
import confetti from "canvas-confetti"

import { Square } from "./components/Square"
import { turns  } from "./components/constants.js"
import { checkWinnerFrom } from "./logic/board";
import { WinnerModal } from "./components/WinnerModal";
import { checkEndGame } from "./logic/board";
import { SaveGameToStorage, resetGameStorage } from "./logic/storage";


function App() {
  const [board, setBoard] = useState(() => {
    const savedBoard = window.localStorage.getItem('board');
    if(savedBoard) return JSON.parse(savedBoard);
    return Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? turns.X;
  });
  //null if there are winner, false if is tie
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(turns.X)
    setWinner(null)

    resetGameStorage()
  }

  const updateBoard = (index) => {
    //no update the position, if there are something
    if(board[index] || winner) return
    //update board
    const newBoard  =[...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    //change turn
    const newTurn = turn === turns.X ? turns.O : turns.X;
    setTurn(newTurn);
    SaveGameToStorage({
      board: newBoard,
      turn: newTurn,
    })
    
    //review if there are winner
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner){
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)){
      setWinner(false);//tie
    }
  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Restart game</button>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === turns.X}>
          {turns.X}
        </Square>
        <Square isSelected={turn === turns.O}>
          {turns.O}
        </Square>
      </section>

        <WinnerModal resetGame={resetGame} winner={winner}/>

    </main>
  )
}

export default App