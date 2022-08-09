import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth'
import { doc, collection, setDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'

const AuthContext = React.createContext()
const auth2 = getAuth()
const usersCollectionRef = collection(db, "users")
const communitiesCollectionRef = collection(db, "communities")


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
      imgURL: "placeholder",
      memberOf: [],
      adminOf: [],
      enrolledEvents: []
    })
  }

  function createCommunity(name, description, creatorUID, creatorName, imgURL){
    const regexp = /( )/gm
    return setDoc(doc(communitiesCollectionRef, name.replaceAll(regexp, "-")),{
      name: name,
      description: description,
      creator: creatorName,
      imgURL: imgURL,
      adminIDs: [creatorUID],
      admins: [creatorName],
      memberIDs: [creatorUID],
      members: [creatorName],
      openApps: [{
        uid: "",
        username: ""
      }]
    })
  }

  function addCommunityMember(communityID, newUID, newUsername){
    const communityRef = doc(db, "communities", communityID)
    return updateDoc(communityRef, {
        members: arrayUnion(newUsername),
        memberIDs: arrayUnion(newUID)
    })
  }

  function addCommunityAdmin(communityID, newUID, newUsername){
    const communityRef = doc(db, "communities", communityID)
    return updateDoc(communityRef, {
        admins: arrayUnion(newUsername),
        adminIDs: arrayUnion(newUID)
    })
  }

  function removeCommunityMember(communityID, newUID, newUsername){
    const communityRef = doc(db, "communities", communityID)
    return updateDoc(communityRef, {
        members: arrayRemove(newUsername),
        memberIDs: arrayRemove(newUID)
    })
  }

  function removeCommunityAdmin(communityID, newUID, newUsername){
    const communityRef = doc(db, "communities", communityID)
    return updateDoc(communityRef, {
        admins: arrayRemove(newUsername),
        adminIDs: arrayRemove(newUID)
    })
  }

  function subscribeUserToCommunity(communityID, userID){
    const userRef = doc(db, "users", userID)
      return updateDoc(userRef, {
          memberOf: arrayUnion(communityID)
      })
  }

  function unsubscribeUserFromCommunity(communityID, userID){
    const userRef = doc(db, "users", userID)
      return updateDoc(userRef, {
          memberOf: arrayRemove(communityID)
      })
  }

  function grantAdminPrivelages(communityID, userID){
    const userRef = doc(db, "users", userID)
      return updateDoc(userRef, {
          adminOf: arrayUnion(communityID)
      })
  }

  function removeAdminPrivelages(communityID, userID){
    const userRef = doc(db, "users", userID)
      return updateDoc(userRef, {
          adminOf: arrayRemove(communityID)
      })
  }

  function addOpenApplication(communityID, userID, username){
    const communityRef = doc(db, "communities", communityID)
    return updateDoc(communityRef, {
        openApps: arrayUnion({
          uid: userID,
          username: username
        })
    })
  }
  
  function removeOpenApplication(communityID, userID, username){
    const communityRef = doc(db, "communities", communityID)
    return updateDoc(communityRef, {
        openApps: arrayRemove({
          uid: userID,
          username: username
        })
    })
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
    addCommunityAdmin,
    addCommunityMember,
    removeCommunityAdmin,
    removeCommunityMember,
    subscribeUserToCommunity,
    unsubscribeUserFromCommunity,
    grantAdminPrivelages,
    removeAdminPrivelages,
    addOpenApplication,
    removeOpenApplication
  }

  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
