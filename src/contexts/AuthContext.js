import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth'
import { doc, collection, setDoc } from 'firebase/firestore'

const AuthContext = React.createContext()
const auth2 = getAuth()
const usersCollectionRef = collection(db, "users")
const communitiesCollectionRef = collection(db, "communities")
const communityNamesInUseCollectionRef = collection(db, "communityNamesInUse")

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider( {children} ) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  
  function signup(email, password){
    return createUserWithEmailAndPassword(auth2, email, password)
  }

  function login(email, password){
    return signInWithEmailAndPassword(auth2, email, password)
  }

  function logout() {
    return signOut(auth2)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth2, email)
  }

  function updateEmail(email) {
    return updateEmail(getAuth().currentUser, email)
  }

  function updatePassword(password) {
    return updatePassword(getAuth.currentUser, password)
  }

  function updateUserInformation(username, info) {
    return setDoc(doc(usersCollectionRef, auth.currentUser.uid), {
      user: username,
      description: info,
      imgURL: "placeholder"
    })
  }

  function createCommunity (name, description, creatorUID, creatorName, imgURL){
    return setDoc(doc(communitiesCollectionRef, name),{
      name: name,
      description: description,
      creator: creatorName,
      imgURL: imgURL,
      admins: [creatorUID],
      members: [creatorUID]
    })
  }

  function setNameInUse(name) {
    return setDoc(doc(communityNamesInUseCollectionRef, name), {})
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user)
        setLoading(false)
      })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    logout,
    signup,
    resetPassword,
    updateEmail,
    updatePassword,
    updateUserInformation,
    createCommunity,
    setNameInUse
  }

  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
