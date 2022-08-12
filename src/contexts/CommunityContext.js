import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, collection, setDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'

const CommunityContext = React.createContext()
const communitiesCollectionRef = collection(db, "communities")

export function useCommunity() {
    return useContext(CommunityContext)
}

export function CommunityProvider( {children} ){

    function createCommunity(name, description, creatorUID, creatorName, imgURL){
        const regexp = /( )/gm
        return setDoc(doc(communitiesCollectionRef, name.replaceAll(regexp, "-")),{
          name: name,
          description: description,
          creator: {UID: creatorUID, user: creatorName},
          imgURL: imgURL,
          admins: [{UID: creatorUID, user: creatorName}],
          members: [{UID: creatorUID, user: creatorName}],
          adminUIDs: [creatorUID],
          memberUIDs: [creatorUID],
          adminUsernames: [creatorName],
          memberUsernames: [creatorName],
          openApps: []
        })
      }

      function addCommunityMember(communityID, newUID, newUsername){
        const communityRef = doc(db, "communities", communityID)
        return updateDoc(communityRef, {
            members: arrayUnion({
              UID: newUID,
              user: newUsername
            }),
            memberUIDs: arrayUnion(newUID),
            memberUsernames: arrayUnion(newUsername)
        })
      }

      function addCommunityAdmin(communityID, newUID, newUsername){
        const communityRef = doc(db, "communities", communityID)
        return updateDoc(communityRef, {
          admins: arrayUnion({
            UID: newUID,
            user: newUsername
          }),
          adminUIDs: arrayUnion(newUID),
          adminUsernames: arrayUnion(newUsername)
        })
      }

      function removeCommunityMember(communityID, newUID, newUsername){
        const communityRef = doc(db, "communities", communityID)
        return updateDoc(communityRef, {
            members: arrayRemove({
              UID: newUID,
              user: newUsername
            }),
            memberUIDs: arrayRemove(newUID),
            memberUsernames: arrayRemove(newUsername)
        })
      }

      function removeCommunityAdmin(communityID, newUID, newUsername){
        const communityRef = doc(db, "communities", communityID)
        return updateDoc(communityRef, {
          admins: arrayRemove({
            UID: newUID,
            user: newUsername
          }),
          adminUIDs: arrayRemove(newUID),
          adminUsernames: arrayRemove(newUsername)
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

    const value = {
        createCommunity,
        addCommunityMember,
        addCommunityAdmin,
        removeCommunityMember,
        removeCommunityAdmin,
        addOpenApplication,
        removeOpenApplication
    }

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    )
}