import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'

export default function EventSlice({ eventType, challengerName, handleAccept, handleReject }) {
  return (
    <Card className='m-2'>
        <Card.Title className="m-2">Event Invitation</Card.Title>
        <Card.Body>
            <Row>
                <Col>
                    <Row><Col><strong>{challengerName}</strong></Col></Row>
                    <Row><Col>{eventType}</Col></Row>
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
