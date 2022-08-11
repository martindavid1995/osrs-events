import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { useAuth } from '../../../contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { Row, Col, Container } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import CommunityPageTitle from '../CommunityPageTitle'
import OpenApplications from './OpenApplications'
import AdminNotifications from './AdminNotifications'
import MemberList from '../MemberList'

export default function AdminPage() {
    const auth = getAuth()
    const navigate = useNavigate()
    const communityID = useParams().communityID
    const communityDocRef = doc(db, "communities", communityID)

    useEffect(() => { 
        async function fetchData() {
            try{
                if (!auth.currentUser){
                    console.log("Logged out")
                    navigate('/')
                    throw("logged out")
                }
                const comDocSnap = await getDoc(communityDocRef)
                if (comDocSnap.exists()) {
                    if (!(comDocSnap.data().adminUIDs).includes(auth.currentUser.uid)){
                        console.log("You aren't authorized to be in here")
                        navigate('/')
                    }
                } else {
                    console.log("")
                }   
            }catch (e){
                console.log("threw an exception: ",e)
            }
             
        }

        fetchData()
    }, [])


  return (
    <Container>
        <Row>
            <Col className="px-0 m-1">
                <CommunityPageTitle from={"admin"} />
            </Col>
        </Row>
        <Row>
            <Col className="px-0 m-1">
                <OpenApplications />
            </Col>
            <Col className="px-0 m-1">
                <AdminNotifications />
            </Col>
            <Col className="px-0 m-1">
                <MemberList admin={true}/>
            </Col>
        </Row>
        
        
    </Container>
  )
}
