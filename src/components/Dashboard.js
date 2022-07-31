import React, { useEffect, useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'
import { TailSpin } from 'react-loader-spinner'

export default function Dashboard() {
    const [error, setError] = useState()
    const [username, setUsername] = useState(null)
    const [description, setDescription] = useState(null)

    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
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
    
    async function handleLogout() {
        setError("")

        try{
            await logout()
            navigate("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    console.log(auth.currentUser)

    if (!username) {
        return <div><TailSpin color="#00BFFF" /></div>
    } else {
        return (
            <>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4'>Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong> {currentUser.email} <br></br>
                    <strong>Username: </strong> {username} <br></br>
                    <strong>Description: </strong> {description}
                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Change Password</Link>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                    <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div>
            </>
            )
    }
}
