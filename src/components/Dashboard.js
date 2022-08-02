import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'
import { Container, Row, Col } from 'react-bootstrap'
import ProfileInfo from './ProfileInfo'
import CommunityPanel from './communities/CommunityPanel'
import EventPanel from './events/EventPanel'

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
        return (
            <div className="text-center">
                <div className="spinner-border" role="status"></div>
            </div>
        )
    } else {
        return (
            <>
                <Container>
                        <Row>
                            <Col className="px-0">
                                <ProfileInfo />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="px-0">
                                <CommunityPanel />
                            </Col>
                            <Col className="px-0">
                                <EventPanel />
                            </Col>
                        </Row>
                </Container>
            </>
        )
    }
}
