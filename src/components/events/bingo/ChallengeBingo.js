import React, { useRef, useState, useEffect } from "react";
import { Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEvent } from "../../../contexts/EventContext";
import { useInvitation } from "../../../contexts/InvitationContext";
import { useCommunity } from "../../../contexts/CommunityContext";

export default function ChallengeBingo() {
  const challengerID = useParams().communityID;
  const [challengeeID, setChallengeeID] = useState(" ");
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState();
  const { createEvent } = useEvent();
  const { createInvitation } = useInvitation();
  const { addCommunityInvitation } = useCommunity();
  const gameTitleRef = useRef();
  const auth = useAuth();
  const navigate = useNavigate();
  const communityDocRef = doc(db, "communities", challengerID);
  const regexp = /( )/gm;

  useEffect(() => {
    async function fetchData() {
      try {
        if (!auth.currentUser) {
          navigate("/");
          throw "user is logged out";
        } else {
          const comDocSnap = await getDoc(communityDocRef);
          if (comDocSnap.exists()) {
            if (!comDocSnap.data().adminUIDs.includes(auth.currentUser.uid)) {
              console.log("You aren't authorized to be in here");
              navigate("/");
            }
          } else {
            console.log("Doc doesn't exist");
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("Enter a community to challenge");
      setLoading(true);
      const comRefCheck = doc(db, "communities", challengeeID);
      const comCheckSnap = await getDoc(comRefCheck);
      if (!comCheckSnap.exists()) {
        setError(
          "The community you're trying to challenge does not exist in our system. Make sure you entered the community name correctly and make sure they are registered with osrs-events."
        );
        throw "Name not found";
      } else if (challengeeID === challengerID) {
        setError("You can't challenge your own community!");
        throw "Attempting to challenge own community";
      } else {
        setError();
        const communitiesInvolved = [challengerID, challengeeID];
        const playersInvolved = [
          {
            community: challengerID,
            players: [],
            admins: [auth.currentUser.uid],
          },
          {
            community: challengeeID,
            players: [],
            admins: [],
          },
        ];
        const eventRef = await createEvent(
          "bingo",
          "pending",
          communitiesInvolved,
          playersInvolved,
          gameTitleRef.current.value
        );
        // console.log("Event ID we just created is: ", eventRef.id);
        const invRef = await createInvitation(
          "open",
          challengerID,
          challengeeID,
          eventRef.id,
          "Bingo",
          `/events/create/${eventRef.id}`
        );
        // console.log("Invitation ID we just created is: ", invRef.id);
        await addCommunityInvitation(
          challengerID,
          invRef.id,
          eventRef.id,
          "outgoing"
        );
        await addCommunityInvitation(
          challengeeID,
          invRef.id,
          eventRef.id,
          "incoming"
        );

        setSuccess("Challenge Sent!");
      }
    } catch (error) {
      // console.log(challengeeID);
      console.log(error);
    }

    setLoading(false);
  }

  return (
    <>
      <Row>
        <Col className="text-center">
          <h3>Create A PvM Bingo Game</h3>
        </Col>
      </Row>
      <Card style={{ display: "flex" }}>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="eventTitle">
              <Form.Label>What would you like to title your event?</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Game Title"
                ref={gameTitleRef}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="communityToChallenge">
              <Form.Label>Which community will you be challenging?</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter community name"
                onChange={(event) =>
                  setChallengeeID(event.target.value.replaceAll(regexp, "-"))
                }
              />
              <Form.Text className="text-muted">
                Community name must be an existing community on the osrs-events
                platform.
              </Form.Text>
            </Form.Group>
            <Button disabled={loading} variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
