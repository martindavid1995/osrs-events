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

const EventContext = React.createContext();
// const eventsCollectionRef = collection(db, "events")

export function useEvent() {
  return useContext(EventContext);
}

export function EventProvider({ children }) {
  function createEvent(gametype, status, communitiesInvolved, playersInvolved) {
    return addDoc(collection(db, "events"), {
      gametype: gametype,
      status: status,
      gameID: null,
      communitiesInvolved: communitiesInvolved,
      playersInvolved: playersInvolved,
    });
  }

  function terminateEvent(eventID) {
    const eventRef = doc(db, "events", eventID);
    return updateDoc(eventRef, {
      status: "terminated",
    });
  }

  const value = {
    createEvent,
    terminateEvent,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
