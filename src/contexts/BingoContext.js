import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, collection, setDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'

const BingoContext = React.createContext()
const bingoCollectionRef = collection(db, "bingo")

export function useBingo() {
    return useContext(BingoContext)
}

export function BingoProvider( {children} ) {


      const value = {

      }

      return (
        <BingoContext.Provider value={value}>
            {children}
        </BingoContext.Provider>
      )
} 