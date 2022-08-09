import React, { useState, useEffect } from 'react'
import { Card, Button, Image, Col, Row, Modal } from 'react-bootstrap'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useParams, useNavigate } from 'react-router-dom'


export default function CommunityPageTitle() {
  const { communityID } = useParams()
  const [communityName, setCommunityName] = useState(null)//30
  const [description, setDescription] = useState(null)//151
  const [memberCount, setMemberCount] = useState(0)
  const [imgUrl, setImgUrl] = useState("/images/temp_avatar.jpg")
  const [creator, setCreator] = useState(null)
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  const communityDocRef = doc(db, "communities", communityID)
  const navigate = useNavigate()


  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const submitApp = () => {
    //be sure to check if user is logged in or not

    console.log("send app logic here")

    handleClose()
  }

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



  return (
    <Card className="m-1">   
      <Card.Body>
        <Row className='pb-2'>
          <Col className='col-md-auto'><Image width={110} height={110} src={imgUrl} rounded/></Col>
            <Col className='col-lg-2'><Row>
                <Col><h4>{communityName}</h4></Col>
                <Row><Col><h6>Created by:</h6></Col></Row>
                <Row><Col>{creator}</Col></Row>
            </Row></Col>
            <Col><Row><Col><strong>About {communityName}: </strong></Col></Row><Row><Col>{description}</Col></Row></Col>
            <Col className='col-md-auto d-flex align-items-center'><Button variant='primary' onClick={handleShow}>Apply</Button></Col>
          </Row>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Apply to {communityName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit an application to join {communityName}? A community administrator will manage your application upon submission</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submitApp}>
            Send Application
          </Button>
        </Modal.Footer>
        </Modal>

      </Card.Body>
    </Card>
    
  )
}


