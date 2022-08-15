import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

const UserContext = React.createContext();
const usersCollectionRef = collection(db, "users");

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  function updateUserInformation(username, info) {
    return setDoc(doc(usersCollectionRef, auth.currentUser.uid), {
      user: username,
      description: info,
      imgURL: "placeholder",
      memberOf: [],
      adminOf: [],
      enrolledEvents: [],
    });
  }

  function subscribeUserToCommunity(communityID, userID) {
    const userRef = doc(db, "users", userID);
    return updateDoc(userRef, {
      memberOf: arrayUnion(communityID),
    });
  }

  function unsubscribeUserFromCommunity(communityID, userID) {
    const userRef = doc(db, "users", userID);
    return updateDoc(userRef, {
      memberOf: arrayRemove(communityID),
    });
  }

  function grantAdminPrivelages(communityID, userID) {
    const userRef = doc(db, "users", userID);
    return updateDoc(userRef, {
      adminOf: arrayUnion(communityID),
    });
  }

  function removeAdminPrivelages(communityID, userID) {
    const userRef = doc(db, "users", userID);
    return updateDoc(userRef, {
      adminOf: arrayRemove(communityID),
    });
  }

  const value = {
    updateUserInformation,
    subscribeUserToCommunity,
    unsubscribeUserFromCommunity,
    grantAdminPrivelages,
    removeAdminPrivelages,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
