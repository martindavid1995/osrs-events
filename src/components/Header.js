import React, { useEffect, useState } from "react";
import { Card, Button, Alert, Navbar, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Header() {
  const auth = getAuth();
  const [error, setError] = useState();
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  function navSettings() {
    navigate("/update-account-info");
  }

  if (!currentUser || location.pathname === "/create-account") {
    return (
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand>osrs-events</Navbar.Brand>
        </Container>
      </Navbar>
    );
  } else {
    return (
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/">osrs-events</Navbar.Brand>
          <Navbar.Text>Welcome, {auth.currentUser.email}</Navbar.Text>
          <Navbar.Text className="margin">
            <Button variant="primary" className="mx-1" onClick={navSettings}>
              Settings
            </Button>
            <Button variant="primary" className="mx-1" onClick={handleLogout}>
              Log Out
            </Button>
          </Navbar.Text>
        </Container>
      </Navbar>
    );
  }
}
