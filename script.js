import Board from "./classes/board.js";
import Player from "./classes/player.js";
import { drawWinningLine, hasClass, addClass } from "./helper.js";

function newGame(depth = -1, startingPlayer = 1) {
  const player = new Player(parseInt(depth));
  const board = new Board(["", "", "", "", "", "", "", "", ""]);

  const boardDiv = document.getElementById("board");
  boardDiv.className = "board";
  boardDiv.innerHTML = `<div class="cells-wrap">
            <button class="cell-0"></button>
            <button class="cell-1"></button>
            <button class="cell-2"></button>
            <button class="cell-3"></button>
            <button class="cell-4"></button>
            <button class="cell-5"></button>
            <button class="cell-6"></button>
            <button class="cell-7"></button>
            <button class="cell-8"></button>
        </div>`;

  //storing html cells
  const htmlCells = [...boardDiv.querySelector(".cells-wrap").children];

  const starting = parseInt(startingPlayer),
    maximizing = starting;
  let playerTurn = starting;

  //AI starting will select an edge square or the middle
  //we will assume the maximizing player is always x and the minimizing player is o
  if (!starting) {
    const centerAndCorners = [0, 2, 4, 6, 8];
    const firstChoice =
      centerAndCorners[Math.floor(Math.random() * centerAndCorners.length)];
    const symbol = !maximizing ? "x" : "o";
    board.insert(symbol, firstChoice);
    addClass(htmlCells[firstChoice], symbol);
    playerTurn = 1; //switch turns
  }

  //click event listenre for each state
  board.state.forEach((cell, index) => {
    htmlCells[index].addEventListener(
      "click",
      () => {
        //return false: space occupied || endGame || not human turn
        if (
          hasClass(htmlCells[index], "x") ||
          hasClass(htmlCells[index], "o") ||
          board.isEndGame() ||
          !playerTurn
        )
          return false;

        const symbol = maximizing ? "x" : "o";
        //Update board class and ui
        board.insert(symbol, index);
        addClass(htmlCells[index], symbol);
        //if it is a terminal move and it is not a draw, human won
        if (board.isEndGame()) {
          drawWinningLine(board.isEndGame());
        }
        playerTurn = 0; //switch turn

        //get AI move and update
        player.getBestMove(board, !maximizing, (best) => {
          const symbol = !maximizing ? "x" : "o";
          board.insert(symbol, parseInt(best));
          addClass(htmlCells[best], symbol);
          if (board.isEndGame()) {
            drawWinningLine(board.isEndGame());
          }
          playerTurn = 1; //switch turn
        });
      },
      false
    );
    if (cell) addClass(htmlCells[index], cell);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  //start new game on page load
  const depth = -1;
  const startingPlayer = 1;
  newGame(depth, startingPlayer);
  //start a new game with chosen options onClick newGame()
  document.getElementById("newGame").addEventListener("click", () => {
    const startingDiv = document.getElementById("starting");
    const starting = startingDiv.options[startingDiv.selectedIndex].value;
    const depthDiv = document.getElementById("depth");
    const depth = depthDiv.options[depthDiv.selectedIndex].value;
    newGame(depth, starting);
  });
});
