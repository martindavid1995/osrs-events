import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { useAuth } from '../../contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useParams, useNavigate } from 'react-router-dom'

export default function CommunityAdminPage() {
    const auth = getAuth()
    const navigate = useNavigate()
    const [admins, setAdmins] = useState(null)
    const communityID = useParams().communityID
    const communityDocRef = doc(db, "communities", communityID)


    useEffect(() => { 
        async function fetchData() {
            if (!auth.currentUser){
                console.log("Logged out")
                navigate('/')
            }
            const comDocSnap = await getDoc(communityDocRef)
            if (comDocSnap.exists()) {
                setAdmins(comDocSnap.data().adminIDs)
                if (!(comDocSnap.data().adminIDs).includes(auth.currentUser.uid)){
                    console.log("You aren't authorized to be in here")
                    navigate('/')
                }
            } else {
                console.log("")
            }    
        }

        fetchData()
    }, [])


  return (
    <div>CommunityAdminPage</div>
  )
}
