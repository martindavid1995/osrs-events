import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useCommunity } from "../../contexts/CommunityContext";
import { useEvent } from "../../contexts/EventContext";
import { useInvitation } from "../../contexts/InvitationContext";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";

export default function EventInvitationSlice({
  eventID,
  inviteID,
  eventType,
  setReload,
  communityAID,
  communityBID,
  internalNavURL,
}) {
  const { setEventStatus, addPlayerInvolved } = useEvent();
  const { setInvitationStatus } = useInvitation();
  const { rejectInvitation } = useCommunity();
  const navigate = useNavigate();
  const [playersInvolved, setPlayersInvolved] = useState([]);
  const auth = getAuth();
  const eventDocRef = doc(db, "events", eventID);

  useEffect(() => {
    async function fetchData() {
      const eventDocSnap = await getDoc(eventDocRef);
      if (eventDocSnap.exists()) {
        setPlayersInvolved(eventDocSnap.data().playersInvolved)
      }
    }
    fetchData();
  }, []);

  function getNewPlayers(){
    var newPlayers = [];
    for (var i = 0; i < playersInvolved.length; i++){
      if (playersInvolved[i].community === communityBID){
       newPlayers[i] = {
        admins: [auth.currentUser.uid],
        community: communityBID,
        players: []
       }
      }else{
        newPlayers[i] = playersInvolved[i]
      }
    }
    return newPlayers;
  }

  async function handleAccept() {
    await setInvitationStatus(inviteID, "closed");
    await addPlayerInvolved(eventID, getNewPlayers());
    setReload((s) => !s);
    navigate(internalNavURL);
  }

  async function handleReject() {
    try {
      await setEventStatus(eventID, "terminated");
      await setInvitationStatus(inviteID, "closed");
      await rejectInvitation(communityAID, eventID, inviteID);
      await rejectInvitation(communityBID, eventID, inviteID);
    } catch (e) {
      console.log(e);
    }

    setReload((s) => !s);
  }

  return (
    <Card className="m-2" bg="secondary">
      <Card.Title className="m-2">
        Incoming Event Invitation: {eventType}
      </Card.Title>
      <Card.Body>
        <Row>
          <Col>
            <Row>
              <Col>
                From: <strong>{communityAID}</strong>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col className="mx-1">
                <Row>
                  <Button size="sm" variant="success" onClick={handleAccept}>
                    Accept
                  </Button>
                </Row>
              </Col>
              <Col className="mx-1">
                <Row>
                  <Button size="sm" variant="danger" onClick={handleReject}>
                    Reject
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
