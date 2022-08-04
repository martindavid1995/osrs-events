import React, { useRef, useState, useEffect } from 'react'
import { Card, Form, Button, Alert} from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'


export default function CreateCommunity() {
    const nameRef = useRef()
    const descriptionRef = useRef()
    const { createCommunity } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState(null)
    const navigate = useNavigate()
    const auth = getAuth()
    const docRef = doc(db, "users", auth.currentUser.uid)


    useEffect(() => { 
      async function fetchData() {
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

          //Check to see if community already exists
          const docRefCheck = doc(db, "communities", nameRef.current.value)
          const docCheckSnap = await getDoc(docRefCheck)
          //If it does, don't create and throw an error
          if (docCheckSnap.exists()){
            throw "preexisting name"
          }
          
          //Create community
          await createCommunity(nameRef.current.value, descriptionRef.current.value, auth.currentUser.uid, username, 'tempURL')

          navigate('/')
        } catch (error){
          console.log(error)
          setError("Community already exists. Try a new name")    
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
