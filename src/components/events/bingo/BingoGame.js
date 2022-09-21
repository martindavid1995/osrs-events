import React from "react";
import BingoBoard from "./BingoBoard";
//The page that displays the bingo game
export default function BingoGame() {
  return (
    //pass in onclick function to submit
    <div>
      <h3>Bingo</h3>

      <BingoBoard/>
    </div>
  );
}
