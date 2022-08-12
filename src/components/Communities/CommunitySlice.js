import React, { useState, useEffect } from 'react'
import { Card, Button, Image, Col, Row } from 'react-bootstrap'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { Navigate, useNavigate } from 'react-router-dom'


export default function CommunitySlice( {communityID} ) {
  const [communityName, setCommunityName] = useState(null)//30
  const [description, setDescription] = useState(null)//151
  const [memberCount, setMemberCount] = useState(0)
  const [imgUrl, setImgUrl] = useState("/images/temp_avatar.jpg")
  const [creator, setCreator] = useState(null)
  const [error, setError] = useState(null)
  const communityDocRef = doc(db, "communities", communityID)
  const navigate = useNavigate()


  useEffect(() => { 

    async function fetchData() {
        const comDocSnap = await getDoc(communityDocRef)
        console.log(comDocSnap)

        if (comDocSnap.exists()) {
            setCommunityName(comDocSnap.data().name)
            setDescription(comDocSnap.data().description)
            setCreator(comDocSnap.data().creator['user'])
            setMemberCount((comDocSnap.data().members).length)
        } else {
          console.log("Slice query failed")
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


