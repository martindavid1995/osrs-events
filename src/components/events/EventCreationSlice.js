import React from 'react'
import { Card, Button } from 'react-bootstrap'

export default function EventCreationSlice( {eventName, eventDescription, eventThumbnail, navUrl, whenClicked} ) {

    return (
        <Card style={{ width: '18rem', padding: '4px', margin:'17px'}}>
          <Card.Img variant="top" src={eventThumbnail} />
          <Card.Body>
            <Card.Title>{eventName}</Card.Title>
            <Card.Text>
              {eventDescription}
            </Card.Text>
            <Button className="text-center" variant="primary" onClick={() => whenClicked(navUrl)}>Create Game</Button>
          </Card.Body>
        </Card>
      );
}
