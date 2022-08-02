import React, { useState } from 'react'
import { Card, Button, Image, Col, Row, Thumbnail } from 'react-bootstrap'


export default function CommunitySlice() {
  const [communityName, setCommunityName] = useState("temp_community_name_limited_30")
  const [description, setDescription] = useState("This is a temporary description for a community page. Instead of imposing a very large character limit i will just cut this string after 151 characters")
  const [memberCount, setMemberCount] = useState(0)
  const [imgUrl, setImgUrl] = useState("/images/temp_avatar.jpg")
  const [owner, setOwner] = useState("temp_owner")

  return (
    <Card className="m-2">   
      <Card.Body>
        <Row className='pb-2'>
          <Col className="col-4 text-center"><Image width={110} height={110} src={imgUrl} rounded/></Col>
          <Col>
            <Row>
              <Col><Card.Title>{communityName}</Card.Title></Col>
            </Row>
            <Row>
              <Col>{description}</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="text-center pt-2"><Button>Community Page</Button></Col>
          <Col><Row><Col><strong>Creator:</strong></Col></Row> {owner}</Col>
          <Col><Row><Col><strong>Member Count:</strong> </Col></Row>{memberCount}</Col>
        </Row>        
      </Card.Body>
    </Card>
  )
}


