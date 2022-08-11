import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { useAuth } from '../../../contexts/AuthContext'

export default function ApplicationSlice( {username, UID, communityID, setReload} ) {
    const { addCommunityMember, removeOpenApplication, subscribeUserToCommunity } = useAuth()
    
    async function handleAccept(){
        try {
            await addCommunityMember(communityID, UID, username)
            await subscribeUserToCommunity(communityID, UID)
            await removeOpenApplication(communityID, UID, username)
            setReload(s => !s)
        } catch(e) {
            console.log(e)
        }
    }

    async function handleReject(){
        try {
            await removeOpenApplication(communityID, UID, username)
            setReload(s => !s)
        } catch(e) {
            console.log(e)
        }
    }

    

  return (
    <Card className='m-2'>
        <Card.Title className="m-2">Pending request to join community</Card.Title>
        <Card.Body>
            <Row>
                <Col>
                    <Row><Col><strong>Username</strong></Col></Row>
                    <Row><Col>{username}</Col></Row>
                </Col>
                <Col>
                    <Row>
                        <Col className='mx-1'><Row><Button variant='success' onClick={handleAccept}>Accept</Button></Row></Col>
                        <Col className='mx-1'><Row><Button variant='danger' onClick={handleReject}>Reject</Button></Row></Col>
                    </Row>
                </Col>
            </Row>
        </Card.Body>
    </Card>
  )
}
