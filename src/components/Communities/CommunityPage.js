import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { getAuth } from 'firebase/auth'

export default function CommunityPage() {
  const { communityID } = useParams()
  const [name, setName] = useState(null)
  const [username, setUsername] = useState(null)
  const [description, setDescription] = useState(null)
  const [creator, setCreator] = useState(null)
  const [members, setMembers] = useState([])
  const [admins, setAdmins] = useState([])
  const [error, setError] = useState()
  const auth = getAuth()
  const navigate = useNavigate()

  const { 
    addCommunityAdmin, 
    addCommunityMember, 
    removeCommunityAdmin, 
    removeCommunityMember,
    subscribeUserToCommunity,
    unsubscribeUserFromCommunity
    } = useAuth()


  useEffect(() => { 

    async function fetchData() {
        if(auth.currentUser === null){
            navigate("/")
            throw("not logged in")
        }

        const communityDocRef = doc(db, "communities", communityID)
        const userDocRef = doc(db, "users", auth.currentUser.uid)
        const comDocSnap = await getDoc(communityDocRef)
        const userDocSnap = await getDoc(userDocRef)
        
        if (comDocSnap.exists() && userDocSnap.exists()) {
            setName(comDocSnap.data().name)
            setDescription(comDocSnap.data().description)
            setCreator(comDocSnap.data().creator)
            setMembers(comDocSnap.data().members)
            setAdmins(comDocSnap.data().admins)
            setUsername(userDocSnap.data().user)
        } else {
            setError("Query Failed")
        }    
    }
    try{
        fetchData()
    } catch (error){
        console.log(error)
    }
    
}, [])

  async function handleClick(args){
    try{
        switch(args){
            case 1:
                console.log("Add Member")
                await addCommunityMember(communityID, auth.currentUser.uid, username)
                await subscribeUserToCommunity(communityID, auth.currentUser.uid)
                break;
            case 2:
                console.log("Remove Member")    
                await removeCommunityMember(communityID, auth.currentUser.uid, username)
                await unsubscribeUserFromCommunity(communityID, auth.currentUser.uid)        
                break;
            case 3:
                console.log("Add Admin")  
                await addCommunityAdmin(communityID, auth.currentUser.uid, username)         
                break;
            case 4:
                console.log("Remove Admin")  
                await removeCommunityAdmin(communityID, auth.currentUser.uid, username)          
                break;
        }
    } catch(error) {

    }
  }
  
  return (
    <Container>
        <Row>
            <Card>
                <Card.Body>
                    <Row><h2>{name}</h2></Row>
                    <Row><h4>{description}</h4></Row>
                    <Row>
                        <Col><h6>Creator</h6></Col>
                        <Col>{creator}</Col>
                    </Row>
                    <Row>
                        <Col><h6>Members</h6></Col>
                        <Col>{members}</Col>
                    </Row>
                    <Row>
                        <Col><h6>Admins</h6></Col>
                        <Col>{admins}</Col>
                    </Row>
                </Card.Body>
            </Card>
        </Row> 
        <Row>
           <Col><Button variant='primary' className='m-1 w-100' onClick={() => handleClick(1)}>Add Member</Button></Col>
           <Col><Button variant='danger' className='m-1 w-100' onClick={() => handleClick(2)}>Remove Member</Button></Col>
        </Row>
        <Row>
           <Col><Button variant='primary' className='m-1 w-100' onClick={() => handleClick(3)}>Add Admin</Button></Col>
           <Col><Button variant='danger' className='m-1 w-100' onClick={() => handleClick(4)}>Remove Admin</Button></Col>
        </Row>
    </Container>

  )
}
