import Board from "./board.js";

export default class Player {
  constructor(maxDepth = -1) {
    this.maxDepth = maxDepth;
    this.nodesMap = new Map();
  }

  getBestMove(board, maximizing = true, callback = () => {}, depth = 0) {
    //clear nodesMap for a new move
    if (depth == 0) this.nodesMap.clear();

    //return heuristic value once endGame is reached
    if (board.isEndGame() || depth === this.maxDepth) {
      if (board.isEndGame().winner === "x") {
        return 100 - depth;
      } else if (board.isEndGame().winner === "o") {
        return -100 + depth;
      }
      return 0;
    }

    if (maximizing) {
      //initialize best to lowest possibility
      let best = -100;
      board.getAvailableMoves().forEach((index) => {
        //initialize new board copied from old board state
        const child = new Board([...board.state]);
        //insert maximizing symbol into empty cell
        child.insert("x", index);
        //recursive call best move function on new board with new move during minimizing turn depth +=1
        const nodeValue = this.getBestMove(child, false, callback, depth + 1);
        //redeem best value
        best = Math.max(best, nodeValue);

        //if main funciton call, no recursive => map heuristic value with move indices
        if (depth == 0) {
          //comma separated indices if multiple moves have the same heuristic vale
          const moves = this.nodesMap.has(nodeValue)
            ? `${this.nodesMap.get(nodeValue)},${index}`
            : index;
          this.nodesMap.set(nodeValue, moves);
        }
      });

      if (depth == 0) {
        let returnValue;
        if (typeof this.nodesMap.get(best) == "string") {
          const arr = this.nodesMap.get(best).split(",");
          const rand = Math.floor(Math.random() * arr.length);
          returnValue = arr[rand];
        } else {
          returnValue = this.nodesMap.get(best);
        }
        //run a callback after calculation and return the index
        callback(returnValue);
        return returnValue;
      }
      return best;
    }

    if (!maximizing) {
      //initialize best to lowest possibility
      let best = 100;
      board.getAvailableMoves().forEach((index) => {
        //initialize new board copied from old board state
        const child = new Board([...board.state]);
        //insert maximizing symbol into empty cell
        child.insert("o", index);
        //recursive call best move function on new board with new move during minimizing turn depth +=1`
        const nodeValue = this.getBestMove(child, true, callback, depth + 1);
        //redeem best value
        best = Math.min(best, nodeValue);
        //if main funciton call, no recursive => map heuristic value with move indices
        if (depth == 0) {
          //comma separated indices if multiple moves have the same heuristic vale
          const moves = this.nodesMap.has(nodeValue)
            ? this.nodesMap.get(nodeValue) + "," + index
            : index;
          this.nodesMap.set(nodeValue, moves);
        }
      });

      //if main funciton call, no recursive => map heuristic value with move indices
      if (depth == 0) {
        let returnValue;
        if (typeof this.nodesMap.get(best) == "string") {
          const arr = this.nodesMap.get(best).split(",");
          const rand = Math.floor(Math.random() * arr.length);
          returnValue = arr[rand];
        } else {
          returnValue = this.nodesMap.get(best);
        }
        //run a callback after calculation and return the index
        callback(returnValue);
        return returnValue;
      }
      //return heuristic value of calculation
      return best;
    }
  }
}
