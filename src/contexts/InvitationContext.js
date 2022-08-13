import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, collection, setDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'

const InvitationContext = React.createContext()
const invitationCollectionRef = collection(db, "invitations")

export function useInvitation() {
    return useContext(InvitationContext)
}

export function InvitationProvider( {children} ) {


      const value = {

      }

      return (
        <InvitationContext.Provider value={value}>
            {children}
        </InvitationContext.Provider>
      )
} 