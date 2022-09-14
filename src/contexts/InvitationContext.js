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

const InvitationContext = React.createContext();

export function useInvitation() {
  return useContext(InvitationContext);
}

export function InvitationProvider({ children }) {
  function createInvitation(
    status,
    from,
    to,
    eventID,
    eventType,
    internalNavURL
  ) {
    return addDoc(collection(db, "invitations"), {
      status: status,
      from: from,
      to: to,
      eventID: eventID,
      eventType: eventType,
      internalNavURL: internalNavURL,
    });
  }

  function setInvitationStatus(invID, status) {
    const invRef = doc(db, "invitations", invID);
    return updateDoc(invRef, {
      status: status,
    });
  }

  const value = {
    createInvitation,
    setInvitationStatus,
  };

  return (
    <InvitationContext.Provider value={value}>
      {children}
    </InvitationContext.Provider>
  );
}
