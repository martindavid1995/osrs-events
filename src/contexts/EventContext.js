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
  function createEvent(gametype, status, communitiesInvolved, readyUpStatus, playersInvolved, eventName) {
    return addDoc(collection(db, "events"), {
      gametype: gametype,
      status: status,
      gameID: null,
      communitiesInvolved: communitiesInvolved,
      readyUpStatus: readyUpStatus, 
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

  function readyUpTeam(eventID, newStatus){
    const eventRef = doc(db, "events", eventID);
    return updateDoc(eventRef, {
      readyUpStatus: newStatus
    })
  }

  const value = {
    createEvent,
    setEventStatus,
    setEventGameID,
    addPlayerInvolved,
    readyUpTeam
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
