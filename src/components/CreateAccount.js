import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, updateEmail, updatePassword } from 'firebase/auth'
import { collection, addDoc } from "firebase/firestore"
import { db } from '../firebase'
import { useUser } from '../contexts/UserContext'

export default function CreateAccount() {
    const usernameRef = useRef()
    const aboutRef = useRef()
    const { updateUserInformation } = useUser()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const auth = getAuth()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
          setError("")
          setLoading(true)
          await updateUserInformation(usernameRef.current.value, aboutRef.current.value)
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
                <h2 className='text-center mb-4'>Create Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="username">
                        <Form.Label>Username (RSN)</Form.Label>
                        <Form.Control type="text" ref={usernameRef} required/>
                    </Form.Group>
                    <Form.Group id="about">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" ref={aboutRef} placeholder="About Me"/>
                    </Form.Group>
                    <Button disabled={loading} variant="primary" className="w-100 mt-3 mx-auto" type="submit">Create Account</Button>   
                </Form>
            </Card.Body>
        </Card>
    </>
    )
}
