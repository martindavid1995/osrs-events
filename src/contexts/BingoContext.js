import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  addDoc,
} from "firebase/firestore";

const BingoContext = React.createContext();
const defaultStatusArray = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

export function useBingo() {
  return useContext(BingoContext);
}

export function BingoProvider({ children }) {
  function createBingo(teamOneID, teamTwoID, defaultItemsArray, eventID) {
    return addDoc(collection(db, "bingo"), {
      items: defaultItemsArray, //text associated with item to obtain
      itemImgs: null,
      teamOneID: teamOneID, //challenger
      teamTwoID: teamTwoID, //challengee
      teamOneStatus: defaultStatusArray,
      teamTwoStatus: defaultStatusArray,
      eventID: eventID
    });
  }

  function updateTile(bingoID, newItemArray) {
    const bingoRef = doc(db, "bingo", bingoID);
    return updateDoc(bingoRef, {
      items: newItemArray,
    });
  }

  const value = {
    createBingo,
    updateTile,
  };

  return (
    <BingoContext.Provider value={value}>{children}</BingoContext.Provider>
  );
}
