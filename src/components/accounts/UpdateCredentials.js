import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert} from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, updateEmail, updatePassword } from 'firebase/auth'

export default function UpdateCredentials() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const auth = getAuth()

    function handleSubmit(e) {
        e.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match")
        }
    
        const promises = []
        setLoading(true)
        setError("")
    
        if (passwordRef.current.value) {
          promises.push(updatePassword(auth.currentUser, passwordRef.current.value))
        }
    
        Promise.all(promises)
          .then(() => {
            navigate('/')
          })
          .catch(() => {
            setError("Failed to update account")
          })
          .finally(() => {
            setLoading(false)
          })
      }

    return (
    <>
        <Card style={{ width: '50%', margin: '0 auto'}}>
            <Card.Body>
                <h2 className='text-center mb-4'>Change Password</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="password">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required/>
                    </Form.Group>
                    <Form.Group id="password-confirm">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required/>
                    </Form.Group>
                    <Button disabled={loading} className="w-100 mt-3" type="submit" value="update">Update</Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            <Link to="/">Back to Profile</Link><br></br>
        </div>
    </>
    )
}
