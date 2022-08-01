import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'
import ProfileInfo from './ProfileInfo'

export default function Dashboard() {
    const [error, setError] = useState()
    const [username, setUsername] = useState(null)
    const [description, setDescription] = useState(null)

    const auth = getAuth()
    const docRef = doc(db, "users", auth.currentUser.uid)
    
    useEffect(() => { 
        async function fetchData() {
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setUsername(docSnap.data().user)
                setDescription(docSnap.data().description)
            } else {
                setError("No Query Results Retrieved")
            }    
        }
        fetchData()
    }, [])
    
 


    if (!username) {
        console.log("Username must be null")
        return (
            <div className="text-center">
                <div className="spinner-border" role="status"></div>
            </div>
        )
    } else {
        return (
            <>
            <ProfileInfo />
            </>
            )
    }
}
