import React, { useRef, useState, useEffect } from 'react'
import { Card, Form, Button, Alert} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useUser } from '../../contexts/UserContext'
import { useCommunity } from '../../contexts/CommunityContext'


export default function CreateCommunity() {
    const nameRef = useRef()
    const descriptionRef = useRef()
    const { createCommunity } = useCommunity()
    const { subscribeUserToCommunity, grantAdminPrivelages } = useUser()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState(null)
    const navigate = useNavigate()
    const auth = getAuth()
    const docRef = doc(db, "users", auth.currentUser.uid)


    useEffect(() => { 
      async function fetchData() {
        if(auth.currentUser === null){
          navigate("/")
          throw("not logged in")
        }

          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
              setUsername(docSnap.data().user)
          } else {
              setError("No Query Results Retrieved")
          }    
      }
      fetchData()
  }, [])

  

    async function handleSubmit(e) {
        e.preventDefault()

        try {
          setError("")
          setLoading(true)

          //prevent sneaky people from spoofing community url's
          if (/^.*(-).*|^.*(  ).*/.test(nameRef.current.value)){
            setError("Invalid name provided. Your name cannot include dashes or concurrent spaces")
            throw "invalid name"
          }

          const regexp = /( )/gm
          //Check to see if community already exists
          const docRefCheck = doc(db, "communities", (nameRef.current.value).replaceAll(regexp, "-"))
          const docCheckSnap = await getDoc(docRefCheck)
          //If it does, don't create and throw an error
          if (docCheckSnap.exists()){
            setError("Community already exists. Try a new name") 
            throw "preexisting name"
          }
          
          //Create community
          await createCommunity(nameRef.current.value, descriptionRef.current.value, auth.currentUser.uid, username, 'tempURL')
          await subscribeUserToCommunity(nameRef.current.value, auth.currentUser.uid)
          await grantAdminPrivelages(nameRef.current.value, auth.currentUser.uid)

          navigate(`/community/${(nameRef.current.value).replace(/\s+/g, '-')}`)
        } catch (error){
          console.log(error)  
        }
    
        setLoading(false)
      }

    return (
    <>
        <Card style={{ width: '50%', margin: '0 auto'}}>
            <Card.Body>
                <h2 className='text-center mb-4'>Create Community</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="name">
                        <Form.Label>Community Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} required />
                    </Form.Group>
                    <Form.Group id="description">
                        <Form.Label>Community Description</Form.Label>
                        <Form.Control type="text" ref={descriptionRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Create Community</Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            <Link to="/">Back</Link>
        </div>
    </>
    )
}
