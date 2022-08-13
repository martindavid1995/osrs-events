import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, collection, setDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'

const EventContext = React.createContext()
const usersCollectionRef = collection(db, "events")

export function useEvent() {
    return useContext(EventContext)
}

export function EventProvider( {children} ) {


      const value = {

      }

      return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
      )
} 