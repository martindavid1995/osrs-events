import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

const AuthContext = React.createContext();
const auth2 = getAuth();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function funcTest(){
    console.log("Called from a function trigger")
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth2, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth2, email, password);
  }

  function logout() {
    return signOut(auth2);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth2, email);
  }

  function updateEmail(email) {
    return updateEmail(getAuth().currentUser, email);
  }

  function updatePassword(password) {
    return updatePassword(getAuth.currentUser, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    funcTest,
    currentUser,
    login,
    logout,
    signup,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
