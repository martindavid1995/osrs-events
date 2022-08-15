import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { Container, Row, Col } from "react-bootstrap";
import CommunityPanel from "../communities/CommunityPanel";
import EventPanel from "../events/EventPanel";
import ProfilePanel from "./ProfilePanel";

export default function Dashboard() {
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
      <>
        <Container>
          <Row>
            <Col className="px-0 m-1">
              <ProfilePanel />
            </Col>
          </Row>
          <Row>
            <Col className="px-0 m-1">
              <CommunityPanel />
            </Col>
            <Col className="px-0 m-1">
              <EventPanel />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
