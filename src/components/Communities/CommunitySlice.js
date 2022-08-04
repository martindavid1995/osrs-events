import React, { useState, useEffect } from 'react'
import { Card, Button, Image, Col, Row } from 'react-bootstrap'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Navigate, useNavigate } from 'react-router-dom'


export default function CommunitySlice( {communityID} ) {
  const [communityName, setCommunityName] = useState("temp_community_name_limited_30")
  const [description, setDescription] = useState("This is a temporary description for a community page. Instead of imposing a very large character limit i will just cut this string after 151 characters")
  const [memberCount, setMemberCount] = useState(0)
  const [imgUrl, setImgUrl] = useState("/images/temp_avatar.jpg")
  const [creator, setCreator] = useState("temp_owner")
  const [error, setError] = useState(null)
  const communityDocRef = doc(db, "communities", communityID)
  const navigate = useNavigate()


  useEffect(() => { 
    async function fetchData() {
        const comDocSnap = await getDoc(communityDocRef)

        
        if (comDocSnap.exists()) {
            setCommunityName(comDocSnap.data().name)
            setDescription(comDocSnap.data().description)
            setCreator(comDocSnap.data().creator)
            setMemberCount((comDocSnap.data().members).length)
        } else {
            setError("Query Failed")
        }    
    }
    fetchData()
}, [])

  function navCommunity(){
    navigate(`/community/${communityID}`)
  }

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
          <Col className="text-center pt-2"><Button type="submit" onClick={navCommunity}>Community Page</Button></Col>
          <Col><Row><Col><strong>Creator:</strong></Col></Row> {creator}</Col>
          <Col><Row><Col><strong>Member Count:</strong> </Col></Row>{memberCount}</Col>
        </Row>        
      </Card.Body>
    </Card>
  )
}


