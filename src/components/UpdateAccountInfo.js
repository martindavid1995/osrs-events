import React, { useRef, useState, useEffect } from 'react'
import { Card, Form, Button, Alert, Row, Col} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function UpdateAccountInfo() {
    const usernameRef = useRef(null)
    const aboutRef = useRef(null)
    const { updateUserInformation } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const auth = getAuth()
    const docRef = doc(db, "users", auth.currentUser.uid)
    const [username, setUsername] = useState(null)
    const [description, setDescription] = useState(null)

    

    useEffect(() => { 
        async function fetchData() {
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setUsername(docSnap.data().user)
                setDescription(docSnap.data().description)
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
          await updateUserInformation(username, aboutRef.current.value)
          navigate("/")
        } catch (error) {
          console.log(error)
          setError("Failed to update account info")
        }
    
        setLoading(false)
      }

    return (
    <>
        <Card style={{ width: '50%', margin: '0 auto'}}>
            <Card.Body>
                <h2 className='text-center mb-4'>Update Account Information</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {/* <Form.Group id="username">
                        <Form.Label>Username (RSN)</Form.Label>
                        <Form.Control type="text" ref={usernameRef} defaultValue={username}/>
                    </Form.Group> */}
                    <Form.Group id="about">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" ref={aboutRef} defaultValue={description}/>
                    </Form.Group>
                    <Button disabled={loading} variant="primary" className="w-100 mt-3" type="submit">Save Account Information</Button>                    
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            <Row>
                <Link to="/update-credentials">Change Password</Link>
            </Row>
            <Row>
                <Link to="/">Back</Link>
            </Row>
        </div>
    </>
    )
}
