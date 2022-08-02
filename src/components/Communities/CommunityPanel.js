import React from 'react'
import { Card, Button, Row } from 'react-bootstrap'
import CommunitySlice from './CommunitySlice'

export default function CommunityPanel() {
  return (
    <Card>
        <Card.Body>
            <h2 className='text-center'>Communities</h2>
            <CommunitySlice />
            <CommunitySlice />


          <Row>
            <Button className="mt-3 mx-auto" type="submit">Create New Community</Button>
          </Row> 
        </Card.Body>
    </Card>
  )
}
