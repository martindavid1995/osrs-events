import React, { useEffect, useState } from 'react'
import { Card, Button, Alert, Navbar, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { current } from '@reduxjs/toolkit'

export default function Header() {
  const auth = getAuth()
  const [error, setError] = useState()
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate

  async function handleLogout() {
    setError("")

    try{
        await logout()
        navigate("/login")
    } catch {
        setError("Failed to log out")
    }
}

if (!currentUser){
  return (
    <Navbar bg="dark" variant="dark">
          <Container fluid>
              <Navbar.Brand>osrs-events</Navbar.Brand>
              <Navbar.Text><Button variant="link" onClick={handleLogout}>Log Out</Button></Navbar.Text>
          </Container>
      </Navbar>
  )
} else {
    return (
      <Navbar bg="dark" variant="dark">
          <Container fluid>
              <Navbar.Brand>osrs-events</Navbar.Brand>
              <Navbar.Text>Welcome, {auth.currentUser.email}</Navbar.Text>
              <Navbar.Text><Button variant="link" onClick={handleLogout}>Log Out</Button></Navbar.Text>
          </Container>
      </Navbar>
    )
  }
}
