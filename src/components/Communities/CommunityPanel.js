import React from 'react'
import { Card, Button, Row } from 'react-bootstrap'
import CommunitySlice from './CommunitySlice'
import { Link, useNavigate } from 'react-router-dom'


export default function CommunityPanel() {
  const navigate = useNavigate()

  function navCreateCommunity(){
    navigate("/create-community")
  }

  return (
    <Card>
        <Card.Body>
            <h2 className='text-center'>Communities</h2>
            <CommunitySlice communityID="ASVP"/>
            <CommunitySlice communityID="RS-Generals"/>
          <Row>
            <Button className="mt-3 mx-auto" type="submit" onClick={navCreateCommunity}>Create New Community</Button>
          </Row> 
        </Card.Body>
    </Card>
  )
}
