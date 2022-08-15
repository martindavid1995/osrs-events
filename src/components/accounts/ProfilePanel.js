import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";

export default function ProfilePanel() {
  const currentUser = useAuth();
  const [error, setError] = useState();
  const [username, setUsername] = useState(null);
  const [description, setDescription] = useState(null);
  const auth = getAuth();
  const docRef = doc(db, "users", auth.currentUser.uid);

  useEffect(() => {
    async function fetchData() {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsername(docSnap.data().user);
        setDescription(docSnap.data().description);
      } else {
        setError("No Query Results Retrieved");
      }
    }
    fetchData();
  }, []);

  if (!username) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  } else {
    return (
      <Card>
        <Card.Body>
          <h2 className="text-center">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Username: </strong> {username} <br></br>
          <strong>Description: </strong> {description}
          <br></br>
        </Card.Body>
      </Card>
    );
  }
}
