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
  function createEvent(gametype, status, communitiesInvolved, playersInvolved, eventName) {
    return addDoc(collection(db, "events"), {
      gametype: gametype,
      status: status,
      gameID: null,
      communitiesInvolved: communitiesInvolved,
      playersInvolved: playersInvolved,
      eventName: eventName
    });
  }

  function setEventStatus(eventID, statusToChange) {
    const eventRef = doc(db, "events", eventID);
    return updateDoc(eventRef, {
      status: statusToChange,
    });
  }

  function setEventGameID(eventID, gameID) {
    const eventRef = doc(db, "events", eventID);
    return updateDoc(eventRef, {
      gameID: gameID,
    });
  }

  function addPlayerInvolved(eventID, playersInvolved){
    const eventRef = doc(db, "events", eventID);
    return updateDoc(eventRef, {
      playersInvolved: playersInvolved
    })
  }

  const value = {
    createEvent,
    setEventStatus,
    setEventGameID,
    addPlayerInvolved
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
